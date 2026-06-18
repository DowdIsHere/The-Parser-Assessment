# Precision — The Calculator (Winning Profile)

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
  not an exceed-target. Gap-report caps: **PM ≤ +3.9**, **FC ≤ +2.8** (the
  failure line; winning FCs sit ~+2.2, just under). The verified −3.9 / −2.2
  pair is the decision centroid; the cap is the separate failure boundary.

## Metric → gradient (reference only; literature kept separate/proprietary)
1-4 / 9+ = Temporal · Conv = Abstract-Spatial · Steal = Concrete-Spatial ·
OUFE = Reference · UFC = Spatial.
