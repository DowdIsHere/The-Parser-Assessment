# Precision — Operating Manual (Cowork)

The single operational document. Screen → Gates → Rally Gap → Flag → Verdict.
The verdict is **one of three words: STRONG · FLAG · PASS.** Nothing else is output.
No leans, no asterisks, no overrides, no injury/form narrative in the read. Real-world
context (injury, form, surface) is a **note handed to the human, never a change to the
verdict.**

---

## 0. THE ONLY THREE OUTPUTS
The frame emits an **analytical classification of the matchup — a read, not a
recommendation.** It is not financial advice and names no action to take. What a
reader does with a classification is entirely their own decision.

| Verdict | What the read means |
|---|---|
| **STRONG** | The frame identifies a clear favorite — decisive Rally Gap separation, an owned axis, and disrupt-safe. |
| **FLAG** | A rally favorite exists, but a moderate+ underdog disruptor conflicts with it — the read is contested. |
| **PASS** | No gradable or clear read — not gradable, a near-toss, or no owned axis. |

A FLAG never names the disruptor as the favored read; it marks the favorite's read
as contested.

---

## 1. DATA — sources, files, how to pull

**Three working CSVs (all small, all in the workspace root — a player must be in the
first two to be gradable; the third feeds the Flag):**

| File | Columns used | Source | Vintage |
|---|---|---|---|
| `Precision - Everybody Measurements.csv` | `short_win%`, `long_win%`, `adjUFE`, `WinUFE` | Sackmann Match Charting Project | **frozen May 21 2026** |
| `Precision - Variables (TennisViz).csv` | `conv`, `steal` (+ `serve`,`perform` for reference) | TennisViz Insights | current |
| `Precision - Flag Report (Disruptor).csv` | `slice%`, `net%`, `drop%`, `TOTAL`, `slice_share%`, `tier` | precomputed from Sackmann shot types | **frozen May 21 2026** |

The Flag file is **precomputed** — one row per player — so grading needs **no raw shot
dump and no engine code**; the model reads it like the other two roster CSVs. (Regeneration
only, offline: `engine/precision/disruptor.py` over the full ShotTypes source, then written
to this CSV. `gen_measurements.py` likewise regenerates the Measurements file. Neither the
32MB+ raw charting files nor the engine are needed to grade a matchup.)

**Look up a player:** match the name across the CSVs (case-insensitive, ignore `-`/`.`).
**Freeze rule:** do NOT refresh either source in the middle of a forward test.

---

## 2. SCREEN (gradability) — do this first, every time
A match is **GRADABLE** only if **both players** appear in **both** roster files
(Measurements + Variables) with **all six** metrics present. Any one of the twelve values
missing → **NOT GRADABLE → verdict PASS.** No manual fill-ins, no substitutes, no partial
grade. (The Flag file is looked up separately for component 3; if a gradable player has no
shot-type row, report the Flag as "no shot data" — it does not block the gates/rally.)

---

## 3. THE SIX METRICS (identical in every matchup)
| Gate | = | File | Direction |
|---|---|---|---|
| **1-4 Rally** | `short_win%` | Everybody Measurements | higher better |
| **Convs** | `conv` | Variables (TennisViz) | higher better |
| **OUFE-A** | `adjUFE` + `WinUFE` | Everybody Measurements | higher better |
| **9+ Rally** | `long_win%` | Everybody Measurements | higher better |
| **Steal** | `steal` | Variables (TennisViz) | higher better |
| **UFE** | `adjUFE` | Everybody Measurements | **lower better** |

---

## 4. TYPE LABEL (per player, from their own rally split)
```
D = short_win% − long_win%
FC   if  D > +2.5      (first-strike)
PM   if  D < −2.5      (grinder)
BAL  if  −2.5 ≤ D ≤ +2.5
```
Type is the magnitude of the player's OWN gap — not who out-grinds whom.

---

## 5. MATCH-TYPE CARDS — the winning gaps (drive Gates AND Rally Gap)
Each card = the average **winning gap per side, per metric.** Pick the card by the
**pair of types.** Values are the winner's margin in the metric's units. `UFE` is an
**error ceiling** (how much MORE own-UFE the winner may carry and still win).

