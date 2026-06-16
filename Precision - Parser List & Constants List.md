# Precision — Parser List & Constants List

*The living sheet for the Precision track. Every test we run either **adds a row** or **kills one.** Nothing goes on a list by hunch — it earns its spot by surviving a test, with the result written down so we never re-argue it.*

**Two target types (Step 1):** **Visionary** (Abstract • Future • Self/World) vs **Legacy** (Concrete • Past • Other).
Picked because they're the two that look alike from the outside (both "anticipate") but are true opposites — Legacy's toughest matchup *is* the Self/Future innovator. The perfect contrast, *if* we can tell them apart cleanly.

---

## The two lists — they do different jobs

| | **Parser List** | **Constants List** |
|---|---|---|
| **Question** | *Who is this player?* (identity / trait) | *Did they win or lose?* (result / state) |
| **Plan step** | Step 2 — ID players | Step 4 — winner vs loser constants |
| **Compares** | Player **vs. other players** | Player **vs. their own baseline** |
| **A row qualifies if** | it separates Visionary from Legacy | it separates that player's wins from their losses (appears in *all* sets) |
| **Usable to predict an upcoming game?** | Yes — identity is known before the match | Only **indirectly** — see the rule below |

**The honest rule for the Constants List:** most constants (UFE, etc.) are measured *after* the match, so they **describe** a loss but can't be **inputs** to a forward pick. To use a constant in Step 5, we have to **predict it from the matchup** (the Coupling Engine: does the opponent's style drag this player past their line *before* the ball is struck).

---

## Standing law (applies to every test, both lists)

1. **Opponent-adjust everything.** No stat is read raw. Each rate = `player's own tendency + opponent's effect`; we solve for both and keep the player's part. (Ranking is just a proxy for opponent quality — we have the *actual* opponents, so we use them.) *Validated tool, reusable.*
2. **Label blind to the result.** ID a player's type *before* we know if they won. Seal it, then bucket. Otherwise winners get called Visionary because they won.
3. **A tell only joins a list by surviving a test** — run on the cleanest extreme examples (and at scale where data allows). Write the result down here, pass or fail.
4. **No look-ahead.** Step 5 is forward-only, no wager. Nothing that peeks at the match it's predicting.

---

## PARSER LIST — identity (Visionary ↔ Legacy)

The discriminator we agreed to label by. Each row observable; ✅ = data-validated, 👁️ = eye-only, ⏳ = not yet tested.

| # | Tell (observable) | Legacy (Past-Concrete) | Visionary (Future) | Status |
|---|---|---|---|---|
| 1 | Point length they win on | Long rallies — outlasts the pattern | Short points — ends it first | ⏳ proxy via row 6 |
| 2 | First strike | Waits for the known shape | Goes before the evidence | ⏳ proxy via row 6 |
| 3 | Surface over-performance | Clay / slow (reps pay) | Fast / hard (first-strike pays) | ⏳ to test (opp-adj) |
| 4 | Under pressure | Retreats to the *proven* pattern | Reaches for the *winning* one | 👁️ eye-only |
| 5 | Aces / serve dominance | Lower | Higher | ⏳ to test (opp-adj) |
| 6 | **Win:UFE ratio (opp-adjusted)** | Low (grind: Ferrer, Simon, Schwartzman) | High (first-strike: Karlovic, Opelka, Isner, Kyrgios) | ✅ **LOCKED** — but see note |

**Note on Row 6 / the open problem:** Win:UFE cleanly sorts **first-strike ↔ attrition** (point length) — but that axis is **NOT the same as Visionary ↔ Legacy.** Proof: **Sinner sits p21** (with the grinders) because he's future-minded *and* a baseline rallier. **Temporal orientation (Past-lived vs. Future-computed) cuts *across* point-length.** So Row 6 is a real, validated instrument for *style of point* — but it can't call Visionary vs Legacy by itself.

### ⚠️ The core open question
**What observable, opponent-adjusted tell separates "remembers the pattern" (Past) from "computes the pattern" (Future)?** Win:UFE doesn't do it. This is the heart of the two-type split and may be partly eye-only. *Unsolved — top priority.*

---

## CONSTANTS LIST — result (wins vs losses, within a player)

Tested against the player's **own** opponent-adjusted baseline, so weapons/level cancel out.

