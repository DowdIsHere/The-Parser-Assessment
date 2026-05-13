// Cronbach's alpha for the Parser Assessment.
//
// The assessment has 15 items grouped into three 5-item subscales:
//   - spatial   (Concrete <-> Abstract)
//   - temporal  (Past     <-> Future)
//   - reference (Other    <-> Self)
//
// Each item is answered on a 1-5 scale. Items have a poleDirection that
// flips the natural direction; for alpha to be meaningful, all items in a
// subscale must be oriented the same way, so we reverse-score the items
// whose poleDirection points "backwards" relative to the subscale's
// canonical high pole (Abstract / Future / Self).
//
// Usage:
//   node cronbach-alpha.js responses.csv
//
// CSV format: header row of item ids, then one row per respondent.
//   ddcot_spatial,spatial_2,spatial_3,spatial_4,spatial_5,ddcot_temporal,...
//   3,5,2,4,1,3,...
//
// Missing cells (empty or NaN) cause that respondent to be dropped from
// the affected subscale (listwise deletion per scale).
//
// Output: per-subscale alpha, item-total correlations, alpha-if-deleted,
// plus an overall 15-item alpha computed on listwise-complete rows.

import fs from 'fs';
import path from 'path';

const SUBSCALES = {
  spatial: ['ddcot_spatial', 'spatial_2', 'spatial_3', 'spatial_4', 'spatial_5'],
  temporal: ['ddcot_temporal', 'temporal_2', 'temporal_3', 'temporal_4', 'temporal_5'],
  reference: ['ddcot_reference', 'reference_2', 'reference_3', 'reference_4', 'reference_5'],
};

// High-pole direction for each subscale (so all items point the same way
// after orientation). Items declared with the OPPOSITE poleDirection in
// assessment.html must be reverse-scored before computing alpha.
const CANONICAL_DIRECTION = {
  spatial: 'concrete-to-abstract',
  temporal: 'past-to-future',
  reference: 'other-to-self',
};

// Pulled directly from assessment.html question definitions.
const ITEM_POLE_DIRECTION = {
  ddcot_spatial: 'abstract-to-concrete',
  spatial_2: 'abstract-to-concrete',
  spatial_3: 'concrete-to-abstract',
  spatial_4: 'concrete-to-abstract',
  spatial_5: 'concrete-to-abstract',
  ddcot_temporal: 'past-to-future',
  temporal_2: 'future-to-past',
  temporal_3: 'past-to-future',
  temporal_4: 'past-to-future',
  temporal_5: 'future-to-past',
  ddcot_reference: 'self-to-other',
  reference_2: 'self-to-other',
  reference_3: 'other-to-self',
  reference_4: 'other-to-self',
  reference_5: 'self-to-other',
};

const SCALE_MIN = 1;
const SCALE_MAX = 5;

function orientItem(itemId, subscale, raw) {
  if (ITEM_POLE_DIRECTION[itemId] === CANONICAL_DIRECTION[subscale]) return raw;
  return SCALE_MIN + SCALE_MAX - raw;
}

function variance(xs) {
  const n = xs.length;
  if (n < 2) return 0;
  const mean = xs.reduce((a, b) => a + b, 0) / n;
  let ss = 0;
  for (const x of xs) ss += (x - mean) * (x - mean);
  return ss / (n - 1);
}

function pearson(xs, ys) {
  const n = xs.length;
  const mx = xs.reduce((a, b) => a + b, 0) / n;
  const my = ys.reduce((a, b) => a + b, 0) / n;
  let num = 0, dx = 0, dy = 0;
  for (let i = 0; i < n; i++) {
    const a = xs[i] - mx;
    const b = ys[i] - my;
    num += a * b;
    dx += a * a;
    dy += b * b;
  }
  const denom = Math.sqrt(dx * dy);
  return denom === 0 ? 0 : num / denom;
}

// matrix: respondents x items, all numeric, no missing.
function cronbachAlpha(matrix) {
  const n = matrix.length;
  const k = matrix[0].length;
  if (n < 2 || k < 2) return NaN;

  const itemVariances = [];
  for (let j = 0; j < k; j++) {
    const col = matrix.map(row => row[j]);
    itemVariances.push(variance(col));
  }
  const totals = matrix.map(row => row.reduce((a, b) => a + b, 0));
  const totalVar = variance(totals);
  const sumItemVar = itemVariances.reduce((a, b) => a + b, 0);
  return (k / (k - 1)) * (1 - sumItemVar / totalVar);
}

