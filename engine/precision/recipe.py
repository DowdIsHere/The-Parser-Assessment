"""
RECIPE RUNNER -- assemble the six metrics from the two sources and run the
all-green recipe (twogate) on a matchup.

Sources:
  Precision - Everybody Measurements.csv  -> r14 (short_win%), r9 (long_win%),
                                             ufc (adjUFE), oufe (adjUFE+WinUFE)
  Precision - Variables (TennisViz).csv   -> conv, steal

A side is a CALL only if all six metrics are green against the opponent. The
engine does not assign the CBI pole (PM/FC) -- pass it in.

Run:  python3 engine/precision/recipe.py
"""
import csv
import os

import twogate

ROOT = os.path.join(os.path.dirname(__file__), "..", "..")
EM = os.path.join(ROOT, "Precision - Everybody Measurements.csv")
VAR = os.path.join(ROOT, "Precision - Variables (TennisViz).csv")


def _num(s):
    s = (s or "").strip()
    return float(s) if s else None


def load():
    """player -> {r14, r9, ufc, oufe, conv, steal} (None where unavailable)."""
    P = {}
    with open(EM, encoding="utf-8") as f:
        for r in csv.DictReader(f):
            short, lng = _num(r["short_win%"]), _num(r["long_win%"])
            adj, win = _num(r["adjUFE"]), _num(r["WinUFE"])
            P[r["player"]] = {
                "r14": short, "r9": lng, "ufc": adj,
                "oufe": (adj + win) if (adj is not None and win is not None) else None,
                "conv": None, "steal": None,
            }
    with open(VAR, encoding="utf-8") as f:
        for r in csv.DictReader(f):
            nm = _find(P, r["player"])
            if nm:
                P[nm]["conv"] = _num(r["conv"])
                P[nm]["steal"] = _num(r["steal"])
    return P


def _norm(s):
    return s.lower().replace("-", " ").replace(".", "").split()


def _find(P, name):
    if name in P:
        return name
    want = set(_norm(name))
    for k in P:
        kk = set(_norm(k))
        if want <= kk or kk <= want:
            return k
    return None


def metrics_ready(d):
    return d is not None and all(d.get(m) is not None for m in twogate.ORDER)


def matchup(P, a, pa, b, pb):
    ka, kb = _find(P, a), _find(P, b)
    if not ka or not kb:
        print(f"  [{a} vs {b}] missing player: "
              f"{a if not ka else ''} {b if not kb else ''}")
        return
    A, B = P[ka], P[kb]
    miss_a = [m for m in twogate.ORDER if A.get(m) is None]
    miss_b = [m for m in twogate.ORDER if B.get(m) is None]
    if miss_a or miss_b:
        print(f"### {ka} ({pa}) vs {kb} ({pb}) — NOT GRADABLE")
        if miss_a:
            print(f"   {ka} missing: {miss_a}")
        if miss_b:
            print(f"   {kb} missing: {miss_b}")
        print()
        return
    print(f"### {ka} ({pa}) vs {kb} ({pb})")
    twogate.chart(ka, A, pa, B)
    twogate.chart(kb, B, pb, A)
    print()


if __name__ == "__main__":
    P = load()
    # graded history (all FC in our records)
    HIST = [
        ("Taylor Fritz", "FC", "Ben Shelton", "FC"),
        ("Taylor Fritz", "FC", "Alexander Zverev", "FC"),
        ("Daniil Medvedev", "FC", "Daniel Altmaier", "FC"),
        ("Francisco Cerundolo", "FC", "Brandon Nakashima", "FC"),
        ("Tommy Paul", "FC", "Ugo Humbert", "FC"),
        ("Frances Tiafoe", "FC", "Felix Auger", "FC"),
    ]
    print("=== graded history (six-metric recipe) ===\n")
    for a, pa, b, pb in HIST:
        matchup(P, a, pa, b, pb)
