"""
SIX-METRIC ALL-GREEN RECIPE -- the author's calculator (IMG_1757), faithful.

The win condition is the WHOLE prescribed set met TOGETHER. Every metric is a
gate; a side is a CALL only if all six are green. Green = the metric meets its
threshold; red = it doesn't. No single factor is a winning condition -- it's a
recipe, and only together they win.

The six metrics (author's grid order), gap = player - opponent:
  1-4 Rally (short_win%)    exceed -- must lead by the success gap
  Convs     (TennisViz)     exceed
  OUFE-A    (adjUFE+WinUFE) trail (FC) / exceed (PM) -- opponent UFE forced
  9+ Rally  (long_win%)     exceed (PM) / trail (FC)
  Steal     (TennisViz)     exceed (PM) / trail (FC)
  UFE       (adjUFE)        cap -- own unforced errors must not exceed by > cap

Kinds:
  exceed v -> green if gap >= v
  trail  v -> green if gap >= -v   (allowed deficit of v)
  cap    v -> green if gap <= v    (own-UFE overage cap)

FC thresholds are read straight off IMG_1757 (UFE cap held at the engine's
verified 2.2, not the image's stale 2.8). PM thresholds carry from the
calibrated calculator; PM's OUFE gate uses the verified +3.5 PM-win gap.
"""
PRESCRIBED = {
    "PM": {"r14": ("exceed", 1.1), "conv": ("exceed", 1.4),
           "oufe": ("exceed", 3.5), "r9": ("exceed", 5.9),
           "steal": ("exceed", 3.6), "ufc": ("cap", 3.9)},
    "FC": {"r14": ("exceed", 2.3), "conv": ("exceed", 0.5),
           "oufe": ("trail", 0.8), "r9": ("trail", 0.6),
           "steal": ("trail", 3.3), "ufc": ("cap", 2.2)},
}
LABEL = {"r14": "1-4 Rally", "conv": "Convs", "oufe": "OUFE-A",
         "r9": "9+ Rally", "steal": "Steal", "ufc": "UFE"}
ORDER = ["r14", "conv", "oufe", "r9", "steal", "ufc"]


def green(kind, gap, v):
    """True (green) if the metric meets its threshold; else False (red)."""
    if kind == "exceed":
        return gap >= v
    if kind == "trail":
        return gap >= -v
    if kind == "cap":
        return gap <= v
    return False


def need_str(kind, v):
    return (f">= +{v}" if kind == "exceed"
            else f">= -{v} (trail)" if kind == "trail"
            else f"<= +{v} (cap)")


def evaluate(player, opp, pole):
    """Per-metric green/red for `player` (CBI type `pole`) vs `opp`."""
    rows = []
    for m in ORDER:
        kind, v = PRESCRIBED[pole][m]
        gap = player[m] - opp[m]
        rows.append({"metric": LABEL[m], "key": m, "kind": kind, "gap": round(gap, 1),
                     "thr": v, "green": green(kind, gap, v)})
    return rows


def all_green(player, opp, pole):
    rows = evaluate(player, opp, pole)
    reds = [r["metric"] for r in rows if not r["green"]]
    return (not reds), reds, rows


def chart(name, player, pole, opp):
    ok, reds, rows = all_green(player, opp, pole)
    print(f"  {name} (as {pole}) — six-metric recipe vs opponent:")
    for r in rows:
        mark = "GREEN" if r["green"] else "RED"
        print(f"    {r['metric']:10s} gap {r['gap']:+6.1f}  need {need_str(r['kind'], r['thr']):16s} {mark}")
    print(f"    -> {'ALL-GREEN — CALL' if ok else 'NOT all-green — NO CALL'};  red: {reds or 'none'}")
    return ok


if __name__ == "__main__":
    # IMG_1757: Zverev (FC) vs Fritz (FC), pre-refresh numbers. Fritz won.
    zverev = {"r14": 51.4, "conv": 70.0, "oufe": 17.9, "r9": 48.7, "steal": 32.7, "ufc": 16.9}
    fritz = {"r14": 51.9, "conv": 68.9, "oufe": 17.0, "r9": 48.2, "steal": 27.4, "ufc": 15.9}
    chart("Zverev", zverev, "FC", fritz)   # expect: only 1-4 red -> NO CALL
    chart("Fritz", fritz, "FC", zverev)
