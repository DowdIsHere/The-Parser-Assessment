"""
engine/condition_fade.py — Coupling Engine, module 3: condition-aware fade.

Module 2 gave a strength-controlled fade residual. This splits that residual by
an EXOGENOUS condition tag — surface (the SPACE dose) — to test the core claim
of the dose-response scale: do conditions BREAK, not just punish? Concretely,
does a fade-prone player fade MORE on a high-dose surface (slow clay, long
points) than on lower-dose surfaces (faster hard/grass)?

We deliberately tag by surface (exogenous), NOT by match length or by reaching a
decider — those are selected for closeness and would make the test circular.

Elo is one global, point-in-time walk; each deciding match's (actual - expected)
is bucketed by the surface it was played on. Also exposes a surface-specific
fade so the matchup race can use the right number for the conditions.

Usage:  python3 engine/condition_fade.py
"""

import math
import os
import sys
from collections import defaultdict

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from fade_curve import (  # noqa: E402
    YEARS, ELO_BASE, ELO_K, MIN_DECIDERS, ensure_data, load_matches,
    reached_decider, expected,
)

MIN_CELL = 10                       # min deciders in a surface bucket to report it
SLOW = {"Clay"}                     # high-dose surface (long points)
FAST = {"Hard", "Grass", "Carpet"} # lower-dose surfaces


def compute_by_surface(rows):
    """Chronological Elo; bucket each decider's (actual-expected) by surface."""
    elo = defaultdict(lambda: ELO_BASE)
    acc = defaultdict(lambda: dict(exp=0.0, act=0.0, var=0.0, n=0))  # key=(player, surface)

    def add(player, surface, e, actual):
        for k in ((player, surface), (player, "ALL")):
            a = acc[k]
            a["exp"] += e
            a["act"] += actual
            a["var"] += e * (1.0 - e)
            a["n"] += 1

    for r in rows:
        w, l = r["winner_name"], r["loser_name"]
        surf = (r.get("surface") or "").strip() or "Unknown"
        try:
            best_of = int(r["best_of"])
        except (ValueError, KeyError):
            best_of = 3

        if reached_decider(r["score"], best_of):
            ew = expected(elo[w], elo[l])
            add(w, surf, ew, 1.0)
            add(l, surf, 1.0 - ew, 0.0)

        ew = expected(elo[w], elo[l])
        elo[w] += ELO_K * (1.0 - ew)
        elo[l] -= ELO_K * (1.0 - ew)

    # reshape -> {player: {surface_or_ALL: {residual, n, z}}}
    by_player = defaultdict(dict)
    for (player, surf), a in acc.items():
        if a["n"] == 0:
            continue
        resid = (a["act"] - a["exp"]) / a["n"] * 100.0
        z = (a["act"] - a["exp"]) / math.sqrt(a["var"]) if a["var"] > 0 else 0.0
        by_player[player][surf] = dict(residual=resid, n=a["n"], z=z)
    return by_player


def dose_test(by_player):
    """
    Paired test: per player, residual on SLOW (clay) vs FAST (hard/grass).
    Hypothesis: fade-prone players fade MORE on the higher-dose surface.
    """
    diffs_fade, diffs_durable = [], []
    for player, cells in by_player.items():
        overall = cells.get("ALL")
        if not overall or overall["n"] < MIN_DECIDERS:
            continue
        slow = cells.get("Clay")
        fast_cells = [cells[s] for s in ("Hard", "Grass") if s in cells]
        if not slow or slow["n"] < MIN_CELL:
            continue
        fast_n = sum(c["n"] for c in fast_cells)
        if fast_n < MIN_CELL:
            continue
        # weighted-average fast residual across hard+grass
        fast_resid = sum(c["residual"] * c["n"] for c in fast_cells) / fast_n
        diff = slow["residual"] - fast_resid          # negative => worse on clay
        (diffs_fade if overall["residual"] < 0 else diffs_durable).append(diff)

    def summ(xs):
        if not xs:
            return None
        m = sum(xs) / len(xs)
        sd = (sum((x - m) ** 2 for x in xs) / len(xs)) ** 0.5
        se = sd / (len(xs) ** 0.5)
        return m, se, len(xs)

    return summ(diffs_fade), summ(diffs_durable)


def race(by_player, a, b, surface="Hard"):
    """Surface-aware fade race: use the surface-specific residual where available."""
    def cell(p):
        c = by_player.get(p, {})
        s = c.get(surface)
        if s and s["n"] >= MIN_CELL:
            return s["residual"], f"{surface} n={s['n']}"
        if "ALL" in c:
            return c["ALL"]["residual"], f"all-surface n={c['ALL']['n']} (thin on {surface})"
        return None, "no sample"

    ra, na = cell(a)
    rb, nb = cell(b)
    if ra is None or rb is None:
        return f"  insufficient sample ({a if ra is None else b})"
    durable = a if ra > rb else b
    breaker = b if durable == a else a
    return (f"  on {surface}:  {a} {ra:+.1f}pp ({na})   {b} {rb:+.1f}pp ({nb})\n"
            f"  -> if it reaches a deciding set here, edge shifts toward {durable}; "
            f"{breaker} likelier to break first.")


def main():
    ensure_data()
    by_player = compute_by_surface(load_matches())

    fade, durable = dose_test(by_player)
    print(f"DOSE TEST — does a slow (high-dose) surface deepen the fade?  ATP {YEARS[0]}-{YEARS[-1]}")
    print("(per player: clay residual minus hard/grass residual; negative = worse on clay)\n")
    for label, s in (("Fade-prone players (overall residual < 0)", fade),
                     ("Durable players  (overall residual > 0)", durable)):
        if s:
            m, se, k = s
            sig = "*" if abs(m) > 2 * se else " "
            print(f"  {label:<42} mean {m:+.1f}pp  (SE {se:.1f}, n={k}) {sig}")
        else:
            print(f"  {label:<42} (no qualifying players)")
    print("\n  Read: if the fade-prone cohort is meaningfully negative and the durable "
          "cohort is not,\n  the slow surface is dosing the break, not merely punishing.")

    print("\nExample surface splits (residual by surface):")
    for p in ("Taylor Fritz", "Marcos Giron", "Carlos Alcaraz"):
        cells = by_player.get(p, {})
        parts = [f"{s} {cells[s]['residual']:+.0f}pp(n{cells[s]['n']})"
                 for s in ("Clay", "Hard", "Grass") if s in cells]
        print(f"  {p:<20} " + "  ".join(parts))

    print("\nExample surface-aware races:")
    print(race(by_player, "Taylor Fritz", "Casper Ruud", surface="Clay"))
    print(race(by_player, "Taylor Fritz", "Casper Ruud", surface="Grass"))


if __name__ == "__main__":
    main()
