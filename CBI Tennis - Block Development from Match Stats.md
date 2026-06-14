# CBI Tennis — Block Development from Match Stats

**Version 1.1**

*Companion instrument to the "CBI Tennis Parser Behavior Playbook." The playbook reads* **orientation** *(the Parser — which blocks a player reaches for). This document reads* **development** *(how trained those blocks have become). Different question, different data, deliberately kept apart so match stats never get mistaken for Parser identity.*

-----

## Core Principle

Two different things, two different sources:

- **The Parser** (three dimensions) is *orientation* — which CBI blocks become available first. It is a constant. You read it from **behavior**, never from stats.
- **A CBI block** is a *capacity* — a processing engine that can be trained. Capacity shows up in **execution quality**, and percentage stats are aggregate execution quality. So stats are a **proxy for block development**.

Put simply: **the Parser tells you which blocks a player reaches for; the stats tell you how developed those blocks have become.**

The payoff is the **accessibility-vs-development gap**: every profile's block indicators already name a player's native-high and likely-low blocks. Stats let you check whether the native blocks were actually trained, whether a low-accessibility block was left undeveloped, or whether a non-native block has been deliberately built up over a season. The Parser is the constant; the stat trend is the developmental arc made measurable.

> **Note on the eight blocks.** This instrument uses the block set as named in the profile/career content: **Sequential Processing, Spatial Relationships, Perceptual Discrimination, Pattern Recognition, Symbolic Manipulation, Self-Reference Processing, Social Signal Processing, Generative Creation.** The framework's clinical reference also names an **Executive** block (control / flexibility); in the profile content that function is carried by **Self-Reference Processing** (regulation under load) and **Generative Creation** (tactical flexibility), so clutch and adjustment stats map there.

-----

## 1. What We Capture

### The capture unit is the *tagged match*

A stat without context can't measure development — the same first-serve % means opposite things against different opponents on different surfaces. So every stat is logged **per match, with condition tags**, and development is read from how the number behaves *across* tags, not from a single average.

**Tag layer (every match):**

| Field | Notes |
|---|---|
| `date` | for longitudinal trend |
| `surface` | hard / clay / grass / indoor-hard |
| `environment` | indoor / outdoor |
| `opponent` | name/id |
| `opponent_parser` | if known — lets us test robustness against specific orientations |
| `round_stakes` | qualifier … final; pressure context |
| `score` / `result` | sets and games |
| `retirement` | flag — exclude or weight down |
| `fatigue_context` | days since last match, third match in three days, etc. |

### Tier 1 — Core box score (always captured)

Runs the whole model on its own.

- **Serve:** aces, double faults, 1st-serve % (in), 1st-serve points won %, 2nd-serve points won %, service points won %, service games / holds (hold %), break points faced / saved (save %)
- **Return:** 1st-serve return points won %, 2nd-serve return points won %, return points won %, break points / converted (conversion %), return games won (break %)
- **Rally:** winners, unforced errors, forced errors, winner:UFE ratio, net points won %, total points won

### Tier 2 — Situational / clutch (from point-by-point)

- Points won by **rally-length bucket**: 0–4 (short), 5–8 (mid), 9+ (long)
- Deuce/ad point conversion
- Tiebreaks won
- Deciding-set record
- Performance **after losing a set** (resilience)
- First-point-of-game won %
- Points won when **behind vs. ahead**

### Tier 3 — Tracking / advanced (optional, Hawkeye-class)

- Serve **placement** (wide/body/T) and won % by location
- Return depth and court position
- Shot speed and spin (rpm)
- Distance run and recovery time
- **Tempo** — time between points
- **Shot-pattern sequences** — the only real window into Symbolic Manipulation (point geometry and sequence design)

-----

## 1.5 The Capture Method: Self-Charting

**This instrument is built on self-charting, not scraped data.** Public stats only exist for tour-level players, are inconsistent on winners/unforced errors, and dry up entirely below the tour — exactly where the players we'd assess (juniors, clients, developing pros) live. Tier 3 (Hawkeye-class) data is proprietary and effectively unobtainable. So we don't chase it.

The win: **you don't log 30 stats — you log one point at a time, and derive the rest.** A simple courtside point log produces the entire Tier 1 box score and most of Tier 2 automatically, with a winner/UFE definition that's finally *consistent* because it's yours.

### Minimum Viable Capture — the point log

For each point, record:

| Field | Values | Derives |
|---|---|---|
| `server` | A / B | hold %, break %, service/return splits |
| `serve` | ace / double-fault / 1st-in / 2nd-in | 1st-serve %, DF rate, aces, 1st-/2nd-serve points won |
| `rally_length` | shot count (or bucket 0–4 / 5–8 / 9+) | rally-length distribution |
| `point_end` | winner / unforced error / forced error | winner:UFE ratio (your consistent definition) |
| `won_by` | A / B | every points-won %, BP save/convert, deciding sets, behind/ahead, first-point |

