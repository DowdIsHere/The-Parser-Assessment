# Billets Report Master Template
## Parser Profile™ — Seat Analysis Edition
### Version 1.0

**Developed by J.D. Mercer | Cognition Blocks Intelligence Framework**
**© 2026 Cognition Blocks LLC. All rights reserved.**

---

## DOCUMENT PURPOSE

This template analyzes the **seat**, not the candidate. It decodes job descriptions to surface the actual architectural requirements of a role, checks hiring team blind spots, and generates Parser-informed interview questions — all without requiring candidates to take any assessment.

**What this tool does:**
1. Extracts architectural requirements from job description text
2. Surfaces mismatches between stated qualifications and actual work demands
3. Generates interview questions that reveal processing style (without assessing)
4. Checks hiring manager and interviewer biases based on their Parsers
5. Provides a credential → architecture decoder

**What this tool does NOT do:**
- Assess candidates
- Score or rank candidates
- Recommend hire/no-hire decisions
- Replace qualification screening
- Require candidates to take any assessment

**Legal/Ethical Foundation:** This is a seat-definition and interviewer-calibration tool. The candidate is never assessed. The hiring team assesses themselves.

---

## REQUIRED INPUTS

```
SEAT INFORMATION:
{{JOB_TITLE}}
{{JOB_DESCRIPTION_TEXT}} — Full text of the job description
{{DEPARTMENT}}
{{REPORTS_TO}}
{{ORGANIZATION}}

HIRING TEAM (each takes the Parser):
{{HIRING_MANAGER_NAME}}
{{HIRING_MANAGER_PROFILE}}
{{HIRING_MANAGER_COORDINATES}}

{{INTERVIEWER_1_NAME}}
{{INTERVIEWER_1_PROFILE}}
{{INTERVIEWER_1_COORDINATES}}

{{INTERVIEWER_2_NAME}} — Optional
{{INTERVIEWER_2_PROFILE}}
{{INTERVIEWER_2_COORDINATES}}

[Additional interviewers as needed]
```

---

## BEGIN TEMPLATE

---

# Parser Profile™
## Seat Analysis — {{JOB_TITLE}}

**Organization:** {{ORGANIZATION}}
**Department:** {{DEPARTMENT}}
**Reports To:** {{REPORTS_TO}}
**Analysis Date:** {{DATE}}

Developed by J.D. Mercer | © 2026 Cognition Blocks LLC

---

# PART 1: SEAT DECODER
## What This Role Actually Requires

*This section extracts the architectural requirements hidden in the job description. Credentials are proxies. This is what the seat actually demands.*

---

## 1.1 Job Description Analysis

**Raw JD Text Analyzed:**
{{JD_TEXT_EXCERPT}}

---

## 1.2 Extracted Architectural Requirements

### Spatial Requirement (Concrete ↔ Abstract)

**JD Language Detected:**
{{SPATIAL_JD_LANGUAGE}}

<!--
Extract phrases from JD that indicate Spatial requirements:

CONCRETE indicators:
- "Detail-oriented," "meticulous," "hands-on"
- "Implementation," "execution," "operational"
- "Specific deliverables," "measurable outcomes"
- "Day-to-day management," "tactical"

ABSTRACT indicators:
- "Strategic thinking," "big-picture," "visionary"
- "Conceptual," "framework development," "systems thinking"
- "Innovation," "thought leadership," "pattern recognition"
- "Long-range planning," "architectural"

BALANCED indicators:
- Mix of both, or
- "Translate strategy to execution," "bridge concept and implementation"
-->

**Architectural Translation:**
{{SPATIAL_REQUIREMENT}}

<!--
Output format:
"This seat requires [Concrete / Abstract / Balanced] processing.

The work involves [specific examples from JD]. This demands [explanation of why this requires the identified Spatial orientation].

Confidence: [High / Medium / Low] — [reason for confidence level]"
-->

---

### Temporal Requirement (Past ↔ Future)

**JD Language Detected:**
{{TEMPORAL_JD_LANGUAGE}}

