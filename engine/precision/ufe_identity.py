"""
PARSER-LIST test: can errors identify a player's TYPE (Visionary vs Legacy)?

Findings codified in "Precision - Parser List & Constants List.md":
  - Raw UFE/100 does NOT identify type: the most first-strike shotmaker
    (Kyrgios) has the LOWEST UFE; the most attritional grinder (Schwartzman)
    the HIGHEST -- backwards. Holds even AFTER opponent-adjustment. => KILLED
    as an identity tell; relocated to the Constants List as a STATE signal.
  - Win:UFE ratio (opponent-adjusted) DOES sort first-strike <-> attrition
    cleanly (Karlovic/Opelka/Isner/Kyrgios high; Ferrer/Simon/Schwartzman low).
    Locked to the Parser List -- but it measures POINT LENGTH, not type:
    Sinner (Visionary who grinds) lands p21 with the grinders. The Temporal
    axis (remembers vs computes) cuts across it and remains UNSOLVED.

Uses men's charting overview (per-match Total rows). Opponent-adjustment is the
standing law: each rate = player_effect + opponent_effect, solved jointly so we
keep the player's part net of who forced them.

Run:  python3 engine/precision/ufe_identity.py
"""
import collections
import csv
import statistics

from mcp_data import ensure, load_match_meta


def load_obs(min_pts=20):
    meta = load_match_meta()
    obs = []  # [player, opponent, ufe_per100, win_per100, pts]
    pts_by = collections.defaultdict(int)
    with open(ensure("m_overview"), encoding="utf-8", errors="replace") as f:
        for row in csv.DictReader(f):
            if row["set"] != "Total":
                continue
            mid = row["match_id"]
            if mid not in meta:
                continue
            m = meta[mid]
            me, opp = (m["p1"], m["p2"]) if row["player"] == "1" else (m["p2"], m["p1"])
            try:
                sp = int(row["serve_pts"]); rp = int(row["return_pts"])
                ufe = int(row["unforced"]); win = int(row["winners"])
            except (ValueError, KeyError):
                continue
            pts = sp + rp
            if pts < min_pts:
                continue
            obs.append([me, opp, 100 * ufe / pts, 100 * win / pts, pts])
            pts_by[me] += pts
    return obs, pts_by


def two_way(obs, field):
    """Opponent-adjusted player effect for obs[field] (additive, pts-weighted).

    Model each observation as mu + a[player] + b[opponent]; solve by alternating
    weighted means. Returns (mu, a) so the player's adjusted rate is mu + a[p].
    """
    mu = statistics.mean([o[field] for o in obs])
    a = collections.defaultdict(float)
    b = collections.defaultdict(float)
    for _ in range(60):
        num = collections.defaultdict(float); den = collections.defaultdict(float)
        for o in obs:
            me, opp, pt = o[0], o[1], o[4]
            num[me] += pt * (o[field] - mu - b[opp]); den[me] += pt
        for k in num:
            a[k] = num[k] / den[k]
        num = collections.defaultdict(float); den = collections.defaultdict(float)
        for o in obs:
            me, opp, pt = o[0], o[1], o[4]
            num[opp] += pt * (o[field] - mu - a[me]); den[opp] += pt
        for k in num:
            b[k] = num[k] / den[k]
    return mu, a


def main():
    obs, pts_by = load_obs()
    qual = [p for p in pts_by if pts_by[p] >= 2000]

    mu_u, a_u = two_way(obs, 2)
    mu_w, a_w = two_way(obs, 3)

    ratio = {p: (mu_w + a_w[p]) / (mu_u + a_u[p]) for p in qual}
    vals = sorted(ratio.values())
    pct = lambda v: sum(1 for x in vals if x < v) / len(vals) * 100

    print(f"qualified players (>=2000 pts): {len(qual)}   tour UFE/100 mu={mu_u:.2f}")
    print("\nOpponent-adjusted Win:UFE ratio (high=first-strike, low=attrition)")
    print("  top 8:")
    for n in sorted(qual, key=lambda x: -ratio[x])[:8]:
        print(f"    {n:22s} {ratio[n]:.2f}")
    print("  bottom 8:")
    for n in sorted(qual, key=lambda x: ratio[x])[:8]:
        print(f"    {n:22s} {ratio[n]:.2f}")

    print("\nKey checks (identity tell would put shotmaker high, grinder low):")
    for nm in ["Nick Kyrgios", "Jannik Sinner", "Carlos Alcaraz",
               "Diego Schwartzman", "David Ferrer"]:
        for n in qual:
            if nm.lower() in n.lower():
                u = mu_u + a_u[n]
                print(f"    {n:22s} adjUFE/100={u:5.2f}  Win:UFE={ratio[n]:.2f} (p{pct(ratio[n]):3.0f})")
                break


if __name__ == "__main__":
    main()
