"""
TWO-GATE EVALUATOR -- the author's framework, per-metric.

Thresholds = average winning gaps from a 700+ match survey. For each prescribed
metric a player passes TWO gates against the opponent (gap = player - opponent):

  1. SIGN gate  -- correct side. Wrong side = NO-EDGE (not even considered).
  2. THRESHOLD  -- FULL (>= the average gap) or CONSIDERED (0..gap, partial).

Metric kinds:
  exceed v -> must lead:  gap>=v FULL ; 0<=gap<v considered ; gap<0 NO-EDGE
  trail  v -> may trail:  gap>=-v hold ; gap<-v NO-EDGE
  cap    v -> own UFE must not exceed opp by >v: gap<=v hold ; gap>v NO-EDGE

This file does NOT decide the winner -- that judgment is the author's. It only
classifies each metric so the chart is exact.

PRESCRIBED (5 gate metrics; oppUFE is display-only, not gated):
  PM: 1-4 +1.1 conv +1.4 9+ +5.9 steal +3.6 ufc cap 3.9   (grinder: leads all)
  FC: 1-4 +2.3 conv +0.5 9+ trail 0.6 steal trail 3.3 ufc cap 2.2 (striker)
"""
PRESCRIBED = {
    "PM": {"r14": ("exceed", 1.1), "conv": ("exceed", 1.4),
           "r9": ("exceed", 5.9), "steal": ("exceed", 3.6),
           "ufc": ("cap", 3.9)},
    "FC": {"r14": ("exceed", 2.3), "conv": ("exceed", 0.5),
           "r9": ("trail", 0.6), "steal": ("trail", 3.3),
           "ufc": ("cap", 2.2)},
}
LABEL = {"r14": "1-4", "conv": "conv", "r9": "9+", "steal": "steal", "ufc": "ufc"}


def state(kind, gap, v):
    if kind == "exceed":
        if gap >= v:
            return "FULL"
        if gap >= 0:
            return "considered"
        return "NO-EDGE"
    if kind == "trail":
        return "hold" if gap >= -v else "NO-EDGE"
    if kind == "cap":
        return "hold" if gap <= v else "NO-EDGE"
    return "?"


def evaluate(player, opp, pole):
    """Per-metric two-gate classification of `player` (CBI type `pole`) vs `opp`."""
    rows = []
    for m, (kind, v) in PRESCRIBED[pole].items():
        gap = player[m] - opp[m]
        rows.append({"metric": LABEL[m], "kind": kind, "gap": round(gap, 1),
                     "thr": v, "state": state(kind, gap, v)})
    return rows


def chart(name, player, pole, opp):
    rows = evaluate(player, opp, pole)
    print(f"  {name} (as {pole}) — gaps vs opponent:")
    for r in rows:
        need = (f">= +{r['thr']}" if r["kind"] == "exceed"
                else f">= -{r['thr']} (trail)" if r["kind"] == "trail"
                else f"<= +{r['thr']} (cap)")
        print(f"    {r['metric']:6s} gap {r['gap']:+6.1f}  need {need:18s} {r['state']}")
    holds = sum(r["state"] in ("FULL", "considered", "hold") for r in rows)
    print(f"    -> holds {holds}/5 (FULL/considered/hold); "
          f"NO-EDGE on: {[r['metric'] for r in rows if r['state']=='NO-EDGE'] or 'none'}")


if __name__ == "__main__":
    # known result test: Fritz beat Shelton (both FC)
    fritz = {"r14": 51.9, "conv": 69.1, "r9": 48.2, "steal": 27.8, "ufc": 15.9}
    shelton = {"r14": 49.9, "conv": 68.3, "r9": 45.1, "steal": 28.8, "ufc": 17.2}
    print("Fritz vs Shelton (both FC) — Fritz won:")
    chart("Fritz", fritz, "FC", shelton)
    chart("Shelton", shelton, "FC", fritz)
