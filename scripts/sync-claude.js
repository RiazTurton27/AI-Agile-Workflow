#!/usr/bin/env node
'use strict';

// Regenerates root CLAUDE.md from two sources:
//   1. templates/CLAUDE.md   — shared end-user constitution (source of truth)
//   2. scripts/dev-section.md — developer-only addendum
//
// Default: writes the combined output to root CLAUDE.md.
// --check : exits 1 if the existing root CLAUDE.md does not match what would
//           be written. Use this in CI and prepublishOnly.

const fs   = require('fs');
const path = require('path');

const ROOT      = path.join(__dirname, '..');
const SRC       = path.join(ROOT, 'templates', 'CLAUDE.md');
const DEV       = path.join(ROOT, 'scripts', 'dev-section.md');
const TARGET    = path.join(ROOT, 'CLAUDE.md');
const SEPARATOR = '\n\n---\n\n';

function build() {
  const shared = fs.readFileSync(SRC, 'utf8').trimEnd();
  const dev    = fs.readFileSync(DEV, 'utf8').trimEnd();
  return shared + SEPARATOR + dev + '\n';
}

function main() {
  const check = process.argv.includes('--check');
  const next  = build();

  if (check) {
    const current = fs.existsSync(TARGET) ? fs.readFileSync(TARGET, 'utf8') : '';
    if (current !== next) {
      console.error('✗ CLAUDE.md is out of sync with templates/CLAUDE.md + scripts/dev-section.md');
      console.error('  Run: node scripts/sync-claude.js');
      process.exit(1);
    }
    console.log('✓ CLAUDE.md in sync');
    return;
  }

  fs.writeFileSync(TARGET, next);
  console.log(`✓ wrote ${path.relative(ROOT, TARGET)} (${next.length} bytes)`);
}

main();
