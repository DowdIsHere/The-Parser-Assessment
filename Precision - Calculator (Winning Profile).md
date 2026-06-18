# Precision — The Calculator (Winning Profile)

*The observed thresholds that separate the winner from the loser in a
Pattern-Matcher vs. Forecaster head-to-head. Source: framework author's
calibrated calculator (IMG_1699). Six observable success metrics. These are
the canonical constants — recorded here so they survive.*

**Convention:** each value is the **winner's margin over the loser** on that
metric. "Must exceed by X" = winner must be **ahead by at least X**.
"Deficit must not exceed −X" = winner is allowed to **trail by at most X**
(no more). "UFC deficit should not exceed X" = own unforced errors (bad) may
run **higher by at most X**.

Metric legend:
- **1-4** = short-rally (first-strike) win %  · Temporal-future
- **9+** = long-rally (grind) win %  · Temporal-past
- **Conv** = conversion (attacking success)  · Abstract-Spatial
- **Steal** = steal score (defending success)  · Concrete-Spatial
- **OUFE** = opponent unforced errors forced  · Reference
- **UFC** = own unforced errors (lower is better)  · Spatial

---

## PM to outmatch FC  (Pattern Matcher wins)
| Metric | Condition | PM edge required |
|---|---|---|
| 1-4   | must exceed by | **+1.1** |
| Conv  | must exceed by | **+1.4** |
| OUFE  | must exceed by | **+3.5** |
| 9+    | must exceed by | **+5.9** |
| Steal | must exceed by | **+3.6** |
| UFC   | deficit should **not exceed** | **≤ +3.9** (may have up to 3.9 more own errors, no more) |

*Read: the winning PM borrows the strike (1-4 +1.1, conv +1.4) on top of his
native grind (9+ +5.9, steal +3.6, OUFE +3.5) — and keeps his own errors
contained (UFC no worse than +3.9).*

## FC to outmatch PM  (Forecaster wins)
| Metric | Condition | FC margin required |
|---|---|---|
| 1-4   | must exceed by | **+2.3** |
| Conv  | must exceed by | **+0.5** |
| OUFE  | deficit must **not exceed** | **≥ −0.8** (may trail on OUFE by at most 0.8) |
| 9+    | deficit must **not exceed** | **≥ −0.6** (may trail on 9+ by at most 0.6) |
| Steal | deficit must **not exceed** | **≥ −5.3** (may trail on steal by at most 5.3) |
| UFC   | must exceed by | **+2.8** (wins while hitting more own errors — aggression) |

*Read: the winning FC pushes the strike harder (1-4 +2.3) and still converts
(+0.5), while not bleeding too much on the PM's native turf (OUFE/9+/steal
deficits capped). He wins WITH more unforced errors (+2.8) — the cost of
first-striking — where the PM has to win WITHOUT them.*

---

## ⚠️ One cell to reconcile
The **FC-side UFC = +2.8** is the cell I previously verified from the charting
data as **−2.2** (a sign flip). The author's calculator says **+2.8** (FC wins
while making *more* errors); my earlier independent re-derivation came out the
other way. Recorded as the author's **+2.8** here. Flagged for a clean re-test
before this cell is trusted in a live call.

## Cross-check against verified fragments
- **Steal PM-side +3.6** ✅ matches the earlier verification (+3.6 / +1.3 two-sided).
- All other PM-side cells (1-4, Conv, OUFE, 9+, UFC) recorded as authoritative
  from the calculator; not independently re-derived yet.
