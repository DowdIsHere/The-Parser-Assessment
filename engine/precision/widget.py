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
    """pm, fc = dicts of native metric values. Returns the calculator read."""
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
        per[m] = norm
        tot += norm; n += 1
        votes += 1 if norm > 0 else 0
    agg = tot / n if n else 0.0

    # conditions: separate lens. fast court helps whoever has the strike edge.
    strike_gap = sum(pm[m] - fc[m] for m in STRIKE if m in pm and m in fc)
    cond = agg + tempo * COND_K * (1 if strike_gap >= 0 else -1)

    def verdict(s):
        win = "PM" if s >= 0 else "FC"
        a = abs(s)
        conf = "HIGH" if a >= 0.6 else "MED" if a >= 0.3 else "LEAN"
        return win, conf, a
    return {"per": per, "n": n, "votes": votes,
            "raw": verdict(agg), "cond": verdict(cond),
            "agree": verdict(agg)[0] == verdict(cond)[0],
            "agg": agg, "condscore": cond}


def from_pool(pool, name, extra=None):
    """Build a metric dict: conv/steal from the CSV pool + any dumped extras
    (r14, r9, oufe, ufc). extra overrides/extends."""
    k = find(pool, name)
    d = {}
    if k:
        d["conv"] = pool[k]["conv"]; d["steal"] = pool[k]["steal"]
    if extra:
        d.update(extra)
    return k or name, d


def call_match(pool, pm_name, fc_name, tempo=0.0, pm_extra=None, fc_extra=None):
    kp, pm = from_pool(pool, pm_name, pm_extra)
    kf, fc = from_pool(pool, fc_name, fc_extra)
    r = calc(pm, fc, tempo)
    win_name = kp if r["raw"][0] == "PM" else kf
    return kp, kf, win_name, r


def main():
    pool = load_pool()
    tempo = conditions_tempo(surface="grass")
    print(f"Calculator: verified 6-metric profile. Grass tempo={tempo:+.2f}.")
    print("Card has conv+steal only (2 of 6) -> PARTIAL reads until the other "
          "four are dumped.\n")
    # (PM-name, FC-name) per provisional flavor; feed real CBI labels to lock.
    card = [
        ("de Minaur", "Shapovalov"),
        ("Medvedev", "Atmane"),
        ("Learner Tien", "Auger-Aliassime"),
        ("Buse", "Nakashima"),
        ("Hijikata", "Lehecka"),
    ]
    print(f"{'MATCH (PM v FC)':<34}{'METRICS':<20}{'+COND':<20}{'on'}")
    for pm_name, fc_name in card:
        kp, kf, win, r = call_match(pool, pm_name, fc_name, tempo)
        w0, c0, a0 = r["raw"]; w1, c1, a1 = r["cond"]
        raw = f"{w0} [{c0} {a0:.2f}]"
        cnd = f"{w1} [{c1} {a1:.2f}]"
        flag = "agree" if r["agree"] else "** FLIPS **"
        label = f"{kp.split()[-1]} v {kf.split()[-1]}"
        print(f"  {label:<32}{raw:<20}{cnd:<20}{r['votes']}/{r['n']}  {flag}")

    print("\nFULL-DUMP EXAMPLE (how a complete 6-metric call looks):")
    pm_dump = {"r14": 51.0, "conv": 69.4, "oufe": 22.0, "r9": 55.0,
               "steal": 36.7, "ufc": 18.0}
    fc_dump = {"r14": 50.5, "conv": 68.2, "oufe": 18.0, "r9": 49.0,
               "steal": 31.3, "ufc": 21.0}
    r = calc(pm_dump, fc_dump, tempo)
    print(f"  sample PM vs FC -> metrics:{r['raw'][0]} [{r['raw'][1]} {r['raw'][2]:.2f}]"
          f"  +cond:{r['cond'][0]} [{r['cond'][1]} {r['cond'][2]:.2f}]"
          f"  votes {r['votes']}/{r['n']}")
    print("  per-metric (+1=PM-win centroid, -1=FC):")
    for m, v in r["per"].items():
        print(f"     {m:6s} {v:+.2f}")


if __name__ == "__main__":
    main()
