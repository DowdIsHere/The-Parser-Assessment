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
| Agut v Fonseca (BAL-PM) | **Agut** | −0.8/−1.9 | 3/5 | +6.1 | 🟠 moderate | LOW (near-toss) | ❌ **L** Fonseca 7-6,6-4,6-3 (flag correct) |
| Struff v Baez (BAL-PM) | **Baez** | −0.4/−2.3 | 3/5 | +4.9 | 🟢 minimal | LOW (near-toss) | 🟡 live, Baez up in 5th (81%) |
| Fokina v Cerundolo (BAL-PM) | **Fokina** | +5.0/−7.7 | 2/5 | −3.4 | 🟢 minimal | STRONG | 🟢 live, Fokina leading (91%) |
| Moutet v Giron (BAL-PM) | **Giron** | +2.6/−5.3 | 3/4 | +17.6 | 🔴 STRONG | DOWNGRADE (disrupt) | |
| de Jong v Hijikata (FC) | **de Jong** | +3.6/−4.4 | 1/5 | +0.9 | 🟢 minimal | STRONG | |
| Sonego v Etcheverry (FC) | **Etcheverry** | +4.5/−5.3 | 2/4 | +11.8 | 🟠 moderate | CAUTION (disrupt) | |
| Sinner v Kecmanovic (BAL) | **Sinner** | +7.9/−12.5 | 1/5 | +4.4 | 🟢 minimal | STRONG | |
| Cilic v Medvedev (BAL) | **Medvedev** | +4.6/−9.2 | 2/4 | +0.1 | 🟢 minimal | STRONG | 🟢 live, Medvedev leading (97%) |

## THREE COUNTS (Strong / Flagged / Pass)
Track each bucket's record separately to see if the confidence tiers earn out.

**STRONG — clean rally edge, disrupt-safe → BET**
| pick | status |
|---|---|
| Bergs | ✅ W |
| Medvedev | 🟢 live, leading 97% |
| Fokina | 🟢 live, leading 91% |
| de Jong | pending |
| Sinner | pending |

→ **Strong: 1–0** (2 leading).

**FLAGGED — disruptor risk on the rally favorite → FADE / AVOID**
| pick (favorite) | flag | status |
|---|---|---|
| Agut | 🟠 Fonseca +6.1 | ❌ **L** (Fonseca won) — **flag CORRECT** |
| Giron | 🔴 Moutet +17.6 | tomorrow |
| Etcheverry | 🟠 Sonego +11.8 | tomorrow |

→ **Flagged: pick 0–1; the flag was right (1–0).** Avoiding the flagged favorite beat the plain rally read.

**PASS — near-toss / low-conviction lean → SKIP (or bet tiny)**
| pick | status |
|---|---|
| Hurkacz | ✅ W (lean; won anyway) |
| Baez | 🟡 live, leading 81% |
| Fritz | pending |

→ **Pass: 1–0** (a small winner skipped — correct discipline, not a loss).

*The headline so far: STRONG is holding, and the FLAGGED bucket's first result
proves the disruptor flag adds real signal — the rally said Agut, the flag said
fade, and fading was right.*

## Honest notes
- Profiles are season-aggregate through **May 21** — no grass-specific form. Two
  known blind spots beat the Rally Gap: an over-performer on the day, and a
  disruptor who changes the rally type (now flagged).
- UFE reds on non-PM-vs-FC cards are the **provisional** gate (descriptive, not
  yet verified) — weight them lighter than rally/strike reds.
