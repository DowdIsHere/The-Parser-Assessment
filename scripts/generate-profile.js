#!/usr/bin/env node
// Parser Profile - On-demand profile generator (CLI)
// Usage:
//   node scripts/generate-profile.js <name|code|all|list> [--section <key>] [--format json|text|md] [--out <file>]
// Examples:
//   node scripts/generate-profile.js actualized
//   node scripts/generate-profile.js actualized --format text
//   node scripts/generate-profile.js visionary --section phrase
//   node scripts/generate-profile.js "Concrete * Past * Self"   (use * or • or |)
//   node scripts/generate-profile.js all --out all-profiles.json
//   node scripts/generate-profile.js list

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');

const PROFILES = [
  'actualized', 'altruistic', 'attuned', 'centered', 'coherent',
  'collaborative', 'embodied', 'empathetic', 'equanimous', 'foresighted',
  'grounded', 'harmonious', 'idealized', 'integrated', 'intentional',
  'introspective', 'intuitive', 'legacy', 'mindful', 'reconciled',
  'reflective', 'reliable', 'resilient', 'seasoned', 'sentimental',
  'sharp', 'visionary',
];

function loadProfile(name) {
  const file = path.join(ROOT, `${name}.js`);
  if (!fs.existsSync(file)) throw new Error(`Profile file not found: ${file}`);
  const src = fs.readFileSync(file, 'utf8');
  const match = src.match(/export\s+const\s+\w+Profile\s*=\s*(\{[\s\S]*\})\s*;?\s*$/);
  if (!match) throw new Error(`Could not extract profile object from ${name}.js`);
  return eval(`(${match[1]})`);
}

function loadAll() {
  const out = {};
  for (const name of PROFILES) out[name] = loadProfile(name);
  return out;
}

function findByCode(input) {
  // Accept Concrete*Past*Self, Concrete|Past|Self, Concrete • Past • Self, etc.
  const norm = input.replace(/[•|*]/g, '•').replace(/\s+/g, ' ').trim();
  for (const name of PROFILES) {
    const p = loadProfile(name);
    const pCode = p.code.replace(/\s+/g, ' ').trim();
    if (pCode.toLowerCase() === norm.toLowerCase()) return { name, profile: p };
  }
  return null;
}

function renderMarkdown(p) {
  const lines = [];
  lines.push(`# ${p.name}`);
  lines.push(`**${p.code}**  `);
  if (p.tagline) lines.push(`_${p.tagline}_`);
  lines.push('');

  const textSections = [
    ['Overview', 'overview'],
    ['How You Learn', 'howYouLearn'],
    ['How You Communicate', 'howYouCommunicate'],
    ['The Phrase That Hits Home', 'phrase'],
    ['Secret', 'secret'],
    ['What Others Get Wrong', 'whatOthersGetWrong'],
    ['Hidden Superpower', 'hiddenSuperpower'],
    ['Blind Spot', 'blindSpot'],
    ['Friction Patterns', 'frictionPatterns'],
    ['Energy Patterns', 'energyPatterns'],
    ['Work Environments', 'workEnvironments'],
    ['Block Indicators', 'blockIndicators'],
  ];
  for (const [heading, key] of textSections) {
    if (typeof p[key] === 'string' && p[key].length) {
      lines.push(`## ${heading}`);
      lines.push(p[key]);
      lines.push('');
    }
  }

  if (Array.isArray(p.strengths) && p.strengths.length) {
    lines.push('## Strengths');
    for (const s of p.strengths) {
      lines.push(`- **${s.title}** — ${s.description}`);
    }
    lines.push('');
  }
  if (Array.isArray(p.challenges) && p.challenges.length) {
    lines.push('## Challenges');
    for (const c of p.challenges) {
      lines.push(`- **${c.title}**`);
      if (c.challenge) lines.push(`  - Challenge: ${c.challenge}`);
      if (c.remedy)    lines.push(`  - Remedy: ${c.remedy}`);
    }
    lines.push('');
  }
  return lines.join('\n');
}

