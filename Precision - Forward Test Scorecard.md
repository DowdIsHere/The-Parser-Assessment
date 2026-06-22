# Precision — Forward Test Scorecard

*Honest record. Trust is earned one graded call at a time.*

## Methodology — the six-metric recipe (all-green)
The win condition is the **whole prescribed set met together**. All **six**
metrics are gates: **1-4 Rally, Convs, OUFE-A, 9+ Rally, Steal, UFE** (author's
calculator, IMG_1757). A metric is **green** when it meets its threshold, **red**
when it doesn't. A side is a **CALL** only if **all six are green**; otherwise the
framework **abstains (NO CALL).** No single factor is a winning condition — it's a
recipe, and only together they win.

*Correction: conv and steal are **gates inside the recipe**, not a separate bin.
An earlier draft split them out as "variables, not in the win rate"; the author's
own grid color-codes all six as pass/fail, so that split is **void.** (FC UFE cap
held at the engine's verified +2.2; the image's +2.8 is stale.)*

## Verdict statuses (the only three)
Every side lands in exactly one. **"Variable" is a verdict, not a set of metrics**
— there is no "variable half," no conv/steal "bin."

- **CALL** — all six metrics measured **and** all six green (every threshold met).
- **VARIABLE** — all six metrics measured, but **one or more thresholds failed**
  (≥1 red). The side has the full recipe present; it just didn't pass it. This is
  the abstain bucket (NO CALL) for fully-measured sides.
- **NOT GRADABLE** — one or more of the six metrics is **missing** (a player absent
  from Everybody Measurements or the TennisViz Variables file). A side missing
  metrics is **not** "Variable" — you can't fail a threshold you never measured.

So conv/steal are simply two of the six metrics. A match that lacks a player's
Rally/UFE numbers is NOT GRADABLE, full stop — it has no partial "variable"
standing, even if conv/steal happen to exist.

Engine: `engine/precision/twogate.py` (the recipe) + `engine/precision/recipe.py`
(assembles the six metrics from the two sources and runs all-green on a matchup).

## RECIPE calls (the validated win rate)
**0 calls so far.** Across every graded match, **no side went all-green** on the
six-metric recipe — the framework abstained on each. (Prior "3–0" / "1–3" tallies
came from an incorrect higher-count rule I invented; **void.**)

| Match | Recipe | Actual |
|---|---|---|
| Fritz–Shelton | NO CALL | Fritz |
| Zverev–Collignon | NO CALL | Zverev |
| Brooksby–Cerúndolo | NO CALL | Cerúndolo |
| Fritz–Zverev | NO CALL | Fritz |
| Altmaier–Medvedev | NO CALL | Altmaier |
| Cerúndolo–Nakashima | NO CALL | Cerúndolo |
| Paul–Humbert | NO CALL | Paul |
| Borges–Mannarino | NO CALL | Borges |
| Sonego–Navone | NO CALL | Sonego |

**Recipe record: 0–0 (0 calls, 9 abstentions).** No edge claimed; none earned
yet. The instrument is strict and has not fired.

## Recipe detail — six-metric reds per side (recomputed)
How many of the six each side fails (refreshed measurements + TennisViz
variables, `engine/precision/recipe.py`). A side calls only at **0 reds**.

| Match (actual winner first) | Winner reds | Loser reds | closest side |
|---|---|---|---|
| Fritz def Shelton | 3 (1-4, Convs, OUFE-A) | 4 | — |
| Fritz def Zverev | 3 (1-4, Convs, Steal) | **Zverev 1 (1-4)** | **loser** |
| Altmaier def Medvedev | 5 | **Medvedev 1 (OUFE-A)** | **loser** |
| Cerúndolo def Nakashima | 4 | 4 | — |
| Paul def Humbert | 2 (1-4, OUFE-A) | 4 | winner |
| Auger def Tiafoe (pred.) | Auger 2 (1-4, 9+) | Tiafoe 3 | winner |

**Honest caution:** twice the side closest to all-green (1 red) was the **loser**
(Zverev, Medvedev) — the recipe was right to abstain, but it also shows the near-
misses are not quiet edges. **1-4 Rally is the most frequent red.** No call has
fired, and these near-misses are not calls.

## Next 24h — graded where possible (six-metric recipe)
| Match | Result | Note |
|---|---|---|
| Draper vs Nakashima | NO CALL | **Draper 1 red** (1-4: +1.6, needs +2.3) |
| Fritz vs Popyrin | NO CALL | **Fritz 1 red** (OUFE-A: −2.1, needs ≥ −0.8) |
| Tiafoe vs Quinn | not gradable | Quinn has no Rally/UFE (thin charting data) |
| Darderi vs Hanfmann | not gradable | both absent from the measurements pool |
| Davidovich Fokina vs Kyrgios | not gradable | Kyrgios not in the TennisViz file |

Two one-red near-misses, no call. A match is only gradable with **both** halves
present — Rally/UFE *and* conv/steal; one ingredient is never a call.

## Variables (logged)
Graded sides that abstained (≥1 red, no all-green) — no separate "True Variable"
status; market-confirmed toss-ups just sit here.

| Match | Status | Note |
|---|---|---|
| Altmaier vs Kovacevic | Variable | market 53¢/48¢ toss-up; **Altmaier won** (slight fav). Metrics partial — Kovacevic has conv/steal but no Rally/UFE — so logged on the market read, not a full grade. |


