"""
STYLE IDENTIFIER -- the polar tell that actually identifies a type.

Lesson that produced this: we first KILLED unforced errors as an identity tell
because a player's OWN UFE runs backwards (Kyrgios lowest, Schwartzman highest).
We were looking at the wrong column. The live signal is the errors a player
FORCES from the opponent -- and three independent, opponent-adjusted tells all
agree on the same poles:

  A. Win:UFE ratio            (high = first-strike, low = attrition)
  B. rally-length differential (long%-short%; + = attrition)
  C. forced-UFE               (opponent-effect term; + = makes you miss)

Agreement (attrition-signed correlations): C vs -A +0.62, B vs C +0.39,
B vs -A +0.29. Fused into one composite, the poles are clean & named:
  Pda / defensive-aggressive (Legacy) pole: Chung, Navone, Schwartzman, Baez...
  first-strike pole:                        Isner, Opelka, Kyrgios, Roddick...

What it identifies: the DEFENSIVE-AGGRESSIVE (Legacy/Pda) type, cleanly, from
data alone. What it does NOT: Visionary -- those sit mid-field (Sinner p76,
Alcaraz p72), because Visionary is a temporal orientation, not a style pole.
So this detects ONE of the two target types. That asymmetry is the finding.

Run:  python3 engine/precision/style_index.py
"""
import collections
import csv
import statistics

from mcp_data import ensure, load_match_meta


def _meta_pairs():
    meta = load_match_meta()
    return {mid: (m["p1"], m["p2"]) for mid, m in meta.items()}


def _two_way(obs):
    """obs = [me, opp, value, weight]; returns (mu, a player-effect, b opp-effect)."""
    mu = statistics.mean([o[2] for o in obs])
    a = collections.defaultdict(float); b = collections.defaultdict(float)
    for _ in range(60):
        n = collections.defaultdict(float); d = collections.defaultdict(float)
        for me, opp, y, w in obs:
            n[me] += w * (y - mu - b[opp]); d[me] += w
        for k in n:
            a[k] = n[k] / d[k]
        n = collections.defaultdict(float); d = collections.defaultdict(float)
        for me, opp, y, w in obs:
            n[opp] += w * (y - mu - a[me]); d[opp] += w
        for k in n:
            b[k] = n[k] / d[k]
    return mu, a, b


def _zscore(d):
    vs = list(d.values()); m = statistics.mean(vs); s = statistics.pstdev(vs)
    return {k: (v - m) / s for k, v in d.items()}


def _corr(d1, d2):
    ks = [k for k in d1 if k in d2]
    xs = [d1[k] for k in ks]; ys = [d2[k] for k in ks]
    mx = statistics.mean(xs); my = statistics.mean(ys)
    return (sum((x - mx) * (y - my) for x, y in zip(xs, ys)) / len(ks)
            / (statistics.pstdev(xs) * statistics.pstdev(ys)))


def build(min_pts=2000, min_short=400, min_long=150):
    pairs = _meta_pairs()
    obsU, obsW = [], []
    pts_by = collections.defaultdict(int)
    with open(ensure("m_overview"), encoding="utf-8", errors="replace") as f:
        for row in csv.DictReader(f):
            if row["set"] != "Total":
                continue
            mid = row["match_id"]
            if mid not in pairs:
                continue
            p1, p2 = pairs[mid]
            me, opp = (p1, p2) if row["player"] == "1" else (p2, p1)
            try:
                sp = int(row["serve_pts"]); rp = int(row["return_pts"])
                ufe = int(row["unforced"]); win = int(row["winners"])
            except (ValueError, KeyError):
                continue
            pts = sp + rp
            if pts < 20:
                continue
            obsU.append([me, opp, 100 * ufe / pts, pts])
            obsW.append([me, opp, 100 * win / pts, pts])
            pts_by[me] += pts

    muU, aU, bU = _two_way(obsU)
    muW, aW, _bW = _two_way(obsW)

    short = collections.defaultdict(lambda: [0, 0])
    longr = collections.defaultdict(lambda: [0, 0])
    with open(ensure("m_rally"), encoding="utf-8", errors="replace") as f:
        for row in csv.DictReader(f):
            mid = row["match_id"]
            if mid not in pairs:
                continue
            p1, p2 = pairs[mid]; r = row["row"]
            try:
                pts = int(row["pts"]); a1 = int(row["pl1_won"]); a2 = int(row["pl2_won"])
            except (ValueError, KeyError):
                continue
            if r == "1-3":
                short[p1][0] += a1; short[p1][1] += pts
                short[p2][0] += a2; short[p2][1] += pts
            elif r == "10":
                longr[p1][0] += a1; longr[p1][1] += pts
                longr[p2][0] += a2; longr[p2][1] += pts

    qual = [p for p in pts_by
            if pts_by[p] >= min_pts and short[p][1] >= min_short and longr[p][1] >= min_long]

    win_ufe = {p: (muW + aW[p]) / (muU + aU[p]) for p in qual}
    rally_d = {p: 100 * longr[p][0] / longr[p][1] - 100 * short[p][0] / short[p][1] for p in qual}
    forced = {p: bU[p] for p in qual}

    zW, zR, zF = _zscore(win_ufe), _zscore(rally_d), _zscore(forced)
    # attrition/Pda-positive composite: Win:UFE flipped (high = first-strike)
    index = {p: (-zW[p] + zR[p] + zF[p]) / 3 for p in qual}
    return {"index": index, "win_ufe": win_ufe, "rally_d": rally_d, "forced": forced,
            "zW": zW, "zR": zR, "zF": zF}


def main():
    r = build()
    idx = r["index"]; qual = list(idx)
    print("Agreement of the 3 tells (attrition-signed):")
    print(f"  rallyDiff vs forced  : {_corr(r['zR'], r['zF']):+.2f}")
    print(f"  rallyDiff vs -WinUFE : {_corr(r['zR'], {k:-v for k,v in r['zW'].items()}):+.2f}")
    print(f"  forced    vs -WinUFE : {_corr(r['zF'], {k:-v for k,v in r['zW'].items()}):+.2f}")

    print("\nComposite (+ = Pda/defensive pole, - = first-strike pole)")
    print("  defensive-aggressive (Legacy) pole:")
    for p in sorted(qual, key=lambda x: -idx[x])[:10]:
        print(f"    {p:22s} {idx[p]:+.2f}")
    print("  first-strike pole:")
    for p in sorted(qual, key=lambda x: idx[x])[:10]:
        print(f"    {p:22s} {idx[p]:+.2f}")


if __name__ == "__main__":
    main()
