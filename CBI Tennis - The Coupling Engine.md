# CBI Tennis — The Coupling Engine: Breaking Points, Aggravation & Oscillation

**Version 1.0**

*The third CBI Tennis instrument. The Playbook reads **orientation** (which blocks a player reaches for). The Block-Development instrument reads **development** (how trained those blocks are). This reads **edge** — it finds against-the-market calls by naming the conditional point at which the market's single price flips.*

-----

## Core Thesis

The market price is the **average** — E[outcome]. Edge cannot live where the market is already correct, and the market is correct about *who's better*: that's literally what the price encodes. Edge lives in the **conditional**:

> Under documented condition X, the favorite's known vulnerability fires and the number flips.

The market prices the average; you price the **path-dependency the average hides.** That conditional is mechanism-level, falsifiable, and structurally impossible to express in a single price — which is exactly why it's an edge.

-----

## The Engine — Four Coupled Pieces

A read has edge **only when all four are present.** Any one alone is nothing.

1. **Breaking Point** — Player A has a documented, specific failure-mode, physical or mental (a fitness ceiling; a close-out collapse). Sourced from intel or measured from data. **Not invented.**
2. **Aggravation** — Player B's parser naturally delivers the *specific stress* that triggers A's breaking point. A grinder *extends* → triggers a fitness ceiling. A Force/proactive player *clusters under pressure* → triggers a close-out collapse. The collision layer's real job is **not** "who's favored" — it's *"is the stressor present?"*
3. **Conditions as Dose** — Time and Space tags determine whether the environment lets the stress *reach* A's threshold. A fitness ceiling only fires if the match actually goes long: slow surface + best-of-5 = high dose.
4. **The Race (survival-to-delivery)** — B must survive the *reciprocal* stress long enough to deliver the dose. Every read is **two breaking-point systems racing**; edge = A breaks before B does, within what conditions allow. (The Dart asterisk: the right stressor who might break first.)

**Assembled, one line:**

> **Edge = a documented breaking point in A × an opponent B whose parser delivers the matching stressor × conditions (time/space dose) that let it reach A's threshold × B surviving to deliver it (B's time-to-break > A's).** The market never sees the coupling — least of all the race inside it.

**Stop at four.** What's left over — **motivation and injury** — is the *intel noise term*: it widens or narrows confidence, it is not a fifth piece. Don't let the model grow, or it will explain everything and predict nothing.

-----

## The Dose-Response Scale

Conditions don't merely *punish* — punish and break are two zones of **one continuous dose-response curve.** This **extends** the Playbook's amplify/punish language; it does not replace it.

> **amplify → neutral → punish → break**

- **amplify** — the condition *favors* the player (low / negative dose)
- **punish** — sub-threshold degradation: soft, linear, recoverable
- **break** — threshold crossed: decoupling fires, non-linear — **the breaking point**

**Punish is the early-warning band before break** — the leading indicator. Break is the event. The **punish→break boundary is the documented breaking point.**

*Tradeable consequence:* you position *during punish* (degradation visible) before the *break* (decoupling cluster). A binary trigger only fires at the break — too late to price.

-----

## Tiered Tags — by Time and Space

Conditions are **tags, tiered by dose**, on two axes — *because the third axis, Reference, is the opponent (the stressor), not a condition.* The architecture cleaves cleanly:

- **Space + Time = the stage** (how much dose the environment delivers)
- **Reference = the aggravator** (the opponent who delivers it)
- **Breaking point = the threshold**
- **UFE / decoupling cluster = the crossing, made visible**

**SPACE tags** (low ↔ high dose)

| Driver | Low ↔ High |
|---|---|
| Surface speed | grass / fast indoor (short points) ↔ slow clay (long points) |
| Altitude / air | sea level ↔ thin air |
| Roof / wind | indoor controlled ↔ outdoor wind & sun |
| Ball | light, lively ↔ heavy, slow |

**TIME tags** (low ↔ high dose)

| Driver | Low ↔ High |
|---|---|
| Duration | <1 hr ↔ 3 hr+ |
| Stage | early set ↔ deciding set / serving-for-set / tiebreak |
| Format | best-of-3 ↔ best-of-5 |
| Recovery | well-rested ↔ back-to-back / late-night-into-day |

