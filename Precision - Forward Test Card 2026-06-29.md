# Precision — Forward Test Card · 2026-06-29 (Wimbledon R1 slate)

Blind picks logged **before** results, to be scored honestly as matches settle.
Two-dimensional read: **Rally Gap** (gap-to-victory, who's favored) + **Disruptor
Flag** (can the favorite be pulled off the rally). Data through May 21; surface =
grass. Engine: `recipe.py`, `twogate.py`, `disruptor.py`.

## Legend
- **Rally Gap** = favorite net / underdog net (sum of gaps to victory on 1-4 & 9+).
- **Reds** = six-gate reds (fav/und); 0 reds = CALL, else VARIABLE.
- **Disrupt gap** = underdog DISRUPT − favorite DISRUPT (slice%+net%+drop%).
- **Flag** 🟢 minimal · 🟠 moderate (≥6) · 🔴 STRONG (≥12) disruption risk.
- **Confidence** = STRONG / lean / CAUTION / DOWNGRADE / LOW, after both layers.

## Settled (scored)
| Match | Pick | Result | Score |
|---|---|---|---|
| Bergs (PM) vs Humbert (FC) — FC-vs-PM | **Bergs** (rally −2.1 vs −6.6; market had Humbert) | **Bergs W** 3-6,6-1,6-4 | ✅ HIT |
| Ruud (BAL) vs Hurkacz (FC) — FC-vs-BAL | **Hurkacz** (lean; +1.2 / −5.2; grass note) | **Hurkacz W** 6-4,6-2,7-6(7) | ✅ HIT |

**Record: 2–0.** Bergs against the market; Hurkacz on the softest "lean" + grass note — both held.

## Pending (Wimbledon R1)
| Match (type) | Favored (rally) | Rally Gap | Reds f/u | Disrupt gap | Flag | Confidence | Result |
|---|---|---|---|---|---|---|---|
| Ruud v Hurkacz (BAL-FC) | **Hurkacz** | +1.2/−5.2 | 4/4 | +0.5 | 🟢 minimal | lean | ✅ **W** 6-4,6-2,7-6 |
| Fritz v Draper (BAL-FC) | **Fritz** | +1.7/−5.7 | 3/3 | +0.6 | 🟢 minimal | lean | |
| Agut v Fonseca (BAL-PM) | **Agut** | −0.8/−1.9 | 3/5 | +6.1 | 🟠 moderate | **PASS** (near-toss) | ❌ pick L, Fonseca 7-6,6-4,6-3 (was a Pass — dodged) |
| Struff v Baez (BAL-PM) | **Baez** | −0.4/−2.3 | 3/5 | +4.9 | 🟢 minimal | **PASS** (near-toss) | ❌ pick L, Struff 6-1,7-6,4-6,2-6,7-5 (was a Pass — dodged) |
| Fokina v ~~Cerundolo~~ | ~~Fokina~~ | — | — | — | — | ⚠️ **VOID** | Graded vs *Francisco* C.; actual opp **Juan Manuel** Cerundolo = NOT GRADABLE. (Fokina W 6-4,6-4,7-6, not a frame call.) |
| Moutet v Giron (BAL-PM) | **Giron** | +2.6/−5.3 | 3/4 | +17.6 | 🔴 STRONG | DOWNGRADE (disrupt) | |
| de Jong v Hijikata (FC) | **de Jong** | +3.6/−4.4 | 1/5 | +0.9 | 🟢 minimal | STRONG | ✅ **W** 7-6(4),3-6,5-7,6-4,6-3 (5 sets, from 2-1 down) |
| Sonego v Etcheverry (FC) | **Etcheverry** | +4.5/−5.3 | 2/4 | +11.8 | 🟠 moderate | CAUTION (disrupt) | |
| Sinner v Kecmanovic (BAL) | **Sinner** | +7.9/−12.5 | 1/5 | +4.4 | 🟢 minimal | STRONG | ✅ **W** 4-6,6-3,6-7,6-2,6-3 (5 sets) |
| Cilic v Medvedev (BAL) | **Medvedev** | +4.6/−9.2 | 2/4 | +0.1 | 🟢 minimal | STRONG | ✅ **W** 6-1,6-2,6-4 (straights) |

## THREE COUNTS (Strong / Flagged / Pass)
Market = prediction market (Kalshi): you **purchase shares** in an outcome, hold
or sell — no wager, no book. Bucket rule: **PASS** = rally near-toss / low
conviction → no position (flag irrelevant). **FLAGGED** = real rally edge, but
disruptor flag fires → don't buy the favorite (consider the other side).
**STRONG** = real edge + disrupt-safe → buy the favorite. Track each bucket.

**STRONG — clean rally edge, disrupt-safe → BUY (favorite shares)**
| pick | status |
|---|---|
| Bergs | ✅ W |
| Medvedev | ✅ W 6-1,6-2,6-4 (straights) |
| ~~Fokina~~ | ⚠️ VOID — graded wrong Cerundolo (actual opp Juan Manuel = not gradable) |
| de Jong | ✅ W 7-6,3-6,5-7,6-4,6-3 (5 sets, comeback from 2-1 down) |
| Sinner | ✅ W (5 sets — Kec pushed it) |

→ **Strong: 4–0** (Bergs, Sinner, Medvedev, de Jong). Every high-conviction call hit.
**Fokina VOID** — wrong opponent graded (the Cerundolo name-collision bit us). Lesson:
confirm player identity before grading when names collide; don't assume the gradable one.

**FLAGGED — real rally edge, but disruptor flag → DON'T BUY FAVORITE (other side?)**
| pick (favorite) | rally sep | flag | status |
|---|---|---|---|
| Giron | +7.9 | 🔴 Moutet +17.6 | tomorrow |
| Etcheverry | +9.8 | 🟠 Sonego +11.8 | tomorrow |

→ **Flagged: 0–0 — UNTESTED.** Both pending; this is where the flag actually gets graded.

**PASS — near-toss / low-conviction lean → SKIP**
| pick | rally sep | status |
|---|---|---|
| Hurkacz | +6.4* | ✅ pick W (skipped a winner) |
| Agut | +1.1 | ❌ pick L, Fonseca won (dodged a loser) |
| Baez | +1.9 | ❌ pick L, Struff won 5 sets (dodged a loser) |
| Fritz | +7.4* | pending |

→ **Pass: dodged 2 losers (Agut, Baez), skipped 1 winner (Hurkacz).** The two
**near-tosses (sep 1.1, 1.9) both lost the thin lean — and the model bought
neither.** That's the abstention edge live: it correctly flagged the two spots it
couldn't call, and both would have been losses. Discipline = the edge.
No position taken on Pass, so not scored W/L.
*Hurkacz/Fritz have real rally separation but went to Pass on low conviction
(4-red VARIABLE, no axis owned) — not near-tosses.

*Honest headline: STRONG is holding (1–0, 2 leading). The disruptor flag is still
**unproven** — Agut was a Pass (we'd skip it regardless), so it didn't test the
flag. Giron and Etcheverry tomorrow are the first real flag exams.*

## Honest notes
- Profiles are season-aggregate through **May 21** — no grass-specific form. Two
  known blind spots beat the Rally Gap: an over-performer on the day, and a
  disruptor who changes the rally type (now flagged).
- UFE reds on non-PM-vs-FC cards are the **provisional** gate (descriptive, not
  yet verified) — weight them lighter than rally/strike reds.