| # | Constant | Hypothesis | Status |
|---|---|---|---|
| 1 | **UFE deviation vs self (opp-adjusted)** | UFE *above your own line* = decoupling = loss. Holds for grinder and shotmaker alike because each is their own control. | ⏳ to test (Step 4); for Step 5, **predict from matchup** (aggravation) |

---

## ✅ VICTORY — the Style Identifier (detects the Legacy / Pda pole from data)

*We were killing UFE by looking at the wrong column. A player's **own** UFE runs backwards, but the UFE he **forces from the opponent** is a live, polar, identifying tell — and it agrees with two others.* Code: `engine/precision/style_index.py`.

**Three independent, opponent-adjusted tells, all pointing at the same poles:**
- **A. Win:UFE ratio** (high = first-strike, low = attrition)
- **B. rally-length differential** — long-rally win% − short-rally win% (+ = attrition)
- **C. forced-UFE** — how much you make the opponent miss (+ = attrition)

**They agree:** C vs −A **+0.62**, B vs C **+0.39**, B vs −A **+0.29** (same direction, not redundant). Fused into one composite, the poles are clean and *named:*

| Defensive-aggressive (Legacy / Pda) pole | First-strike pole |
|---|---|
| Chung, Navone, Schwartzman, Baez, Fognini, Ruusuvuori | Isner, Rinderknech, Opelka, Kyrgios, Roddick, Anderson |

**What it identifies:** the **defensive-aggressive Legacy (Pda)** type — cleanly, from data alone, no eye needed. *This is the first data-only identifier of one of the two target types.*
**What it does NOT:** find **Visionary** — those sit mid-field (Sinner p76, Alcaraz p72, Djokovic p57), because Visionary is a *temporal orientation,* not a *style pole.* **So we can detect one of the two types, not both — and that asymmetry is itself the finding.**

### ✅ DISQUALIFIER — "steal points" (turns the spectrum into a gated classifier)
A true Legacy *earns* points by pattern/attrition; **stealing** cheap points (short-rally winners, aces — improvised, risk-taken) is first-strike behavior and **disqualifies Legacy.** Ruling *out* is more reliable than ruling *in.*
- **Steal rate** = (1–3-shot-rally winners + aces) per 100 points. corr(Legacy index, steal) = **−0.59** (firm; disqualifier wants negative).
- Legacy pole steal ≈ 4–9/100; first-strike pole ≈ 14–24/100 (Kyrgios 24, Isner 22, Opelka 21).
- **Gate** (`classify_legacy`, index ≥ 1.0 **and** steal ≤ 12/100): **15 confirmed**, and it threw out **impostors hiding in the Legacy pole** — Bergs (steal 16), Karatsev (15), Basilashvili (14), Korda (13): rank Legacy-ish but bash. The composite ranks in; the steal-gate ejects the fakes. Code in `engine/precision/style_index.py`.

---

## Kill log (tested, failed — do not revive)

