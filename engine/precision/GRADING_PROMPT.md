# Grading Prompt — six-metric all-green recipe (automation-ready)

Drop this into a Claude Cowork session pointed at this repo. It encodes the
recipe, thresholds, pole rule, verdicts, and output format so the agent runs
without re-deriving anything.

USAGE (recurring list every 6h): set Cowork to run this prompt on a 6-hour
schedule. Cowork has schedule access, so it fetches the day's matchups itself —
no input needed. (For a one-off, you can still paste matchups under `MATCHUPS:`.)

---

You are grading ATP singles matchups with the six-metric all-green recipe.
Work in the repo; the engine lives at engine/precision/twogate.py (recipe) and
engine/precision/recipe.py (loader). Reuse them — do not reinvent the math.

STEP 0 — GET THE MATCHUPS: fetch today's and the next ~24h of ATP singles order
of play (you have schedule access). Collect every singles matchup with both
player names. If a `MATCHUPS:` list is provided below, use that instead.

DATA SOURCES (the only rosters):
- "Precision - Everybody Measurements.csv"  cols: tour,player,WinUFE,short_win%,
  long_win%,steal_droplob,BP_conv%,forces_oppUFE,adjUFE
- "Precision - Variables (TennisViz).csv"   cols: player,conv,steal,perform,
  serve,return,forehand,backhand
Match names by normalizing accents, hyphens, and dots, then subset-matching
tokens. A player must resolve in BOTH files to be usable.

THE SIX METRICS (map exactly; gap = thisPlayer − opponent):
  1-4 Rally (r14) = short_win%                  [Measurements]
  Convs     (conv)= conv  (TennisViz — NOT BP_conv%)        [Variables]
  OUFE-A    (oufe)= adjUFE + WinUFE              [Measurements]
  9+ Rally  (r9)  = long_win%                    [Measurements]
  Steal           = steal (TennisViz — NOT steal_droplob)   [Variables]
  UFE       (ufc) = adjUFE                       [Measurements]

POLE RULE (assign per matchup, comparing the two players):
  - higher 1-4 (short)                 → that player is FC
  - higher 9+ (long) AND higher OUFE-A → that player is PM
  Evaluate EACH side at its own pole. (Pole is a verdict input, never guessed
  from reputation; it comes from these numbers only.)

THRESHOLDS (success gap; gap = side − opponent). FC UFE cap is 2.2 (the 2.8 seen
on older cards is stale):
  FC: r14 exceed +2.3 | conv exceed +0.5 | oufe trail −0.8 | r9 trail −0.6 |
      steal trail −3.3 | ufc cap +2.2
  PM: r14 exceed +1.1 | conv exceed +1.4 | oufe exceed +3.5 | r9 exceed +5.9 |
      steal exceed +3.6 | ufc cap +3.9
  green logic: exceed v → gap ≥ v ; trail v → gap ≥ −v ; cap v → gap ≤ v
  (green = meets threshold, red = doesn't)

VERDICTS (every side is exactly one):
  - CALL         = all six measured AND all six green
  - VARIABLE     = all six measured but ≥1 red (the abstain bucket; NO CALL)
  - NOT GRADABLE = any of the six missing (a player absent from either file)
  "Variable" is a verdict, NOT a set of metrics. There is no "variable half" and
  no conv/steal "bin" — conv and steal are two of the six gates. A match missing
  Rally/UFE is NOT GRADABLE, even if conv/steal exist. Never order results
  "winner first" — grade blind to the result.

OUTPUT — for each gradable side, render this grid (IMG_1757 format):
  columns: (metric) | PlayerA(pole) | PlayerB(pole) | [POLE] Thresh |
           Success Deficit/Surplus | Actual Deficit/Surplus
  rows in order: 1-4 Rally, Convs, OUFE-A, (blank), 9+ Rally, Steal, UFE,
           (blank), TOUFE (mark n/a — not in the dataset)
  where: Thresh = opponentValue + Success (for UFE: opponentValue − Success);
         Actual = A − B; mark each Actual cell 🟢 (green) or 🔴 (red).
  When a matchup is a clean PM/FC split, show one grid per side at its own pole.

Then a one-line summary per match: pole(A) Nr vs pole(B) Nr → CALL <name> or
VARIABLE, and list NOT GRADABLE matches with the missing player(s). End with:
"ALL-GREEN CALLS: <list or NONE>".

Market odds, if mentioned, are external context only — they never change a grade.
Report faithfully: if nothing goes all-green, say 0 calls. Lead the run with the
date/time and a one-line headline (e.g. "N gradable, M all-green calls"), so a
quick glance tells the whole story.

MATCHUPS (optional — leave blank to auto-fetch in Step 0):
<!-- paste one matchup per line, e.g.
Jack Draper vs Brandon Nakashima
Fabian Marozsan vs Alejandro Tabilo
-->
