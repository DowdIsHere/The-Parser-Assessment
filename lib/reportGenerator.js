// Parser Profile™ — AI Report Generator
// © 2026 Cognition Blocks LLC. All rights reserved.
//
// Loads a markdown report template + the Collision Logic Matrix, computes the
// deterministic architecture (labels, coordinates, per-axis gaps) from each
// person's raw scores, then calls Claude to fill the template into a finished
// report. The template's embedded generation logic (HTML comments) is the
// authoring guide — Claude follows it; we do not do naive variable substitution.

const fs = require('fs');
const path = require('path');

let Anthropic = null;
try { Anthropic = require('@anthropic-ai/sdk'); } catch { /* package not installed yet */ }

const MODEL = 'claude-opus-4-5';
const TEMPLATES_DIR = path.join(__dirname, '..', 'templates');

// The 27 Parser Profiles keyed by `${spatial}-${temporal}-${reference}` buckets.
const PROFILE_NAMES = {
    'concrete-past-self': 'Sharp',
    'concrete-past-balanced': 'Seasoned',
    'concrete-past-other': 'Legacy',
    'concrete-present-self': 'Embodied',
    'concrete-present-balanced': 'Grounded',
    'concrete-present-other': 'Attuned',
    'concrete-future-self': 'Intentional',
    'concrete-future-balanced': 'Resilient',
    'concrete-future-other': 'Reliable',
    'balanced-past-self': 'Integrated',
    'balanced-past-balanced': 'Coherent',
    'balanced-past-other': 'Reconciled',
    'balanced-present-self': 'Centered',
    'balanced-present-balanced': 'Equanimous',
    'balanced-present-other': 'Empathetic',
    'balanced-future-self': 'Actualized',
    'balanced-future-balanced': 'Harmonious',
    'balanced-future-other': 'Collaborative',
    'abstract-past-self': 'Sentimental',
    'abstract-past-balanced': 'Reflective',
    'abstract-past-other': 'Idealized',
    'abstract-present-self': 'Introspective',
    'abstract-present-balanced': 'Mindful',
    'abstract-present-other': 'Intuitive',
    'abstract-future-self': 'Visionary',
    'abstract-future-balanced': 'Foresighted',
    'abstract-future-other': 'Altruistic'
};

// Report type -> template file. Add rows as more report types are wired.
const TEMPLATE_FILES = {
    children: 'children.md',
    social: 'social.md',
    billets: 'billets.md',
    teams: 'teams.md'
};

function spatialBucket(v)   { return v < 33 ? 'concrete' : v > 66 ? 'abstract' : 'balanced'; }
function temporalBucket(v)  { return v < 33 ? 'past'     : v > 66 ? 'future'   : 'present'; }
function referenceBucket(v) { return v < 33 ? 'other'    : v > 66 ? 'self'     : 'balanced'; }

const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);

// Snap a raw 0-100 score to the nearest published position value.
function positionValue(v) {
    const steps = [0, 25, 50, 75, 100];
    return steps.reduce((a, b) => (Math.abs(b - v) < Math.abs(a - v) ? b : a), 0);
}

// Derive the full deterministic architecture for one person from raw scores.
// scores: { spatial, temporal, reference } each 0-100.
function deriveArchitecture(scores) {
    const spatial   = Number(scores?.spatial)   || 0;
    const temporal  = Number(scores?.temporal)  || 0;
    const reference = Number(scores?.reference) || 0;

    const sB = spatialBucket(spatial);
    const tB = temporalBucket(temporal);
    const rB = referenceBucket(reference);

    const profileName = PROFILE_NAMES[`${sB}-${tB}-${rB}`] || 'Equanimous';

    const spatialLabel   = cap(sB);
    const temporalLabel  = cap(tB);
    const referenceLabel = cap(rB);

    return {
        scores: { spatial, temporal, reference },
        positions: {
            spatial: positionValue(spatial),
            temporal: positionValue(temporal),
            reference: positionValue(reference)
        },
        labels: { spatial: spatialLabel, temporal: temporalLabel, reference: referenceLabel },
        profileName,
        coordinates: `${spatialLabel} • ${temporalLabel} • ${referenceLabel}`
    };
}

// Deterministic per-axis gaps between two people (the Collision Logic Matrix inputs).
function computeGaps(a, b) {
    const axis = (k) => {
        const gap = Math.abs(a.scores[k] - b.scores[k]);
        let severity;
        if (gap <= 25) severity = 'match';
        else if (gap <= 50) severity = 'moderate';
        else severity = 'large';
        return { gap, severity, a: a.labels[k], b: b.labels[k] };
    };
    const axes = { spatial: axis('spatial'), temporal: axis('temporal'), reference: axis('reference') };
    const largeCount = Object.values(axes).filter(x => x.severity === 'large').length;
    const dimensionsApart = Object.values(axes).filter(x => x.severity !== 'match').length;
    return { axes, largeCount, dimensionsApart };
}