<!--
PAST indicators:
- "Experience with," "proven track record," "demonstrated history"
- "Compliance," "precedent," "institutional knowledge"
- "Quality assurance," "post-mortem," "lessons learned"
- "Maintenance," "preservation," "documentation"

FUTURE indicators:
- "Vision," "roadmap," "growth," "scaling"
- "Innovation," "emerging," "next-generation"
- "Anticipate," "forecast," "trajectory"
- "Build," "launch," "pioneer"

PRESENT indicators:
- "Responsive," "real-time," "immediate"
- "Current state," "ongoing," "day-to-day"
- "Agile," "adaptive," "in-the-moment"
-->

**Architectural Translation:**
{{TEMPORAL_REQUIREMENT}}

---

### Reference Requirement (Self ↔ Other)

**JD Language Detected:**
{{REFERENCE_JD_LANGUAGE}}

<!--
SELF indicators:
- "Independent," "self-directed," "autonomous"
- "Individual contributor," "self-starter"
- "Personal accountability," "ownership"
- "Expert," "specialist," "deep expertise"

OTHER indicators:
- "Collaborative," "team player," "cross-functional"
- "Stakeholder management," "client-facing," "relationship building"
- "Consensus building," "influence without authority"
- "Servant leadership," "team development"

BALANCED indicators:
- "Both independent and collaborative"
- "Lead and contribute"
-->

**Architectural Translation:**
{{REFERENCE_REQUIREMENT}}

---

## 1.3 Composite Seat Profile

**This seat requires:** {{SEAT_PROFILE_SUMMARY}}

<!--
Example:
"This seat requires Abstract-Future-Other processing.

The role demands strategic thinking (Abstract), forward planning and growth orientation (Future), and heavy stakeholder and team coordination (Other).

Ideal Parser range: Abstract-leaning to Abstract, Future-leaning to Future, Other-leaning to Other.

Note: This is the seat's demand, not a candidate filter. Candidates outside this range can succeed with awareness and support."
-->

---

## 1.4 Requirement Confidence Assessment

| Dimension | Extracted Requirement | Confidence | Notes |
|-----------|----------------------|------------|-------|
| Spatial | {{SPATIAL_REQ}} | {{SPATIAL_CONF}} | {{SPATIAL_NOTES}} |
| Temporal | {{TEMPORAL_REQ}} | {{TEMPORAL_CONF}} | {{TEMPORAL_NOTES}} |
| Reference | {{REFERENCE_REQ}} | {{REFERENCE_CONF}} | {{REFERENCE_NOTES}} |

**Overall Clarity:** {{OVERALL_CLARITY}}

<!--
If confidence is low on any dimension, note:
"The JD is ambiguous about [dimension]. Recommend clarifying with the hiring manager: Does this role actually require [X] or [Y]?"
-->

---

# PART 2: JD MISMATCH ANALYSIS
## Where the Job Description Doesn't Match the Work

*Job descriptions are often copy-pasted, outdated, or written by people who don't do the work. This section surfaces conflicts between what the JD says and what the seat actually needs.*

---

## 2.1 Detected Mismatches

{{MISMATCH_ANALYSIS}}

<!--
For each detected mismatch:

**Mismatch: [Title]**

JD says: "[Quote from JD]"
Work actually requires: [Architectural reality]
The conflict: [Explanation]
Risk: [What happens if you hire to the JD instead of the work]
Recommendation: [Clarify / revise JD / adjust expectations]

Example:
**Mismatch: Strategy vs. Execution**

JD says: "Detail-oriented with strong attention to accuracy"
Work actually requires: Strategic planning and long-range vision (based on "develop 5-year roadmap" later in JD)
The conflict: The JD asks for Concrete processing in the requirements but Abstract processing in the responsibilities.
Risk: You'll screen for detail-orientation and hire someone who struggles with the actual strategic work.
Recommendation: Clarify which is primary. If strategic, remove "detail-oriented" from requirements or specify it as secondary.
-->

---

## 2.2 Hidden Requirements

{{HIDDEN_REQUIREMENTS}}

<!--
Requirements not stated in the JD but implied by the work:

Example:
"**Hidden Requirement: Future Orientation**