Five fields. From them you compute essentially all of Tier 1 and the situational half of Tier 2 — no separate stat sheet needed.

**Optional add-ons** (one tap more per relevant point, for finer block mapping):

- `wing` (FH / BH) on winners and errors → sharpens the Generative Creation vs. Sequential read
- `net` flag (point involved a net approach) → net-points-won %, feeds Spatial Relationships

### What we deliberately drop

Serve speed, spin, distance run, tempo, exact placement — all Tier 3. Not chartable by eye, not worth a guess. The model runs without them; they were only ever a sharpening layer for Symbolic Manipulation, which the optional `wing`/`net` flags and rally shape approximate well enough.

-----

## 2. Stat → Block Map

| Stat | Block(s) it indexes |
|---|---|
| 1st-serve %, double-fault rate, hold % | **Sequential Processing** (grooved motor program) × **Self-Reference Processing** (composure) |
| Break-point conversion / save % | **Self-Reference Processing** (clutch regulation) + **Pattern Recognition** (reading the big point) |
| Winner : unforced-error ratio | **Generative Creation** (shotmaking) against **Sequential Processing** (error suppression) |
| Return points won / reading the serve | **Perceptual Discrimination** + **Pattern Recognition** + **Social Signal Processing** (anticipation) |
| Net / approach points won | **Spatial Relationships** + **Perceptual Discrimination** |
| Points won in 9+ shot rallies | **Self-Reference Processing** (sustained composure) + **Pattern Recognition** (point construction) |
| Between-set tactical shift / variety | **Generative Creation** + **Pattern Recognition** (+ **Symbolic Manipulation** for game-theory reads) |
| Deciding-set / tiebreak record | **Self-Reference Processing** under maximum load |
| Serve placement / point geometry (Tier 3) | **Symbolic Manipulation** + **Spatial Relationships** |

Most blocks are over-determined — several stats touch them. Triangulate: a block is well-evidenced when *multiple* stats that index it move together.

-----

## 3. From Stats to a Development Read

### Step 1 — One match is noise

A single match's numbers are confounded by opponent, surface, and luck. Never read development from one match, the same way you never read a Parser from one point.

### Step 2 — Build a per-block index

For each block, aggregate the stats that index it (Section 2) across the captured matches. This gives a rough level — but level alone isn't development.

### Step 3 — Development = level **and** robustness

A block is **developed** when its stats hold up *as conditions turn hostile* — across surfaces, against tougher opponents, deep in deciding sets. It is **fragile / underdeveloped** when the number is fine in easy conditions but **collapses** under pressure or against a specific style.

> Capture the variance, not just the mean. High mean + low collapse = developed. High mean + sharp collapse under load = a block that's present but untrained for pressure.

### Step 4 — Overlay the Parser to read the gap

Pull the player's profile block indicators (native-high / likely-low). Compare to what the stats show developed:

- **High accessibility + high development** → a trained native weapon. The stat is elite *and* condition-proof.
- **High accessibility + low development** → wasted architecture. The capacity is native but never built (the Visionary with gorgeous Pattern Recognition but an unforced-error count that screams untrained Sequential Processing).
- **Low accessibility + rising development** → deliberate, hard-won training. A non-native block being built up — and a stat that **climbs over a season is the development happening in front of you.** This is the longitudinal payoff: block growth made measurable.

-----

## 4. Cautions

- **Stats measure development, not orientation.** Never infer a Parser from these numbers — that re-blurs the conditions-vs-architecture line. Orientation comes from behavior (the playbook); these stats only tell you how trained the blocks are.
- **Confounds are real.** Opponent quality, surface, altitude, and small samples all distort. The tag layer exists precisely so you can hold conditions roughly constant before comparing.
- **Exclude or down-weight** retirements, tanked dead rubbers, and severe-weather matches.
- **Sample size.** Robustness needs enough matches *per condition* to be meaningful — a block isn't "fragile on clay" off one bad clay match.
- **Triangulate before concluding.** One stat moving is noise; the cluster of stats that share a block moving together is signal.

-----

## 5. Cleanest Summary

- The capture unit is the **tagged match**, not the stat — captured by **self-charting**, not scraping.
- You log **five fields per point** and derive the whole Tier 1 box score plus most of Tier 2; Tier 3 is dropped as unobtainable.
- Stats are a proxy for **block development**, not Parser identity.
- Development = **level that survives hostile conditions**, read across matches.
- Overlay the Parser's accessibility map to read the **gap** — trained native, wasted native, or deliberately built non-native.
- A stat trending up across a season is block development you can actually watch.

-----

*CBI Tennis — Block Development from Match Stats v1.1*
*Developed by J.D. Mercer | Based on the Cognition Blocks Intelligence (CBI) Framework*
*© 2026 Cognition Blocks LLC. All rights reserved.*
