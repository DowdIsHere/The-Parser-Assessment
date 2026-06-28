# Precision — Master Reference: Types, 6 Gates, Rally Gap

The single source for *how* a matchup is graded. Type label → the six metrics →
the two formulas (6 Gates, Rally Gap) → the four matchup cards that feed both.
Every number here is from a validated card in the record, not reconstructed.

---

## 1. The TYPE label (PM / FC / BAL)
Per player, from their **own** rally split:

```
D = short_win% − long_win%        (the "1-4" value minus the "9+" value)

FC   if  D > +2.5                  (first-strike dominant)
PM   if  D < −2.5                  (grind dominant)
BAL  if  −2.5 ≤ D ≤ +2.5           (balanced)
```

Type is the **magnitude of a player's own gap** — NOT who out-grinds the
opponent. The relative "pole" in a matchup (higher 1-4 = short side, higher 9+ =
long side) only picks which *column* of a card to read; it does **not** set the
type. (This is the trap: Ruud out-grinds an opponent yet is BAL because his own
D is only +1.9; Medvedev looks like an FC pole but his own D is −2.2 → BAL.)

---

## 2. The SIX metrics (identical in every matchup)
| Gate | = | Source file |
|---|---|---|
| **1-4 Rally** | `short_win%` | Everybody Measurements |
| **Convs** | `conv` | Variables (TennisViz) |
| **OUFE-A** | `adjUFE + WinUFE` | Everybody Measurements |
| **9+ Rally** | `long_win%` | Everybody Measurements |
| **Steal** | `steal` | Variables (TennisViz) |
| **UFE** | `adjUFE` | Everybody Measurements |

`gap = yourValue − opponentValue` on each metric.

---

## 3. The 6-GATE formula (all six metrics)
For each metric, read **your side's winning gap** off the matchup card (§5):

```
GREEN  if  actual gap ≥ card gap        (every metric EXCEPT UFE)
UFE is a CAP:  GREEN if actual gap ≤ cap
```

Verdict (every side is exactly one):
- **CALL** — all six measured AND all six green.
- **VARIABLE** — all six measured, but ≥1 red. (Abstain bucket; no call.)
- **NOT GRADABLE** — any one of the six missing (player absent from a source).

"Variable" is a verdict, not a set of metrics. conv/steal are two of the six.

---

## 4. The RALLY GAP formula (two rally metrics only)
A lighter read that uses **only 1-4 and 9+** — it is literally the two rally rows
of the same matchup card. Used when the six-gate recipe abstains but rally shape
still separates the players.

```
score(metric) = actual gap − card bar       (for 1-4, then 9+)
Net rally     = score(1-4) + score(9+)
Higher net rally = the play.
```

The 9+ "trail" bars are negative, so they enter as negatives: `gap − (−v) = gap+v`.

---

## 5. The four matchup cards (winning gaps — drive BOTH formulas)
Each card gives the average winning gap per side. The **6 Gates** use all six
rows; the **Rally Gap** uses the **1-4 and 9+** rows only.

### PM-vs-FC  *(calibrated calculator, IMG_1699/1757)*
| metric | **PM wins** (PM−FC) | **FC wins** (FC−PM) |
|---|---|---|
| 1-4 | +1.1 | +2.3 |
| conv | +1.4 | +0.5 |
| OUFE-A | +3.5 | −0.8 |
| 9+ | +5.9 | −0.6 |
| steal | +3.6 | −1.3 ¹ |
| UFE (cap) | ≤ +3.9 | ≤ +2.2 |

**Rally bars:** PM `1-4 +1.1 / 9+ +5.9` · FC `1-4 +2.3 / 9+ −0.6`
¹ Locked six-gate engine uses FC steal **trail −3.3** (from IMG_1757); the
calibrated card flips to −1.3. UFE caps (+3.9 / +2.2) are separately verified.

### PM-vs-BAL  *(validated cross card)*
| metric | **PM wins** (PM−B) | **BAL wins** (B−PM) |
|---|---|---|
| 1-4 | −1.7 | +3.1 |
| conv | −0.8 | +1.7 |
| OUFE-A | +0.9 | −1.1 |
| 9+ | +2.1 | −0.8 |
| steal | +1.0 | +0.7 |
| ownUFE | +1.1 | −1.3 |

**Rally bars:** PM `1-4 −1.7 / 9+ +2.1` · BAL `1-4 +3.1 / 9+ −0.8`
(Each wins on opposite turf: the PM via the long rally, the BAL via the short.)

### FC-vs-BAL  *(validated cross card)*
| metric | **FC wins** (FC−BAL) | **BAL wins** (BAL−FC) |
|---|---|---|
| 1-4 | +0.6 | +1.1 |
| conv | −0.9 | +1.5 |
| OUFE-A | +0.5 | −1.4 |
| 9+ | −3.8 | +6.1 |
| steal | −2.1 | +3.2 |
| ownUFE | +0.6 | −1.5 |

**Rally bars:** FC `1-4 +0.6 / 9+ −3.8` · BAL `1-4 +1.1 / 9+ +6.1`

### PM-vs-PM  *(same-type — coin toss)*
Symmetric: the winner exceeds the loser by the same small margin on each metric,
so both sides read the same column.
| metric | winner − loser |
|---|---|
| 1-4 | +0.3 |
| conv | +0.3 |
| OUFE-A | +0.3 |
| 9+ | +0.1 |
| steal | +0.4 |
| ownUFE | +0.3 |

**Rally bars:** `1-4 +0.3 / 9+ +0.1` (both sides). These are ≈0 — **same-type is
the coin-toss bucket; the BREAKOUT (largest single outlier gap) decides, not the
bars.** Don't over-trust a Rally Gap here.

---

## 6. Honest limits
- **UFE caps are only verified for PM-vs-FC** (+3.9 / +2.2). The other cards show
  the raw winner−loser ownUFE gap; treat it as descriptive until verified as a gate.
- **The cards describe match-day winning, not season-average prediction.** Cobolli
  (BAL) graded −14.4 under the BAL-wins profile on his season numbers and won
  anyway. The frame reads the *shape of winning*; it does not promise a player
  will bring that shape on the day. This is the wall.
- **FC bars are matchup-specific:** an FC vs a PM (`+2.3 / −0.6`) and an FC vs a
  BAL (`+0.6 / −3.8`) are different frames. Using the wrong one flips verdicts.
