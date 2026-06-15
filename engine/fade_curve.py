"""
engine/fade_curve.py — Coupling Engine, module 2: the strength-controlled fade curve.

The breaking point is a decoupling event; the fade curve is its SLOW band —
decoupling over a match's duration. We proxy "time-to-break" with deciding-set
performance, but raw decider win% is confounded by strength (Alcaraz wins
deciders partly because he is simply better). So we control for strength.

FADE RESIDUAL = a player's actual deciding-set win rate
                MINUS their Elo-expected deciding-set win rate,
                averaged over all their deciding-set matches.

    + residual  -> wins deciders MORE than strength predicts  (durable / long time-to-break)
    - residual  -> wins deciders LESS than strength predicts  (fades / early breaking point)

A z-score (over/under-performance vs Elo expectation) flags signal vs noise.

Data: Jeff Sackmann's public tennis_atp repo, cached locally on first run.
Usage:  python3 engine/fade_curve.py
"""

import csv
import math
import os
import re
import tempfile
import urllib.request
from collections import defaultdict

YEARS = (2023, 2024, 2025, 2026)
ELO_BASE = 1500.0
ELO_K = 32.0
MIN_DECIDERS = 20          # stability filter
RAW_URL = ("https://raw.githubusercontent.com/JeffSackmann/"
           "tennis_atp/master/atp_matches_{year}.csv")
DATA_DIR = os.path.join(tempfile.gettempdir(), "cbi_tennis_data")


# ----------------------------------------------------------------------------- data
def _local_path(year):
    return os.path.join(DATA_DIR, f"atp_matches_{year}.csv")


def ensure_data(years=YEARS):
    """Download each season's match file to the local cache if absent."""
    os.makedirs(DATA_DIR, exist_ok=True)
    for y in years:
        path = _local_path(y)
        if not os.path.exists(path):
            urllib.request.urlretrieve(RAW_URL.format(year=y), path)


def load_matches(years=YEARS):
    """Return all matches across the given seasons, sorted chronologically."""
    rows = []
    for y in years:
        with open(_local_path(y)) as f:
            rows.extend(csv.DictReader(f))

    def key(r):
        try:
            return (int(r["tourney_date"]), int(r["match_num"]))
        except (ValueError, KeyError):
            return (0, 0)

    rows.sort(key=key)
    return rows


# ----------------------------------------------------------------------------- helpers
def reached_decider(score, best_of):
    """True iff a clean (non-retirement) match went to its final set."""
    s = (score or "").upper()
    if any(t in s for t in ("RET", "W/O", "DEF", "WALKOVER", "ABD", "UNFINISHED")):
        return False
    sets = [t for t in s.split() if re.match(r"^\d+-\d+", t)]
    return bool(sets) and len(sets) == best_of


def expected(elo_a, elo_b):
    """Elo win probability for A vs B."""
    return 1.0 / (1.0 + 10 ** ((elo_b - elo_a) / 400.0))


# ----------------------------------------------------------------------------- engine
def compute_fade(rows):
    """
    Walk matches chronologically. For each deciding-set match, record both
    players' pre-match Elo expectation and the actual result, then update Elo
    on every match. Returns {player: stats}.
    """
    elo = defaultdict(lambda: ELO_BASE)
    acc = defaultdict(lambda: dict(exp=0.0, act=0.0, var=0.0, n=0, wins=0))

    for r in rows:
        w, l = r["winner_name"], r["loser_name"]
        try:
            best_of = int(r["best_of"])
        except (ValueError, KeyError):
            best_of = 3

        if reached_decider(r["score"], best_of):
            ew = expected(elo[w], elo[l])          # pre-match expectation
            el = 1.0 - ew
            for p, e, actual in ((w, ew, 1.0), (l, el, 0.0)):
                a = acc[p]
                a["exp"] += e
                a["act"] += actual
                a["var"] += e * (1.0 - e)          # Bernoulli variance for the z-score
                a["n"] += 1
                a["wins"] += int(actual)

        ew = expected(elo[w], elo[l])              # update Elo on every match
        elo[w] += ELO_K * (1.0 - ew)
        elo[l] -= ELO_K * (1.0 - ew)

    out = {}
    for p, a in acc.items():
        if a["n"] < MIN_DECIDERS:
            continue
        residual_pp = (a["act"] - a["exp"]) / a["n"] * 100.0
        z = (a["act"] - a["exp"]) / math.sqrt(a["var"]) if a["var"] > 0 else 0.0
        out[p] = dict(
            elo=round(elo[p]),
            deciders=a["n"],
            raw_win_pct=a["wins"] / a["n"] * 100.0,
            expected_pct=a["exp"] / a["n"] * 100.0,
            fade_residual=residual_pp,           # the strength-controlled number
            z=z,
        )
    return out


def race(fade, a, b):
    """Condition-free preview of the fade race: who over/under-performs in deciders."""
    if a not in fade or b not in fade:
        missing = a if a not in fade else b
        return f"  (insufficient deciding-set sample for {missing})"
    fa, fb = fade[a]["fade_residual"], fade[b]["fade_residual"]
    durable, breaker = (a, b) if fa > fb else (b, a)
    return (f"  {a}: {fa:+.1f}pp (z={fade[a]['z']:+.1f})   "
            f"{b}: {fb:+.1f}pp (z={fade[b]['z']:+.1f})\n"
            f"  -> if it reaches a deciding set, edge shifts toward {durable}; "
            f"{breaker} is likelier to break first.")


# ----------------------------------------------------------------------------- report
def _print_board(fade):
    rows = sorted(fade.items(), key=lambda kv: -kv[1]["fade_residual"])
    fmt = "{:<26}{:>5}{:>5}{:>9}{:>9}{:>9}{:>7}"
    hdr = fmt.format("PLAYER", "Elo", "Dec", "Raw%", "Exp%", "Resid", "z")
    print(f"\nStrength-controlled fade curve — ATP {YEARS[0]}-{YEARS[-1]}, "
          f">={MIN_DECIDERS} deciders ({len(fade)} players)\n")
    print(hdr)
    print("-" * len(hdr))
    print("MOST DURABLE (over-perform Elo in deciders — long time-to-break):")
    for n, d in rows[:10]:
        print(fmt.format(n[:25], d["elo"], d["deciders"], f"{d['raw_win_pct']:.0f}",
                         f"{d['expected_pct']:.0f}", f"{d['fade_residual']:+.1f}", f"{d['z']:+.1f}"))
    print("\nMOST FADE-PRONE (under-perform Elo in deciders — early breaking point):")
    for n, d in rows[-10:][::-1]:
        print(fmt.format(n[:25], d["elo"], d["deciders"], f"{d['raw_win_pct']:.0f}",
                         f"{d['expected_pct']:.0f}", f"{d['fade_residual']:+.1f}", f"{d['z']:+.1f}"))


def main():
    ensure_data()
    fade = compute_fade(load_matches())
    _print_board(fade)
    print("\nExample fade races:")
    print(race(fade, "Carlos Alcaraz", "Alexander Zverev"))
    print(race(fade, "Casper Ruud", "Alex De Minaur"))


if __name__ == "__main__":
    main()
