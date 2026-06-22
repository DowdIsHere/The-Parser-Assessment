# Precision — The Calculator (Winning Profile)

## THE RULE (win determination — author's framework, confirmed)
The thresholds are the **average winning gaps from a survey of 700+ matches** —
every PM victory averaged into the PM prescribed gaps, every FC victory into the
FC prescribed gaps. Every single victory had this shape; the thresholds are the
average of them.

A parser **wins** only by satisfying the prescribed set under **two gates, on
each metric**:

1. **SIGN gate** — be on the correct side. Positive where the metric must be
   led (exceed metrics); within the allowed deficit band on a trail metric.
   **Wrong side (negative) = zero edge — not even "considered."** He doesn't
   have it in the slightest.
2. **THRESHOLD gate** — depends on metric type:
   - **SUCCESS metrics (must-exceed)** are **met-or-nothing**: `gap ≥ threshold`
     = edge (MET); anything less, *even positive*, = **NO-EDGE**. There is **no
     "considered" zone on success metrics** (PM and FC alike).
   - **ALLOWED-gap metrics** (the deficits a type may carry — e.g. an FC's 9+,
     steal, oppUFE; the own-error cap) are **held** while within the allowed
     band, **NO-EDGE** once breached. The tolerance lives here, not on success.

A winner must carry the **whole prescribed set** this way — **not** win on one
standout metric while underwater elsewhere. (Brooksby had a full 9+ but was
negative on conv and steal → failed the sign gate there → no winning shape → he
loses, despite the 9+.)

> ⚠️ The engine helpers I wrote earlier — `WIN_ABS` (absolute bars),
> `resolve()` (clear-more-counting), `same_parser()` — are **approximations I
> invented, not this rule.** Do not treat them as the framework. The rule above
> is the framework.

> ⚠️ **DATA RULE: ONE CONSISTENT CONVENTION — DON'T MIX.** The calculator is
> gap-based (winner − loser), so an additive opponent-baseline offset **cancels
> in the difference** and does not bias the verdict — *as long as the same
> convention is used on both sides AND matches how the thresholds were set.*
> The only real error is **mixing**: adjusted data against raw-calibrated
> thresholds (or vice versa). That mismatch — not the adjustment itself — is
> what caused every earlier disagreement. Pick the convention the thresholds
> were calibrated on, apply it to both players every time, and never mix raw and
> adjusted inside one comparison.

*The observed, **verified** thresholds that separate winner from loser in a
Pattern-Matcher vs. Forecaster head-to-head. Source: framework author's
calibrated calculator (IMG_1699), verified column. Six observable success
metrics. Canonical constants — recorded here so they survive compaction.*

## Convention
Every value is a **(PM − FC) gap** in the metric's native units.
Each metric has a **pair: [when PM wins] / [when PM loses]**.

| Metric | PM wins (PM−FC) | PM loses (PM−FC) | Win-side direction |
|---|---|---|---|
| **1-4** (first-strike win %) | **+1.1** | **−2.3** | higher = PM |
| **Conv** (conversion) | **+1.4** | **−0.5** | higher = PM |
| **OUFE** (errors forced on opp) | **+3.5** | **+0.8** | higher = PM |
| **9+** (grind win %) | **+5.9** | **+0.6** | higher = PM |
| **Steal** (steal score) | **+3.6** | **+1.3** | higher = PM |
| **UFC** (own unforced errors) | **−3.9** | **−2.2** | lower = PM |

Decision boundary per metric = midpoint of the pair:

| Metric | midpoint (PM−FC boundary) |
|---|---|
| 1-4 | −0.60 |
| Conv | +0.45 |
| OUFE | +2.15 |
| 9+ | +3.25 |
| Steal | +2.45 |
| UFC | −3.05 |

## The pass bar (count model)
**oppUFE is NOT a gate metric** (no independent source — see the mapping note).
The gate runs on the **five** sourceable metrics: 1-4, conv, 9+, steal, ownUFE.
oppUFE is **display-only** in the H2H. A side wins by meeting a count:
- **Pattern Matcher must pass 4 of 5** (may carry 1 on the gap report).
- **Forecaster must pass 3 of 5** (may carry up to 2 on the gap report).

