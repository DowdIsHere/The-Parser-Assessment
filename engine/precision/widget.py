"""
CBI MATCH WIDGET -- the calibrated calculator. Dump the stats, get the winner.

Scope: the SIX observable success metrics from the author's own pool
("Precision - Everybody Measurements.csv"). Two architectures:
  PM (Pattern Matcher)   FC (Forecaster)
Architecture is CBI-identified OFF-DATA -- the metrics never assign it
(opponent-use rule). The widget takes the labels as input (which side is pm,
which is fc); it must never guess them.

VERDICT = PROFILE GATE. A side wins ONLY by MEETING its full winning profile
(every threshold met, no deficit cap breached). If neither side is clean,
there is NO stood-by call. The gap report shows exactly where a side falls
short.

Metric column mapping (Everybody Measurements -> calculator):
  r14  = short_win%        conv = BP_conv%        oufe = forces_oppUFE
  r9   = long_win%         steal= steal_droplob   ufc  = adjUFE

Run:  python3 engine/precision/widget.py
"""
import csv
import os

CSV = os.path.join(os.path.dirname(__file__), "..", "..",
                   "Precision - Everybody Measurements.csv")

COLMAP = {"r14": "short_win%", "r9": "long_win%", "steal": "steal_droplob",
          "conv": "BP_conv%", "oufe": "forces_oppUFE", "ufc": "adjUFE"}
METRICS = list(COLMAP)

# winner requirements (gap in the WINNER's frame: PM -> PM-FC ; FC -> FC-PM)
#   "exceed" v -> must lead by >= v
#   "trail"  v -> may trail by <= v
#   "errcap" v -> own-error gap must be <= v   (UFE: must-not-exceed both ways)
REQUIRE = {
    "PM": {"r14": ("exceed", 1.1), "conv": ("exceed", 1.4),
           "oufe": ("exceed", 3.5), "r9": ("exceed", 5.9),
           "steal": ("exceed", 3.6), "ufc": ("errcap", 3.9)},
    "FC": {"r14": ("exceed", 2.3), "conv": ("exceed", 0.5),
           "oufe": ("trail", 0.8), "r9": ("trail", 0.6),
           "steal": ("trail", 1.3), "ufc": ("errcap", 2.2)},
}
# UFE caps = verified magnitudes: PM 3.9, FC 2.2 (own errors flagged only when high).


def load_pool():
    """The pool = players in Everybody Measurements with ALL SIX metrics."""
    pool = {}
    with open(CSV, encoding="utf-8") as f:
        for r in csv.DictReader(f):
            d, ok = {}, True
            for k, col in COLMAP.items():
                v = (r.get(col) or "").strip()
                if v == "":
                    ok = False
                    break
                d[k] = float(v)
            if ok:
                pool[r["player"]] = d
    return pool


def find(pool, name):
    for k in pool:
        if name.lower() in k.lower():
            return k
    return None


def profile(pm, fc, arch):
    """Check ONE side against its winning profile and record every shortfall.

    Nothing disqualifies a side from the report -- a metric that runs negative
    or pushes past its cap is RECORDED (that magnitude is the variance), not
    removed. Two kinds of lacking:
      short  -- a "+" (exceed) metric below its threshold (incl. negative gaps)
      beyond -- a "-" (deficit / errcap) metric past its allowed cap
    A side is CLEAN (a winner) only when it records neither.
    Boundary inclusive: gap exactly on the threshold / cap counts as met.
    """
    short, beyond, met = [], [], []
    for m, (kind, v) in REQUIRE[arch].items():
        gap = (pm[m] - fc[m]) if arch == "PM" else (fc[m] - pm[m])
        if kind == "exceed":
            if gap < v:
                short.append((m, gap, v, v - gap))        # how far below threshold
            else:
                met.append((m, gap, v))
        elif kind == "trail":
            if gap < -v:
                beyond.append((m, gap, -v, (-v) - gap))   # how far past the cap
            else:
                met.append((m, gap, -v))
        elif kind == "errcap":
            if gap > v:
                beyond.append((m, gap, v, gap - v))       # own-error overage
            else:
                met.append((m, gap, v))
    clean = not short and not beyond
    return {"clean": clean, "short": short, "beyond": beyond, "met": met}


# Pass bar: how many of the six metrics a side must meet to win.
# PM must pass 5 of 6; FC must pass 3 of 6 (the architectural asymmetry).
PASS = {"PM": 5, "FC": 3}


