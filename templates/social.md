# Social Report Master Template
## Parser Profile™ — Relationship Analysis, Social Edition
### Version 1.0

**Developed by J.D. Mercer | Cognition Blocks Intelligence Framework**
**© 2026 Cognition Blocks LLC. All rights reserved.**

---

## TEMPLATE USAGE INSTRUCTIONS

This template generates a Social Report for any two Parser Profiles in a friendship, roommate, or non-romantic social context. Lighter than Couples — different stakes, different weights.

**Key Differences from Couples:**
- No shared life timeline (less Temporal weight)
- Exit is easier (friendships can fade; marriages require divorce)
- Reference is primary (does the friendship feel mutual?)
- No Parenting, Money, or Intimacy sections
- Focus: Can this friendship sustain? Is it enjoyable for both?

**Required Inputs:**
- Person A: Name, Profile Name, Coordinates, Position Values
- Person B: Name, Profile Name, Coordinates, Position Values
- Context: Friends / Roommates / Colleagues / Activity Partners

**Output:** 2,000–3,500 word relationship analysis

---

## CONTEXT WEIGHTS — SOCIAL EDITION

| Dimension | Weight | Why |
|-----------|--------|-----|
| **Reference** | Highest | Friendships live or die on whether both people feel seen. Imbalance here kills the connection. |
| **Spatial** | Moderate | Affects conversation quality and intellectual compatibility. Can you talk? |
| **Temporal** | Lower | Friends don't share a timeline the way couples do. You can enjoy the present without aligning on future/past. |

---

## VARIABLE DEFINITIONS

```
{{A_NAME}}
{{A_PROFILE}}
{{A_COORDINATES}}
{{A_SPATIAL_LABEL}}
{{A_TEMPORAL_LABEL}}
{{A_REFERENCE_LABEL}}

{{B_NAME}}
{{B_PROFILE}}
{{B_COORDINATES}}
{{B_SPATIAL_LABEL}}
{{B_TEMPORAL_LABEL}}
{{B_REFERENCE_LABEL}}

{{SPATIAL_GAP}}
{{TEMPORAL_GAP}}
{{REFERENCE_GAP}}

{{CONTEXT}} — Friends / Roommates / Colleagues / Activity Partners
```

---

## BEGIN TEMPLATE

---

# Parser Profile™
## Relationship Analysis — Social Edition

# {{A_NAME}} × {{B_NAME}}
### {{A_PROFILE}} × {{B_PROFILE}}

**Context:** {{CONTEXT}}

Developed by J.D. Mercer | © 2026 Cognition Blocks LLC

---

## What This Report Is For

This isn't a compatibility score. Friendships aren't pass/fail. This report names what's actually happening between you — where connection is easy, where friction lives, and what each of you might be experiencing that the other doesn't see.

Friendships are different from romantic partnerships. You didn't sign up to build a life together. You're here because something works — a shared interest, a history, a way of being together that feels good. The question isn't "can we make it work?" It's "what's actually happening, and does knowing it make the friendship better?"

---

## The Shape of the Two of You

{{SHAPE_OVERVIEW}}

<!--
SHAPE_OVERVIEW GENERATION LOGIC:

2-3 paragraphs covering:
1. What you share (matches)
2. Where you differ (gaps)
3. The overall pattern

For Social context, lead with Reference (the primary dimension for friendships), then Spatial, then Temporal.

Example:
"You're both [Reference description] — which means [what this creates in friendship]. That's the foundation.

Where you differ is [primary gap] — [what this looks like in practice].

[If applicable: secondary gap description]

The short version: [summary of the dynamic]."
-->

---

## Where Connection Is Easy

{{CONNECTION_EASY}}

<!--
CONNECTION_EASY GENERATION LOGIC:

For each match or near-match, describe:
1. What it creates between you
2. Why this makes the friendship feel good
3. What you probably take for granted

Examples by dimension match:

REFERENCE match:
- Both Self: "You both process internally. Neither of you needs constant contact. Silence isn't distance — it's comfort. You can pick up where you left off."
- Both Other: "You both track each other. The friendship feels reciprocal because you're both paying attention to how the other person is doing."
- Both Balanced: "Neither of you is pulling hard toward self or other. The friendship has natural equilibrium."

SPATIAL match:
- Both Abstract: "You can talk ideas for hours. The conversation goes deep and wide. You don't have to explain why a concept matters — the other person already cares."
- Both Concrete: "You connect through doing, not just talking. Shared activities, real experiences, tangible things — that's where the friendship lives."

