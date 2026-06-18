"""
CBI MATCH WIDGET -- the calibrated calculator. Dump the stats, get the winner.

Scope: the SIX observable success metrics only (no gradients/neuro literature;
that stays proprietary & separate). Two cognitive architectures:
  PM (Pattern Matcher)   FC (Forecaster)

VERIFIED winning profile (see "Precision - Calculator (Winning Profile).md").
Each constant is a (PM - FC) gap in native units; pair = [PM wins] / [PM loses]:

  metric   PM-wins   PM-loses   (win-side)
  1-4       +1.1      -2.3       higher = PM
  conv      +1.4      -0.5       higher = PM
  oufe      +3.5      +0.8       higher = PM
  9+        +5.9      +0.6       higher = PM
  steal     +3.6      +1.3       higher = PM
  ufc       -3.9      -2.2       lower  = PM   (own errors; lower better)

Decision: for each metric compute the observed (PM - FC) gap, compare to the
midpoint of its pair, and normalize so +1 == sitting on the PM-win centroid,
-1 == the PM-lose centroid. Average across the metrics present -> >0 predicts
the PM, <0 the FC.

CONDITIONS are a SEPARATE second read (the dials are season averages, so
surface is already partly baked in -- never trust a conditions-only flip).

Run:  python3 engine/precision/widget.py
"""
import csv
import os
import statistics

CSV = os.path.join(os.path.dirname(__file__), "..", "..",
                   "ATP Insights - Performance (TennisViz).csv")

# metric: (PM-wins gap, PM-loses gap)   all (PM - FC), native units
PROFILE = {
    "r14":   (1.1, -2.3),
    "conv":  (1.4, -0.5),
    "oufe":  (3.5,  0.8),
    "r9":    (5.9,  0.6),
    "steal": (3.6,  1.3),
    "ufc":   (-3.9, -2.2),
}
STRIKE = ("r14", "conv")          # conditions lens keys off the strike gap
SURFACE_TEMPO = {"grass": 0.6, "indoor": 0.4, "hard": 0.0, "clay": -0.6}
COND_K = 0.15


def load_pool():
    rows = {}
    with open(CSV, encoding="utf-8") as f:
        for r in csv.DictReader(f):
            rows[r["player"]] = {"conv": float(r["conversion"]),
                                 "steal": float(r["steal"])}
    return rows


def find(pool, name):
    for k in pool:
        if name.lower() in k.lower():
            return k
    return None


def conditions_tempo(surface="hard", wind=False, cold=False, hot_dry=False,
                     altitude=False):
    t = SURFACE_TEMPO.get(surface, 0.0)
    if wind:     t -= 0.2
    if cold:     t -= 0.2
    if hot_dry:  t += 0.2
    if altitude: t += 0.2
    return max(-1.0, min(1.0, t))


def calc(pm, fc, tempo=0.0):
    """pm, fc = dicts of native metric values. Returns the calculator read.

    A call is STOOD BY only when all six metrics are present. With anything
    missing it is INCOMPLETE -> no verdict (author does not stand by partials).
    """
    per = {}
    tot = 0.0; n = 0; votes = 0
    for m, (w, l) in PROFILE.items():
        if m not in pm or m not in fc:
            continue
        gap = pm[m] - fc[m]
        mid = (w + l) / 2.0
        half = abs(w - l) / 2.0 or 1e-9
        d = 1.0 if w > l else -1.0
        norm = ((gap - mid) * d) / half        # +1 PM-win centroid, -1 PM-lose
        per[m] = {"gap": gap, "win": w, "lose": l, "half": half,
                  "d": d, "norm": norm}
        tot += norm; n += 1
        votes += 1 if norm > 0 else 0
    agg = tot / n if n else 0.0
    complete = (n == len(PROFILE))

    strike_gap = sum(pm[m] - fc[m] for m in STRIKE if m in pm and m in fc)
    cond = agg + tempo * COND_K * (1 if strike_gap >= 0 else -1)

    def verdict(s):
        win = "PM" if s >= 0 else "FC"
        a = abs(s)
        conf = "HIGH" if a >= 0.6 else "MED" if a >= 0.3 else "LEAN"
        return win, conf, a
    return {"per": per, "n": n, "votes": votes, "complete": complete,
            "missing": [m for m in PROFILE if m not in per],
            "raw": verdict(agg), "cond": verdict(cond),
            "agree": verdict(agg)[0] == verdict(cond)[0],
            "agg": agg, "condscore": cond}


