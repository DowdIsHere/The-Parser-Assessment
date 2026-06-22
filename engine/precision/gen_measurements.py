"""Regenerate Precision - Everybody Measurements.csv from a FRESH Sackmann pull.
Framework metrics only matter (short_win%/long_win%/adjUFE/WinUFE); conv/steal
columns are kept for shape but the variables are sourced from TennisViz."""
import csv, os, sys
sys.path.insert(0, os.path.dirname(__file__))
import profile
OUT = os.path.join(os.path.dirname(__file__), "..", "..",
                   "Precision - Everybody Measurements.csv")
def f(v, d):
    return "" if v is None else round(v, d)
rows = []
for tour, label in (("m", "MEN"), ("w", "WOMEN")):
    M = profile.measurements(tour)
    for p in sorted(M):
        m = M[p]
        rows.append([label, p, f(m["WinUFE"], 2), f(m["short"], 1), f(m["long"], 1),
                     f(m["steal"], 1), f(m["conv"], 1), f(m["forces"], 2), f(m["adjUFE"], 1)])
with open(OUT, "w", newline="", encoding="utf-8") as fh:
    w = csv.writer(fh)
    w.writerow(["tour","player","WinUFE","short_win%","long_win%","steal_droplob",
                "BP_conv%","forces_oppUFE","adjUFE"])
    w.writerows(rows)
print(f"wrote {len(rows)} rows")
