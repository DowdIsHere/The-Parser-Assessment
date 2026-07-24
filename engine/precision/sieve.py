"""
PM/FC SIEVE -- group the men's list by the sourceable gradient-signature
metrics. oppUFE is NOT used here (no independent source; it is display-only in
the H2H). Filters, in order:

  PATTERN MATCHER : High 9+ (Past, long_win%) AND Low UFE (Concrete, adjUFE)
  FORECAST        : High 1-4 (Future, short_win%) -- from the players left over
  LEFT            : everyone else

Cuts are tertiles by default (top third = "high", bottom third = "low"),
computed over the men's pool. Change CUT_HI/CUT_LO to re-cut.

Mechanical caveat: "High 9+" and "Low UFE" tension each other -- heavy-rally
players hit more balls and so carry higher absolute UFE, so the biggest
grinders tend to land in LEFT, not PM. ownUFE here is an ABSOLUTE field cut,
which is a different use than the H2H gap. Grouping is candidate screening;
final CBI labels are the author's.

Run:  python3 engine/precision/sieve.py
"""
import csv
import os

EM_CSV = os.path.join(os.path.dirname(__file__), "..", "..",
                      "Precision - Everybody Measurements.csv")
CUT_HI = 66.7
CUT_LO = 33.3


def load_men():
    rows = []
    with open(EM_CSV, encoding="utf-8") as f:
        for r in csv.DictReader(f):
            if r["tour"] != "MEN":
                continue
            try:
                rows.append({"name": r["player"],
                             "r14": float(r["short_win%"]),
                             "r9": float(r["long_win%"]),
                             "ownUFE": float(r["adjUFE"])})
            except (ValueError, KeyError):
                continue
    return rows


def _pct(vals, p):
    s = sorted(vals)
    return s[int(p / 100 * (len(s) - 1))]


def sieve(rows):
    r9_hi = _pct([x["r9"] for x in rows], CUT_HI)
    own_lo = _pct([x["ownUFE"] for x in rows], CUT_LO)
    r14_hi = _pct([x["r14"] for x in rows], CUT_HI)
    pm = [x for x in rows if x["r9"] >= r9_hi and x["ownUFE"] <= own_lo]
    rest = [x for x in rows if x not in pm]
    fc = [x for x in rest if x["r14"] >= r14_hi]
    left = [x for x in rest if x not in fc]
    cuts = {"r9_hi": r9_hi, "own_lo": own_lo, "r14_hi": r14_hi}
    return pm, fc, left, cuts


def main():
    rows = load_men()
    pm, fc, left, cuts = sieve(rows)
    print(f"MEN pool: {len(rows)}")
    print(f"cuts -> High 9+ >= {cuts['r9_hi']:.1f} | Low UFE <= {cuts['own_lo']:.1f} "
          f"| High 1-4 >= {cuts['r14_hi']:.1f}\n")
    print(f"PATTERN MATCHER (High 9+ + Low UFE): {len(pm)}")
    for x in sorted(pm, key=lambda z: -z["r9"]):
        print(f"   {x['name']:24s} 9+ {x['r9']:.1f}  ownUFE {x['ownUFE']:.1f}")
    print(f"\nFORECAST (High 1-4, from the rest): {len(fc)}")
    for x in sorted(fc, key=lambda z: -z["r14"]):
        print(f"   {x['name']:24s} 1-4 {x['r14']:.1f}")
    print(f"\nLEFT (neither): {len(left)}")


if __name__ == "__main__":
    main()
