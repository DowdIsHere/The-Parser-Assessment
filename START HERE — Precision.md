# START HERE — Precision

Point any new Claude session at this file. Everything it needs is in this repo.

---

## THE PROMPT (paste into a fresh session)

> Follow `Precision - Operating Manual (Cowork).md`. For **[Player A] vs [Player B]**,
> give me the six gates, the rally gap, and the flag report (both comparatives —
> disruption gap and slice-share gap), then the verdict: **STRONG / FLAG / PASS.**
> Analytical read only — no buy/sell/position language, not financial advice.

That's it. Supply the **two player names** (add surface/date if you want it noted). The
model screens gradability itself; if either player is missing from a data file it returns
**PASS — not gradable** and stops.

---

## WHAT THE MODEL READS (automatically — you don't paste these)
- `CLAUDE.md` — loaded first: the 4 components + hard rules (no overrides, no advice language)
- `Precision - Operating Manual (Cowork).md` — the step-by-step procedure
- `Precision - Master Reference (Types, Gates, Rally Gap).md` — the type cards / spec
- Data: `Precision - Everybody Measurements.csv` · `Precision - Variables (TennisViz).csv` ·
  `engine/data/mcp/charting-m-stats-ShotTypes.csv`
- Engine: `engine/precision/` (`recipe.py`, `twogate.py`, `disruptor.py`)

## THE FRAME IS EXACTLY FOUR COMPONENTS
1. Gates by Victory Gaps · 2. Rally Gap Deficit · 3. Flag by shot types (slice/net/drop) ·
4. True Coin Toss → Pass. Output is one of **STRONG / FLAG / PASS** — nothing else, no leans,
no injury/form narrative in the read (context is a note to you, never a verdict change).

---

## THE TWO KNOBS YOU OWN (set once; they stick across sessions)

**A. Near-toss cutoff (Operating Manual §9) — CURRENTLY UNSET.**
The Rally-Gap separation below which the verdict is PASS. Record shows near-tosses at
separation ≈ 1–2 were PASS; a STRONG hit landed at ≈ 6. **Set your number here:**
> near-toss cutoff = __________   (until set, treat any separation under ~5 as PASS)

**B. Flag trigger (Operating Manual §8) — CURRENTLY: TOTAL disruption gap.**
FLAG fires on the TOTAL disruption gap (underdog is the disruptor, gap ≥ 6); the
slice-share gap is reported alongside. If the **slice-share gap** should be the trigger
instead, change this line and the manual will be rewired to match:
> flag trigger = TOTAL disruption gap   ▢   /   slice-share gap   ▢

---

## FREEZE RULES
- Charting data (rally/UFE/OUFE) is frozen at **May 21 2026.** TennisViz (conv/steal) is current.
- Do **not** refresh either source in the middle of a forward test.
- Never claim a live result — wait for the final score before logging W/L.
