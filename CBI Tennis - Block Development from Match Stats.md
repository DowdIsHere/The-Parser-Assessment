# CBI Tennis — Block Development from Match Stats

**Version 1.2**

*Companion instrument to the "CBI Tennis Parser Behavior Playbook." The playbook reads* **orientation** *(the Parser — which blocks a player reaches for). This document reads* **development** *(how trained those blocks have become) from established public datasets, kept apart from Parser orientation so match stats never get mistaken for Parser identity.*

-----

## Core Principle

Two different things, two different sources:

- **The Parser** (three dimensions) is *orientation* — which CBI blocks become available first. A constant. Read from **behavior**, never from stats.
- **A CBI block** is a *capacity* — a processing engine that can be trained. Capacity shows up in **execution quality**, and the right stats are a proxy for it.

Put simply: **the Parser tells you which blocks a player reaches for; the stats tell you how developed those blocks have become.** The payoff is the **accessibility-vs-development gap** — checking whether native blocks were trained, low-accessibility blocks left wasted, or non-native blocks deliberately built up over a season. The Parser is the constant; the stat trend is the developmental arc made measurable.

> **Note on the eight blocks.** This instrument uses the block set named in the profile/career content: **Sequential Processing, Spatial Relationships, Perceptual Discrimination, Pattern Recognition, Symbolic Manipulation, Self-Reference Processing, Social Signal Processing, Generative Creation.** The framework's clinical reference also names an **Executive** block (control / flexibility); in the profile content that function is carried by **Self-Reference Processing** (regulation under load) and **Generative Creation** (tactical flexibility).

-----

## 1. The Data Source: Established Datasets

We use existing public data — **Jeff Sackmann's `tennis_atp` / `tennis_wta` and the Match Charting Project, plus official ATP/WTA box scores and Grand Slam point-by-point.** No self-charting required.

This is only possible because of the metric decision in Section 2. The thing that *forced* people toward hand-charting was the winner/unforced-error count — subjective, inconsistently scored, often unpublished. Drop that contaminated construct in favor of objective serve metrics, and the established datasets already contain everything the model needs.

**Coverage and its limits, stated honestly:**

- **Match-level totals** (serve %, double faults, break points, points won) — broad coverage, tour main draw, back decades.
- **Point-by-point** (needed for situational splits) — Grand Slams and the Match Charting Project: a large but partial subset, skewed toward well-known players.
- **Below the tour** (juniors, club, developing pros) — little to nothing exists. For an individual uncovered player, self-charting remains the only fallback, but it is no longer the primary method.

-----

## 2. The Lead Metric: Serve Pressure-Delta

### Why the serve

The serve is the **only shot the opponent doesn't touch.** Every other stat is contaminated by who's across the net; the serve is the one moment that is pure Self. That makes serve metrics the **least confounded read of a player's own architecture** — exactly what you want when isolating block development from matchup noise.

### Why "winner" is out

A winner is an *outcome label*, not a block manifestation. The same ball is scored a winner whether it came from **Generative Creation** (manufactured), **Spatial Relationships** (geometry), raw pace, *or* simply because the opponent fed a sitter. Several blocks plus the opponent's contribution collapse into one word — you cannot back out a block from it. Demoted to color, never a metric.

### Why the double fault is in

The **double fault is the only unforced error recorded objectively and unambiguously.** No judgment call, no scorer's opinion, present in every dataset. It is *literally* an unforced error, stripped of the subjectivity that made the broadcast UFE untrustworthy.

### The metric

Two objective, dataset-native stats:

- **Double-fault rate**
- **2nd-serve points won %**

measured as a **pressure-delta** — the value in high-load states minus the baseline:

> **Pressure-delta = (stat under load) − (stat at baseline)**
> *Load states:* break points faced, deciding sets, immediately after losing a set, extended deuce games.

The raw rate is the floor; **the size of the collapse under load is the read.** A small delta = a developed, pressure-proof block. A sharp delta = a block that's present but untrained for load.

**Block tie:** **Sequential Processing** (the grooved motor program) × **Self-Reference Processing** (regulation under load).

*Resolution note:* the full pressure-delta needs point-by-point (Slams + Match Charting Project). A coarse version — deciding-set DF rate vs. overall DF rate — runs on match-level data alone, and is enough to start.

-----

## 3. Predicting the Break

The pressure-delta isn't only a static development score. **Tracked live across a match, its trajectory predicts *when* a block gives — the break window.**

