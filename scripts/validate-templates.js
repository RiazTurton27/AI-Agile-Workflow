#!/usr/bin/env node
'use strict';

const fs   = require('fs');
const path = require('path');

const TEMPLATES = path.join(__dirname, '..', 'templates');

const REQUIRED = [
  'CLAUDE.md',
  'commands/agile-start.md',
  'commands/phase1/vision.md',
  'commands/phase1/vision-intake.md',
  'commands/phase1/vision-brief.md',
  'commands/phase1/vision-challenge.md',
  'commands/phase1/vision-improve.md',
  'commands/phase2/architect.md',
  'commands/phase2/arch-epics.md',
  'commands/phase2/arch-stories.md',
  'commands/phase2/arch-challenge.md',
  'commands/phase2/arch-improve.md',
  'commands/phase3/sprint.md',
  'commands/phase3/sprint-plan.md',
  'commands/phase3/sprint-dor.md',
  'commands/phase3/sprint-challenge.md',
  'commands/phase3/sprint-improve.md',
  'commands/phase4/retro.md',
  'commands/phase4/retro-analyze.md',
  'commands/phase4/retro-prescribe.md',
  'commands/phase4/retro-challenge.md',
  'commands/phase4/retro-improve.md',
];

let failed = false;

for (const rel of REQUIRED) {
  const full = path.join(TEMPLATES, rel);

  if (!fs.existsSync(full)) {
    console.error(`  ✗  missing: templates/${rel}`);
    failed = true;
    continue;
  }

  const content = fs.readFileSync(full, 'utf8').trim();
  if (content === '# PLACEHOLDER — paste content from spec' || content === '') {
    console.error(`  ✗  placeholder: templates/${rel}`);
    failed = true;
    continue;
  }

  console.log(`  ✓  templates/${rel}`);
}

if (failed) {
  console.error('\nTemplate validation failed. Fix the errors above before publishing.\n');
  process.exit(1);
}

console.log('\nAll templates valid.\n');
