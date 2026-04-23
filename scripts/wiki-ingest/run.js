#!/usr/bin/env node
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { State } from './lib/state.js';
import { InboxWriter } from './lib/writer.js';
import cargonews from './sources/cargonews.js';
import aircargonews from './sources/aircargonews.js';
import cargopress from './sources/cargopress.js';
import forwarder from './sources/forwarder.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, '..', '..');
const INBOX_DIR = path.join(REPO_ROOT, 'raw', 'inbox');
const STATE_PATH = path.join(__dirname, '.state', 'seen-urls.json');

const DRY_RUN = process.env.DRY_RUN === '1';
const ONLY = process.env.ONLY ? new Set(process.env.ONLY.split(',')) : null;

const SOURCES = [
  { name: 'cargonews', fn: cargonews },
  { name: 'aircargonews', fn: aircargonews },
  { name: 'cargopress', fn: cargopress },
  { name: 'forwarder-jobs', fn: forwarder },
];

function log(msg) {
  process.stdout.write(`${msg}\n`);
}

async function main() {
  log(`wiki-ingest starting (dry-run=${DRY_RUN ? 'yes' : 'no'})`);
  log(`  inbox: ${INBOX_DIR}`);
  log(`  state: ${STATE_PATH}`);

  const state = new State(STATE_PATH);
  await state.load();
  log(`  state loaded: ${state.size} URLs known`);

  const writer = new InboxWriter(INBOX_DIR, { dryRun: DRY_RUN });

  const totals = { written: 0, skipped: 0, candidates: 0, errors: [] };
  const bySource = [];

  for (const src of SOURCES) {
    if (ONLY && !ONLY.has(src.name)) continue;
    log(`\n[${src.name}]`);
    try {
      const stats = await src.fn({ state, writer, log });
      bySource.push(stats);
      totals.written += stats.written;
      totals.skipped += stats.skipped;
      totals.candidates += stats.candidates;
      totals.errors.push(...stats.errors.map((e) => `${src.name}: ${e}`));
      log(`  → candidates=${stats.candidates} written=${stats.written} skipped=${stats.skipped} errors=${stats.errors.length}`);
    } catch (e) {
      log(`  ✖ ${src.name} failed: ${e.message}`);
      totals.errors.push(`${src.name}: ${e.message}`);
    }
  }

  if (!DRY_RUN) {
    await state.save();
  }

  log(`\n=== summary ===`);
  log(`  candidates: ${totals.candidates}`);
  log(`  written:    ${totals.written}`);
  log(`  skipped:    ${totals.skipped}`);
  log(`  errors:     ${totals.errors.length}`);
  if (totals.errors.length) {
    for (const e of totals.errors) log(`    - ${e}`);
  }

  // exit 1 when every source failed to fetch; otherwise 0 so cron doesn't spam alerts
  const allFailed = bySource.length > 0 && bySource.every((s) => s.candidates === 0 && s.errors.length > 0);
  process.exit(allFailed ? 1 : 0);
}

main().catch((e) => {
  console.error('fatal:', e);
  process.exit(1);
});
