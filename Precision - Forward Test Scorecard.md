# Precision — Forward Test Scorecard

*Honest record. Trust is earned one graded call at a time.*

## Methodology (keep these separate)
- **WIN RATE = FRAMEWORK** — bound strictly to the research-captured metrics
  (1-4, 9+, oppUFE, UFE), applied **all-green**: a side is a framework call only
  if its success metric is met **AND** every allowed gap is held. Otherwise the
  framework **abstains (NO CALL).** Nothing observed or invented alters this.
- **VARIABLES (conv, steal)** — logged separately for **future correlation
  analysis**. They do **NOT** feed the win rate.

## FRAMEWORK calls (the validated win rate)
**0 calls so far.** Across the 7 qualifying matches below, **no side went
all-green** — the framework abstained on every one. (Prior "3–0" / "1–3" tallies
were produced by an incorrect higher-count rule I invented; **void.**)

| Match | Framework | Actual |
|---|---|---|
| Fritz–Shelton | NO CALL | Fritz |
| Zverev–Collignon | NO CALL (1-4 met, 9+ breached 0.4) | Zverev |
| Brooksby–Cerúndolo | NO CALL | Cerúndolo |
| Fritz–Zverev | NO CALL | Fritz |
| Altmaier–Medvedev | NO CALL (Medvedev 1-4 met, oppUFE breached) | Altmaier |
| Cerúndolo–Nakashima | NO CALL | Cerúndolo |
| Paul–Humbert | NO CALL | Paul |
| Borges–Mannarino | NO CALL | Borges |
| Sonego–Navone | NO CALL | Sonego |

**Framework record: 0–0 (0 calls, 9 abstentions).** No edge claimed; none earned
yet. The instrument is strict and has not fired in 9 qualifying matches.

*Re-run 2026-06-22 on the refreshed form data (Sackmann snapshot, 321→333
players, single consistent ≥2000-point pipeline): every verdict held. The
UFE family moved a hair on the fresh opponent-adjustment, but the binding
constraints — the 1-4 success shortfalls (Fritz +2.0/+0.5 vs +2.3, Auger +1.9)
and Medvedev's oppUFE breach (−3.6) — are unchanged. No match flipped to
all-green.*

## VARIABLE-SUCCESSES log (for correlation, NOT the win rate)
**Source: authoritative TennisViz conv/steal (`Precision - Variables
(TennisViz).csv`, pulled 2026-06-22).** Supersedes the earlier estimated entries.
Structured the way the framework treats them for an FC: **conv** is the variable
**success** metric (exceed +0.5); **steal** is an **allowed-gap** (trail 3.3) —
its states are *hold* / *breach*, not met/unmet. "+" = conv MET, "−" = conv short.

| Match (winner first) | Winner conv | Loser conv | conv picked winner? |
|---|---|---|---|
| Fritz v Shelton | − (tie 68.8) | − (tie 68.8) | neither met |
| Zverev v Collignon | − (70.2) | **+ (70.7)** | ✗ (loser met) |
| Cerúndolo v Brooksby | **+ (68.0)** | − (66.2) | ✓ |
| Fritz v Zverev | − (68.8) | **+ (70.2)** | ✗ (loser met) |
| Altmaier v Medvedev | − (67.7) | **+ (68.5)** | ✗ (loser met) |
| Cerúndolo v Nakashima | − (68.0) | − (68.4) | neither met |
| Paul v Humbert | **+ (69.2)** | − (67.4) | ✓ |

**conv as a win-signal: 2 picked the winner, 3 picked the loser, 2 neither.**
On real data conv is *worse* than the earlier estimate suggested — it points at
the loser as often as the winner. All three "loser met conv" cases include the
two upsets (Fritz/Zverev, Altmaier/Medvedev). Recorded for correlation; the
read (held loosely): **conv is not a win condition.**

## VARIABLE-FAILURES log (what it takes to break)
Where variable status and outcome **diverge** — the break points. For FC, the
two break kinds: a **winner who breached the steal trail and still won**, and a
**loser who met conv / held steal and still lost.**

| Match | Winner broke steal & won | Loser met conv / held steal & lost |
|---|---|---|
| Fritz v Shelton | — | — |
| Zverev v Collignon | — | **conv** (Collignon met +0.5, lost) |
| Cerúndolo v Brooksby | — | — |
| Fritz v Zverev | **steal** (Fritz −5.5, won) | **conv** (Zverev met, lost) |
| Altmaier v Medvedev | **steal** (Altmaier −5.8, won) | **conv** (Medvedev met, lost) |
| Cerúndolo v Nakashima | — | **steal** (Nakashima breached −4.5, lost) |
| Paul v Humbert | — | **steal** (Humbert breached −7.5, lost) |

**What's breaking (real data):** twice the winner **breached the steal trail and
won anyway** (Fritz, Altmaier — both upsets); three times the loser **met conv
and lost** (Collignon, Zverev, Medvedev). Steal breaches landed on both winners
(2) and losers (2) — not outcome-determining. Early read (held loosely):
**neither variable is holding as a win condition** on this sample. Data only —
the framework win rate (0 calls) is untouched by any of this.

