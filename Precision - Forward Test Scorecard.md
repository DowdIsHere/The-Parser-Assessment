# Precision — Forward Test Scorecard

*Honest record of every committed call and its result. Trust is earned here,
one graded call at a time. A call counts only when made before the match.*

| # | Date | Matchup | Type | Call | Why | Market | Result |
|---|------|---------|------|------|-----|--------|--------|
| 1 | Jun 19 | Shelton vs Fritz (Halle) | FC vs FC (same-parser) | **Fritz** | grind edge, 9+ +3.1 → +11.0 | Fritz 56% | ✅ **WIN** — Fritz 6-7(5) 7-6(8) 7-6(3), all 3 tiebreaks |
| 2 | Jun 19 | Zverev vs Collignon (Halle) | win-metrics | **Zverev** | clears 4/5 win-metrics vs Collignon 3/5 | Zverev ~84% | ✅ **WIN** — Zverev 7-6(10) 7-6(7), both tiebreaks |

**Record: 2–0.** Both calls on matches decided in tiebreaks; both times the higher-win-metrics (cleaner/steadier) player took the margins.

## Notes
- **Same-parser resolution** (`engine/precision/widget.py` → `same_parser`):
  FC-vs-FC decided by grind (9+ heaviest), PM-vs-PM by strike. oppUFE not used.
- Earlier reads NOT counted as clean forward calls: Djere–Ofner (baseline-
  assisted), Altmaier–Hurkacz (retro/test).
- The instrument is **untested** until this scorecard shows a track record.