def gap_report(pm, fc):
    """Metrics that EXCEED (are on the predicted winner's side of the line)
    but DO NOT MEET the winning threshold -- trending right, still short.

    For each such metric: the shortfall to threshold, in native units.
    Only meaningful on a COMPLETE (stood-by) call.
    """
    r = calc(pm, fc)
    if not r["complete"]:
        return {"complete": False, "missing": r["missing"]}
    winner = r["raw"][0]
    rows = []
    floor_breaks = []
    for m, p in r["per"].items():
        # winner-frame score: +1 == at winner centroid, 0 == decision line
        s = p["norm"] if winner == "PM" else -p["norm"]
        center = p["win"] if winner == "PM" else p["lose"]
        if s <= 0:
            floor_breaks.append((m, p["gap"], center))       # on loser's side
        elif s < 1:
            short = (1 - s) * p["half"]                       # native shortfall
            rows.append((m, p["gap"], center, short))
    return {"complete": True, "winner": winner, "rows": rows,
            "floor": floor_breaks, "clean": [m for m, p in r["per"].items()
                if (p["norm"] if winner == "PM" else -p["norm"]) >= 1]}


def from_pool(pool, name, extra=None):
    """Metric dict: conv/steal from the CSV pool + any dumped extras
    (r14, r9, oufe, ufc)."""
    k = find(pool, name)
    d = {}
    if k:
        d["conv"] = pool[k]["conv"]; d["steal"] = pool[k]["steal"]
    if extra:
        d.update(extra)
    return k or name, d


def main():
    pool = load_pool()
    tempo = conditions_tempo(surface="grass")
    print("Calculator: verified 6-metric profile. A call is STOOD BY only "
          "with all six metrics.\n")
    card = [
        ("de Minaur", "Shapovalov"),
        ("Medvedev", "Atmane"),
        ("Learner Tien", "Auger-Aliassime"),
        ("Buse", "Nakashima"),
        ("Hijikata", "Lehecka"),
    ]
    print("CARD (have conv+steal only):")
    for pm_name, fc_name in card:
        kp, pm = from_pool(pool, pm_name)
        kf, fc = from_pool(pool, fc_name)
        r = calc(pm, fc, tempo)
        miss = ", ".join(r["missing"])
        print(f"  {kp.split()[-1]:12s} v {kf.split()[-1]:14s} "
              f"INCOMPLETE -> not stood by (missing: {miss})")

    print("\nFULL-DUMP EXAMPLE -- verdict + GAP REPORT:")
    pm_dump = {"r14": 51.0, "conv": 69.4, "oufe": 21.0, "r9": 53.0,
               "steal": 36.7, "ufc": 19.5}
    fc_dump = {"r14": 50.5, "conv": 68.2, "oufe": 18.0, "r9": 49.0,
               "steal": 31.3, "ufc": 21.0}
    r = calc(pm_dump, fc_dump, tempo)
    w, c, a = r["raw"]
    print(f"  verdict: {w} [{c} {a:.2f}]  (votes {r['votes']}/{r['n']}, "
          f"complete={r['complete']})")
    gr = gap_report(pm_dump, fc_dump)
    print(f"  winner = {gr['winner']}.  clean (meet/exceed threshold): "
          f"{', '.join(gr['clean']) or 'none'}")
    if gr["rows"]:
        print("  GAP REPORT -- exceeds the line but short of threshold:")
        for m, gap, center, short in gr["rows"]:
            print(f"     {m:6s} gap {gap:+5.1f}  threshold {center:+5.1f}  "
                  f"short by {short:.2f}")
    if gr["floor"]:
        print("  BELOW FLOOR (on the loser's side, worse than a gap):")
        for m, gap, center in gr["floor"]:
            print(f"     {m:6s} gap {gap:+5.1f}  needs {center:+5.1f}")


if __name__ == "__main__":
    main()