// Build the deterministic data block that anchors the model to the exact numbers.
function architectureBlock(label, arch) {
    return [
        `${label}:`,
        `  Profile: ${arch.profileName}`,
        `  Coordinates: ${arch.coordinates}`,
        `  Spatial:   ${arch.scores.spatial} (${arch.labels.spatial}), position ${arch.positions.spatial}`,
        `  Temporal:  ${arch.scores.temporal} (${arch.labels.temporal}), position ${arch.positions.temporal}`,
        `  Reference: ${arch.scores.reference} (${arch.labels.reference}), position ${arch.positions.reference}`
    ].join('\n');
}

function gapsBlock(gaps) {
    const lines = ['Deterministic gaps (from the Collision Logic Matrix):'];
    for (const [k, v] of Object.entries(gaps.axes)) {
        lines.push(`  ${cap(k)}: gap ${v.gap} — ${v.severity} (${v.a} vs ${v.b})`);
    }
    lines.push(`  Dimensions apart: ${gaps.dimensionsApart} | Large gaps: ${gaps.largeCount}`);
    return lines.join('\n');
}

function loadTemplate(reportType) {
    const file = TEMPLATE_FILES[reportType];
    if (!file) throw new Error(`Unknown report type: ${reportType}`);
    return fs.readFileSync(path.join(TEMPLATES_DIR, file), 'utf8');
}

function loadCollisionMatrix() {
    return fs.readFileSync(path.join(TEMPLATES_DIR, 'collision-matrix.md'), 'utf8');
}

const SYSTEM_PROMPT = `You are the report-generation engine for the Parser Profile™ system by Cognition Blocks LLC.

You are given a report TEMPLATE (markdown with {{VARIABLES}} and HTML-comment generation instructions), the COLLISION LOGIC MATRIX (the deterministic engine that defines how two architectures interact), and a DATA block with each person's exact scores, labels, coordinates, and pre-computed gaps.

Your job:
- Produce the FINISHED report by following the template's structure and the generation logic in each HTML comment. The HTML comments are instructions to you — never output them.
- Replace every {{VARIABLE}} with generated content grounded in the DATA. Never leave a {{VARIABLE}} in the output.
- Use the exact scores, labels, coordinates, and gap severities from the DATA block. Do not invent or recompute numbers.
- Honor the Collision Logic Matrix when describing how two people's architectures meet (match types, friction, context weighting).
- This is not a clinical, psychological, or developmental assessment — keep that framing where the template calls for it.
- Output only the finished report as clean markdown. No preamble, no explanation, no code fences around the whole thing.`;

// Generate a report.
//   reportType: 'children' | 'social' | 'billets' | 'teams'
//   people: { subject: {name, age?, gender?, scores}, parentA?: {...}, parentB?: {...}, ... }
//   extra: optional freeform notes appended to the prompt
async function generateReport({ reportType, people, extra }) {
    if (!Anthropic) throw new Error('@anthropic-ai/sdk is not installed');
    if (!process.env.ANTHROPIC_API_KEY) throw new Error('ANTHROPIC_API_KEY is not set');

    const template = loadTemplate(reportType);
    const matrix = loadCollisionMatrix();

    // Derive architecture for every supplied person and collect gap computations
    // against the subject where relevant.
    const dataSections = [];
    const derived = {};
    for (const [role, person] of Object.entries(people || {})) {
        if (!person || !person.scores) continue;
        const arch = deriveArchitecture(person.scores);
        derived[role] = { person, arch };
        const meta = [];
        if (person.name) meta.push(`  Name: ${person.name}`);
        if (person.age != null) meta.push(`  Age: ${person.age}`);
        if (person.gender) meta.push(`  Gender/pronouns: ${person.gender}`);
        dataSections.push(architectureBlock(role, arch) + (meta.length ? '\n' + meta.join('\n') : ''));
    }

    // Gaps: subject vs each other party.
    const subject = derived.subject || derived.parentA || Object.values(derived)[0];
    if (subject) {
        for (const [role, d] of Object.entries(derived)) {
            if (d === subject) continue;
            const gaps = computeGaps(subject.arch, d.arch);
            dataSections.push(`Gaps — ${role} relative to subject:\n` + gapsBlock(gaps));
        }
    }

    const userPrompt = [
        '=== COLLISION LOGIC MATRIX (engine) ===',
        matrix,
        '',
        '=== DATA (deterministic — use these exact values) ===',
        dataSections.join('\n\n'),
        extra ? `\nAdditional context:\n${extra}` : '',
        '',
        '=== REPORT TEMPLATE (fill this in) ===',
        template,
        '',
        'Now produce the finished report. Follow the template exactly, replace every {{VARIABLE}}, strip all HTML-comment instructions, and ground every claim in the DATA above.'
    ].join('\n');

    const client = new Anthropic();
    const message = await client.messages.create({
        model: MODEL,
        max_tokens: 16000,
        system: SYSTEM_PROMPT,
        messages: [{ role: 'user', content: userPrompt }]
    });

    const text = (message.content || [])
        .filter(b => b.type === 'text')
        .map(b => b.text)
        .join('');

    return {
        reportType,
        model: MODEL,
        markdown: text,
        architecture: Object.fromEntries(Object.entries(derived).map(([r, d]) => [r, d.arch]))
    };
}

module.exports = {
    deriveArchitecture,
    computeGaps,
    generateReport,
    PROFILE_NAMES,
    TEMPLATE_FILES
};