def verdict(pm, fc):
    """Profile gate, COUNT model. pm = CBI Pattern Matcher, fc = CBI Forecaster.
    A side wins by meeting at least PASS[type] of its six metrics."""
    P = profile(pm, fc, "PM")
    F = profile(pm, fc, "FC")
    P_met = len(REQUIRE["PM"]) - len(P["short"]) - len(P["beyond"])
    F_met = len(REQUIRE["FC"]) - len(F["short"]) - len(F["beyond"])
    P_pass = P_met >= PASS["PM"]
    F_pass = F_met >= PASS["FC"]
    if P_pass and not F_pass:
        call = "PM"
    elif F_pass and not P_pass:
        call = "FC"
    elif P_pass and F_pass:
        call = "BOTH PASS (flag)"
    else:
        call = "NO CALL"
    return {"call": call, "PM": P, "FC": F,
            "PM_met": P_met, "FC_met": F_met,
            "PM_pass": P_pass, "FC_pass": F_pass}


def _show(name, arch, res):
    fails = len(res["short"]) + len(res["beyond"])
    met = len(REQUIRE[arch]) - fails
    bar = PASS[arch]
    print(f"   {name} as {arch}: met {met}/{len(REQUIRE[arch])} "
          f"(needs {bar}) -> {'PASS' if met >= bar else 'fail'}")
    for m, gap, v, sh in res["short"]:
        print(f"      short  {m:6s} gap {gap:+6.1f}  need >= +{v}  (short {sh:.1f})")
    for m, gap, cap, ov in res["beyond"]:
        print(f"      beyond {m:6s} gap {gap:+6.1f}  cap {cap:+.1f}  (over {ov:.1f})")


# Canonical hand-verified numbers (author's definitions). Columns:
#   ufc=ownUFE  oufe=oppUFE  r14=1-4  r9=9+  steal=steal  conv=conv
CANON = {
    "Tien":      {"ufc": 18.9, "oufe": 19.4, "r14": 49.4, "r9": 50.7, "steal": 35.3, "conv": 69.5},
    "Auger":     {"ufc": 19.5, "oufe": 15.4, "r14": 50.4, "r9": 45.4, "steal": 31.9, "conv": 70.5},
    "Hurkacz":   {"ufc": 17.7, "oufe": 17.5, "r14": 52.2, "r9": 47.6, "steal": 31.2, "conv": 68.7},
    "Altmaier":  {"ufc": 19.0, "oufe": 19.3, "r14": 46.5, "r9": 53.6, "steal": 31.0, "conv": 67.0},
}


# Baseline profiles -- stand-in opponent when the competitor's metrics are
# unknown. Absolute values for a winning PM and a winning FC. A known player of
# type T is placed against the baseline of the OPPOSITE type.
BASELINE = {
    "PM": {"r14": 51.3, "conv": 70.3, "oufe": 17.7, "r9": 51.5, "steal": 33.8, "ufc": 15.5},
    "FC": {"r14": 50.8, "conv": 68.8, "oufe": 17.1, "r9": 49.1, "steal": 32.2, "ufc": 18.6},
}


def vs_baseline(player, arch):
    """Run a known player (CBI type `arch`) against the baseline stand-in
    opponent of the opposite type."""
    if arch == "PM":
        return profile(player, BASELINE["FC"], "PM")
    return profile(BASELINE["PM"], player, "FC")


def main():
    print("Verdict = profile gate; gap report records every shortfall "
          "(negatives recorded, not disqualified).\n")
    # (PM name, FC name) -- author's CBI labels
    matchups = [("Tien", "Auger"), ("Altmaier", "Hurkacz")]
    for pm_name, fc_name in matchups:
        pm, fc = CANON[pm_name], CANON[fc_name]
        v = verdict(pm, fc)
        print(f"{pm_name} (PM) vs {fc_name} (FC):   CALL: {v['call']}")
        _show(pm_name, "PM", v["PM"])
        _show(fc_name, "FC", v["FC"])
        print()

    print("vs BASELINE (unknown-opponent stand-in):")
    for name, arch in [("Tien", "PM"), ("Auger", "FC"),
                       ("Hurkacz", "FC"), ("Altmaier", "PM")]:
        r = vs_baseline(CANON[name], arch)
        _show(name, arch, r)
        print()


if __name__ == "__main__":
    main()