TEMPORAL match:
- Both Future: "You're both looking ahead. Planning, imagining, building toward something — you get each other's forward orientation."
- Both Past: "You both value history. The friendship has depth because neither of you discards what came before."
-->

---

## Where Friction Lives

{{FRICTION_SECTION}}

<!--
FRICTION_SECTION GENERATION LOGIC:

For each gap, describe:
1. What the gap looks like in practice
2. What each person experiences
3. The misread that can happen
4. Why it's not personal

Social friction is different from couples friction — the stakes are lower, so the friction is often quieter. It shows up as:
- Conversations that don't quite land
- One person feeling unseen
- Different expectations about contact/presence
- Not being sure if the other person enjoyed themselves

Examples by gap:

REFERENCE gap (most important in friendships):
- Self vs. Other: "{{A_NAME}} checks in on {{B_NAME}} frequently; {{B_NAME}} doesn't reciprocate at the same rate — not because they don't care, but because they process internally. {{A_NAME}} might feel like the friendship is one-sided. It's not. It's architectural."

SPATIAL gap:
- Abstract vs. Concrete: "{{A_NAME}} wants to talk about ideas; {{B_NAME}} wants to do things. Neither is wrong, but if every hangout is one mode, someone's not getting fed."

TEMPORAL gap:
- Future vs. Past: "{{A_NAME}} is always planning the next thing; {{B_NAME}} is still savoring what happened. Neither is refusing to be present — they're just anchored in different directions."
-->

---

## What You Each Might Be Missing

**What {{A_NAME}} might not see:**

{{A_BLIND_SPOT}}

<!--
Based on A's coordinates, what might A be missing about B's experience?
Example for Self-oriented A with Other-oriented B:
"{{B_NAME}} is tracking you more than you realize. They notice when you're off fully, when you're distracted, when something's wrong. They're paying attention. If you're not reciprocating that attention, they may feel like they care more than you do — even if that's not true."
-->

**What {{B_NAME}} might not see:**

{{B_BLIND_SPOT}}

<!--
Same structure, reversed.
-->

---

## The Friendship at Its Best

{{FRIENDSHIP_BEST}}

<!--
Describe what this friendship looks like when both people are operating well:
- What do you bring to each other?
- What does the friendship provide that others don't?
- What's the unique value of this pairing?

Example:
"At its best, this friendship is [description]. {{A_NAME}} brings [gift]; {{B_NAME}} brings [gift]. Together, you have access to [what the combination provides].

Most friendships default to similarity. This one has [match/gap pattern], which means [what that creates]. That's rarer than it looks."
-->

---

## The Friendship Under Strain

{{FRIENDSHIP_STRAIN}}

<!--
Describe what happens when the friendship is stressed:
- What's the first thing to go?
- What does each person withdraw or over-extend?
- What's the warning sign that repair is needed?

Example:
"Under strain, {{A_NAME}} tends to [behavior based on coordinates] — which {{B_NAME}} might read as [misread]. {{B_NAME}} tends to [behavior] — which {{A_NAME}} might read as [misread].

The warning sign: [specific observable indicator].

The repair: [what brings it back]."
-->

---

## If You're Roommates

<!--
CONDITIONAL SECTION: Include only if Context = Roommates
-->

{{ROOMMATE_SECTION}}

<!--
Roommate-specific friction points:
- Shared space management
- Communication about issues
- Different social/alone time needs
- Different cleanliness/organization standards as they map to coordinates

Example for Reference gap:
"{{A_NAME}} (Other-oriented) will likely notice and address shared-space issues first. {{B_NAME}} (Self-oriented) may not register them until directly asked — not because they don't care, but because their attention is pointed inward. The fix isn't 'be more considerate.' It's explicit agreements about what matters to each of you, checked against regularly."

Example for Spatial gap:
"{{A_NAME}} (Abstract) may not notice the physical state of the space until it's extreme. {{B_NAME}} (Concrete) may be bothered by things {{A_NAME}} genuinely doesn't see. Name it as architecture, not character."
-->

---

## If You're Colleagues

<!--
CONDITIONAL SECTION: Include only if Context = Colleagues
-->

{{COLLEAGUE_SECTION}}

<!--
Colleague-specific considerations:
- Working styles
- Communication preferences
- Meeting behavior
- How each processes feedback
- Where collaboration is easy/hard

