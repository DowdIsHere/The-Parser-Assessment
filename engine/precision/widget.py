"""
CBI MATCH WIDGET -- the calibrated "dump the stats, get a winner" tool.

Scope (per the framework author): this uses the SUCCESS DIALS ONLY --
conversion and steal. No gradients, no neuro literature (that stays
proprietary and separate). Two cognitive architectures:

  PM (Pattern Matcher)  -- native access: STEAL (defend/grind)
  FC (Forecaster)       -- native access: CONVERSION (strike)

The claim encoded here: each architecture WINS by borrowing the other's
engine -- the "dials required."
  PM wins by dialing UP conversion  (borrowed strike)   weights conv .51 / steal .27
  FC wins by dialing UP steal       (borrowed grind)    weights steal .51 / conv .24
(These are the verified winner-side mirror coefficients.)

CONDITIONS move the dials. Fast/low-bounce play rewards the strike dial;
slow/wet/cold/windy play rewards the grind dial. tempo in [-1..+1]:
  +1 = fastest (rewards conversion)   -1 = slowest (rewards steal)

Calibration: conv & steal are z-scored across the supplied pool so the two
dials sit on one scale before the architecture/condition weights apply.

Run:  python3 engine/precision/widget.py
"""
import csv
import os
import statistics

CSV = os.path.join(os.path.dirname(__file__), "..", "..",
                   "ATP Insights - Performance (TennisViz).csv")

# winner-side mirror weights (native + borrowed)
W = {
    "PM": {"conv": 0.51, "steal": 0.27},
    "FC": {"conv": 0.24, "steal": 0.51},
}
TEMPO_K = 0.20   # how hard conditions push the dials

SURFACE_TEMPO = {"grass": 0.6, "indoor": 0.4, "hard": 0.0, "clay": -0.6}


def load_pool():
    rows = {}
    with open(CSV, encoding="utf-8") as f:
        for r in csv.DictReader(f):
            rows[r["player"]] = {"conv": float(r["conversion"]),
                                 "steal": float(r["steal"])}
    cs = [v["conv"] for v in rows.values()]
    ss = [v["steal"] for v in rows.values()]
    mc, sc = statistics.mean(cs), statistics.pstdev(cs)
    ms, ss_ = statistics.mean(ss), statistics.pstdev(ss)
    for v in rows.values():
        v["zc"] = (v["conv"] - mc) / sc
        v["zs"] = (v["steal"] - ms) / ss_
    return rows


def find(pool, name):
    for k in pool:
        if name.lower() in k.lower():
            return k, pool[k]
    return None, None


def conditions_tempo(surface="hard", wind=False, cold=False, hot_dry=False,
                     altitude=False):
    t = SURFACE_TEMPO.get(surface, 0.0)
    if wind:     t -= 0.2     # wind hurts the precise striker -> grind
    if cold:     t -= 0.2     # cold/heavy ball -> grind
    if hot_dry:  t += 0.2     # lively ball -> strike
    if altitude: t += 0.2     # thin air -> strike
    return max(-1.0, min(1.0, t))


def win_score(stats, arch, tempo):
    w = dict(W[arch])
    shift = TEMPO_K * tempo            # +tempo pushes toward conversion
    wc = max(0.0, w["conv"] + shift)
    ws = max(0.0, w["steal"] - shift)
    return wc * stats["zc"] + ws * stats["zs"]


def flavor(stats):
    """Provisional architecture flavor from native lean (until a CBI label
    is supplied): higher native steal => PM, higher native conv => FC."""
    return "PM" if stats["zs"] >= stats["zc"] else "FC"


def call_match(pool, a_name, b_name, tempo, arch=None):
    """Return dict with both reads: metrics-only (tempo 0) and metrics+conditions.

    The dials are season-long averages -> conditions are ALREADY partly baked
    in. So we report the raw read separately from the conditions-adjusted read.
    Agreement = robust call; disagreement = the conditions layer is either
    adding signal or double-counting -> flag, don't trust blind.
    """
    ka, sa = find(pool, a_name)
    kb, sb = find(pool, b_name)
    if not sa or not sb:
        miss = a_name if not sa else b_name
        return {"miss": f"{a_name} vs {b_name} -- not in pool ({miss})"}
    aA = (arch or {}).get(ka) or flavor(sa)
    aB = (arch or {}).get(kb) or flavor(sb)

    def read(t):
        za, zb = win_score(sa, aA, t), win_score(sb, aB, t)
        win = ka if za >= zb else kb
        d = abs(za - zb)
        conf = "HIGH" if d >= 0.5 else "MED" if d >= 0.2 else "LEAN"
        return win, d, conf

    w0, d0, c0 = read(0.0)        # metrics only
    w1, d1, c1 = read(tempo)      # metrics + conditions
    return {"a": ka, "b": kb, "aA": aA, "aB": aB,
            "raw": (w0, d0, c0), "cond": (w1, d1, c1),
            "agree": w0 == w1}


def main():
    pool = load_pool()
    tempo = conditions_tempo(surface="grass")   # Halle + Queen's = grass
    card = [
        ("de Minaur", "Shapovalov"),
        ("Atmane", "Medvedev"),
        ("Learner Tien", "Auger-Aliassime"),
        ("Nakashima", "Buse"),
        ("Hijikata", "Lehecka"),
    ]
    print(f"Conditions: grass, tempo={tempo:+.2f} (rewards the strike dial)")
    print("Dials are season averages -> conditions partly baked in already.\n")
    print(f"{'MATCH':<34}{'METRICS ONLY':<22}{'+ CONDITIONS':<22}{'':<6}")
    for a, b in card:
        r = call_match(pool, a, b, tempo)
        if "miss" in r:
            print("  " + r["miss"]); continue
        w0, d0, c0 = r["raw"]; w1, d1, c1 = r["cond"]
        raw = f"{w0.split()[-1]} [{c0} {d0:.2f}]"
        cnd = f"{w1.split()[-1]} [{c1} {d1:.2f}]"
        flag = "agree" if r["agree"] else "** FLIPS **"
        label = f"{r['a'].split()[-1]}({r['aA']}) v {r['b'].split()[-1]}({r['aB']})"
        print(f"  {label:<32}{raw:<22}{cnd:<22}{flag}")


if __name__ == "__main__":
    main()

