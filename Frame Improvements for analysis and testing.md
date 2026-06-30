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
a real research task, not a quick recalibration.

### A4. BACKTEST RESULT — the disruptor flag shows NO measurable effect (n=1,519)
Ran the real test: does disruption gap predict the Rally-Gap favorite losing MORE
than expected? Backtested every gradable historical match (both players in pool,
both have shot-type data) — favorite/underdog determined the same way the live engine
does (Rally Gap), bucketed by disruption gap, checked actual winner via `PtWinner`.

| disruption gap | n | favorite win% |
|---|---|---|
| favorite is bigger disruptor (<0) | 457 | 60.8% |
| 0–6 (minimal) | 593 | 67.3% |
| 6–12 (moderate) | 327 | 62.4% |
| **12+ (STRONG flag)** | 142 | **68.3%** |
| overall | 1,519 | 64.4% |

**No trend.** If the flag had real signal, favorite win% should *fall* as the
disruption gap rises. It doesn't — it's flat/noisy, and the STRONG-flag bucket (12+)
has the **highest** favorite win rate of all four, the opposite of the hypothesis.
Confidence intervals overlap heavily across buckets (rough 2×SE: 56–65% / 64–71% /
57–68% / 62–75%) — consistent with **no detectable effect**, not just a weak one.

**Verdict: the disruptor flag, as currently constructed (slice%+net%+drop%, season-
aggregate, summed), does not clear a basic backtest.** This is a bigger problem than
"the weights are arbitrary" (§A3) — the construct itself shows no measurable
predictive power at n=1,519. Reweighting slice/net/drop relative to each other would
be tuning a signal that may not exist in this form. Tonight's live 1-for-2
(Sonego/Etcheverry hit, Giron/Moutet miss) is consistent with pure noise around a
null effect, not a small sample of a real one.

**Do not deploy any version of this flag live until it clears a real backtest.**
Possible next directions (untested, for future research only): condition on surface,
on rally-gap size, on round/tournament tier; or abandon the season-aggregate-%
framing entirely and pursue the mid-rally/point-ending shot-sequence approach in §A3.

### A4b. Small-sample trap — confirmed live (slice SHARE, not just raw score)
After §A4's null backtest, tried "slice share" (slice as % of a player's own DISRUPT
score) on the same 3 anecdote matches: winner had the higher share in all 3 (3/3) —
looked like a finding. Re-ran it on Cerundolo's real last-10 (10 matches, not
cherry-picked): **5 holds, 5 breaks — exactly a coin flip.** The 3/3 was 1-in-8 noise
from a small, non-random sample (selected *because* it was "disruptor-qualifying"),
not a real pattern. **Lesson: after a large null backtest, do not chase patterns in
small/selected sub-samples — they regress to the null almost every time.** Confirms
§A4: no validated shot-type signal, slice share included.

### A5. Why it fails — the "3 shot types" flag is really 1 (slice), and slice doesn't reliably disrupt
Broke down DISRUPT into its components for both flagged matches plus the original
Altmaier/Medvedev anecdote:

| player | slice% | net% | drop% | TOTAL | slice's share |
|---|---|---|---|---|---|
| Moutet (flagged, LOST as disruptor) | 23.4 | 4.6 | 4.6 | 32.6 | 72% |
| Sonego (flagged, WON as disruptor) | 14.5 | 5.8 | 3.1 | 23.5 | 62% |
| Altmaier (original anecdote, WON) | 19.5 | 5.0 | 1.0 | 25.5 | 76% |
| Giron / Etcheverry / Medvedev (favorites) | — | — | — | — | 57–75% (similar!) |

**Net and drop are minor everywhere — DISRUPT is effectively a slice score with two
small passengers, not a 3-mechanism signal.** Worse: **Moutet and Altmaier are nearly
identical profiles** (slice-dominant, low net/drop) with **opposite outcomes**
(Altmaier beat the favorite; Moutet lost to the favorite). Same shape of player,
opposite results — consistent with §A4's backtest: slice-heavy play behaves like a
coin flip, not a reliable disruption weapon. **Conclusion: rethink the construct from
scratch rather than reweight it** — collapsing 3 shot types that are ~all slice
explains both the conceptual confound (§A3) and the null backtest (§A4).

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

---

## C. Process checklist (not a frame component — a diligence step)

### C1. Check physical condition / recent injuries before every live read.
No data source we have (charting, frozen May 21; shot types, same) can see a
withdrawal, an injury, or fatigue from a heavy match week. Case: **Tommy Paul**
withdrew from Stuttgart (Jun 8, neck injury) minutes before his match, then lost the
Queen's Club final to Cerundolo 13 days later (6-7(4), 6-4, 6-3, after winning set
one) — a plausible injury-affected MISS on a match the gates/rally favored Paul to
win cleanly (2r vs 5r, +4.8/−9.8). (Correction: this was first misattributed to
Cerundolo — verify which player an injury report belongs to before logging it.)
**This is now a standing check, logged in CLAUDE.md**, alongside recent-form/surface:
real-world context to flag before presenting a read — never a frame override, just
something to know and say out loud.
