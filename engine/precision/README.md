# Precision — reproducible analysis

The code behind the **Precision track**: an honest, no-wager test of whether the
Parser framework finds a real edge in tennis. The *findings and decisions* live
in two docs at the repo root:

- **`Precision - Parser List & Constants List.md`** — the method, the two lists,
  standing law, kill log, match-shape findings, and the clutch instrument note.
- **`Precision - Player Labeling Sheet.md`** — the blind type-labeling sheet
  (waiting on the human eye).

This folder is the *machinery* that produced those findings, so they're
reproducible and never lost to a container reset.

## Run

```bash
cd engine/precision
python3 ufe_identity.py    # PARSER-LIST test: can errors ID the type?
python3 match_shape.py     # COUPLING test: two readers, match shape
python3 clutch.py          # CLUTCH instrument v0.1: grip / which side
```

First run downloads the Match Charting Project files into `engine/data/mcp/`
(gitignored, ~100 MB). After that it reads from cache.

## What each script establishes

| Script | Question | Result |
|---|---|---|
| `ufe_identity.py` | Do errors identify Visionary vs Legacy? | **No.** Raw UFE backwards (Kyrgios lowest, Schwartzman highest), even opponent-adjusted → killed. Win:UFE (opp-adj) cleanly sorts *first-strike ↔ attrition* but that's **not** the type axis (Sinner, a grinding Visionary, lands p21). |
| `match_shape.py` | What happens when two readers collide? | Awkward seam = **start of set 2**, not end of set 1 (clean both tours). Coupling fingerprint faint & closeness-confounded; strong claim fails. A near-draw. |
| `clutch.py` | Whose grip is tighter / which side lifts? | Renders distinct per-player signatures (Kyrgios tight+offense; Swiatek defensive lift when hot; Gauff offense→defense flip when hot). **v0.1 has a break-point selection bias — illustrative, not a ranking yet.** |

## The standing law (applied throughout)
1. **Opponent-adjust everything** (two-way additive model in `ufe_identity.two_way`).
2. **Label blind to the result** (types tagged by eye *before* any stat — see the labeling sheet).
3. **A tell joins a list only by surviving a test;** write the result down (pass or fail).
4. **No look-ahead** — Step 5 is forward-only, no wager.

## Open / next
- **Unsolved:** a data-derived **Temporal tell** (remembers-the-pattern vs
  computes-the-pattern). May be eye-only.
- **To do before trusting clutch ranks:** opponent-and-state-adjust the
  break-point deltas (remove the selection bias noted in `clutch.py`).
- **The prize:** run `clutch.py` on the *sealed human labels* and check whether
  Future cashes the offensive ledger and defensive-aggressive Past the
  defensive ledger — a residual asymmetry would be the edge.

> Scope: everything is calibrated for the **Visionary ↔ Legacy** pair only. The
> machinery generalizes; the calibration (which behaviors discriminate, which
> ledger maps to which type, whether clutch is even the right lens) does not —
> it gets re-derived for any other pair.

Data: Jeff Sackmann Match Charting Project (`master`). The ATP/WTA *results*
repos are not reachable from this sandbox, so all analysis is charting-based.