This asymmetry is the architecture: the PM has to be near-complete to win; the
FC wins off its few strike metrics while bleeding the grind ones. Verdict:
one side passes its bar and the other doesn't → that side wins; neither → NO
CALL; both → flag.

## How to read it
- The **PM wins** when its (PM−FC) gaps sit on the PM side of the midpoints —
  i.e. PM is adding the strike (1-4, conv) on top of native grind (9+, steal,
  OUFE) **and** holding own errors well below the FC (UFC ≈ −3.9).
- The **FC wins** (PM-loses column) when PM gives back the strike (1-4 −2.3,
  conv −0.5), barely leads on its own turf (OUFE +0.8 / 9+ +0.6 / steal +1.3),
  and the error edge shrinks (UFC −2.2).
- The asymmetry is the architecture: **PM must win clean; FC wins while
  hitting more errors** (its UFC edge over PM is smaller).

## Resolved
- **Steal**: verified **+3.6 / +1.3** (the handwritten −5.3 is superseded).
- **UFC FC-side**: verified **−2.2** (the handwritten +2.8 is superseded;
  matches the independent charting re-derivation).
- **UFC is "must not exceed" in BOTH directions** — own unforced errors are
  flagged only when they run **too high**, never too low. It is an error CAP,
  not an exceed-target. Gap-report caps = the verified magnitudes:
  **PM ≤ +3.9**, **FC ≤ +2.2**.

## Metric → gradient (reference only; literature kept separate/proprietary)
1-4 / 9+ = Temporal · Conv = Abstract-Spatial · Steal = Concrete-Spatial ·
OUFE = Reference · UFC = Spatial.

---

## File → calculator mapping (Everybody Measurements)
Pull these from the file:
- **1-4** = `short_win%`
- **9+** = `long_win%`
- **ownUFE** = `adjUFE`
- **conv** = TennisViz conversion (NOT the file's `BP_conv%` — different stat).
  Source: `Precision - Variables (TennisViz).csv`, `conv` column (pulled 2026-06-22).
- **steal** = TennisViz steal (NOT the file's `steal_droplob` — different stat).
  Source: `Precision - Variables (TennisViz).csv`, `steal` column. These two are
  the **variable bin** — separate from the win rate (see scorecard methodology).

- **oppUFE** = `adjUFE` + `WinUFE` (the column right before adjUFE is `forces_oppUFE`;
  the author's oppUFE is the **adjUFE + WinUFE** sum, baked into the metrics). This
  is **display-only** in the H2H — it is NOT a gate metric. Note: WinUFE ≈ +0.9 for
  everyone, so oppUFE ≈ ownUFE + ~0.9 — largely redundant with ownUFE, which is why
  it doesn't gate. The earlier per-match chart oppUFE values (e.g. Tien 19.4) are
  **superseded/wrong**; the computed adjUFE + WinUFE is the metric that counts.

## Baseline profiles (stand-in opponent when the competitor is unknown)
Absolute metric values for a winning PM and a winning FC. When an opponent's
metrics are unknown, fill their side with the baseline of **their** type
(your PM faces the FC baseline; your FC faces the PM baseline), then run the
normal gap profile.

| metric | PM win | FC win |
|---|---|---|
| 1-4 (r14)     | 51.3 | 50.8 |
| conv          | 70.3 | 68.8 |
| oppUFE (oufe) | 17.7 | 17.1 |
| 9+ (r9)       | 51.5 | 49.1 |
| steal         | 33.8 | 32.2 |
| ownUFE (ufc)  | 15.5 | 18.6 |

Higher = better on all except **ownUFE** (lower = better). Note the PM baseline
is the cleaner one (ownUFE 15.5 vs FC 18.6) and the heavier grinder (9+ 51.5 vs
49.1) — the architecture difference, in absolute numbers.
