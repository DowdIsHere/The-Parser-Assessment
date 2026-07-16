# Teams Report Master Template
## Parser Profile™ — Team Analysis Edition
### Version 1.0

**Developed by J.D. Mercer | Cognition Blocks Intelligence Framework**
**© 2026 Cognition Blocks LLC. All rights reserved.**

---

## DOCUMENT PURPOSE

This template generates a comprehensive Team Analysis from the Parser Profiles of all team members. It is designed to:

1. **Map coverage** — Which architectural positions are represented, which are gaps
2. **Identify collision points** — Where friction will naturally occur between team members
3. **Surface synergy opportunities** — Which pairings should be deployed together
4. **Guide leadership decisions** — Hiring, assignments, development, restructuring

**Structure:**
- **Section A:** Team-Wide Report (Shared with entire team)
- **Section B:** Management Addendum (Lead only, written in lead's Parser register)

**Design Principle:** The team sees the same core data as the lead. Trust is built through transparency. The addendum provides decision support without exposing sensitive personnel recommendations to the full team.

---

## REQUIRED INPUTS

```
TEAM MEMBERS (for each):
{{MEMBER_NAME}}
{{MEMBER_ROLE}}
{{MEMBER_PROFILE}}
{{MEMBER_COORDINATES}}
{{MEMBER_SPATIAL_VALUE}}
{{MEMBER_TEMPORAL_VALUE}}
{{MEMBER_REFERENCE_VALUE}}

TEAM METADATA:
{{TEAM_NAME}}
{{TEAM_SIZE}}
{{TEAM_FUNCTION}} — Engineering / Sales / Operations / Creative / Executive / Cross-functional / etc.
{{ORGANIZATION}} — Company name

LEAD (for Management Addendum):
{{LEAD_NAME}}
{{LEAD_ROLE}}
{{LEAD_PROFILE}}
{{LEAD_COORDINATES}}
{{LEAD_SPATIAL_LABEL}}
{{LEAD_TEMPORAL_LABEL}}
{{LEAD_REFERENCE_LABEL}}
```

---

## SCALING LOGIC

| Team Size | Report Scope |
|-----------|--------------|
| 3-8 (Small) | Full individual collision/synergy mapping |
| 9-15 (Medium) | Cluster analysis + key individual pairings |
| 16-30 (Large) | Cluster/subgroup analysis + aggregate patterns |
| 30+ (Department) | Statistical distribution + subgroup reports |

---

## BEGIN TEMPLATE

---

# Parser Profile™
## Team Analysis — {{TEAM_NAME}}

**Organization:** {{ORGANIZATION}}
**Team Function:** {{TEAM_FUNCTION}}
**Team Size:** {{TEAM_SIZE}}
**Report Date:** {{DATE}}

Developed by J.D. Mercer | © 2026 Cognition Blocks LLC

---

# SECTION A — TEAM-WIDE REPORT
## Shared with All Team Members

*This section is for the entire team. It maps your collective cognitive architecture — where you're strong together, where friction lives, and how to work with (not against) your differences.*

---

## 1. The Team at a Glance

### Team Composition

| Member | Role | Profile | Coordinates |
|--------|------|---------|-------------|
{{TEAM_ROSTER_TABLE}}

<!--
Generate a row for each team member:
| {{MEMBER_NAME}} | {{MEMBER_ROLE}} | {{MEMBER_PROFILE}} | {{MEMBER_COORDINATES}} |
-->

### Dimensional Distribution

**Spatial Dimension (Concrete ↔ Abstract)**
{{SPATIAL_DISTRIBUTION}}
<!--
Visual or text representation:
- X members Concrete-oriented (0-25)
- X members Concrete-leaning (26-49)
- X members Balanced (50)
- X members Abstract-leaning (51-74)
- X members Abstract-oriented (75-100)

Note any heavy clustering or gaps.
-->

**Temporal Dimension (Past ↔ Future)**
{{TEMPORAL_DISTRIBUTION}}

**Reference Dimension (Self ↔ Other)**
{{REFERENCE_DISTRIBUTION}}

---

## 2. Coverage Map

### What This Team Has

{{COVERAGE_STRENGTHS}}

<!--
Identify which architectural positions are well-represented:

Example:
"This team has strong representation in Abstract-Future processing — multiple members who naturally think in patterns, principles, and possibilities. Strategic thinking and forward planning are architecturally supported.

The team also has solid Other-orientation — people who track impact on stakeholders, clients, and each other. Relational awareness is built in."
-->

### What This Team Is Missing

{{COVERAGE_GAPS}}

<!--
Identify which architectural positions have no or minimal representation:

Example:
"No one on this team occupies the Concrete-Past quadrant. This means:
- Operational history may not be retained
- Detailed post-mortems may be undervalued
- 'What actually happened' may get lost in 'what could happen next'
- Precedent and proven methods may be overlooked

This isn't a flaw in any individual — it's a structural gap in the team's collective architecture."

NOTE: Name the gap AND the consequences. Don't just say "you're missing X."
-->

### Coverage Implications for Team Function

{{COVERAGE_FUNCTION_FIT}}

<!--
Analyze whether the coverage pattern fits the team's function:

Example for an Engineering team heavy on Abstract-Future:
"For an engineering team, Abstract-Future density supports innovation, system design, and long-horizon architecture decisions. However, execution, debugging, and maintenance require Concrete-Present capacity that's underrepresented here. Watch for: brilliant designs that don't get implemented, technical debt from skipping details, frustration with 'boring' operational work."

Example for a Sales team heavy on Concrete-Present-Other:
"For a sales team, Concrete-Present-Other is ideal — reading the room, responding to immediate client needs, tracking relationships. The gap in Abstract-Future means strategic account planning and long-term relationship architecture may need external support or deliberate process."
-->

---

## 3. Collision Points

These are the places where architectural differences will create natural friction. Not because anyone is wrong — because you're processing differently.

### High-Friction Pairings

{{COLLISION_PAIRINGS}}

<!--
For each significant collision pairing on the team:

**{{MEMBER_A}} ({{A_PROFILE}}) × {{MEMBER_B}} ({{B_PROFILE}})**

Primary gap: {{GAP_DIMENSION}}

What happens:
- {{A_NAME}} tends to [behavior based on coordinates]
- {{B_NAME}} tends to [opposite behavior]
- In meetings/projects, this shows up as [specific observable friction]

What each experiences:
- {{A_NAME}} may feel {{B_NAME}} is [misread]
- {{B_NAME}} may feel {{A_NAME}} is [misread]

The reframe: [Both are right within their architecture. The friction is structural, not personal.]

Bridge behavior: [Specific action that helps]
-->

### Collision Patterns (Team-Wide)

{{COLLISION_PATTERNS}}

<!--
Aggregate patterns beyond individual pairings:

Example:
"This team has a Temporal split — roughly half are Future-oriented, half are Past-oriented. This creates a recurring pattern in meetings: one faction wants to discuss where things are heading, the other wants to discuss what led to this point. Both inputs are necessary. The friction isn't disagreement — it's different processing order.

Structural fix: Explicitly sequence discussions. 'First: what's the history here? Then: where does this lead?' Naming the order prevents the collision."
-->

---

## 4. Synergy Opportunities

These are pairings and groupings where architectural differences become complementary strengths.

### High-Synergy Pairings

{{SYNERGY_PAIRINGS}}

<!--
For each synergy pairing:

**{{MEMBER_A}} ({{A_PROFILE}}) + {{MEMBER_B}} ({{B_PROFILE}})**

Why this works:
- {{A_NAME}} brings [architectural strength]
- {{B_NAME}} brings [complementary strength]
- Together: [what the combination provides that neither has alone]

Best deployed for: [types of projects/problems/decisions]

Example:
"**Jordan (Visionary) + Taylor (Seasoned)**

Why this works:
- Jordan sees where things could go — pattern recognition, future projection, big-picture synthesis
- Taylor knows what's been tried — operational history, proven methods, detail retention
- Together: Vision that's grounded in reality. Strategy that accounts for precedent.

Best deployed for: New initiative design, long-range planning, post-mortem analysis"
-->

### Complementary Clusters

{{SYNERGY_CLUSTERS}}

<!--
For larger teams, identify clusters that work well together:

Example:
"The Abstract cluster (Jordan, Alex, Sam) generates strategic options quickly but may not stress-test them. Pairing this cluster with the Concrete cluster (Taylor, Morgan) for review sessions ensures ideas get reality-checked before launch."
-->

---

## 5. Working Agreements

Based on your team's architecture, these practices will reduce friction and increase flow:

### Meeting Practices

{{MEETING_PRACTICES}}

<!--
Generate specific meeting recommendations based on team composition:

Example for Temporal-split team:
"Start meetings with a 2-minute 'context check': What's the relevant history? Then pivot to: Where does this lead? This honors both Past and Future processors without forcing either to abandon their natural mode."

Example for Spatial-split team:
"When presenting ideas, give the principle AND the example. Abstract processors need the 'why'; Concrete processors need the 'what specifically.' Lead with whichever matches the presenter, but always bridge to the other."

Example for Reference-split team:
"Check in on both task AND people. Self-oriented members will track their own work; Other-oriented members will track the team. Explicitly ask: 'Where are we on the work?' AND 'How is everyone doing?' Neither question is optional."
-->

### Communication Norms

{{COMMUNICATION_NORMS}}

<!--
How this team should communicate based on architectural diversity:

Example:
"This team has high Abstract representation. Default communication style will trend conceptual. For the Concrete members: explicitly request examples when you need them. It's not that Abstract communicators are withholding — they genuinely think they've been clear. Say: 'Give me a specific case.'

This team has mixed Reference orientations. Some members will share personal updates unprompted; others won't think to. Build in explicit check-ins rather than assuming silence means 'fine.'"
-->

### Decision-Making

{{DECISION_PRACTICES}}

<!--
How this team should make decisions given its architecture:

Example:
"With strong Future orientation and weak Past orientation, this team is biased toward new solutions over proven ones. Build in a 'precedent check': Before deciding, ask 'Have we or anyone else tried this before? What happened?' This isn't about slowing down — it's about not repeating mistakes."
-->

---

## 6. How to Use This Map

This report is a tool, not a verdict. Architectural differences don't determine success or failure — awareness does.

**Use this map to:**
- Understand why friction happens (and stop taking it personally)
- Deploy pairings deliberately (put complementary strengths together)
- Identify when the team needs external input (to cover gaps)
- Build practices that work *with* your architecture instead of against it

**Don't use this map to:**
- Excuse behavior ("I'm Abstract, I can't do details")
- Limit people ("You're Concrete, you can't do strategy")
- Replace judgment (architecture informs; it doesn't decide)

You are not your coordinates. But your coordinates are real. Name them. Use them. Work with them.

---

*End of Section A — Team-Wide Report*

---

# SECTION B — MANAGEMENT ADDENDUM
## For {{LEAD_NAME}} Only

**Lead Profile:** {{LEAD_PROFILE}} ({{LEAD_COORDINATES}})

*This section is written in your receiving register. It provides decision support for personnel, hiring, and team development. The team has seen Section A; they have not seen this.*

---

## 1. Your Read of This Team

{{LEAD_OVERVIEW}}

<!--
LEAD_OVERVIEW GENERATION LOGIC:

Write 2-3 paragraphs translating the team analysis into the lead's Parser register.

SPATIAL translation:
- If lead is Abstract: Frame in patterns and principles
- If lead is Concrete: Frame in specific examples and observable behaviors

TEMPORAL translation:
- If lead is Future: Frame in trajectory, where this leads, what you're building toward
- If lead is Past: Frame in precedent, what's happened before, what the record shows

REFERENCE translation:
- If lead is Self: Frame in terms of their goals, their performance, what they need
- If lead is Other: Frame in terms of team impact, stakeholder implications, system health

Example for Altruistic lead (Abstract-Future-Other):
"Your team has strong forward momentum — multiple members who see possibilities and think systemically. That's aligned with your own orientation. What you're building toward is architecturally supported.

The gap is in the grounding. No one is naturally holding the operational past — the detailed record of what's been tried, what worked, what's owed. For a team building toward something, this means the foundation may have cracks no one is tracking. The system you're creating for others is running without its memory.

This isn't about adding a 'detail person.' It's about ensuring the people this team serves don't pay the cost of lessons unlearned."
-->

---

## 2. The Vacuum

{{VACUUM_ANALYSIS}}

<!--
VACUUM_ANALYSIS: Name what's missing from the team's architecture AND the consequences, framed in the lead's register.

Structure:
1. What position(s) are unoccupied
2. What function that position serves
3. What happens when it's absent (framed in lead's temporal orientation)
4. Who bears the cost (framed in lead's reference orientation)

Example for Coherent lead (Concrete-Past-Balanced):
"You've seen this before. A team without operational memory eventually repeats its worst mistakes. The specific gap here is Concrete-Past — no one but you is holding the record of what actually happened, what was promised, what was tried.

What happens when you're not in the room: Decisions get made without the context that would change them. Commitments get forgotten. The same problems resurface because no one remembers they've surfaced before.

You're currently the single point of failure for institutional memory. That's not sustainable. The record needs a second carrier — not a backup, but a partner who holds it with you."
-->

---

## 3. Personnel Recommendations

{{PERSONNEL_RECOMMENDATIONS}}

<!--
Specific, actionable recommendations written in lead's register.

Categories:
- HIRING: What Parser positions to prioritize in next hire
- DEVELOPMENT: Which current members could grow into gap coverage
- DEPLOYMENT: How to reassign or pair members for better coverage
- RISK: Personnel risks based on architectural patterns

Example for Future-oriented lead:
"Where this team needs to go:

NEXT HIRE: Prioritize Concrete-Past orientation. Not to slow you down — to give your forward motion something solid to push against. Look for: detail retention, operational memory, 'what happened last time' orientation. In interviews: ask about precedent, not just possibility.

DEVELOPMENT: {{MEMBER_NAME}} shows flexibility on the Spatial dimension. With intentional development, they could bridge your Abstract-Future cluster to the concrete operational layer. The path: pair them with your most detail-oriented current member on a bounded project.

DEPLOYMENT: {{MEMBER_A}} and {{MEMBER_B}} have a Temporal collision that's costing you in planning meetings. They're both strong, but they shouldn't own the same decision. Split ownership by time horizon: {{MEMBER_A}} owns forward strategy, {{MEMBER_B}} owns operational review.

RISK: Your team has no redundancy on Past-orientation. If {{ONLY_PAST_MEMBER}} leaves, your institutional memory walks out the door. Begin knowledge transfer now, not when they give notice."
-->

---

## 4. The Cost of Inaction

{{INACTION_COST}}

<!--
INACTION_COST: What happens if the vacuum isn't addressed, framed entirely in the lead's Parser register.

TEMPORAL framing:
- Future lead: "Where this leads if you don't act..."
- Past lead: "What's happened before when teams had this gap..."
- Balanced: Both framings, sequenced

REFERENCE framing:
- Self lead: "What this costs you personally..."
- Other lead: "What this costs the team/stakeholders/system..."
- Balanced: Both framings

SPATIAL framing:
- Abstract lead: Pattern language, systemic consequences
- Concrete lead: Specific examples, observable outcomes

Example for Visionary lead (Abstract-Future-Self):
"If you don't address the gap:

The pattern you're building toward will outrun its foundation. You'll get further down the road before realizing the ground behind you didn't hold. The ideas will be right; the execution will fail in ways that feel random but aren't — they're the predictable consequence of a system without memory.

For you specifically: You'll take the hit for failures that aren't about your vision. They're about the absence of someone holding what you naturally release. The reputational cost lands on you. The strategic cost is ideas that die in implementation.

This isn't about covering a weakness. It's about building the architecture that lets your strength actually land."

Example for Legacy lead (Concrete-Past-Other):
"You've watched this happen before.

A team without enough forward orientation drifts into maintenance mode. The record is held, but nothing new is built. The people you serve start getting yesterday's solutions to tomorrow's problems.

Specifically: {{EXAMPLE_BEHAVIOR_YOU'VE_SEEN}}. The team that used to lead becomes the team that preserves. That's not what you're here for.

The people who depend on this team — they need what you're building to keep moving. The cost of inaction isn't visible today. It's visible in the gap that opens between where you are and where the field is going."
-->

---

## 5. Your Blind Spot as Lead

{{LEAD_BLIND_SPOT}}

<!--
Direct, constructive feedback to the lead based on their architecture.

Frame as: "Given how you're built, here's what you might not see..."

Example for Abstract-Future-Other lead:
"Given how you're built, here's what you might not see:

You're tracking where this team is going and how it affects everyone. That's your strength. What you may miss:

- The concrete details that are falling through the cracks (your team may be more chaotic operationally than you realize)
- The member who's struggling but not affecting others visibly (your Other-orientation tracks group impact; individual internal struggle may not register)
- The value of what's already working (your Future-orientation scans for what to build next; you may undervalue what's already built)

Your team needs you to sometimes ask: 'What's actually happening right now, specifically?' and 'Who's quietly struggling?' and 'What should we keep doing exactly as we're doing it?'

These questions don't come naturally to you. Build them in."
-->

---

## 6. Decision Framework

When making personnel or structural decisions about this team, use this framework:

### Before Adding Someone
1. What architectural gap does this hire fill?
2. Does this create new collisions? With whom?
3. Is the gap real, or am I hiring in my own image?

### Before Removing Someone
1. What architectural coverage do I lose?
2. Who else can carry that function?
3. Am I removing them because of performance or because of Parser friction with me?

### Before Restructuring
1. Does the new structure account for architectural coverage?
2. Which synergy pairings am I breaking?
3. Which collision pairings am I creating?

### The Override Check
Before any major decision, ask: *Am I seeing this team's needs, or am I seeing my own Parser's preferences?*

Your architecture shapes what you notice. Build in checks for what you miss.

---

## 7. Confidentiality Note

This addendum contains personnel-sensitive analysis. Section A (the Team-Wide Report) has been shared with all team members. This section has not.

If Section A recommendations are not followed and failure occurs, the team has the same data you do — the discrepancy will be visible. The framework is protected by transparency of the core analysis.

This addendum is decision support, not justification. Use it to inform judgment, not to replace it.

---

*End of Section B — Management Addendum*

---

*Parser Profile™ — Team Analysis Edition*
*Developed by J.D. Mercer | © 2026 Cognition Blocks LLC. All rights reserved.*
*For authorized use only.*

---

## END TEMPLATE

---

# APPENDIX: TEAM ANALYSIS GENERATION RULES

## A. Coverage Map Calculation

For each dimension, calculate team distribution:

| Position | Spatial | Temporal | Reference |
|----------|---------|----------|-----------|
| Pole A (0-25) | Concrete | Past | Self |
| Lean A (26-49) | Concrete-lean | Past-lean | Self-lean |
| Balanced (50) | Balanced | Balanced | Balanced |
| Lean B (51-74) | Abstract-lean | Future-lean | Other-lean |
| Pole B (75-100) | Abstract | Future | Other |

**Gap threshold:** If a position has 0 members, it's a gap. If it has 1 member, it's a single-point-of-failure risk.

## B. Collision Identification

Flag pairings where:
- Two members are 50+ points apart on any dimension = High collision
- Two members are 50+ points apart on two dimensions = Critical collision
- Two members are opposite corners (50+ on all three) = Maximum collision

## C. Synergy Identification

Flag pairings where:
- Members are 25-50 points apart (complementary, not colliding)
- Members together cover a gap neither covers alone
- Members have matching Reference (shared "who this is for") with differing Spatial/Temporal (different "how to get there")

## D. Lead Register Translation Rules

| Lead Spatial | Translation Style |
|--------------|-------------------|
| Abstract | Patterns, principles, system-level framing |
| Balanced | Mix of pattern and example |
| Concrete | Specific examples, observable behaviors, "last time this happened" |

| Lead Temporal | Translation Style |
|---------------|-------------------|
| Future | Trajectory, "where this leads," "what you're building toward" |
| Balanced | Both trajectory and precedent |
| Past | Precedent, "what's happened before," "what the record shows" |

| Lead Reference | Translation Style |
|----------------|-------------------|
| Self | Personal impact, "what this means for you," your goals |
| Balanced | Both personal and team impact |
| Other | Team/stakeholder impact, "who this affects," system health |

## E. Scaling Adjustments

| Team Size | Collision Analysis | Synergy Analysis | Coverage Analysis |
|-----------|-------------------|------------------|-------------------|
| 3-8 | All pairings (N×(N-1)/2) | All pairings | Individual-level |
| 9-15 | Top 5 critical + patterns | Top 5 + clusters | Cluster-level |
| 16-30 | Top 10 + cluster patterns | Cluster analysis | Subgroup-level |
| 30+ | Statistical collision risk | Cluster + rotation recommendations | Department-level distribution |

## F. Function-Specific Coverage Benchmarks

| Team Function | Ideal Coverage Pattern |
|---------------|----------------------|
| Engineering | Balanced Spatial (design + implementation), Future-lean Temporal, Mixed Reference |
| Sales | Concrete-lean Spatial, Present Temporal, Other-heavy Reference |
| Operations | Concrete-heavy Spatial, Past-lean Temporal, Balanced Reference |
| Strategy | Abstract-heavy Spatial, Future-heavy Temporal, Balanced Reference |
| HR/People | Balanced Spatial, Balanced Temporal, Other-heavy Reference |
| Creative | Abstract-heavy Spatial, Balanced Temporal, Mixed Reference |
| Executive | Full coverage needed — gaps should be filled by direct reports |

---

*Teams Report Master Template v1.0*
*Parser Profile™ — Cognition Blocks Intelligence Framework*
*© 2026 Cognition Blocks LLC. All rights reserved.*
