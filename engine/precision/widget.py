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
           "steal": ("trail", 1.3), "ufc": ("errcap", 2.8)},
}


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
    """Check ONE side against its winning profile, directional-gate model.

    To be ON the gap report a side must CLEAR EVERY metric directionally:
      - "+" (exceed) metrics  -> gap must be positive (ahead)
      - "-" (deficit / errcap) -> gap must stay within the allowed cap
    Break direction on any one metric -> OFF-PROFILE (not on the report).
    For a side that clears all directions, the report shows by how much it
    still LACKS to reach the full winning threshold on each "+" metric.
    Boundary inclusive on the full threshold (gap == threshold = met).
    """
    offdir, lacking, met = [], [], []
    for m, (kind, v) in REQUIRE[arch].items():
        gap = (pm[m] - fc[m]) if arch == "PM" else (fc[m] - pm[m])
        if kind == "exceed":
            if gap <= 0:
                offdir.append((m, gap, v))            # wrong side of the line
            elif gap < v:
                lacking.append((m, gap, v, v - gap))  # ahead but short of threshold
            else:
                met.append((m, gap, v))
        elif kind == "trail":
            if gap < -v:
                offdir.append((m, gap, -v))           # breached the deficit cap
            else:
                met.append((m, gap, -v))
        elif kind == "errcap":
            if gap > v:
                offdir.append((m, gap, v))            # own errors past the cap
            else:
                met.append((m, gap, v))
    qualified = not offdir          # on the report at all
    clean = qualified and not lacking
    return {"qualified": qualified, "clean": clean,
            "offdir": offdir, "lacking": lacking, "met": met}


def verdict(pm, fc):
    """Profile gate. pm = the CBI Pattern Matcher, fc = the CBI Forecaster.
    A side wins only by being qualified AND clean (clears all, lacks nothing)."""
    P = profile(pm, fc, "PM")
    F = profile(pm, fc, "FC")
    if P["clean"] and not F["clean"]:
        call = "PM"
    elif F["clean"] and not P["clean"]:
        call = "FC"
    elif P["clean"] and F["clean"]:
        call = "BOTH CLEAN (flag)"
    else:
        call = "NO CALL"
    return {"call": call, "PM": P, "FC": F}


def _show(name, arch, res):
    if not res["qualified"]:
        bad = ", ".join(f"{m}({gap:+.1f})" for m, gap, *_ in res["offdir"])
        print(f"   {name} as {arch}: OFF-PROFILE — broke direction on: {bad}")
        return
    if res["clean"]:
        print(f"   {name} as {arch}: CLEAN — meets every threshold")
        return
    lack = ", ".join(f"{m} short {sh:.1f} (gap {gap:+.1f}, need +{v})"
                     for m, gap, v, sh in res["lacking"])
    print(f"   {name} as {arch}: ON REPORT — lacking: {lack}")


# Canonical hand-verified numbers (author's definitions). Columns:
#   ufc=ownUFE  oufe=oppUFE  r14=1-4  r9=9+  steal=steal  conv=conv
CANON = {
    "Tien":      {"ufc": 18.9, "oufe": 19.4, "r14": 49.4, "r9": 50.7, "steal": 35.3, "conv": 69.5},
    "Auger":     {"ufc": 19.5, "oufe": 15.4, "r14": 50.4, "r9": 45.4, "steal": 31.9, "conv": 70.5},
    "Hurkacz":   {"ufc": 17.7, "oufe": 17.5, "r14": 52.2, "r9": 47.6, "steal": 31.2, "conv": 68.7},
    "Altmaier":  {"ufc": 19.0, "oufe": 19.3, "r14": 46.5, "r9": 53.6, "steal": 31.0, "conv": 67.0},
}


def main():
    print("Verdict = profile gate; gap report = directional-clear sides only.\n")
    # (PM name, FC name) -- author's CBI labels
    matchups = [("Tien", "Auger"), ("Altmaier", "Hurkacz")]
    for pm_name, fc_name in matchups:
        pm, fc = CANON[pm_name], CANON[fc_name]
        v = verdict(pm, fc)
        print(f"{pm_name} (PM) vs {fc_name} (FC):   CALL: {v['call']}")
        _show(pm_name, "PM", v["PM"])
        _show(fc_name, "FC", v["FC"])
        print()


if __name__ == "__main__":
    main()