| Tell | Where it failed | Evidence |
|---|---|---|
| **Raw *self*-UFE/100** as a *parser/identity* tell | A player's *own* errors don't separate the types | Kyrgios (most shotmaker) **lowest** UFE p7; Schwartzman (most grinder) **highest** p97 — backwards, even after opponent-adjustment. *NOTE: this killed **self**-UFE only — **forced**-UFE (errors you cause) is alive; see Victory above. We were looking in the wrong column.* |
| **"Low UFE = Legacy"** | Contradicted | corr(attrition-lean, UFE) = **+0.13** — attrition players miss *slightly more,* not less. Legacy grinds *and* errs (can't end points cheaply). |

---

## MATCH-SHAPE / COUPLING findings

*What happens when two elite **readers** collide. These are about the matchup, not the player — they belong to the Coupling Engine, not the identity list.*

### ✅ Finding 1 — The awkward seam is the **set-2 restart**, not the set-1 close *(clean on both tours)*
Break rate by match phase (MCP point-by-point, 2020s; break = returner wins the game, tiebreaks excluded):

| phase | MEN | WOMEN |
|---|---|---|
| S1 early (games 1–6) | 19.5% | 33.1% |
| **S1 late (7+) — "end of set 1"** | **15.8%** ⬇ lowest | **30.6%** ⬇ lowest |
| **S2 open (1–3) — "start of set 2"** | **20.7%** ⬆ highest | **34.2%** ⬆ highest |
| S2 rest (4+) | 18.5% | 32.7% |
| S3+ | 19.7% | 33.7% |

- **"Beginning of set 2 is awkward" → confirmed.** S2's opening games are the most break-prone phase of the match, both tours.
- **"End of set 1 is awkward" → reversed.** Set-1 closing games are the *calmest* phase — when a set is on the line, people hold. They get awkward *reopening,* not closing.
- **The refined law:** *openings are volatile, closings are calm, and set 2's opening is the most volatile of all.* The disruption lands on the **far side** of the set break — the read survives the close of set 1 and breaks at the restart.
- **Caveat:** S1 early is also high — set openings in general are break-prone (cold serve, no rhythm). So this is "set-2 restart is the peak of a general openings-effect," not "set 2 is uniquely magic."

### Coupling fingerprint — faint but consistent *(elite-vs-elite proxy for "two readers")*
Across **six** independent comparisons (3-set rate ↑, set-1 conversion ↓, set-1-loser-wins-decider ↑ — men & women each), **all six lean the predicted way** (~1.6% if pure chance). But every effect is *small* (1–4pp) and **confounded with closeness** — evenly matched players go long and split early reads mechanically, no reading required.
- **Strong claim** ("the read was *wrong* → the player who was read wins the decider") → **NOT supported.** Set-1 winner keeps a small edge even into a decider (set-1 loser wins ~48%).
- **Weak claim** ("between two readers the early read is worth *less*") → **directionally supported,** consistently, but faint.
- Consistent with Robert's **chess-game** refinement: two great readers countering each other to a near-draw produce exactly these whisper-off-50% numbers. A balanced chess game has *no edge in it* — an edge needs a *residual asymmetry* (one type reliably out-reading the other), which can only be tested with **type labels.**

### ⏳ Hypothesis logged (untested) — the early phase is **pressure reconnaissance**
Robert: early set 1, the **Future** player is *stress-testing the opponent's natural reflexes and behavior under pressure* — banking how the opponent responds when pushed — *to spend it later when it gets heated.* So "set 1 looks like a legit game" because Future is **sandbagging on purpose**, collecting clutch-response data.
- **What it would predict (testable once types are labeled):** the Future player **over-performs in high-pressure moments later** — break points, tiebreaks, deciders — *relative to his own baseline,* because he pre-loaded the opponent's pressure tells in set 1. Future's clutch edge should *grow* as the match heats up.
- Not yet tested — needs the Parser labels.

### ⏳ Clutch instrument (v0.1) — "grip tightness, and which side lifts"
Robert's distillation of the edge: both types can grab the clutch, so the only edge lives in **(a) whose grip is tighter** (magnitude of lift above baseline) and **(b) when even, which side lifts first** (offensive ledger = *taking* the point via BP conversion / tiebreak aggression; defensive ledger = *saving* the point via BP save / holding under siege) **and at what pressure threshold** (regular → break point → deciding set).
- **Built (v0.1):** per player from MCP point data — `DEF grip` = BP-save% − serve-point-win%; `OFF grip` = BP-convert% − return-point-win%; plus both recomputed **inside the deciding set** ("@heated") to see if the grip tightens or fades when it's hot. It renders distinct signatures (Kyrgios = tight, offense-led, tightens when heated; Gauff = offense in general but flips to *defense* when heated; Swiatek = defensive lift only at deepest pressure).
- **⚠️ Bias to fix before ranking:** break points are a **selected** game-state (the returner already won 2–3 points), so raw deltas are biased — *every* DEF grip reads negative, *most* OFF grips positive, partly as artifact. Extremes (Kyrgios) are real; the middle is muddy. **Per standing law, opponent-and-state adjust before "whose grip is tighter" is trustworthy.**
- **The prize:** if Future cashes the *offensive* ledger and Past/defensive-aggressive cashes the *defensive* ledger — and one reliably lifts *first* — that's a **residual asymmetry,** the only thing that could pay. Tested by running this instrument on the **sealed type labels.**

---

## Where we are
- ✅ Two types chosen; discriminator agreed; opponent-adjustment built & validated.
- ✅ Win:UFE locked to Parser List (as a *point-length* instrument, with its limit named).
- ✅ UFE relocated, correctly, from identity → Constants List (state, not trait).
- ⚠️ **Next:** the Temporal tell (Past-lived vs Future-computed) — the one thing that actually completes the Visionary/Legacy ID.

*Data source: Jeff Sackmann Match Charting Project (charting-m-stats-Overview + charting-m-matches). Sinner sample: 302 charted matches / 45,712 points.*
