#!/usr/bin/env node
'use strict';

const fs   = require('fs');
const path = require('path');

const TEMPLATES = path.join(__dirname, '..', 'templates');

// Command files — thin dispatchers + subagent definitions
const REQUIRED_COMMANDS = [
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

// Workflow files — source of behavior for each phase
const REQUIRED_WORKFLOWS = [
  'agile-start.md',
  'phase1.md',
  'phase2.md',
  'phase3.md',
  'phase4.md',
];

// Thin dispatcher check — command orchestrators must be ≤ 10 lines
const THIN_DISPATCHERS = [
  'commands/agile-start.md',
  'commands/phase1/vision.md',
  'commands/phase2/architect.md',
  'commands/phase3/sprint.md',
  'commands/phase4/retro.md',
];

let failed = false;

function checkFile(root, rel, displayPrefix) {
  const full = path.join(root, rel);
  if (!fs.existsSync(full)) {
    console.error(`  ✗  missing: ${displayPrefix}/${rel}`);
    failed = true;
    return null;
  }
  const content = fs.readFileSync(full, 'utf8').trim();
  if (content === '# PLACEHOLDER — paste content from spec' || content === '') {
    console.error(`  ✗  placeholder: ${displayPrefix}/${rel}`);
    failed = true;
    return null;
  }
  return content;
}

// Validate command files
console.log('\n  Command files:');
for (const rel of REQUIRED_COMMANDS) {
  const content = checkFile(TEMPLATES, rel, 'templates');
  if (content !== null) console.log(`  ✓  templates/${rel}`);
}

// Validate workflow files
console.log('\n  Workflow files:');
const WF_DIR = path.join(TEMPLATES, 'workflows');
for (const name of REQUIRED_WORKFLOWS) {
  const content = checkFile(WF_DIR, name, 'templates/workflows');
  if (content !== null) console.log(`  ✓  templates/workflows/${name}`);
}

// Validate thin dispatchers — must be ≤ 10 lines
console.log('\n  Thin dispatcher check (must be ≤ 10 lines):');
for (const rel of THIN_DISPATCHERS) {
  const full = path.join(TEMPLATES, rel);
  if (!fs.existsSync(full)) continue; // already reported above
  const lines = fs.readFileSync(full, 'utf8').split('\n').filter(l => l.trim()).length;
  if (lines > 10) {
    console.error(`  ✗  ${rel}  (${lines} non-blank lines — should be ≤ 10)`);
    failed = true;
  } else {
    console.log(`  ✓  ${rel}  (${lines} lines)`);
  }
}

if (failed) {
  console.error('\nTemplate validation failed. Fix the errors above before publishing.\n');
  process.exit(1);
}

console.log('\nAll templates valid.\n');