Example:
"In meetings, {{A_NAME}} (Abstract-Future) will want to discuss where things are heading; {{B_NAME}} (Concrete-Past) will want to discuss what's already happened and what specifically needs to be done. Both are necessary. The friction isn't disagreement — it's different processing speeds on different inputs. Let each person lead in their domain."
-->

---

## What Would Help

**For {{A_NAME}}:**

{{A_SUGGESTIONS}}

<!--
2-3 specific, actionable suggestions based on A's coordinates and the gaps.
Format: Brief headline + one sentence of explanation.

Example for Self-oriented A with Other-oriented B:
"Check in without prompting. {{B_NAME}} is tracking you; return the favor occasionally. It doesn't have to be deep — 'how are you actually doing?' goes further than you'd expect."
-->

**For {{B_NAME}}:**

{{B_SUGGESTIONS}}

**For both of you:**

{{JOINT_SUGGESTIONS}}

<!--
What could you do together to make the friendship stronger?
Example:
"Name the dynamic out loud. 'I process externally and you process internally — so if I'm checking in a lot, it's not pressure, and if you're quiet, it's not distance.' Once it's named, it stops being confusing."
-->

---

## The One Thing to Know

> {{ONE_SENTENCE}}

<!--
ONE_SENTENCE GENERATION LOGIC:

For Social reports, the one sentence should capture:
- What the friendship provides
- The main gap to navigate
- A reframe that makes it easier

Examples:
- "You connect through [match], and the only gap worth naming is [primary gap] — which isn't a flaw in either of you, just a different setting."
- "This friendship works because [reason]. The thing to watch is [gap] — not because it's a problem, but because naming it keeps it from becoming one."
-->

---

*Parser Profile™ — Relationship Analysis, Social Edition*
*Developed by J.D. Mercer | © 2026 Cognition Blocks LLC. All rights reserved.*
*For personal use only.*

---

## END TEMPLATE

---

# APPENDIX: SOCIAL-SPECIFIC GENERATION RULES

## A. Section Inclusion by Context

| Context | Sections to Include |
|---------|---------------------|
| Friends | Shape, Connection Easy, Friction, Blind Spots, Best, Strain, Suggestions, One Sentence |
| Roommates | All of above + Roommate Section |
| Colleagues | All of Friends + Colleague Section |
| Activity Partners | Shape, Connection Easy, Friction (abbreviated), Suggestions, One Sentence |

## B. Tone Calibration

Social reports are lighter than Couples:
- Less "this is the work of your life"
- More "here's what's happening and how to enjoy it more"
- No existential stakes
- Permission to let friendships be what they are

## C. Reference Dimension Priority

In Social context, Reference is the primary indicator of friendship health:

| A Reference | B Reference | Friendship Dynamic |
|-------------|-------------|-------------------|
| Self | Self | Low-maintenance. Can go months without contact and pick up easily. Risk: may drift without intentional reconnection. |
| Other | Other | High-engagement. Both tracking each other. Risk: both may over-give and burn out, or create codependency. |
| Self | Other | Imbalanced attention. Other-oriented partner may feel like they care more. Self-oriented partner may feel smothered. Needs naming. |
| Balanced | Any | Flex partner. Can meet the other where they are. |

## D. Spatial Dimension in Conversation

| A Spatial | B Spatial | Conversation Pattern |
|-----------|-----------|---------------------|
| Abstract | Abstract | Deep conceptual talks. May lose track of time. Risk: may never get to practical matters. |
| Concrete | Concrete | Activity-based connection. Shared doing. May not go "deep" in traditional sense but bonds through presence. |
| Abstract | Concrete | Translation needed. Abstract wants to discuss meaning; Concrete wants to discuss specifics. Both valid. |

## E. Temporal Dimension in Social

Temporal matters less in friendships than in couples because:
- Friends don't share a life timeline
- You can enjoy present together without aligning on past/future
- Less "where is this going" pressure

When it does matter:
- Planning activities (Future-oriented wants to plan ahead; Past-oriented wants to reminisce)
- Conversation content (Future talks about what's next; Past talks about what happened)
- Group history (Past-oriented holds the friendship's story; Future-oriented may forget shared memories faster)

## F. Length Guidelines

| Context | Target Length |
|---------|---------------|
| Friends | 2,000–2,500 words |
| Roommates | 2,500–3,000 words |
| Colleagues | 2,500–3,000 words |
| Activity Partners | 1,500–2,000 words |

---

*Social Report Master Template v1.0*
*Parser Profile™ — Cognition Blocks Intelligence Framework*
*© 2026 Cognition Blocks LLC. All rights reserved.*
