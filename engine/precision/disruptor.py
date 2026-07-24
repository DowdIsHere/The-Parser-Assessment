"""
DISRUPTOR FLAG -- shot-type signal for who can pull an opponent off the rally.

The Rally Gap assumes a STANDARD baseline rally. A player who slices, comes to
net, and drop-shots changes what the rally IS -- taking points out of the
baseline bucket the Rally Gap measures. So a clean baseliner favored on the
Rally Gap is AT RISK when the underdog is a heavy disruptor (Altmaier slicing
Medvedev off his game at Halle, 2026 -- the rally gap said Medvedev +6.0, the
disruptor pulled the rally apart and won).

DISRUPT score = slice% + net% + drop% of a player's total shots (men's charting).
Tiers:  >= 20 DISRUPTOR  |  15-20 mild  |  < 15 baseline.

The matchup signal is the DISRUPTION GAP = underdog DISRUPT - favorite DISRUPT.
A big positive gap means the rally underdog can change the rally type on the
favorite -> downgrade confidence in the Rally Gap pick.

Source: charting-m-stats-ShotTypes.csv (rows Sl, Net, Dr over Total).
Run:  python3 engine/precision/disruptor.py
"""
import csv
import collections
import os

ST = os.path.join(os.path.dirname(__file__), "..", "data", "mcp",
                  "charting-m-stats-ShotTypes.csv")

_AGG = None


def _load():
    global _AGG
    if _AGG is not None:
        return _AGG
    agg = collections.defaultdict(lambda: collections.Counter())
    with open(ST, encoding="utf-8", errors="replace") as f:
        for r in csv.DictReader(f):
            try:
                s = int(r["shots"] or 0)
            except ValueError:
                s = 0
            agg[r["player"]][r["row"]] += s
    _AGG = agg
    return agg


def _find(agg, name):
    toks = name.lower().replace("-", " ").replace(".", "").split()
    for k in agg:
        if all(t in k.lower() for t in toks):
            return k
    return None


def score(name):
    """DISRUPT score (slice%+net%+drop%) for a player, or None if absent."""
    agg = _load()
    k = _find(agg, name)
    if not k:
        return None
    t = agg[k]["Total"]
    if not t:
        return None
    return round(100 * (agg[k]["Sl"] + agg[k]["Net"] + agg[k]["Dr"]) / t, 1)


def parts(name):
    """Full flag report for a player:
    (slice%, net%, drop%, TOTAL, slice_share%, net_share%, drop_share%) or None.
    Each of slice/net/drop% is that shot-type as a % of ALL shots; TOTAL is their
    sum (= the DISRUPT score); each *_share is that shot type as a % of TOTAL
    (how the disruptor total is composed)."""
    agg = _load()
    k = _find(agg, name)
    if not k:
        return None
    t = agg[k]["Total"]
    if not t:
        return None
    sl, net, dr = agg[k]["Sl"], agg[k]["Net"], agg[k]["Dr"]
    slp, netp, drp = 100 * sl / t, 100 * net / t, 100 * dr / t
    tot = slp + netp + drp
    d = (sl + net + dr) or 1
    return (round(slp, 1), round(netp, 1), round(drp, 1), round(tot, 1),
            round(100 * sl / d), round(100 * net / d), round(100 * dr / d))


def tier(d):
    if d is None:
        return "?"
    return "DISRUPTOR" if d >= 20 else ("mild" if d >= 15 else "baseline")


def matchup_flag(favorite, underdog):
    """Disruption risk to the Rally-Gap favorite. Returns (gap, label)."""
    df, du = score(favorite), score(underdog)
    if df is None or du is None:
        return None, "n/a (shot data missing)"
    gap = round(du - df, 1)
    if gap >= 12:
        lab = "STRONG disruption risk"
    elif gap >= 6:
        lab = "moderate disruption risk"
    else:
        lab = "minimal"
    return gap, lab


if __name__ == "__main__":
    for nm in ["Daniel Altmaier", "Daniil Medvedev", "Corentin Moutet",
               "Lorenzo Sonego", "Jannik Sinner", "Marin Cilic"]:
        d = score(nm)
        print(f"{nm:22s} DISRUPT {d}  [{tier(d)}]")
    print()
    print("Medvedev (fav) vs Altmaier:", matchup_flag("Daniil Medvedev", "Daniel Altmaier"))
    print("Etcheverry (fav) vs Sonego:", matchup_flag("Tomas Martin Etcheverry", "Lorenzo Sonego"))
