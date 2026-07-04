"""
FRAME — the card-based read (Gates by Victory Gaps + Rally Gap + Flag).

This SUPERSEDES the FC/PM-only all-green recipe in twogate.py for grading. That
older engine has no BAL profile and cannot grade a Balanced player — it forces
FC/PM/none and mislabels the board. This module implements the CURRENT method
from `Precision - Master Reference` and `Precision - Operating Manual (Cowork)`:

  1. TYPE per player (own gap):  D = short_win% - long_win%
       FC if D > +2.5 · PM if D < -2.5 · BAL if -2.5 <= D <= +2.5
  2. CARD by the pair of types (all six pairings, incl. the three BAL cards).
  3. GATES as gap-to-victory:  win# = opp + your winning gap;  g2v = you - win#
       (UFE flips: g2v = win# - you).  Read by DEPTH, not red count.
  4. RALLY GAP = g2v(1-4) + g2v(9+).  Favorite = higher; surplus = ownership.
  5. FLAG (shot types) read from the precomputed CSV — a presented layer, NOT a
       hard trigger. No `disruption gap >= 6 -> FLAG` rule; the STRONG/FLAG/PASS
       call is the read ACROSS the layers, made by the author, not fired here.

Data (three small CSVs at repo root):
  Precision - Everybody Measurements.csv   short_win%, long_win%, adjUFE, WinUFE
  Precision - Variables (TennisViz).csv    conv, steal
  Precision - Flag Report (Disruptor).csv  slice/net/drop %, TOTAL, shares, tier

Run:  python3 engine/precision/frame.py "Player A" "Player B" ["C" "D" ...]
"""
import csv
import os
import sys

ROOT = os.path.join(os.path.dirname(__file__), "..", "..")
EM_F = os.path.join(ROOT, "Precision - Everybody Measurements.csv")
VAR_F = os.path.join(ROOT, "Precision - Variables (TennisViz).csv")
FL_F = os.path.join(ROOT, "Precision - Flag Report (Disruptor).csv")

ORDER = ["r14", "conv", "oufe", "r9", "steal", "ufc"]
LAB = {"r14": "1-4 Rally", "conv": "Convs", "oufe": "OUFE-A",
       "r9": "9+ Rally", "steal": "Steal", "ufc": "UFE"}

# Winning gaps per side, by matchup card. UFE is an error ceiling (lower better).
# APPROVED: FC-PM, PM-BAL, FC-BAL, PM-PM.  PROVISIONAL: BAL-BAL (n=610), FC-FC.
CARDS = {
    ("FC", "PM"): {
        "FC": dict(r14=2.3, conv=0.5, oufe=-0.8, r9=-0.6, steal=-3.3, ufc=2.2),
        "PM": dict(r14=1.1, conv=1.4, oufe=3.5, r9=5.9, steal=3.6, ufc=3.9)},
    ("PM", "BAL"): {
        "PM": dict(r14=-1.7, conv=-0.8, oufe=0.9, r9=2.1, steal=1.0, ufc=1.1),
        "BAL": dict(r14=3.1, conv=1.7, oufe=-1.1, r9=-0.8, steal=0.7, ufc=-1.3)},
    ("FC", "BAL"): {
        "FC": dict(r14=0.6, conv=-0.9, oufe=0.5, r9=-3.8, steal=-2.1, ufc=0.6),
        "BAL": dict(r14=1.1, conv=1.5, oufe=-1.4, r9=6.1, steal=3.2, ufc=-1.5)},
    ("PM", "PM"): {
        "PM": dict(r14=0.3, conv=0.3, oufe=0.3, r9=0.1, steal=0.4, ufc=0.3)},
    ("BAL", "BAL"): {  # PROVISIONAL (n=610, not fully validated)
        "BAL": dict(r14=1.1, conv=0.6, oufe=-0.3, r9=1.4, steal=1.1, ufc=-0.4)},
    ("FC", "FC"): {  # PROVISIONAL (flat ~+-0.3)
        "FC": dict(r14=0.3, conv=0.3, oufe=0.3, r9=0.3, steal=0.4, ufc=0.3)},
}
PROVISIONAL = {("BAL", "BAL"), ("FC", "FC")}


def _norm(s):
    return set(s.lower().replace("-", " ").replace(".", "").split())


def _find(D, name):
    want = _norm(name)
    for k in D:
        kk = _norm(k)
        if kk == want or want <= kk or kk <= want:
            return k
    return None


def _num(x):
    x = (x or "").strip()
    return float(x) if x else None


def load():
    EM = {r["player"].strip(): r for r in csv.DictReader(open(EM_F))}
    VAR = {r["player"].strip(): r for r in csv.DictReader(open(VAR_F))}
    FL = {r["player"].strip(): r for r in csv.DictReader(open(FL_F))}
    return EM, VAR, FL


def metrics(name, EM, VAR):
    """Six gate metrics, or None if the player is not fully gradable."""
    ke, kv = _find(EM, name), _find(VAR, name)
    if not ke or not kv:
        return None, (ke, kv)
    e, v = EM[ke], VAR[kv]
    m = dict(r14=_num(e["short_win%"]), r9=_num(e["long_win%"]),
             ufc=_num(e["adjUFE"]), conv=_num(v["conv"]), steal=_num(v["steal"]))
    m["oufe"] = (m["ufc"] + _num(e["WinUFE"])) if (m["ufc"] is not None
                                                   and _num(e["WinUFE"]) is not None) else None
    if any(m[x] is None for x in ORDER):
        return None, (ke, kv)
    return m, (ke, kv)


