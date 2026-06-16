"""
PLAYER MEASUREMENTS — no filtering, no thresholds, no invented categories.

This is the honest substrate. Every column here is a *measurement* of how a
player actually plays — a fact, opponent-adjusted where noted. NONE of it is a
selection rule. There are no cut lines, no composites, no cascade, no
tennis-style buckets ("first-strike", "Pda", "outlaster") — all of that was
arbitrary scaffolding and has been removed. Selection / Parser identification
is done by the framework and the eye, against these numbers — not by code.

Columns:
  WinUFE  = winners:UFE ratio (opponent-adjusted)
  short%  = win% in 1-4 shot rallies (raw, counted from point notation)
  long%   = win% in 9+ shot rallies
  steal   = drop+lob per 1000 shots (improvisation)
  conv%   = break-point conversion
  forces  = opponent unforced errors induced (opponent-adjusted; + = you make
            them miss). REPORTED ONLY — explicitly NOT a filter.
  adjUFE  = own unforced errors /100, opponent-adjusted

Run:  python3 engine/precision/profile.py [name substring ...]
"""
import collections
import sys

import style_index as si
import clutch
from mcp_data import iter_points

SHOT = "fbrsvzopuylmhijkt"


def _rally(tour):
    pairs = si._meta_pairs()
    short = collections.defaultdict(lambda: [0, 0])
    longr = collections.defaultdict(lambda: [0, 0])
    for row in iter_points(tour):
        mid = row["match_id"]
        if mid not in pairs:
            continue
        p1, p2 = pairs[mid]
        seq = (row.get("1st", "") or "").strip() or (row.get("2nd", "") or "").strip()
        if not seq:
            continue
        rl = 1 + sum(1 for c in seq if c in SHOT)
        pw = row.get("PtWinner", "")
        if pw not in ("1", "2"):
            continue
        w = p1 if pw == "1" else p2
        b = short if rl <= 4 else (longr if rl >= 9 else None)
        if b is None:
            continue
        for nm in (p1, p2):
            b[nm][1] += 1
        b[w][0] += 1
    return short, longr


def measurements(tour):
    r = si.build(tour)
    fs = si.future_steal(tour)
    S = clutch.analyze(tour, si.load_match_meta())
    short, longr = _rally(tour)
    out = {}
    for p in r["index"]:
        rec = {
            "WinUFE": r["win_ufe"].get(p),
            "short": 100 * short[p][0] / short[p][1] if short[p][1] >= 100 else None,
            "long": 100 * longr[p][0] / longr[p][1] if longr[p][1] >= 60 else None,
            "steal": fs.get(p),
            "conv": 100 * S[p]["bpc_w"] / S[p]["bpc"] if S.get(p, {}).get("bpc", 0) >= 120 else None,
            "forces": r["forces_opp"].get(p),
            "adjUFE": r["adj_ufe"].get(p),
        }
        out[p] = rec
    return out


def _fmt(v, w=6, d=1):
    return (" " * w if v is None else f"{v:{w}.{d}f}")


def main(argv):
    for tour, label in (("m", "MEN"), ("w", "WOMEN")):
        M = measurements(tour)
        names = sorted(M)
        if argv:
            names = [p for p in names if any(a.lower() in p.lower() for a in argv)]
        if not names:
            continue
        print(f"\n=== {label} — measurements only (no filters) ===")
        print(f"  {'player':24s} {'WinUFE':>6s} {'short%':>6s} {'long%':>6s} "
              f"{'steal':>6s} {'conv%':>6s} {'forces':>6s} {'adjUFE':>6s}")
        for p in names:
            m = M[p]
            print(f"  {p:24s} {_fmt(m['WinUFE'],6,2)} {_fmt(m['short'])} {_fmt(m['long'])} "
                  f"{_fmt(m['steal'])} {_fmt(m['conv'])} {_fmt(m['forces'],6,2)} {_fmt(m['adjUFE'])}")


if __name__ == "__main__":
    main(sys.argv[1:])