Not stated, but the role involves 'building a new function from scratch.' This requires someone who's energized by possibility and comfortable with ambiguity — Future-oriented processing. A Past-oriented hire will struggle with the lack of precedent and established process.

Recommend adding to JD: 'Comfortable building in ambiguous environments' or 'Energized by greenfield opportunities.'"
-->

---

## 2.3 Credential vs. Architecture Analysis

{{CREDENTIAL_ANALYSIS}}

<!--
For each major credential requirement, decode the architectural assumption:

| Credential Required | Assumed Architecture | Actually Necessary? |
|---------------------|---------------------|---------------------|
| "MBA required" | Abstract processing, strategic thinking | Maybe — or maybe just credentialism. Does the work require this? |
| "10+ years experience" | Past-orientation, precedent-based judgment | Depends — is the role about applying experience or building new? |
| "CPA/CFA/etc." | Concrete, detail-oriented, compliance-focused | Usually yes — these credentials do map to the architecture |

Flag credentials that may be filtering for the wrong architecture.
-->

---

# PART 3: HIRING TEAM BLIND SPOT CHECK
## How Your Parser Shapes What You See in Candidates

*The hiring team has taken the Parser. This section shows how their architecture may bias their evaluation.*

---

## 3.1 Hiring Manager Analysis

**{{HIRING_MANAGER_NAME}}** — {{HIRING_MANAGER_PROFILE}} ({{HIRING_MANAGER_COORDINATES}})

### What You Naturally Value

{{HM_NATURAL_VALUE}}

<!--
Based on the hiring manager's coordinates, what will they instinctively see as "good":

