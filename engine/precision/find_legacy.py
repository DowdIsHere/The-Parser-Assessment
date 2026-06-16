"""
LOCKED Legacy identifier -- applied to the entire charting dataset (men + women).

The locked, validated data points (each earned its place by surviving a test;
see "Precision - Parser List & Constants List.md"):

  STYLE INDEX (the defensive/attrition pole) -- composite of three independent,
  opponent-adjusted tells that agree:
    * Win:UFE ratio        (low = attrition)
    * rally differential   (long%-short%, high = attrition)
    * forced-UFE           (you make the opponent miss)
  STEAL DISQUALIFIER -- short-rally winners + aces per 100 (wins cheap/fast).
    A true Legacy earns by pattern; high steal = first-strike -> disqualified.

  Locked gate:  style index >= INDEX_MIN  AND  steal <= STEAL_MAX

NOT locked (unresolved): "low UFE = Legacy". Tested 3 ways and the low-UFE end
is owned by big servers, not grinders -- so adj-UFE is REPORTED as a column for
the open Legacy-vs-Pda question (does the cluster split into low-UFE true Legacy
vs high-UFE defensive-aggressive presser?), but it does NOT gate. Awaiting a
human ground-truth Legacy to fix the direction (cf. Alcaraz=Intentional).

Run:  python3 engine/precision/find_legacy.py
"""
import style_index as si

INDEX_MIN = 1.0
STEAL_MAX = 12.0


def find(tour):
    r = si.build(tour)
    idx, steal = r["index"], r["steal"]
    adj_ufe, forces = r["adj_ufe"], r["forces_opp"]
    rows = []
    for p in idx:
        if idx[p] >= INDEX_MIN and p in steal and steal[p] <= STEAL_MAX:
            rows.append({
                "player": p, "index": idx[p], "steal": steal[p],
                "adj_ufe": adj_ufe.get(p, float("nan")),
                "forces": forces.get(p, float("nan")),
            })
    rows.sort(key=lambda x: -x["index"])
    return rows


def main():
    for tour, label in (("m", "MEN"), ("w", "WOMEN")):
        rows = find(tour)
        print(f"\n=== {label}: LEGACY candidates "
              f"(index>={INDEX_MIN} AND steal<={STEAL_MAX})  n={len(rows)} ===")
        print(f"  {'player':24s} {'index':>6s} {'steal':>6s} {'adjUFE':>7s} {'forces':>7s}  UFE-flag")
        # median UFE within the cluster to flag low vs high (the open Legacy/Pda split)
        ufes = sorted(x["adj_ufe"] for x in rows)
        med = ufes[len(ufes) // 2] if ufes else float("nan")
        for x in rows:
            flag = "LOW (true Legacy?)" if x["adj_ufe"] <= med else "high (Pda?)"
            print(f"  {x['player']:24s} {x['index']:+6.2f} {x['steal']:6.1f} "
                  f"{x['adj_ufe']:7.2f} {x['forces']:+7.2f}  {flag}")


if __name__ == "__main__":
    main()
