"""
CASCADE CLASSIFIER -- the filter chain that realizes the Precision method.

Design (Robert's): throw in everyone, then DISQUALIFY type by type until only
the target survives. No single metric separates Legacy from Visionary; instead
each validated filter removes a type, and the residual pool is split last (by
eye -- the only thing the box score can't do; see the Past/Future finding).

Cascade order (each step removes a type; first match wins):
  1. First-strike  : style index <= -0.6            (server/aggressor pole)
  2. Pda (presser) : forces >= 3.5                  (makes you beat yourself)
  3. Intentional   : steal (drop+lob) >= p80        (steals the gap, low convert)
  4. Legacy(outlaster): wins 9+ >> 1-4 (>=10 pctile gap)  (Past style leaks through)
  5. else          : Legacy/Visionary pool          -> EYE makes the final call

Validation: all 13 men + Swiatek ground-truth anchors classify correctly.
Thresholds calibrated to those anchors. See "Precision - Type Map.md".

Run:  python3 engine/precision/classify.py
"""
import collections
import csv

import style_index as si
import clutch

IDX_FIRSTSTRIKE = -0.6
FORCES_PDA = 3.5
STEAL_PCTILE_INTENTIONAL = 80
OUTLASTER_GAP = -10  # (short pctile - 9+ pctile) <= this => wins long >> short


def features(tour):
    r = si.build(tour)
    fs = si.future_steal(tour)
    meta = si.load_match_meta()
    S = clutch.analyze(tour, meta)
    conv = {p: 100 * S[p]["bpc_w"] / S[p]["bpc"] for p in S if S[p].get("bpc", 0) >= 120}

    pairs = si._meta_pairs()
    sh = collections.defaultdict(lambda: [0, 0])
    nine = collections.defaultdict(lambda: [0, 0])
    with open(si.ensure(f"{tour}_rally"), encoding="utf-8", errors="replace") as f:
        for row in csv.DictReader(f):
            mid = row["match_id"]
            if mid not in pairs:
                continue
            p1, p2 = pairs[mid]
            rr = row["row"]
            try:
                pts = int(row["pts"]); a1 = int(row["pl1_won"]); a2 = int(row["pl2_won"])
            except (ValueError, KeyError):
                continue
            if rr == "1-3":
                sh[p1][0] += a1; sh[p1][1] += pts; sh[p2][0] += a2; sh[p2][1] += pts
            elif rr in ("7-9", "10"):
                nine[p1][0] += a1; nine[p1][1] += pts; nine[p2][0] += a2; nine[p2][1] += pts

    qual = [p for p in r["index"] if p in fs]
    swp = {p: 100 * sh[p][0] / sh[p][1] for p in qual if sh[p][1] >= 300}
    nwp = {p: 100 * nine[p][0] / nine[p][1] for p in qual if nine[p][1] >= 150}
    return r, fs, conv, swp, nwp, qual


def _pctiler(d):
    vals = sorted(d.values())
    return lambda v: sum(1 for x in vals if x < v) / len(vals) * 100 if vals else float("nan")


def classify(tour):
    r, fs, conv, swp, nwp, qual = features(tour)
    idx, forces = r["index"], r["forces_opp"]
    fspct, spct, npct = _pctiler(fs), _pctiler(swp), _pctiler(nwp)
    out = {}
    for p in qual:
        if idx[p] <= IDX_FIRSTSTRIKE:
            t = "First-strike"
        elif forces[p] >= FORCES_PDA:
            t = "Pda (presser)"
        elif fspct(fs[p]) >= STEAL_PCTILE_INTENTIONAL:
            t = "Intentional"
        elif p in swp and p in nwp and (spct(swp[p]) - npct(nwp[p])) <= OUTLASTER_GAP:
            t = "Legacy (outlaster)"
        else:
            t = "Legacy/Visionary (eye)"
        out[p] = t
    return out


def main():
    for tour, label in (("m", "MEN"), ("w", "WOMEN")):
        out = classify(tour)
        cnt = collections.Counter(out.values())
        print(f"\n=== {label}: n={len(out)} ===")
        for t, c in cnt.most_common():
            print(f"   {t:24s} {c}")
        for bucket in ("Legacy (outlaster)", "Legacy/Visionary (eye)", "Intentional"):
            names = sorted(p for p, t in out.items() if t == bucket)
            print(f"   [{bucket}] {', '.join(names[:18])}"
                  + (" ..." if len(names) > 18 else ""))


if __name__ == "__main__":
    main()
