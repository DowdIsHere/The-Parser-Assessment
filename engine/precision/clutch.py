"""
CLUTCH instrument (v0.1) -- "grip tightness, and which side lifts."

Robert's distillation of the only place an edge could live: both types can grab
the clutch, so what matters is (a) whose grip is tighter (lift above baseline)
and (b) when even, which SIDE lifts -- offensive ledger (taking the point: break
points CONVERTED) vs defensive ledger (saving the point: break points SAVED) --
and whether the grip tightens when it's heated (inside the deciding set).

Per player:
  DEF grip = BP-save%  - serve-point-win%      (defensive lift)
  OFF grip = BP-convert% - return-point-win%   (offensive lift)
  ...both also recomputed inside the deciding set (Set1+Set2 == 2) = "@heated".

** KNOWN BIAS (v0.1): break points are a SELECTED game-state -- to face one, the
returner already won 2-3 points that game. So raw deltas are biased: nearly all
DEF grips read negative, most OFF grips positive, partly as artifact. The
extremes (Kyrgios) are real; the middle is muddy. Per standing law, this needs
opponent-and-state adjustment before "whose grip is tighter" is a trustworthy
ranking. Treat v0.1 output as illustrative, not final. **

Run:  python3 engine/precision/clutch.py
"""
import collections

from mcp_data import load_match_meta, iter_points

RANK = {"0": 0, "15": 1, "30": 2, "40": 3, "AD": 4}


def parse_score(pts):
    """'server-first' point label -> (server_rank, returner_rank) or None (e.g. tiebreak)."""
    try:
        a, b = pts.split("-")
    except ValueError:
        return None
    if a not in RANK or b not in RANK:
        return None
    return RANK[a], RANK[b]


def analyze(tour, meta):
    S = collections.defaultdict(lambda: collections.defaultdict(int))
    for row in iter_points(tour):
        mid = row["match_id"]
        if mid not in meta:
            continue
        svr, pw = row["Svr"], row["PtWinner"]
        if svr not in ("1", "2") or pw not in ("1", "2"):
            continue
        m = meta[mid]
        server = m["p1"] if svr == "1" else m["p2"]
        returner = m["p2"] if svr == "1" else m["p1"]
        try:
            deciding = (int(row["Set1"]) + int(row["Set2"])) == 2
        except (ValueError, KeyError):
            continue
        server_won = pw == svr

        S[server]["sp"] += 1; S[server]["spw"] += server_won
        S[returner]["rp"] += 1; S[returner]["rpw"] += (not server_won)
        if deciding:
            S[server]["sp_d"] += 1; S[server]["spw_d"] += server_won
            S[returner]["rp_d"] += 1; S[returner]["rpw_d"] += (not server_won)

        sc = parse_score(row["Pts"])
        if sc:
            sr, rr = sc
            is_bp = (rr == 4) or (rr == 3 and sr < 3)  # returner AD, or 40 vs <40
            if is_bp:
                S[server]["bps"] += 1; S[server]["bps_w"] += server_won
                S[returner]["bpc"] += 1; S[returner]["bpc_w"] += (not server_won)
                if deciding:
                    S[server]["bps_d"] += 1; S[server]["bps_w_d"] += server_won
                    S[returner]["bpc_d"] += 1; S[returner]["bpc_w_d"] += (not server_won)
    return S


def _rate(d, w, t):
    return 100 * d[w] / d[t] if d[t] else float("nan")


def grips(d):
    def_grip = _rate(d, "bps_w", "bps") - _rate(d, "spw", "sp")
    off_grip = _rate(d, "bpc_w", "bpc") - _rate(d, "rpw", "rp")
    try:
        def_h = 100 * d["bps_w_d"] / d["bps_d"] - 100 * d["spw_d"] / d["sp_d"]
    except ZeroDivisionError:
        def_h = float("nan")
    try:
        off_h = 100 * d["bpc_w_d"] / d["bpc_d"] - 100 * d["rpw_d"] / d["rp_d"]
    except ZeroDivisionError:
        off_h = float("nan")
    return def_grip, off_grip, def_h, off_h


def report(tour, label, names):
    meta = load_match_meta()
    S = analyze(tour, meta)
    print(f"\n=== {label}: clutch grip (delta vs baseline; + = grips tighter) ===")
    print(f"  {'player':22s} {'DEF':>6s} {'OFF':>6s} | {'DEF@hot':>7s} {'OFF@hot':>7s}")
    for n in names:
        if n not in S or S[n]["sp"] < 2000:
            print(f"  {n:22s}  (insufficient sample)")
            continue
        dg, og, dh, oh = grips(S[n])
        print(f"  {n:22s} {dg:+6.1f} {og:+6.1f} | {dh:+7.1f} {oh:+7.1f}")


def main():
    report("m", "MEN", [
        "Jannik Sinner", "Carlos Alcaraz", "Novak Djokovic", "Rafael Nadal",
        "Nick Kyrgios", "Daniil Medvedev", "Diego Schwartzman", "Casper Ruud",
        "Matteo Berrettini",
    ])
    report("w", "WOMEN", ["Iga Swiatek", "Aryna Sabalenka", "Coco Gauff"])


if __name__ == "__main__":
    main()
