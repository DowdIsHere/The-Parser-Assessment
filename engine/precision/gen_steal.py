"""Precompute charting steal (drop+lob per 1000 shots) for ALL charted players,
both tours -> 'Precision - Steal (Charting).csv'. Frees the frame from the
101-player TennisViz cage: any charted player gets a real steal value."""
import sys, os, csv
sys.path.insert(0, os.path.dirname(__file__))
import style_index as si

ROOT = os.path.join(os.path.dirname(__file__), "..", "..")
OUT = os.path.join(ROOT, "Precision - Steal (Charting).csv")

rows = []
for tour in ("m", "w"):
    fs = si.future_steal(tour, min_shots=800)
    for nm, v in fs.items():
        rows.append((nm, tour, round(v, 1)))
rows.sort()
with open(OUT, "w", newline="") as f:
    w = csv.writer(f)
    w.writerow(["player", "tour", "steal_charting"])
    w.writerows(rows)
print(f"wrote {len(rows)} players -> {OUT}")