function analyzeSubscale(name, items, rows) {
  const idx = items.map(id => rows.headerIndex[id]);
  if (idx.some(i => i === undefined)) {
    return { name, error: `missing item columns: ${items.filter(id => rows.headerIndex[id] === undefined).join(', ')}` };
  }

  const matrix = [];
  for (const row of rows.data) {
    const oriented = items.map((id, j) => {
      const raw = row[idx[j]];
      if (raw === null || Number.isNaN(raw)) return null;
      return orientItem(id, name, raw);
    });
    if (oriented.every(v => v !== null)) matrix.push(oriented);
  }

  if (matrix.length < 2) {
    return { name, error: `only ${matrix.length} complete respondent(s) for this subscale` };
  }

  const alpha = cronbachAlpha(matrix);

  const itemStats = items.map((id, j) => {
    const col = matrix.map(r => r[j]);
    const restTotals = matrix.map(r => r.reduce((a, b, i) => i === j ? a : a + b, 0));
    const itemTotalCorr = pearson(col, restTotals);
    const reducedMatrix = matrix.map(r => r.filter((_, i) => i !== j));
    const alphaIfDeleted = cronbachAlpha(reducedMatrix);
    return { id, itemTotalCorr, alphaIfDeleted };
  });

  return { name, n: matrix.length, k: items.length, alpha, itemStats };
}

function parseCSV(filepath) {
  const text = fs.readFileSync(filepath, 'utf8').trim();
  const lines = text.split(/\r?\n/);
  const header = lines.shift().split(',').map(s => s.trim());
  const headerIndex = Object.fromEntries(header.map((h, i) => [h, i]));
  const data = lines.map(line => line.split(',').map(s => {
    const t = s.trim();
    if (t === '') return null;
    const n = Number(t);
    return Number.isFinite(n) ? n : NaN;
  }));
  return { header, headerIndex, data };
}

function fmt(x) {
  return Number.isFinite(x) ? x.toFixed(3) : String(x);
}

function printReport(results, overall) {
  console.log('Parser Assessment - Cronbach\'s Alpha');
  console.log('=====================================\n');
  for (const r of results) {
    console.log(`Subscale: ${r.name}`);
    if (r.error) {
      console.log(`  (skipped: ${r.error})\n`);
      continue;
    }
    console.log(`  n = ${r.n}, k = ${r.k}`);
    console.log(`  alpha = ${fmt(r.alpha)}`);
    console.log('  item                     r(item-rest)   alpha-if-deleted');
    for (const s of r.itemStats) {
      console.log(`    ${s.id.padEnd(22)} ${fmt(s.itemTotalCorr).padStart(12)}   ${fmt(s.alphaIfDeleted).padStart(14)}`);
    }
    console.log('');
  }
  if (overall) {
    if (overall.error) {
      console.log(`Overall (15 items): ${overall.error}`);
    } else {
      console.log(`Overall (15 items): n = ${overall.n}, alpha = ${fmt(overall.alpha)}`);
      console.log('(Note: an overall alpha across heterogeneous subscales is only loosely interpretable.)');
    }
  }
}

function main() {
  const file = process.argv[2];
  if (!file) {
    console.error('Usage: node cronbach-alpha.js <responses.csv>');
    console.error('CSV header must include the 15 item ids (see SUBSCALES in this file).');
    process.exit(1);
  }
  const rows = parseCSV(path.resolve(file));

  const results = Object.entries(SUBSCALES).map(([name, items]) => analyzeSubscale(name, items, rows));

  const allItems = Object.values(SUBSCALES).flat();
  const overall = (() => {
    const idx = allItems.map(id => rows.headerIndex[id]);
    if (idx.some(i => i === undefined)) return { error: 'missing item columns' };
    const matrix = [];
    for (const row of rows.data) {
      const oriented = allItems.map((id, j) => {
        const raw = row[idx[j]];
        if (raw === null || Number.isNaN(raw)) return null;
        const sub = Object.keys(SUBSCALES).find(s => SUBSCALES[s].includes(id));
        return orientItem(id, sub, raw);
      });
      if (oriented.every(v => v !== null)) matrix.push(oriented);
    }
    if (matrix.length < 2) return { error: `only ${matrix.length} complete respondent(s)` };
    return { n: matrix.length, alpha: cronbachAlpha(matrix) };
  })();

  printReport(results, overall);
}

main();
