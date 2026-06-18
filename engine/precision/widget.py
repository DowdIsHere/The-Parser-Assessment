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
    """Check ONE side against its full winning profile.
    Returns (clean, short[], beyond[]). Boundary inclusive (strict < / >):
    a gap exactly on the published value PASSES -- the players who DEFINED a
    metric are never excluded from it.
    """
    short, beyond = [], []
    for m, (kind, v) in REQUIRE[arch].items():
        gap = (pm[m] - fc[m]) if arch == "PM" else (fc[m] - pm[m])
        if kind == "exceed" and gap < v:
            short.append((m, gap, v, v - gap))            # shortfall to threshold
        elif kind == "trail" and gap < -v:
            beyond.append((m, gap, -v, (-v) - gap))       # past the cap
        elif kind == "errcap" and gap > v:
            beyond.append((m, gap, v, gap - v))           # own-error overage
    return (not short and not beyond), short, beyond


def verdict(pm, fc):
    """Profile gate. pm = the CBI Pattern Matcher, fc = the CBI Forecaster.
    A side wins only by MEETING its full profile."""
    pc, ps, pb = profile(pm, fc, "PM")
    fc_clean, fs, fb = profile(pm, fc, "FC")
    if pc and not fc_clean:
        call = "PM"
    elif fc_clean and not pc:
        call = "FC"
    elif pc and fc_clean:
        call = "BOTH CLEAN (flag)"
    else:
        call = "NO CALL"
    return {"call": call,
            "PM": {"clean": pc, "short": ps, "beyond": pb},
            "FC": {"clean": fc_clean, "short": fs, "beyond": fb}}


def _show(name, arch, res):
    print(f"   {name} as {arch}: {'CLEAN' if res['clean'] else 'not clean'}")
    for m, gap, thr, sh in res["short"]:
        print(f"      exceeds-short  {m:6s} gap {gap:+6.2f}  need >= +{thr}  (short {sh:.2f})")
    for m, gap, cap, ov in res["beyond"]:
        print(f"      beyond-deficit {m:6s} gap {gap:+6.2f}  cap {cap:+.1f}  (over {ov:.2f})")


def main():
    pool = load_pool()
    print(f"Pool: {len(pool)} players with all six metrics "
          f"(Everybody Measurements). Verdict = profile gate.\n")
    # (CBI Pattern Matcher, CBI Forecaster) -- labels provisional, confirm by eye
    card = [("de Minaur", "Shapovalov"), ("Learner Tien", "Auger")]
    for pm_name, fc_name in card:
        kp, kf = find(pool, pm_name), find(pool, fc_name)
        print(f"{pm_name} (PM) vs {fc_name} (FC):")
        if not kp or not kf:
            miss = pm_name if not kp else fc_name
            print(f"   -- {miss} not in pool\n")
            continue
        v = verdict(pool[kp], pool[kf])
        print(f"   CALL: {v['call']}")
        _show(kp, "PM", v["PM"])
        _show(kf, "FC", v["FC"])
        print()


if __name__ == "__main__":
    main()