**The rule that makes it work:** **tier is relative to the crack, not absolute.** The tag is not `slow = bad`; it is `(condition × breaking-point) → dose`. A slow surface is *high-tier* for a fitness ceiling (it extends → dose climbs) and *low-tier* for a close-out collapser. Same condition, opposite tier, depending on whose crack you're dosing.

-----

## CBI Oscillation — the Decoupling Signal

The breaking point is a **decoupling event**: the player's blocks stop coordinating. Coupling is not a state — it's a **wave**: 4-0 (coupled) → 4-3 (decoupled) → re-couple or break.

The same oscillation appears in **two frequency bands:**

- **Slow band — the Fade Curve:** decoupling over a match's *duration*. Measured by deciding-set / long-match performance.
- **Fast band — the UFE Cluster:** decoupling *in the moment*.

**Why the unforced error is the clean read:** it's the *unforced* error — by definition the opponent didn't cause it. **Opponent-free, like the serve.** It is the purest readout of the player's own architecture failing to couple, with the opponent's contribution subtracted out. (Unlike "winner," which is an over-determined outcome label tied to no single block.)

**Up- and downstream:**

- **Downstream (live):** a UFE cluster is a *leading indicator* — the break firing in real time. The in-play edge is to **read the wave, not the scoreboard.**
- **Upstream (pre-match):** *where* a player's UFEs cluster — under what stress — **is** the breaking point, mined from data instead of an interview. A live cluster confirms the aggravation is landing.

**Measurement unlock:** the broadcast UFE count is subjective and absent below tour. But the **double fault is a UFE — objective, opponent-free, present in every dataset.** The entire oscillation thesis can be tested on **double-fault clustering** without the noisy hand-scored UFE.

-----

## Measurement Map

| Signal | Proxy | Source |
|---|---|---|
| Slow band / time-to-break | deciding-set win% (50% = neutral); **strength-controlled residual** (decider win% vs. Elo-expected) to isolate clutch from strength *(to build)* | match results |
| Fast band / in-moment decoupling | double-fault clustering; rally-context UFE where charted | box score / Match Charting |
| Conditions (dose) | duration (`minutes`), surface, `best_of`, recovery (from match dates) | match files |

The hand-built **duration conditional** (e.g., Kyrgios's fitness ceiling crossing ~2 hrs) generalizes to the **fade-curve race**: plot both players' fade curves and output *who breaks first* and *the match-length at which the edge flips.*

-----

## Operating Discipline

- **Grade the conditional, not the headline.** A read can be a headline miss and a mechanism hit (the upset's *only* path was pre-named and it occurred). The conditional is the unit of evidence.
- **Mind the denominator.** Log every conditional *before lock* — trigger, flip-side, market price — including the ones that fizzle. Two hits prove nothing; calibration over 30–50 does.
- **CLV is the scoreboard.** Did your price beat the close? Winning individual bets is not edge.
- **Freeze the conditional; don't re-grade live.** The operator panics mid-match; the conditional was sound. Replicate the conditional, not the panic.
- **Intel is the moat — but stats corroborate.** Where a vulnerability is measurable (fade stats, DF clusters), the data finds it at scale; reserve scarce hand-intel for what data can't see (injury, motivation).
- **Don't test "conditions break" via deciding-set selection** — deciders are *selected* for closeness, so that comparison is circular. Tier by **exogenous** tags (surface, format, rest) that don't depend on how the match went.

-----

## One-Paragraph Summary

The market prices an average; the edge is a conditional that names where the average flips. That conditional has four coupled parts: a documented **breaking point** in one player, an opponent whose parser **aggravates** exactly that crack, **conditions** (tiered time/space tags) that dose the stress past the threshold, and a **race** in which the aggressor must survive to deliver the dose before breaking first. Conditions run a four-zone curve — amplify → neutral → punish → break — where punish is the early warning and break is the documented threshold firing. That firing is a **decoupling** event, visible as the fade curve over a match (slow band) and the unforced-error cluster in the moment (fast band) — the unforced error being the clean, opponent-free read, with the double fault as its objective, universally-recorded instance. Graded by the conditional rather than the headline, logged with its denominator, and scored on closing-line value, this is the engine behind the against-the-market reads.

-----

*CBI Tennis — The Coupling Engine v1.0*
*Developed by J.D. Mercer | Based on the Cognition Blocks Intelligence (CBI) Framework*
*© 2026 Cognition Blocks LLC. All rights reserved.*