### 5.1 PM-vs-FC  *(APPROVED — calibrated, IMG_1699/1757)*
| metric | PM side (PM−FC) | FC side (FC−PM) |
|---|---|---|
| 1-4 | +1.1 | +2.3 |
| conv | +1.4 | +0.5 |
| OUFE-A | +3.5 | −0.8 |
| 9+ | +5.9 | −0.6 |
| steal | +3.6 | −3.3 |
| UFE (ceiling) | +3.9 | +2.2 |

### 5.2 PM-vs-BAL  *(APPROVED — validated cross card)*
| metric | PM side (PM−B) | BAL side (B−PM) |
|---|---|---|
| 1-4 | −1.7 | +3.1 |
| conv | −0.8 | +1.7 |
| OUFE-A | +0.9 | −1.1 |
| 9+ | +2.1 | −0.8 |
| steal | +1.0 | +0.7 |
| UFE (ceiling) | +1.1 | −1.3 |

### 5.3 FC-vs-BAL  *(APPROVED — validated cross card)*
| metric | FC side (FC−BAL) | BAL side (BAL−FC) |
|---|---|---|
| 1-4 | +0.6 | +1.1 |
| conv | −0.9 | +1.5 |
| OUFE-A | +0.5 | −1.4 |
| 9+ | −3.8 | +6.1 |
| steal | −2.1 | +3.2 |
| UFE (ceiling) | +0.6 | −1.5 |

### 5.4 PM-vs-PM  *(APPROVED — same-type, flat)*
Symmetric; both sides read the same column.
| metric | winner − loser |
|---|---|
| 1-4 | +0.3 · conv +0.3 · OUFE-A +0.3 · 9+ +0.1 · steal +0.4 · UFE +0.3 |

### 5.5 BAL-vs-BAL  *(PROVISIONAL — computed n=610, NOT yet committed/validated)*
Symmetric; both sides same column. **Use only with this caveat until re-verified.**
| metric | winner − loser |
|---|---|
| 1-4 +1.1 · conv +0.6 · OUFE-A −0.3 · 9+ +1.4 · steal +1.1 · UFE −0.4 |

### 5.6 FC-vs-FC  *(PROVISIONAL — flat ~±0.3, NOT committed)*
Treat as flat symmetric (≈ PM-vs-PM shape) until a real card is computed.

> **Same-type is NOT a coin toss by default.** A coin toss is what the Gates + Rally
> Gap dictate (§9), never a property of two players sharing a type.

---

## 6. THE GATES (gap to victory) — read by DEPTH, not red count
For each of the six metrics, for each player:
```
Winning#        = opponent's value + your side's winning gap (from the §5 card)
Gap-to-Victory  = your value − Winning#
                  (UFE only, flipped: Gap-to-Victory = Winning# − your value)
GREEN if Gap-to-Victory ≥ 0 ; else RED (and by HOW MUCH)
```
Status per side:
- **CALL** — all six green.
- **VARIABLE** — all six measured, ≥1 red.
- **NOT GRADABLE** — any metric missing.

**Reading rule:** compare G2V vs G2V by depth. A red is a *closed door on one path*,
not a demerit — −0.1 ≈ green, −7 is a chasm. A negative Steal/Conv against strong
opposition tells you *how* a player wins, it is not a hole he must fill.

---

## 7. THE RALLY GAP (decision layer — 1-4 and 9+ only)
```
Rally Gap = Gap-to-Victory(1-4) + Gap-to-Victory(9+)
```
- **Favorite** = higher Rally Gap.
- **Separation** = favorite Rally Gap − underdog Rally Gap.
- **Ownership** = does the favorite have a POSITIVE Gap-to-Victory on ≥1 rally axis?
  How far OVER the win line = how hard he owns it (surplus = dominance).
  Barely clearing (+0.3) = hanging on; +1.6 = owns it.

---