function renderText(p) {
  const lines = [];
  const bar = '='.repeat(60);
  lines.push(bar);
  lines.push(p.name);
  lines.push(p.code);
  if (p.tagline) lines.push(p.tagline);
  lines.push(bar);
  lines.push('');

  const sections = [
    ['OVERVIEW', 'overview'],
    ['HOW YOU LEARN', 'howYouLearn'],
    ['HOW YOU COMMUNICATE', 'howYouCommunicate'],
    ['PHRASE', 'phrase'],
    ['SECRET', 'secret'],
    ['WHAT OTHERS GET WRONG', 'whatOthersGetWrong'],
    ['HIDDEN SUPERPOWER', 'hiddenSuperpower'],
    ['BLIND SPOT', 'blindSpot'],
    ['FRICTION PATTERNS', 'frictionPatterns'],
    ['ENERGY PATTERNS', 'energyPatterns'],
    ['WORK ENVIRONMENTS', 'workEnvironments'],
    ['BLOCK INDICATORS', 'blockIndicators'],
  ];
  for (const [heading, key] of sections) {
    if (typeof p[key] === 'string' && p[key].length) {
      lines.push(`-- ${heading} --`);
      lines.push(p[key]);
      lines.push('');
    }
  }
  if (Array.isArray(p.strengths) && p.strengths.length) {
    lines.push('-- STRENGTHS --');
    for (const s of p.strengths) {
      lines.push(`* ${s.title}`);
      lines.push(`  ${s.description}`);
    }
    lines.push('');
  }
  if (Array.isArray(p.challenges) && p.challenges.length) {
    lines.push('-- CHALLENGES --');
    for (const c of p.challenges) {
      lines.push(`* ${c.title}`);
      if (c.challenge) lines.push(`  Challenge: ${c.challenge}`);
      if (c.remedy)    lines.push(`  Remedy:    ${c.remedy}`);
    }
    lines.push('');
  }
  return lines.join('\n');
}

function parseFlags(argv) {
  const out = { positional: [], section: null, format: 'json', outFile: null };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--section') out.section = argv[++i];
    else if (a === '--format') out.format = argv[++i];
    else if (a === '--out' || a === '-o') out.outFile = argv[++i];
    else if (a === '-h' || a === '--help') out.help = true;
    else out.positional.push(a);
  }
  return out;
}

function usage() {
  process.stderr.write(
`Parser Profile - on-demand generator

Usage:
  node scripts/generate-profile.js <name|code|all|list> [options]

Targets:
  <name>     One of the 27 profile names (e.g. actualized, visionary, sharp)
  <code>     Quoted profile code, e.g. "Concrete * Past * Self"
             Separators accepted: * | bullet (•)
  all        Dump all 27 profiles as a single JSON object
  list       Print the 27 profile names, one per line

Options:
  --section <key>   Print only one field (e.g. phrase, overview, strengths)
  --format <fmt>    json (default), text, md
  --out <file>      Write output to file instead of stdout
  -h, --help        Show this help

Examples:
  node scripts/generate-profile.js list
  node scripts/generate-profile.js actualized
  node scripts/generate-profile.js actualized --format text
  node scripts/generate-profile.js visionary --section phrase
  node scripts/generate-profile.js "Concrete * Past * Self"
  node scripts/generate-profile.js all --out all-profiles.json

Available profiles:
  ${PROFILES.join(', ')}
`);
}

function emit(data, format, outFile) {
  let text;
  if (format === 'json') {
    text = typeof data === 'string' ? JSON.stringify(data) : JSON.stringify(data, null, 2);
  } else if (format === 'text') {
    text = typeof data === 'string' ? data : renderText(data);
  } else if (format === 'md' || format === 'markdown') {
    text = typeof data === 'string' ? data : renderMarkdown(data);
  } else {
    throw new Error(`Unknown format: ${format} (use json, text, or md)`);
  }
  if (outFile) {
    fs.writeFileSync(outFile, text + (text.endsWith('\n') ? '' : '\n'));
    process.stderr.write(`Wrote ${outFile}\n`);
  } else {
    process.stdout.write(text + (text.endsWith('\n') ? '' : '\n'));
  }
}

function main() {
  const flags = parseFlags(process.argv.slice(2));
  if (flags.help || flags.positional.length === 0) {
    usage();
    process.exit(flags.help ? 0 : 1);
  }

  const target = flags.positional.join(' ');
  const lower = target.toLowerCase();

  if (lower === 'list') {
    process.stdout.write(PROFILES.join('\n') + '\n');
    return;
  }

  if (lower === 'all') {
    const all = loadAll();
    if (flags.section) {
      const sliced = {};
      for (const [name, p] of Object.entries(all)) sliced[name] = p[flags.section];
      emit(sliced, flags.format, flags.outFile);
    } else {
      emit(all, flags.format, flags.outFile);
    }
    return;
  }

  let profile = null;
  let resolvedName = null;
  if (PROFILES.includes(lower)) {
    resolvedName = lower;
    profile = loadProfile(lower);
  } else if (target.includes('•') || target.includes('*') || target.includes('|')) {
    const found = findByCode(target);
    if (found) { resolvedName = found.name; profile = found.profile; }
  }

  if (!profile) {
    process.stderr.write(`Unknown profile: "${target}"\n`);
    process.stderr.write(`Try "list" to see all 27 names, or pass a code like "Concrete * Past * Self".\n`);
    process.exit(1);
  }

  if (flags.section) {
    if (!(flags.section in profile)) {
      process.stderr.write(`Section "${flags.section}" not in ${resolvedName} profile.\n`);
      process.stderr.write(`Available: ${Object.keys(profile).join(', ')}\n`);
      process.exit(1);
    }
    emit(profile[flags.section], flags.format, flags.outFile);
  } else {
    emit(profile, flags.format, flags.outFile);
  }
}

main();
