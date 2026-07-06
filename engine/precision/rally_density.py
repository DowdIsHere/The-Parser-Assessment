"""
RALLY DENSITY — how much of a match is actually a rally, from the point log.

The frame weights short_win% (1-4) and long_win% (9+) as if both axes matter
equally. But a match is a DISTRIBUTION of point lengths, reshaped by surface and
by serve. This measures the shape we've never looked at: what SHARE of points are
short (1-4) / mid (5-8) / long (9+) — overall, by surface, and per player.

Low long-share = the 9+ gate is grading a sliver of the real match (a server on
grass); the rally read is projecting a game that barely happens.
"""
import sys, os, collections
sys.path.insert(0, os.path.dirname(__file__))
import style_index as si
from mcp_data import iter_points, load_match_meta

SHOT = "fbrsvzopuylmhijkt"


def scan():
    pairs = si._meta_pairs()
    meta = load_match_meta()
    # buckets: overall, by surface, per (player), per (player,grass)
    tot = collections.Counter()
    surf = collections.defaultdict(collections.Counter)
    per = collections.defaultdict(collections.Counter)
    perg = collections.defaultdict(collections.Counter)
    for row in iter_points("m"):
        mid = row["match_id"]
        if mid not in pairs:
            continue
        seq = (row.get("1st", "") or "").strip() or (row.get("2nd", "") or "").strip()
        if not seq:
            continue
        rl = 1 + sum(1 for c in seq if c in SHOT)
        b = "1-4" if rl <= 4 else ("5-8" if rl <= 8 else "9+")
        surface = (meta.get(mid, {}).get("surface", "") or "").strip()
        tot[b] += 1
        surf[surface][b] += 1
        p1, p2 = pairs[mid]
        for nm in (p1, p2):
            per[nm][b] += 1
            if surface.lower() == "grass":
                perg[nm][b] += 1
    return tot, surf, per, perg


def pct(c):
    n = sum(c.values()) or 1
    return {k: 100 * c.get(k, 0) / n for k in ("1-4", "5-8", "9+")}, n


def line(name, c):
    p, n = pct(c)
    print(f"  {name:26} 1-4:{p['1-4']:5.1f}%  5-8:{p['5-8']:5.1f}%  9+:{p['9+']:5.1f}%   (n={n})")


if __name__ == "__main__":
    tot, surf, per, perg = scan()
    print("=== OVERALL (all men, all surfaces) ===")
    line("all", tot)
    print("\n=== BY SURFACE ===")
    for s in sorted(surf, key=lambda s: -sum(surf[s].values())):
        if sum(surf[s].values()) > 2000:
            line(s or "(blank)", surf[s])
    print("\n=== PLAYERS (all surfaces) ===")
    for nm in ["Jannik Sinner","Jan-Lennard Struff","Alexander Zverev","Jiri Lehecka","Taylor Fritz","Alexander Bublik","Felix Auger-Aliassime","Novak Djokovic","Alex de Minaur","Flavio Cobolli","Daniil Medvedev"]:
        k = next((k for k in per if nm.split()[-1] in k), None)
        if k: line(k, per[k])
    print("\n=== SAME PLAYERS, GRASS ONLY ===")
    for nm in ["Jannik Sinner","Jan-Lennard Struff","Alexander Zverev","Jiri Lehecka","Taylor Fritz","Alexander Bublik","Felix Auger-Aliassime","Novak Djokovic","Alex de Minaur","Flavio Cobolli","Daniil Medvedev"]:
        k = next((k for k in perg if nm.split()[-1] in k and sum(perg[k].values())>150), None)
        if k: line(k+" (grass)", perg[k])