## 8. THE FLAG (shot types ONLY — slice / net / drop)
**The Flag Report is a table, one row per player** — never collapse it to a single number.
Read each player's row straight from `Precision - Flag Report (Disruptor).csv`:
```
columns:  slice%  net%  drop%  TOTAL  slice_share%  tier
TOTAL       = slice% + net% + drop%                        (= the DISRUPT score)
slice share = slice% / TOTAL                               (the author's read within the flag)
tier        = TOTAL ≥20 DISRUPTOR | 15–20 mild | <15 baseline
```
(Definitions, for reference — the CSV already has these computed: each shot-type % is that
type as a share of ALL the player's shots, i.e. `100 × Sl/Total`, `100 × Net/Total`,
`100 × Dr/Total`.)
**Report format (always all six columns):**
| player | slice% | net% | drop% | TOTAL | slice share | tier |

**Reading it:** `TOTAL` sets the tier (who is a disruptor). The **slice-share gap** between
the two players is the author's read — *how* the disruption is accomplished — and is read
against the Rally Gap. `slice share` and `TOTAL` are distinct: two players can share the
same slice share at very different TOTALs (e.g. Sonego 62% @ 23.5 = DISRUPTOR vs Etcheverry
61% @ 11.7 = baseline).

**Report BOTH comparatives every time** (favorite = Rally-Gap favorite):
```
DISRUPTION GAP  = underdog TOTAL − favorite TOTAL
                  ≥12 STRONG | 6–12 moderate | <6 minimal   (fires FLAG when the disruptor is the underdog)
SLICE-SHARE GAP = underdog slice share − favorite slice share   (the author's read; report alongside, never in place of)
```
Steal and conv are **NOT** disruption signals — they are baked into the rallies and are
two of the six gates. The flag is shot types only. A flag never designates the
disruptor as the favored read.

---

## 9. THE VERDICT (decision tree → STRONG / FLAG / PASS)
```
1. Not gradable (any of 12 metrics missing)                         → PASS
2. Favorite owns NO axis (both rally Gap-to-Victory < 0)            → PASS
3. Separation below the near-toss cutoff  (see parameter below)     → PASS
4. Favorite clear (owns an axis, separation ≥ cutoff):
     Disruption gap ≥ 6 AND underdog is the disruptor              → FLAG
     else                                                          → STRONG
```
**Near-toss cutoff = author-set calibration parameter.** From the record: near-tosses
at separation ≈ 1–2 were PASS; a STRONG hit landed at separation ≈ 6 (Munar). Set the
cutoff in that band and hold it constant across a test. (Do not treat this number as
approved until you fix it — it is the one open knob.)

---

## 10. HARD RULES (operational)
1. Output is exactly one of **STRONG / FLAG / PASS** — an analytical read only.
   **Never attach an action or transaction to it:** no buy/sell/purchase/position/
   shares language, and none of the trading jargon (fade/back/lay/take). The frame
   reads the matchup; it does not advise, and it is not financial advice.
2. **No overrides.** The frame's pick is not adjusted for form, price, tiebreak hunches,
   level, or any in-match read.
3. **No editorializing against a pick.** A concern goes to
   `Frame Improvements for analysis and testing.md` as a hypothesis to validate — never
   into the live read as a lean or an asterisk.
4. **Real-world context is a note, not a verdict change.** Injury/fatigue/surface may be
   stated to the human; the STRONG/FLAG/PASS does not move.
5. **Never claim a live result.** Wait for the final score before logging W/L.
6. **Freeze inputs across a forward test.** Do not refresh mid-test.
7. **Void, never pad.** A misgraded match (wrong player on a name collision, missing
   metric) is voided, not force-fit.

---

## 11. QUICK RUN ORDER
1. Screen both players in both files (§2). Missing → PASS.
2. Label each player's Type (§4).
3. Pick the §5 card by the pair of types.
4. Fill the six Gates as Gap-to-Victory (§6).
5. Sum the two rally rows → Rally Gap; set favorite, separation, ownership (§7).
6. Compute the Flag (§8).
7. Apply the §9 tree → **STRONG / FLAG / PASS.**
