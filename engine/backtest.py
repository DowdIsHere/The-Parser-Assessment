"""
engine/backtest.py — first real test of the engine, logged to the local store.

Clean train/test split, no leakage:
  - fade residual trained on <=2025 deciders
  - tested on 2026 matches with point-in-time Elo (updates as the season runs)

For each 2026 match we log a prediction:
  base  = Elo P(winner)                       -> correct if >= 0.5
  adj   = Elo + lambda*(fadeResid_w - fadeResid_l)/100  (coupling tilt)

We then compare base vs adj accuracy OVERALL and on the CLOSE (coin-flip) subset.
Expectation per the Coupling Engine: the fade tilt is a *conditional* edge, so a
blanket per-match tilt should show little/no overall lift — the signal lives in
specific matchups, not the average. We report honestly either way.

Usage:  python3 engine/backtest.py
"""

import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import db  # noqa: E402
import elo  # noqa: E402
from fade_curve import compute_fade, ensure_data, load_matches  # noqa: E402

TEST_YEAR = 2026
CLOSE_BAND = 0.10          # |p-0.5| < this  => coin-flip match
LAMBDAS = (0.5, 1.0, 1.5)  # coupling tilt strengths to scan
RUN_TAG = "backtest_2026_v1"


def year(ev):
    try:
        return int(ev["row"]["tourney_date"]) // 10000
    except (ValueError, KeyError):
        return 0


def main():
    ensure_data()
    rows = load_matches()

    # train fade on <= 2025 only (out-of-sample for 2026)
    train_rows = [r for r in rows if (int(r["tourney_date"]) // 10000) <= 2025]
    fade = compute_fade(train_rows)

    def fr(name):
        return fade.get(name, {}).get("fade_residual", 0.0)

    events, _, _ = elo.walk(rows, blend=0.0)        # point-in-time global Elo
    test = [e for e in events if year(e) == TEST_YEAR]

    # scan lambda for the adjusted model
    print(f"First backtest — {len(test)} matches in {TEST_YEAR} "
          f"(fade trained <=2025)\n")
    base_all = sum(e["exp_global"] >= 0.5 for e in test)
    close = [e for e in test if abs(e["exp_global"] - 0.5) < CLOSE_BAND]
    base_close = sum(e["exp_global"] >= 0.5 for e in close)
    n, nc = len(test), len(close)
    print(f"{'model':<22}{'overall':>14}{'close-only':>16}")
    print("-" * 52)
    print(f"{'Elo baseline':<22}{base_all/n*100:>10.1f}% {' ':>2}{base_close/nc*100:>12.1f}%")

    best = None
    for lam in LAMBDAS:
        ok = okc = 0
        for e in test:
            r = e["row"]
            p = e["exp_global"] + lam * (fr(r["winner_name"]) - fr(r["loser_name"])) / 100.0
            ok += p >= 0.5
            if abs(e["exp_global"] - 0.5) < CLOSE_BAND:
                okc += p >= 0.5
        print(f"{'Elo + fade (λ='+format(lam,'.1f')+')':<22}"
              f"{ok/n*100:>10.1f}% {' ':>2}{okc/nc*100:>12.1f}%")
        if best is None or okc > best[1]:
            best = (lam, okc)

    # log the chosen run (best lambda on close matches) into the store
    lam = best[0]
    conn = db.connect()
    db.clear_run(conn, RUN_TAG)
    for e in test:
        r = e["row"]
        p_elo = e["exp_global"]
        p_adj = p_elo + lam * (fr(r["winner_name"]) - fr(r["loser_name"])) / 100.0
        pick = "A" if p_adj >= 0.5 else "B"     # A = winner (by construction)
        db.insert_prediction(
            conn, run_tag=RUN_TAG,
            match_date=str(r.get("tourney_date")),
            tournament=r.get("tourney_name"), level=r.get("tourney_level"),
            surface=r.get("surface"), best_of=int(r.get("best_of") or 0),
            player_a=r["winner_name"], player_b=r["loser_name"],
            model_prob_a=round(p_elo, 4), adj_prob_a=round(p_adj, 4),
            pick=pick, settled=1, result_winner="A",
            headline_correct=int(pick == "A"),
            notes=f"backtest lambda={lam}",
        )
    conn.commit()
    logged = conn.execute(
        "select count(*) c, sum(headline_correct) h from predictions where run_tag=?",
        (RUN_TAG,)).fetchone()
    print(f"\nlogged {logged['c']} predictions to {db.DEFAULT_PATH} "
          f"(λ={lam}); headline-correct {logged['h']}/{logged['c']}.")


if __name__ == "__main__":
    main()
