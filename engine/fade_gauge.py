"""
engine/fade_gauge.py — Coupling Engine: the ordinal fade gauge (n-fold).

Generalizes the ternary hero/middle/fail gauge to an ORDINAL ladder
(default 5: break < struggle < middle < good < hero) and tests the real claim:
edge scales with the GAP between two players' bins, peaks hero-vs-break, and is
null at the middle / same-bin. "Or whatever the data shows" — the edge-by-gap
curve reveals how many bins are actually resolvable.

The fade gauge needs only results + scores (decider win residual vs Elo), NOT
serve stats — so it uses the full data universe: ATP + WTA, tour + challenger.

Train fade on <= TRAIN_MAX; test edge-by-gap on the later years (no leakage).
Elo is computed per tour (separate populations), pooled only at the edge tally.

Usage:  python3 engine/fade_gauge.py
"""

import bisect
import csv
import math
import os
import sys
import tempfile
import urllib.request
from collections import defaultdict

DATA_DIR = os.path.join(tempfile.gettempdir(), "cbi_tennis_data")
RAW = "https://raw.githubusercontent.com/JeffSackmann/{repo}/master/{fname}"
SOURCES = {
    "ATP": ("tennis_atp", ["atp_matches_{y}.csv", "atp_matches_qual_chall_{y}.csv"]),
    "WTA": ("tennis_wta", ["wta_matches_{y}.csv", "wta_matches_qual_itf_{y}.csv"]),
}
YEARS = range(2021, 2027)
TRAIN_MAX = 2024            # train fade on <=2024, test 2025-2026
ELO_BASE, ELO_K = 1500.0, 32.0
MIN_TRAIN_DECIDERS = 15
# 5-fold z thresholds: break / struggle / middle / good / hero
BIN_EDGES = [-1.5, -0.5, 0.5, 1.5]
BIN_NAMES = ["break", "struggle", "middle", "good", "hero"]


def _fetch(repo, fname):
    path = os.path.join(DATA_DIR, fname)
    if not os.path.exists(path):
        try:
            urllib.request.urlretrieve(RAW.format(repo=repo, fname=fname), path)
        except Exception:
            return None
    return path


def load_tour(tour):
    repo, templates = SOURCES[tour]
    rows = []
    for y in YEARS:
        for t in templates:
            p = _fetch(repo, t.format(y=y))
            if not p:
                continue
            with open(p) as f:
                for r in csv.DictReader(f):
                    if r.get("winner_name") and r.get("loser_name"):
                        rows.append(r)

    def key(r):
        try:
            return (int(r["tourney_date"]), int(r.get("match_num") or 0))
        except (ValueError, KeyError):
            return (0, 0)

    rows.sort(key=key)
    return rows


def expected(a, b):
    return 1.0 / (1.0 + 10 ** ((b - a) / 400.0))


def reached_decider(score, best_of):
    s = (score or "").upper()
    if any(t in s for t in ("RET", "W/O", "DEF", "WALKOVER", "ABD", "UNFINISHED")):
        return False
    import re
    sets = [t for t in s.split() if re.match(r"^\d+-\d+", t)]
    return bool(sets) and len(sets) == best_of


def walk_tour(rows):
    """One chronological pass: train-fade accumulators + test-match records."""
    elo = defaultdict(lambda: ELO_BASE)
    train = defaultdict(lambda: dict(exp=0.0, act=0.0, var=0.0, n=0))
    test = []   # (winner, loser, exp_winner, is_decider)

    for r in rows:
        w, l = r["winner_name"], r["loser_name"]
        try:
            yr = int(r["tourney_date"]) // 10000
            bo = int(r["best_of"])
        except (ValueError, KeyError):
            continue
        ew = expected(elo[w], elo[l])
        dec = reached_decider(r["score"], bo)

        if dec and yr <= TRAIN_MAX:
            for p, e, a in ((w, ew, 1.0), (l, 1.0 - ew, 0.0)):
                t = train[p]
                t["exp"] += e; t["act"] += a; t["var"] += e * (1 - e); t["n"] += 1
        elif yr > TRAIN_MAX:
            test.append((w, l, ew, dec))

        elo[w] += ELO_K * (1.0 - ew)
        elo[l] -= ELO_K * (1.0 - ew)

    z = {}
    for p, t in train.items():
        if t["n"] >= MIN_TRAIN_DECIDERS and t["var"] > 0:
            z[p] = (t["act"] - t["exp"]) / math.sqrt(t["var"])
    return z, test


def bin_of(z):
    return bisect.bisect_right(BIN_EDGES, z)   # 0..4


def main():
    os.makedirs(DATA_DIR, exist_ok=True)
    # accumulate edge-by-gap across both tours; gap = higher-bin minus lower-bin
    by_gap = defaultdict(lambda: dict(n=0, hwon=0.0, exp=0.0))           # all test matches
    by_gap_dec = defaultdict(lambda: dict(n=0, hwon=0.0, exp=0.0))       # deciders only
    binpop = defaultdict(int)

    for tour in ("ATP", "WTA"):
        z, test = walk_tour(load_tour(tour))
        for p, zz in z.items():
            binpop[bin_of(zz)] += 1
        for w, l, ew, dec in test:
            if w not in z or l not in z:
                continue
            bw, bl = bin_of(z[w]), bin_of(z[l])
            if bw == bl:
                continue                      # no higher-bin player; no directional call
            # higher bin = the more durable player; did they win?
            if bw > bl:
                hi_won, eh, gap = 1.0, ew, bw - bl
            else:
                hi_won, eh, gap = 0.0, ew, bl - bw
            for tbl in (by_gap,):
                d = tbl[gap]; d["n"] += 1; d["hwon"] += hi_won; d["exp"] += eh
            if dec:
                d = by_gap_dec[gap]; d["n"] += 1; d["hwon"] += hi_won; d["exp"] += eh

    print(f"Ordinal fade gauge — ATP+WTA tour+challenger, train<= {TRAIN_MAX}, "
          f"test {TRAIN_MAX+1}-{max(YEARS)}")
    print(f"5 bins by z: {BIN_NAMES}  edges {BIN_EDGES}")
    print(f"classified players per bin: " +
          ", ".join(f"{BIN_NAMES[b]}={binpop[b]}" for b in range(5)) + "\n")

    def show(title, tbl):
        print(title)
        print(f"  {'gap':>3} {'n':>6} {'higher-bin win%':>16} {'Elo-exp%':>10} {'edge':>8}")
        for gap in sorted(tbl):
            d = tbl[gap]
            if d["n"] == 0:
                continue
            act = d["hwon"] / d["n"] * 100
            exp = d["exp"] / d["n"] * 100
            se = 50.0 / math.sqrt(d["n"])      # rough SE on the win-rate (pp)
            star = "*" if abs(act - exp) > 2 * se else " "
            print(f"  {gap:>3} {d['n']:>6} {act:>15.1f}% {exp:>9.1f}% {act-exp:>+7.1f}{star}")
        print()

    show("EDGE BY BIN-GAP — all test matches:", by_gap)
    show("EDGE BY BIN-GAP — deciders only (where the gauge should fire):", by_gap_dec)
    print("Read: if edge rises with gap and is ~0 at gap 0, the ordinal gauge is real;")
    print("'*' = edge exceeds ~2 SE (separated from noise).")


if __name__ == "__main__":
    main()