Example for Abstract-Future-Self manager:
"You naturally value:
- Big-picture thinking (you'll light up when candidates speak in patterns)
- Forward orientation (candidates who talk about where things are going will resonate)
- Independent judgment (candidates who have their own point of view will impress you)

These are real strengths. But they're YOUR strengths. They may or may not be what the seat needs."
-->

### What You Might Miss

{{HM_BLIND_SPOT}}

<!--
Example for Abstract-Future-Self manager:
"You might miss:
- The candidate who's great at execution but doesn't 'think big' in interviews (Concrete strength)
- The candidate who references precedent and experience rather than possibility (Past strength)
- The candidate who talks about team impact rather than personal vision (Other strength)

These candidates may feel 'flat' to you. That's your architecture talking, not their capability."
-->

### Seat Alignment Check

{{HM_SEAT_ALIGNMENT}}

<!--
Compare hiring manager's architecture to the seat's requirements:

"The seat requires: Abstract-Future-Other
You are: Abstract-Future-Self

Alignment: Strong on Spatial and Temporal. You'll accurately assess whether candidates can do the strategic, forward-looking work.

Gap: The seat requires Other-orientation (stakeholder management, team coordination). You're Self-oriented. You may undervalue candidates who lead with relational language and overvalue candidates who lead with personal vision.

Compensation: Deliberately listen for how candidates talk about teams and stakeholders. Ask yourself: 'Am I dismissing this person because they're Other-oriented, or because they're actually weak?'"
-->

---

## 3.2 Interviewer Analysis

### {{INTERVIEWER_1_NAME}} — {{INTERVIEWER_1_PROFILE}}

**What they'll naturally probe for:**
{{INT1_NATURAL_PROBE}}

**What they might miss:**
{{INT1_BLIND_SPOT}}

**Best used for assessing:**
{{INT1_BEST_USE}}

<!--
Match interviewer strengths to assessment needs:

Example for Concrete-Past-Balanced interviewer:
"Best used for assessing:
- Execution capability and follow-through
- Experience depth and lessons learned
- Operational judgment and realistic planning

Don't rely on this interviewer to assess:
- Strategic thinking and big-picture vision
- Innovation and greenfield capability
- Future-orientation and growth mindset

Pair with an Abstract-Future interviewer to cover blind spots."
-->

---

### {{INTERVIEWER_2_NAME}} — {{INTERVIEWER_2_PROFILE}}

**What they'll naturally probe for:**
{{INT2_NATURAL_PROBE}}

**What they might miss:**
{{INT2_BLIND_SPOT}}

**Best used for assessing:**
{{INT2_BEST_USE}}

---

## 3.3 Interview Panel Coverage

{{PANEL_COVERAGE}}

<!--
Analyze whether the interview panel covers all dimensions the seat requires:

"**Panel Coverage Analysis:**

| Seat Requirement | Panel Coverage | Gap? |
|------------------|----------------|------|
| Abstract processing | {{HM}} is Abstract — covered | No |
| Future orientation | {{HM}} is Future — covered | No |
| Other orientation | No interviewers are Other-oriented | YES |

**Gap Alert:** No one on the panel naturally values or probes for Other-orientation, but the seat requires heavy stakeholder management. You may fail to assess this critical requirement.

**Recommendation:** Add an Other-oriented interviewer, OR explicitly assign someone to probe for relational/stakeholder capability with structured questions (provided below)."
-->

---

# PART 4: PARSER-INFORMED INTERVIEW QUESTIONS
## Questions That Surface Processing Style Without Assessing

*These questions are designed to reveal how candidates process — Spatial, Temporal, Reference orientation — through behavioral examples. They do not require the candidate to take any assessment.*

---

## 4.1 Spatial Dimension Questions
### (Concrete ↔ Abstract)

**To surface Concrete processing:**
{{CONCRETE_QUESTIONS}}

<!--
- "Walk me through a project where the details really mattered. What details, specifically?"
- "Tell me about a time you caught something that everyone else missed."
- "How do you typically organize your work when there are many moving parts?"

Listen for: Specific examples, sequential thinking, tangible deliverables, comfort with details
-->

**To surface Abstract processing:**
{{ABSTRACT_QUESTIONS}}

<!--
- "Tell me about a time you saw a pattern that others didn't see."
- "How do you approach problems where there's no clear precedent?"
- "Describe a situation where you had to simplify something complex for others."

Listen for: Pattern language, conceptual framing, systems thinking, comfort with ambiguity
-->

**Balanced probe:**
{{SPATIAL_BALANCED_QUESTION}}

<!--
- "Tell me about a project where you had to move between big-picture strategy and detailed execution. How did you manage both?"

Listen for: Flexibility, awareness of both needs, translation ability
-->

---

## 4.2 Temporal Dimension Questions
### (Past ↔ Future)

**To surface Past processing:**
{{PAST_QUESTIONS}}

<!--
- "Tell me about a lesson you learned early in your career that still guides you."
- "Describe a time you used past experience to avoid a mistake others were about to make."
- "How do you typically onboard yourself into a new role — what do you learn first?"

Listen for: References to experience, precedent, lessons learned, "what worked before"
-->

**To surface Future processing:**
{{FUTURE_QUESTIONS}}

<!--
- "Where do you see this field/industry/function going in the next 5 years?"
- "Tell me about something you built that didn't exist before."
- "How do you approach a situation where there's no playbook?"

Listen for: Possibility language, vision, comfort with uncertainty, forward projection
-->

**Balanced probe:**
{{TEMPORAL_BALANCED_QUESTION}}

<!--
- "Tell me about a time you had to balance honoring what came before with building something new."

Listen for: Integration, respect for both, ability to hold both orientations
-->

---

## 4.3 Reference Dimension Questions
### (Self ↔ Other)

**To surface Self processing:**
{{SELF_QUESTIONS}}

<!--
- "Tell me about a decision you made that wasn't popular but you knew was right."
- "How do you know when you've done good work?"
- "Describe your process for working through a complex problem on your own."

Listen for: Internal compass, independent judgment, self-assessment, conviction
-->

**To surface Other processing:**
{{OTHER_QUESTIONS}}

<!--
- "Tell me about a time you helped a team work better together."
- "How do you typically navigate stakeholders with conflicting interests?"
- "Describe a success that was really a team success. What was your role in enabling others?"

Listen for: Relational awareness, stakeholder thinking, group facilitation, "we" language
-->

**Balanced probe:**
{{REFERENCE_BALANCED_QUESTION}}

<!--
- "Tell me about a time you had to balance doing what you thought was right with what the group wanted."

Listen for: Awareness of tension, navigation ability, neither dominates
-->

---

## 4.4 Seat-Specific Questions

Based on this seat's requirements ({{SEAT_PROFILE_SUMMARY}}), prioritize these questions:

{{SEAT_SPECIFIC_QUESTIONS}}

<!--
Generate 3-5 questions tailored to the specific seat requirements.

Example for Abstract-Future-Other seat:
1. "This role requires building a function that doesn't exist yet while coordinating across multiple stakeholder groups. Tell me about a time you did something similar."
2. "How do you bring people along when you're building toward a vision they can't yet see?"
3. "Describe a time you had to advocate for a strategic direction while maintaining relationships with people who disagreed."

These questions probe all three required dimensions simultaneously.
-->

---

# PART 5: CREDENTIAL → ARCHITECTURE DECODER
## Translation Guide for Common JD Language

*This reference helps hiring teams understand what credentials and common phrases actually imply architecturally.*

---

## 5.1 Common Credential Translations

| Credential / Requirement | Architectural Implication | Notes |
|-------------------------|---------------------------|-------|
| "MBA required" | Abstract processing assumed | May be credentialism; verify the work actually requires it |
| "10+ years experience" | Past-orientation valued | Makes sense for precedent-based roles; may filter out Future-oriented high performers in greenfield roles |
| "Detail-oriented" | Concrete processing required | Legitimate for operational roles; often misused for strategic roles |
| "Strategic thinker" | Abstract processing required | Verify the role is actually strategic, not just labeled that way |
| "Self-starter" | Self-orientation valued | Good for IC roles; may conflict with collaborative requirements |
| "Team player" | Other-orientation required | Often paired with "self-starter" creating contradiction |
| "Entrepreneurial" | Future-Self typically implied | Mismatch if role requires process adherence or team coordination |
| "Proven track record" | Past-orientation; values precedent | May screen out non-traditional candidates with equal capability |
| "Growth mindset" | Future-orientation implied | Verify this is actually needed or just buzzword |
| "Executive presence" | Often Abstract-Other coded | May have bias implications; clarify what it actually means |

---

## 5.2 Red Flag Combinations

{{RED_FLAG_COMBINATIONS}}

<!--
Common contradictions to flag:

**"Detail-oriented strategic thinker"**
Contradiction: Concrete + Abstract requirements. Very few people are both. Clarify which is primary.

**"Self-starter who's a team player"**
Contradiction: Self + Other requirements. Most people lean one direction. Clarify the balance.

**"Innovative with proven track record"**
Contradiction: Future + Past requirements. Innovation doesn't have a track record by definition. Clarify whether you want someone who's done this before (Past) or someone who can do new things (Future).

**"Fast-paced and meticulous"**
Contradiction: Speed often trades against detail. Clarify the priority.
-->

---

## 5.3 Decoder for This Role

Based on the JD analyzed, here's the specific translation:

{{ROLE_SPECIFIC_DECODER}}

<!--
For each major requirement in THIS JD, provide the translation:

| JD Says | Actually Means | Confidence |
|---------|----------------|------------|
| "Drive strategic initiatives" | Abstract-Future processing | High |
| "Manage stakeholder relationships" | Other-orientation | High |
| "Attention to detail" | Concrete processing | Medium — may conflict with strategic requirement |
-->

---

# PART 6: POST-HIRE RECOMMENDATIONS
## If the Hire Has Architectural Gaps

*This section is used after hiring to support onboarding and development if the new hire doesn't perfectly match the seat's architectural requirements.*

---

## 6.1 Gap-Bridging Framework

If the person hired has gaps relative to the seat's requirements:

**Spatial Gap (Hired Concrete for Abstract seat, or vice versa):**
{{SPATIAL_GAP_BRIDGE}}

<!--
Concrete hire in Abstract seat:
- Pair with Abstract partner for strategic work
- Develop pattern-recognition through deliberate exposure
- Frame big-picture in concrete terms during onboarding
- Don't expect them to generate vision; expect them to execute it well

Abstract hire in Concrete seat:
- Build systems and checklists to catch details
- Pair with Concrete partner for operational review
- Frame detail work as serving the larger pattern
- Don't expect them to enjoy the details; expect them to respect the necessity
-->

**Temporal Gap (Hired Past for Future seat, or vice versa):**
{{TEMPORAL_GAP_BRIDGE}}

**Reference Gap (Hired Self for Other seat, or vice versa):**
{{REFERENCE_GAP_BRIDGE}}

---

## 6.2 Manager Adjustment Guide

**For {{HIRING_MANAGER_NAME}} ({{HIRING_MANAGER_PROFILE}})**

If you hire someone architecturally different from you:

{{MANAGER_ADJUSTMENT}}

<!--
Based on hiring manager's Parser, how should they adjust for managing different architectures:

Example for Abstract-Future-Self manager hiring Concrete-Past-Other:
"You will be tempted to:
- Give big-picture direction and expect them to figure it out (they need specifics)
- Focus on where things are going (they need to understand how you got here)
- Assume they're tracking their own progress (they're tracking the team's)

Adjust by:
- Providing concrete examples alongside principles
- Honoring their need for context and history
- Asking about team dynamics, not just individual work"
-->

---

# APPENDIX: LEGAL & ETHICAL GUARDRAILS

## What This Tool Is

- A seat-definition instrument
- An interviewer-calibration tool
- A bias-awareness mechanism
- A communication optimization system

## What This Tool Is NOT

- A candidate screening tool
- A scoring mechanism
- A hire/no-hire recommendation engine
- A replacement for qualification assessment

## Compliance Statement

This tool does not assess candidates. Candidates are not required to take any assessment. All Parser assessment is completed by the hiring team for self-awareness purposes only.

Interview questions provided are behavioral and do not diagnose, score, or assess cognitive architecture. They surface information that interviewers interpret using their own judgment.

Hiring decisions remain with the hiring team. This tool informs; it does not decide.

---

*Parser Profile™ — Seat Analysis Edition*
*Developed by J.D. Mercer | © 2026 Cognition Blocks LLC. All rights reserved.*
*For authorized use only.*

---

## END TEMPLATE

---

# APPENDIX: GENERATION RULES

## A. JD Parsing Logic

### Spatial Indicators

| Keywords/Phrases | Likely Requirement |
|-----------------|-------------------|
| detail, meticulous, precise, accurate, thorough, hands-on, tactical, operational, implementation, execution | Concrete |
| strategic, vision, big-picture, systems, framework, conceptual, architecture, innovation, thought leadership | Abstract |
| translate, bridge, both strategic and tactical | Balanced |

### Temporal Indicators

| Keywords/Phrases | Likely Requirement |
|-----------------|-------------------|
| experience, proven, track record, established, compliance, precedent, lessons, history, maintenance, QA | Past |
| build, launch, pioneer, emerging, growth, scaling, roadmap, vision, anticipate, innovative | Future |
| responsive, agile, real-time, day-to-day, current, ongoing, adaptive | Present/Balanced |

### Reference Indicators

| Keywords/Phrases | Likely Requirement |
|-----------------|-------------------|
| independent, autonomous, self-directed, individual contributor, ownership, expert, specialist | Self |
| collaborative, team, stakeholder, cross-functional, relationship, consensus, influence, client-facing | Other |
| both independent and team, lead and contribute | Balanced |

## B. Confidence Scoring

| Clarity Level | Confidence Score |
|---------------|------------------|
| Multiple clear indicators, no contradictions | High |
| Some indicators, minor contradictions | Medium |
| Few indicators, major contradictions, ambiguous | Low |

## C. Interview Panel Coverage Calculation

For each seat requirement dimension:
- If at least one interviewer matches: Covered
- If hiring manager matches but no interviewer: Partially covered
- If no one matches: Gap

## D. Manager-Candidate Mismatch Severity

| Dimensions Mismatched | Severity |
|----------------------|----------|
| 0-1 | Low — natural rapport likely |
| 2 | Moderate — conscious adjustment needed |
| 3 | High — significant blind spot risk |

---

*Billets Report Master Template v1.0*
*Parser Profile™ — Cognition Blocks Intelligence Framework*
*© 2026 Cognition Blocks LLC. All rights reserved.*