def typ(m):
    D = round(m["r14"] - m["r9"], 1)
    return D, ("FC" if D > 2.5 else "PM" if D < -2.5 else "BAL")


def card_for(ta, tb):
    for k in CARDS:
        if set(k) == {ta, tb}:
            return k
    return None


def _g2v(you, opp, gap, m):
    win = opp[m] + gap[m]
    return win, round((win - you[m]) if m == "ufc" else (you[m] - win), 1)


def report(a, b, EM, VAR, FL):
    ma, ka = metrics(a, EM, VAR)
    mb, kb = metrics(b, EM, VAR)
    if ma is None or mb is None:
        miss = []
        if ma is None:
            miss.append(f"{a} (charting={'Y' if ka[0] else '-'} tviz={'Y' if ka[1] else '-'})")
        if mb is None:
            miss.append(f"{b} (charting={'Y' if kb[0] else '-'} tviz={'Y' if kb[1] else '-'})")
        print(f"### {a} vs {b} — NOT GRADABLE → PASS")
        print(f"    missing: {', '.join(miss)}\n")
        return
    Da, ta = typ(ma)
    Db, tb = typ(mb)
    key = card_for(ta, tb)
    card = CARDS[key]
    ga = card[ta] if ta in card else card[next(iter(card))]
    gb = card[tb] if tb in card else card[next(iter(card))]
    prov = " (PROVISIONAL card)" if key in PROVISIONAL else ""
    print(f"### {a} ({ta}, D{Da:+}) vs {b} ({tb}, D{Db:+})   [{'-'.join(key)} card{prov}]")
    print(f"GATE          {a.split()[-1][:12]:<12}          {b.split()[-1][:12]}")
    print(f"              your#  win#   g2v      your#  win#   g2v")
    ra = rb = 0
    for m in ORDER:
        wa, va = _g2v(ma, mb, ga, m)
        wb, vb = _g2v(mb, ma, gb, m)
        if m in ("r14", "r9"):
            ra += va
            rb += vb
        print(f"{LAB[m]:13} {ma[m]:5.1f}|{wa:5.1f}|{va:+5.1f}{'R' if va < 0 else 'G'}"
              f"   {mb[m]:5.1f}|{wb:5.1f}|{vb:+5.1f}{'R' if vb < 0 else 'G'}")
    reda = sum(1 for m in ORDER if _g2v(ma, mb, ga, m)[1] < 0)
    redb = sum(1 for m in ORDER if _g2v(mb, ma, gb, m)[1] < 0)
    ra, rb = round(ra, 1), round(rb, 1)
    print(f"reds / RALLY   {reda}  |{ra:+6}           {redb}  |{rb:+6}")
    fav, und = (a, b) if ra > rb else (b, a)
    favG = (ra if fav == a else rb)
    owns = (max(_g2v(ma, mb, ga, "r14")[1], _g2v(ma, mb, ga, "r9")[1]) >= 0) if fav == a \
        else (max(_g2v(mb, ma, gb, "r14")[1], _g2v(mb, ma, gb, "r9")[1]) >= 0)
    print(f"RALLY favorite: {fav.split()[-1]}  (sep {round(abs(ra - rb), 1)}; "
          f"favorite {'owns an axis' if owns else 'owns NO axis → PASS'})")
    # FLAG — presented layer, both comparatives; no hard trigger
    fa, fb = FL.get(_find(FL, a)), FL.get(_find(FL, b))
    print("FLAG          slice% net% drop% TOTAL | sl-sh net-sh dr-sh tier")
    for nm, fr in [(a, fa), (b, fb)]:
        if fr and fr.get("TOTAL"):
            print(f"{nm.split()[-1][:12]:13}{fr['slice%']:>6}{fr['net%']:>5}{fr['drop%']:>6}"
                  f"{fr['TOTAL']:>6} |{fr['slice_share%'] + '%':>6}{fr['net_share%'] + '%':>7}"
                  f"{fr['drop_share%'] + '%':>6} {fr['tier']}")
        else:
            print(f"{nm.split()[-1][:12]:13} no shot-type data")
    if fa and fb and fa.get("TOTAL") and fb.get("TOTAL"):
        favf = fa if fav == a else fb
        undf = fb if fav == a else fa
        dg = round(float(undf["TOTAL"]) - float(favf["TOTAL"]), 1)
        ss = int(undf["slice_share%"]) - int(favf["slice_share%"])
        print(f"              disruption gap {dg:+}  ·  slice-share gap {ss:+}  "
              f"(read downstream vs the {round(abs(ra - rb), 1)} rally cushion — not a trigger)")
    print()


def main(argv):
    if len(argv) < 2 or len(argv) % 2:
        print('usage: frame.py "Player A" "Player B" ["Player C" "Player D" ...]')
        return
    EM, VAR, FL = load()
    for i in range(0, len(argv), 2):
        report(argv[i], argv[i + 1], EM, VAR, FL)


if __name__ == "__main__":
    main(sys.argv[1:])
