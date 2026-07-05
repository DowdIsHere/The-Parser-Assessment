"""
FIT — physical read: can the body BRING and SUSTAIN the shape the frame reads?
Companion to the gates/rally (reception) — FIT is delivery-across-time.

Three components, from what we OBSERVED beating the frame this week:
  1. FATIGUE  (load)      — this module. Current-event load off the match log.
  2. FADE     (durability)— deciding-set win% from our charting data (see build note).
  3. INJURY   (condition) — real-world news; not computable. Manual per read.

FATIGUE v1 — deliberately sources off the MATCH LOG (sets/games/5-setters this
event), NOT the ATP Physicality Index. The Index is per-match, tracked-events
only, and unreachable behind the egress policy; the match log is always available
(it's the same results we reconcile from) and captures the case that mattered
(Mensik came in off a 5-setter). Distance/workload is the deluxe upgrade for a
tracked, borderline match — pulled manually, not depended on here.

Output is a PRESENTED layer, not a hard trigger — report the load and the
differential; the read is made across FIT + the frame, in the author's voice.

Run:  python3 engine/precision/fit.py   (demo on this week)
"""
import re


def total_games(score):
    """Total games both players played in a match score string.
    Handles tiebreak annotations '7-6(4)' and retirements '2-1 ret'."""
    g = 0
    sets = 0
    for chunk in score.split(","):
        chunk = re.sub(r"\(.*?\)", "", chunk).strip()
        m = re.match(r"(\d+)\D+(\d+)", chunk)
        if not m:
            continue
        a, b = int(m.group(1)), int(m.group(2))
        g += a + b
        sets += 1
    return g, sets


def load(matches):
    """matches: list of score strings the player was IN this event.
    Returns event load: matches, sets, games (time-on-court proxy), five_setters."""
    tg = ts = five = 0
    for s in matches:
        g, sets = total_games(s)
        tg += g
        ts += sets
        if sets >= 5:
            five += 1
    return dict(matches=len(matches), sets=ts, games=tg, five_setters=five)


def report(a, a_matches, b, b_matches):
    """FATIGUE report for a matchup — load per player + the differential.
    A presented layer; no threshold fires a verdict."""
    la, lb = load(a_matches), load(b_matches)
    print(f"FATIGUE (event load, off the match log)")
    print(f"  {'player':16}{'matches':>8}{'sets':>6}{'games':>7}{'5-setters':>11}")
    for nm, l in [(a, la), (b, lb)]:
        print(f"  {nm.split()[-1]:16}{l['matches']:>8}{l['sets']:>6}{l['games']:>7}{l['five_setters']:>11}")
    dg = la["games"] - lb["games"]
    heavier = a if dg > 0 else b
    print(f"  load differential: {a.split()[-1]} − {b.split()[-1]} = {dg:+} games "
          f"(heavier: {heavier.split()[-1]}"
          f"{', +5-setter' if la['five_setters'] != lb['five_setters'] else ''})")
    print(f"  → presented layer: read the load gap vs the frame's shape + durability; not a trigger.")


if __name__ == "__main__":
    print("=== Mensik vs Dimitrov (R2) — load coming in ===")
    report("Jakub Mensik", ["5-7, 6-3, 6-3, 3-6, 7-6"],          # R1 vs Samuel (5 sets)
           "Grigor Dimitrov", ["7-6, 6-3, 7-5"])                  # R1 vs Sweeny (3 sets)
    print()
    print("=== Khachanov vs Cobolli (R3) — load coming in ===")
    report("Karen Khachanov", ["6-4, 3-6, 6-4, 6-4", "6-3, 7-6, 6-4"],
           "Flavio Cobolli", ["7-6, 3-6, 7-6, 6-1", "1-6, 7-6, 6-3, 7-6"])  # two 4-set recoveries
