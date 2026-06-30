# Frame Improvements — for analysis and testing

**These are NOT part of the approved frame.** They are additions Claude introduced
during live use. They are parked here for separate analysis/testing and must not
be wired back into the engine or used in a live read until Robert (CBI) approves
them. The approved frame is exactly four components:

1. **Gates** by Victory Gaps
2. **Rally Gap** Deficit Analysis
3. **Flag** by shot types (slice / net / drop)
4. **True Coin Toss → Pass** (a gate-vs-flag conflict is a coin toss → Pass)

---

## A. Worth exploring (Robert flagged these two)

### A1. Flag-scaling — does a flag matter less against a large rally edge?
Idea: the disruptor flag may be **decision-relevant only when the rally edge is
modest** (e.g. rally sep under ~12). A very large rally edge (Sinner +22, Djokovic
+14) might be too big for a disruptor to overturn, so a borderline flag there could
be nominal. **Status: untested hypothesis.** Needs a real sample of flagged matches
split by rally-sep size, scored against results. Do NOT apply live yet.

### A2. Tiebreak proxy — who wins a breaker?
Idea: a tiebreak rewards **serve + clutch + short-point**, so rank the two players on:
`1-4 short-win%`, TennisViz `serve`, TennisViz `perform`, `conv`. Higher = better
tiebreak player.
- Observed: de Jong > Hijikata (de Jong won set-1 TB); Etcheverry > Sonego on proxy
  (Etcheverry won the set-3 TB 7-2 — proxy right) **but Sonego stole the set-4 TB 7-4
  (proxy wrong on the decisive one).** So: **1-for-2 on decisive breakers — unproven.**
- Caution learned: a tiebreak read must NEVER override the shot-type flag. On
  Sonego/Etcheverry the in-the-moment tiebreak lean pointed at the flagged favorite
  and cost a position. **Status: untested; explore only after the approved engine is back.**

### A3. Disruptor flag's shot weighting — CURRENT FORMULA IS NOT DATA-SUPPORTED.
The live `disruptor.py` DISRUPT score sums slice% + net% + drop% as if all three carry
equal "disruption" weight. **They do not.** Measured directly from
`charting-m-stats-ShotTypes.csv` (`shots_in_pts_won` / `shots_in_pts_lost`, pooled
across all charted matches), baseline = 50.2% of all shots occur in a point the hitter
wins:

| shot | win-association | vs baseline |
|---|---|---|
| Slice | 41.0% | **−9.3** (hitter loses the point MORE often) |
| Drop shot | 55.0% | +4.8 |
| Net/Volley (all variants) | 68.5–70.9% | **+18 to +21** |
| Overhead | 82.7% | +32.4 |
| Groundstroke | ~50% | flat (the baseline) |

**Slice and net/volley are near-opposites**, yet the current formula weights them
identically and adds them together. This is not a refinement question — **the current
DISRUPT formula is not supported by the data and should not be trusted as-is.**

**Critical caveat — correlation, not causation, and likely confounded:** a volley's
strong positive association is partly tautological (you're often at net hitting a
volley *because* the point was already going your way — the volley frequently *ends*
an already-won point, it doesn't *cause* the win). Slice's negative association likely
mirrors this: players slice more while defending/stretched, i.e. already in a losing
position — the slice may be a **symptom** of trouble, not its cause. This data does
NOT separate point-ending shots from mid-rally shots, so it cannot yet support a real
causal "this shot type disrupts the opponent" claim.

**What real validation would require:** split each shot category into "mid-rally" vs
"point-ending," and check whether a MID-RALLY slice/net/drop changes how the point
*subsequently* unfolds (not just whether it co-occurs with a known outcome). That is
a real research task, not a quick recalibration. **Until done, treat the live
disruptor flag's calibration as unverified — its directional finding (Sonego/Etch:
flag-side won; Giron/Moutet: rally-side won, 1-for-2) is too small a sample to lean on.**

---

## B. Discarded / incorrect (kept for the record, not for use)

### B1. Steal/conv as a "disruption tell" — INCORRECT.
Reading Moutet's steal gap as evidence of disruption. Wrong: **steal and conv are
baked into the rallies** (they occur during the point) and are already two of the six
gates. The disruption signal is **shot types only.** Do not cross-wire them.

### B2. "Form-override" as a decision — INCORRECT as applied.
Overriding a frame pick on recent form (faded Munar on Cerundolo's Queen's run).
The frame's Munar pick was right; the override was wrong. Recent form is a real-world
*caveat to be aware of*, but it is **not** a mechanism that flips a frame pick.

### B3. Proposed "shotmaker flag" (UFE/OUFE/rally signature) — UNAPPROVED.
Idea floated to flag players who win via winners/serve (low rally win% + high OUFE +
high own UFE) whom a rally-based frame underrates (Cerundolo, Hijikata). Not approved;
parked as a possible future study only.

### B4. Proposed "absolute-fragility flag" (value vs winning baseline) — UNAPPROVED.
Idea floated to flag a favorite whose absolute 1-4 or 9+ sits far below the winning
baseline. Not approved; parked.
