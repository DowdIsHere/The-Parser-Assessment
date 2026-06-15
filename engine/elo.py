"""
engine/elo.py — global + surface-blended Elo for the Coupling Engine.

Naive surface Elo (a fresh 1500 per surface) throws away history and underperforms.
This blends: a player's expectation on a surface uses

    blended_rating = blend * surface_elo + (1 - blend) * global_elo

so e.g. Alcaraz's hard-court baseline is no longer inflated by his clay dominance,
which is the confound that contaminated module 3's per-surface fade residuals.

`walk()` runs one chronological pass and returns, per match, the pre-match global
and surface-blended expectations for the winner — the baseline every downstream
module uses. Running this file validates the blend weight out-of-sample on 2026.

Usage:  python3 engine/elo.py
"""

import os
import sys
from collections import defaultdict

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from fade_curve import (  # noqa: E402
    ELO_BASE, ELO_K, YEARS, ensure_data, load_matches, expected,
)

# EMPIRICAL FINDING (validated on 2026, 2023-25 warm-up): surface blending does
# NOT improve match prediction — global Elo (blend=0.0) is best at 64.7%, every
# blend is slightly worse. Fragmenting ~3 yrs across surfaces just adds noise.
# So global Elo is the standing baseline; surface ratings are kept available for
# research but are NOT used as the predictor or as a fade baseline.
DEFAULT_BLEND = 0.0


def walk(rows, blend=DEFAULT_BLEND):
    """
    Chronological pass. Returns (events, global_elo, surface_elo) where each event
    carries the match row plus pre-match expectations for the winner:
        exp_global   — from the global pool
        exp_surface  — from the surface-blended rating
    Both pools are updated on every match, each by its own expectation.
    """
    glob = defaultdict(lambda: ELO_BASE)
    surf = defaultdict(lambda: ELO_BASE)
    events = []

    for r in rows:
        w, l = r["winner_name"], r["loser_name"]
        s = (r.get("surface") or "").strip() or "Unknown"

        eg = expected(glob[w], glob[l])
        bw = blend * surf[(w, s)] + (1 - blend) * glob[w]
        bl = blend * surf[(l, s)] + (1 - blend) * glob[l]
        es = expected(bw, bl)

        events.append(dict(row=r, surface=s, exp_global=eg, exp_surface=es))

        glob[w] += ELO_K * (1.0 - eg)
        glob[l] -= ELO_K * (1.0 - eg)
        esu = expected(surf[(w, s)], surf[(l, s)])
        surf[(w, s)] += ELO_K * (1.0 - esu)
        surf[(l, s)] -= ELO_K * (1.0 - esu)

    return events, glob, surf


def _accuracy(events, key, test_year=2026):
    ok = tot = 0
    for e in events:
        try:
            y = int(e["row"]["tourney_date"]) // 10000
        except (ValueError, KeyError):
            continue
        if y != test_year:
            continue
        tot += 1
        ok += (e[key] >= 0.5)          # winner was the (≥50%) favorite
    return ok, tot


def main():
    ensure_data()
    rows = load_matches()
    print(f"Out-of-sample 2026 accuracy ({YEARS[0]}-2025 warm-up):\n")
    # global is blend-independent; compute once
    ev0, _, _ = walk(rows, blend=0.0)
    g_ok, g_tot = _accuracy(ev0, "exp_global")
    print(f"  global Elo                : {g_ok/g_tot*100:.1f}% ({g_ok}/{g_tot})")
    for b in (0.0, 0.3, 0.5, 0.7, 1.0):
        ev, _, _ = walk(rows, blend=b)
        ok, tot = _accuracy(ev, "exp_surface")
        print(f"  surface-blended (w={b:.1f}) : {ok/tot*100:.1f}% ({ok}/{tot})")


if __name__ == "__main__":
    main()