Accumulating load — rising break-point exposure, lengthening service games, momentum running against — drives the delta. When a player's 2nd-serve points won and double-fault behavior cross **their own known collapse threshold**, the breakdown is imminent. That is bounded behavioral prediction in action: not *who wins* (too many confounds), but **when the break lands, inside the controlled space of this match and the controlled time of this load window.**

> A break arriving a few seconds before the call is the model working, not failing — the threshold crossed a hair early. Tighten the window; the thesis holds. The architecture predicts the **signature and the break**, not the scoreline.

-----

## 4. Supporting Stat → Block Map

The serve pressure-delta leads. These triangulate the rest of the blocks:

| Stat | Block(s) it indexes |
|---|---|
| **Double-fault pressure-delta + 2nd-serve points won %** *(lead)* | **Sequential Processing** × **Self-Reference Processing** |
| Break-point conversion / save % | **Self-Reference Processing** (clutch regulation) + **Pattern Recognition** |
| Return points won / reading the serve | **Perceptual Discrimination** + **Pattern Recognition** + **Social Signal Processing** |
| Net / approach points won | **Spatial Relationships** + **Perceptual Discrimination** |
| Points won in 9+ shot rallies | **Self-Reference Processing** (sustained composure) + **Pattern Recognition** |
| Deciding-set / tiebreak record | **Self-Reference Processing** under maximum load |
| Serve placement / point geometry *(where point-by-point exists)* | **Symbolic Manipulation** + **Spatial Relationships** |
| ~~Winner count~~ | *demoted — outcome label, not block-clean* |

A block is well-evidenced when *multiple* stats that index it move together. Triangulate; don't conclude from one.

-----

## 5. From Stats to a Development Read

1. **One match is noise** — confounded by opponent, surface, luck. Read across matches, never from one.
2. **Build a per-block index** — aggregate the stats that index each block (Section 4) across captured matches.
3. **Development = level *and* robustness** — a block is developed when its stats (and small pressure-delta) hold up *as conditions turn hostile*; fragile when they collapse under load. Capture the variance, not just the mean.
4. **Overlay the Parser to read the gap** — pull the profile's native-high / likely-low blocks and compare to what's developed:
   - **High accessibility + high development** → trained native weapon (elite *and* condition-proof).
   - **High accessibility + low development** → wasted architecture (native but never built).
   - **Low accessibility + rising development** → deliberate training — and a stat climbing across a season is the development happening in front of you.

-----

## 6. Is It Predictive? — Yes, on the Side It Can Carry

Known data + CBI is genuinely predictive of **behavioral tendencies, block development, and the break window** — *how* a player's blocks express and *where/when* they give. It is **not** predictive of scorelines (level, surface, draw dominate). Keep the claim there and it's strong; let it drift to "predicts the winner" and it's falsifiable in the bad way.

**It's testable with the established data:**

- Cluster players on objective serve/return signatures (DF pressure-delta, 2nd-serve %, BP save/convert, return-points-won) and see whether profile-shaped groupings fall out.
- The cleaner test: **does the serve pressure-delta track the Self-Reference accessibility the Parser predicts?** If the profiles with high Self-Reference accessibility show the smallest collapse under load, the methodology earns its keep.

-----

## 7. Cautions

- **Stats measure development, not orientation.** Never infer a Parser from these numbers — that re-blurs the conditions-vs-architecture line.
- **Predicts behavior in bounded space and time, not outcomes.** The break window inside a match is fair game; the result is not.
- **Confounds are real** — opponent quality, surface, altitude, small samples. The tag context exists to hold conditions roughly constant before comparing.
- **Exclude or down-weight** retirements, dead rubbers, severe-weather matches.
- **Triangulate before concluding** — one stat moving is noise; the cluster sharing a block moving together is signal.

-----

## 8. Cleanest Summary

- Source: **established public datasets** (Sackmann, Match Charting Project, official box scores) — no self-charting needed.
- **Drop "winner"** (block-arbitrary outcome label); **lead with the double-fault pressure-delta + 2nd-serve points won %** — objective, dataset-native, serve = pure Self.
- The serve is the only opponent-free shot, so it's the cleanest signal of a player's own block development.
- Development = **level that survives hostile conditions**; the pressure-delta *is* that read.
- Tracked live, the pressure-delta predicts **the break window** — bounded behavior in controlled space and time.
- The architecture predicts the **signature and the break, not the scoreline** — and it's testable.

-----

*CBI Tennis — Block Development from Match Stats v1.2*
*Developed by J.D. Mercer | Based on the Cognition Blocks Intelligence (CBI) Framework*
*© 2026 Cognition Blocks LLC. All rights reserved.*
