"""
COUPLING test: what happens when two elite readers collide?

Findings codified in "Precision - Parser List & Constants List.md":
  - Awkward seam = the START OF SET 2, not the end of set 1. Break rate by
    phase: set openings are volatile, set CLOSINGS are calm, and set 2's
    opening is the most break-prone phase of the match. Clean on both tours.
  - Coupling fingerprint (elite-vs-elite proxy for "two readers"): more
    deciders, lower set-1 conversion, set-1 loser does slightly better --
    6/6 directional arrows but small and confounded with closeness. The
    strong claim ("read is wrong -> the one who was read wins") FAILS; the
    weak claim ("early read worth less between two readers") holds faintly.
    Consistent with the chess-game read: near-draw, no edge.

"Elite" here = both players in the top 40 by charted-match count (a proxy for
two strong readers; we cannot yet label true types from data).

Run:  python3 engine/precision/match_shape.py
"""
import collections

from mcp_data import load_match_meta, iter_points


def reconstruct(tour, meta):
    """Per match: set winners (list of '1'/'2'), match winner, best_of, players,
    and the per-game break events tagged by phase."""
    rows_by = collections.defaultdict(list)
    for row in iter_points(tour):
        mid = row["match_id"]
        try:
            rows_by[mid].append((
                int(row["Set1"]), int(row["Set2"]),
                int(row["Gm1"]), int(row["Gm2"]),
                row["Svr"], row["PtWinner"],
            ))
        except (ValueError, KeyError):
            pass

    matches = []
    pcount = collections.Counter()
    for mid, rows in rows_by.items():
        if mid not in meta or len(rows) < 5:
            continue
        m = meta[mid]
        # set winners by watching the running set tally increment
        sw = []
        prev = (0, 0)
        for s1, s2, *_ in rows:
            if (s1 + s2) > (prev[0] + prev[1]):
                sw.append("1" if s1 > prev[0] else "2")
                prev = (s1, s2)
        last = rows[-1][5]
        s1f, s2f = rows[-1][0], rows[-1][1]
        if last == "1":
            s1f += 1
        else:
            s2f += 1
        sw.append(last)
        if len(sw) < 2:
            continue
        mw = "1" if s1f > s2f else "2"

        # break events by phase
        games = []
        p = None
        for cur in rows:
            if p is not None:
                s1, s2, g1, g2, svr, _pw = cur
                ps1, ps2, pg1, pg2, psvr, _ppw = p
                set_changed = (s1 + s2) != (ps1 + ps2)
                game_changed = (g1 != pg1 or g2 != pg2) and not set_changed
                is_tb = (pg1 == 6 and pg2 == 6)
                if game_changed and not is_tb:
                    setno = ps1 + ps2 + 1
                    gin = pg1 + pg2 + 1
                    gw = "1" if g1 > pg1 else ("2" if g2 > pg2 else None)
                    if gw:
                        broke = gw != psvr
                        if setno == 1:
                            ph = "S1 early(1-6)" if gin <= 6 else "S1 late(7+)"
                        elif setno == 2:
                            ph = "S2 open(1-3)" if gin <= 3 else "S2 rest(4+)"
                        else:
                            ph = "S3+"
                        games.append((ph, broke))
            p = cur

        matches.append({"p1": m["p1"], "p2": m["p2"], "bo": m["best_of"],
                        "nsets": len(sw), "s1w": sw[0], "mw": mw, "games": games})
        pcount[m["p1"]] += 1
        pcount[m["p2"]] += 1
    return matches, pcount


PHASES = ["S1 early(1-6)", "S1 late(7+)", "S2 open(1-3)", "S2 rest(4+)", "S3+"]


def report(tour, label):
    meta = load_match_meta()
    res, pc = reconstruct(tour, meta)
    top = set(p for p, _ in pc.most_common(40))
    bo3 = [m for m in res if m["bo"] == 3]
    n = len(bo3)

    print(f"\n=== {label} (best-of-3 charted matches: {n}) ===")
    dec = sum(1 for m in bo3 if m["nsets"] == 3)
    conv = sum(1 for m in bo3 if m["s1w"] == m["mw"])
    print(f"  3-set rate: {100*dec/n:.1f}%   set-1 -> match conversion: {100*conv/n:.1f}%")

    elite = [m for m in bo3 if m["p1"] in top and m["p2"] in top]
    other = [m for m in bo3 if not (m["p1"] in top and m["p2"] in top)]

    def split(ms):
        d = 100 * sum(1 for m in ms if m["nsets"] == 3) / len(ms)
        c = 100 * sum(1 for m in ms if m["s1w"] == m["mw"]) / len(ms)
        threes = [m for m in ms if m["nsets"] == 3]
        lw = 100 * sum(1 for m in threes if m["s1w"] != m["mw"]) / len(threes) if threes else 0
        return len(ms), d, c, lw

    for name, ms in (("elite v elite", elite), ("everyone else", other)):
        nn, d, c, lw = split(ms)
        print(f"  {name:14s} n={nn:4d}: 3-set {d:.1f}%  set1-conv {c:.1f}%  "
              f"set1-loser-wins-decider {lw:.1f}%")

    # break rate by phase
    def phase_rates(ms):
        agg = collections.defaultdict(lambda: [0, 0])
        for m in ms:
            for ph, broke in m["games"]:
                agg[ph][0] += broke
                agg[ph][1] += 1
        return agg

    print("  break rate by phase (all / elite-v-elite):")
    allr = phase_rates(bo3 + [m for m in res if m["bo"] != 3])
    elr = phase_rates(elite)
    for ph in PHASES:
        b, g = allr[ph]
        eb, eg = elr[ph]
        a = f"{100*b/g:5.1f}%" if g else "  -  "
        e = f"{100*eb/eg:5.1f}%" if eg else "  -  "
        print(f"    {ph:16s} all {a}   elite {e}")


def main():
    report("m", "MEN")
    report("w", "WOMEN")


if __name__ == "__main__":
    main()
