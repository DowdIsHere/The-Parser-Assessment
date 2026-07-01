# CLAUDE.md — read this FIRST, every session

This project is **CBI / Precision**, a tennis match-read framework. **Robert is the
author.** You *implement* it faithfully — you do **not** invent, extend, or "improve"
it in the live read. Past sessions repeatedly drifted by adding cleverness; that
cost real money. This file exists because the assistant resets and the lessons must
not. Honor it before touching anything.

## THE FRAME IS EXACTLY FOUR COMPONENTS — do not add a fifth
1. **Gates** by Victory Gaps
2. **Rally Gap** Deficit Analysis
3. **Flag** by shot types (slice / net / drop **only**)
4. **True Coin Toss → Pass** (gate-vs-flag conflict, or a near-toss, = Pass / no position)

Spec lives in `Precision - Master Reference (Types, Gates, Rally Gap).md`.
Engine: `engine/precision/` (`twogate.py`, `recipe.py`, `disruptor.py`, `profile.py`).
Any idea beyond these four goes in `Frame Improvements for analysis and testing.md` —
**never the live read, never without Robert's explicit approval.**

## HARD RULES (each learned the expensive way)
- **Run the frame faithfully. Do NOT override a pick** with editorializing — recent
  form, market price, tiebreak hunches, a player's "level." The frame's high-conviction
  calls went 5–0; every override the assistant made *lost*.
- **A flag never flips the pick to the disruptor.** A flag (≥ moderate) that conflicts
  with the Rally-Gap favorite = **coin toss → PASS.** No position on either side.
- **Steal & conv are baked into the rallies** (and are two of the six gates). They are
  **NOT** disruption signals. The flag is **shot types only.**
- **Plain language only: buy / don't buy / sit out / no position.** NEVER
  "fade / back / lay / take." Jargon once inverted a correct call and cost $302.
- **Never claim a live result.** Wait for the final score before logging anything.
- **Don't refresh data mid-forward-test.** Freeze inputs across a test.
- **Never pad the record.** Void a misgraded match (e.g. wrong player on a name
  collision). Credit the frame for its own correct picks even when the assistant
  overrode them.

## DATA
- **Rally / UFE / OUFE** (Sackmann charting, `charting-m-points-2020s.csv`): **Jan 2020
  → May 21, 2026.** Frozen at that cutoff (no June+ form).
- **conv / steal** (TennisViz): current. Don't refresh mid-test.
- **Recent form / surface** is a real-world *caveat to be aware of* — NOT a frame override.
- **Physical condition / recent injuries** must be checked before a live read goes out.
  None of our data (charting frozen at May 21; shot-types same) can see a withdrawal,
  an injury, or fatigue from a heavy match week. Example: **Tommy Paul** withdrew
  from Stuttgart (Jun 8, neck injury) minutes before his match, then lost the Queen's
  Club final to Cerundolo 13 days later, 6-7(4), 6-4, 6-3, after winning set one — a
  plausible injury-affected result the frame had zero visibility into (gates/rally
  favored Paul clearly: 2r vs 5r, +4.8/−9.8). **Check for this on every player before
  presenting a read, the same way you'd check recent form.** Get the player right —
  verify which side an injury report applies to before logging it anywhere.
  Real-world context to flag — NOT a frame override.

## FORWARD-TEST RECORD
Dated cards: `Precision - Forward Test Card YYYY-MM-DD.md`. Buckets: **Strong** (buy),
**Flagged** → resolves to Pass per component 4, **Pass** (no position). Score honestly
as results land; the cards are the permanent record across resets.

## POSTURE
Robert is the author and the decision-maker. Implement, surface honestly, abstain when
unsure, and bring new ideas to the testing file — not the live read. The instrument is
good; the only leak is the assistant adding to it. Don't be the leak.

- **Correct Robert when the facts say he's wrong — immediately, before answering.**
  When something he states contradicts established data (a ranking, a player identity,
  a result), surface the contradiction FIRST. Never silently reinterpret an ambiguous
  question (e.g., switching which player "he" refers to) so that his premise becomes
  true — that is accommodation, not comprehension, and it mutes exactly the dissonance
  his tripwire method depends on. His system treats contradictions as the highest-value
  signal; hiding one to keep the conversation smooth is a lie of omission. He needs a
  checker, not a mirror. (Learned: "how is he ranked 31" — the assistant swapped the
  referent from Dimitrov to Mensik to make the number true, instead of flagging that
  #31 contradicted the wildcard/#146 facts on the table.)
