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


# Winning requirements per architecture (gap measured in the WINNER's frame:
# PM-winner -> PM-FC ; FC-winner -> FC-PM). kinds:
#   "exceed" v -> must lead by >= v        (short of threshold if gap < v)
#   "trail"  v -> may trail by <= v        (beyond deficit if gap < -v)
#   "errcap" v -> own-error gap <= v       (beyond deficit if gap > v)
REQUIRE = {
    "PM": {"r14": ("exceed", 1.1), "conv": ("exceed", 1.4),
           "oufe": ("exceed", 3.5), "r9": ("exceed", 5.9),
           "steal": ("exceed", 3.6), "ufc": ("errcap", 3.9)},
    "FC": {"r14": ("exceed", 2.3), "conv": ("exceed", 0.5),
           "oufe": ("trail", 0.8), "r9": ("trail", 0.6),
           "steal": ("trail", 1.3), "ufc": ("exceed", 2.2)},
}


def gap_report(pm, fc):
    """Only two categories, per spec:
      EXCEEDS BUT SHORT      -- a must-exceed metric that does not meet threshold.
      BEYOND ALLOWED DEFICIT -- a capped metric that breaches its cap.
    Everything that meets threshold / stays within cap is silent.
    Only meaningful on a COMPLETE (stood-by) call.
    """
    r = calc(pm, fc)
    if not r["complete"]:
        return {"complete": False, "missing": r["missing"]}
    winner = r["raw"][0]
    short, beyond = [], []
    for m, (kind, v) in REQUIRE[winner].items():
        gap = (pm[m] - fc[m]) if winner == "PM" else (fc[m] - pm[m])
        if kind == "exceed" and gap < v:
            short.append((m, gap, v, v - gap))            # shortfall to threshold
        elif kind == "trail" and gap < -v:
            beyond.append((m, gap, -v, (-v) - gap))       # how far past the cap
        elif kind == "errcap" and gap > v:
            beyond.append((m, gap, v, gap - v))           # own-error overage
    return {"complete": True, "winner": winner,
            "short": short, "beyond": beyond}


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
    print(f"  winner = {gr['winner']}")
    print("  EXCEEDS BUT SHORT (must-exceed, under threshold):")
    for m, gap, thr, sh in gr["short"]:
        print(f"     {m:6s} gap {gap:+5.1f}  threshold +{thr:.1f}  short by {sh:.2f}")
    if not gr["short"]:
        print("     (none)")
    print("  BEYOND ALLOWED DEFICIT (capped metric breached):")
    for m, gap, cap, over in gr["beyond"]:
        print(f"     {m:6s} gap {gap:+5.1f}  cap {cap:+.1f}  beyond by {over:.2f}")
    if not gr["beyond"]:
        print("     (none)")

    print("\nSECOND EXAMPLE -- an FC win that breaches a deficit cap:")
    pm2 = {"r14": 50.0, "conv": 68.0, "oufe": 18.0, "r9": 49.0,
           "steal": 35.0, "ufc": 20.0}
    fc2 = {"r14": 53.5, "conv": 69.2, "oufe": 17.6, "r9": 48.6,
           "steal": 32.0, "ufc": 22.5}
    r2 = calc(pm2, fc2)
    gr2 = gap_report(pm2, fc2)
    print(f"  verdict: {r2['raw'][0]} [{r2['raw'][1]} {r2['raw'][2]:.2f}]  "
          f"winner = {gr2['winner']}")
    print("  EXCEEDS BUT SHORT:")
    for m, gap, thr, sh in gr2["short"]:
        print(f"     {m:6s} gap {gap:+5.1f}  threshold +{thr:.1f}  short by {sh:.2f}")
    if not gr2["short"]:
        print("     (none)")
    print("  BEYOND ALLOWED DEFICIT:")
    for m, gap, cap, over in gr2["beyond"]:
        print(f"     {m:6s} gap {gap:+5.1f}  cap {cap:+.1f}  beyond by {over:.2f}")
    if not gr2["beyond"]:
        print("     (none)")


if __name__ == "__main__":
    main()

