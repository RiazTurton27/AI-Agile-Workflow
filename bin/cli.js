#!/usr/bin/env node
'use strict';

const fs   = require('fs');
const path = require('path');
const rl   = require('readline');

// ── Package + paths ────────────────────────────────────────────────────────────

const PKG          = require('../package.json');
const TEMPLATES    = path.join(__dirname, '..', 'templates');

// ── Phase manifest ─────────────────────────────────────────────────────────────

const PHASES = {
  1: [
    'phase1/vision.md',
    'phase1/vision-intake.md',
    'phase1/vision-brief.md',
    'phase1/vision-challenge.md',
    'phase1/vision-improve.md',
  ],
  2: [
    'phase2/architect.md',
    'phase2/arch-epics.md',
    'phase2/arch-stories.md',
    'phase2/arch-challenge.md',
    'phase2/arch-improve.md',
  ],
  3: [
    'phase3/sprint.md',
    'phase3/sprint-plan.md',
    'phase3/sprint-dor.md',
    'phase3/sprint-challenge.md',
    'phase3/sprint-improve.md',
  ],
  4: [
    'phase4/retro.md',
    'phase4/retro-analyze.md',
    'phase4/retro-prescribe.md',
    'phase4/retro-challenge.md',
    'phase4/retro-improve.md',
  ],
};

// ── Colour helpers ─────────────────────────────────────────────────────────────

const NO_COLOUR = !process.stdout.isTTY || process.env.NO_COLOR;

const c = NO_COLOUR
  ? { reset:'', dim:'', bold:'', green:'', yellow:'', red:'', cyan:'', gray:'' }
  : {
      reset:  '\x1b[0m',
      dim:    '\x1b[2m',
      bold:   '\x1b[1m',
      green:  '\x1b[32m',
      yellow: '\x1b[33m',
      red:    '\x1b[31m',
      cyan:   '\x1b[36m',
      gray:   '\x1b[90m',
    };

const sym = { ok: '✓', skip: '–', err: '✗', info: 'i' };

const out = {
  ok:   msg => console.log(`  ${c.green}${sym.ok}${c.reset}  ${msg}`),
  skip: msg => console.log(`  ${c.yellow}${sym.skip}${c.reset}  ${c.gray}${msg}${c.reset}`),
  err:  msg => console.log(`  ${c.red}${sym.err}${c.reset}  ${msg}`),
  info: msg => console.log(`  ${c.cyan}${sym.info}${c.reset}  ${msg}`),
  line: ()  => console.log(`  ${c.gray}${'─'.repeat(52)}${c.reset}`),
  br:   ()  => console.log(''),
};

// ── Arg parser ─────────────────────────────────────────────────────────────────

function parseArgs(argv) {
  const opts = {
    phases:          [1, 2, 3, 4],
    force:           false,
    skipConstitution: false,
    yes:             false,
    help:            false,
    version:         false,
  };

  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--force'            || a === '-f') opts.force            = true;
    if (a === '--skip-constitution'             ) opts.skipConstitution = true;
    if (a === '--yes'              || a === '-y') opts.yes              = true;
    if (a === '--help'             || a === '-h') opts.help             = true;
    if (a === '--version'          || a === '-v') opts.version          = true;
    if (a === '--phase') {
      const raw = argv[++i] ?? '';
      const parsed = raw.split(',')
        .map(n => parseInt(n.trim(), 10))
        .filter(n => n >= 1 && n <= 4);
      if (parsed.length === 0) {
        console.error(`\n  ${c.red}Error:${c.reset} --phase requires comma-separated values between 1 and 4 (e.g. --phase 1,2)\n`);
        process.exit(1);
      }
      opts.phases = parsed;
    }
  }
  return opts;
}

// ── File installer ─────────────────────────────────────────────────────────────

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

/**
 * Copy src → dest.
 * Returns 'created' | 'overwritten' | 'skipped'
 */
function copyFile(src, dest, force) {
  const exists = fs.existsSync(dest);
  if (exists && !force) return 'skipped';
  ensureDir(path.dirname(dest));
  fs.copyFileSync(src, dest);
  return exists ? 'overwritten' : 'created';
}

function labelFor(status) {
  if (status === 'created')    return `${c.green}created${c.reset}`;
  if (status === 'overwritten') return `${c.yellow}overwritten${c.reset}`;
  return `${c.gray}skipped${c.reset}`;
}

// ── Install orchestrator ───────────────────────────────────────────────────────

function install(cwd, opts) {
  const tally = { created: 0, overwritten: 0, skipped: 0, failed: 0 };

  function record(status) { tally[status] = (tally[status] ?? 0) + 1; }

  // ── CLAUDE.md ──────────────────────────────────────────────────────────────
  const constitutionDest = path.join(cwd, 'CLAUDE.md');

  if (opts.skipConstitution) {
    out.skip('CLAUDE.md  (--skip-constitution)');
    record('skipped');
  } else {
    const src = path.join(TEMPLATES, 'CLAUDE.md');
    try {
      const status = copyFile(src, constitutionDest, opts.force);
      if (status === 'skipped') {
        out.skip('CLAUDE.md  (already exists — use --force to overwrite)');
      } else {
        out.ok(`CLAUDE.md  ${labelFor(status)}`);
      }
      record(status);
    } catch (e) {
      out.err(`CLAUDE.md  — ${e.message}`);
      record('failed');
    }
  }

  out.br();

  // ── agile-start.md ─────────────────────────────────────────────────────────
  const startSrc  = path.join(TEMPLATES, 'commands', 'agile-start.md');
  const startDest = path.join(cwd, '.claude', 'commands', 'agile-start.md');
  try {
    const status = copyFile(startSrc, startDest, opts.force);
    if (status === 'skipped') {
      out.skip('.claude/commands/agile-start.md');
    } else {
      out.ok(`.claude/commands/agile-start.md  ${labelFor(status)}`);
    }
    record(status);
  } catch (e) {
    out.err(`agile-start.md  — ${e.message}`);
    record('failed');
  }

  // ── Phase files ────────────────────────────────────────────────────────────
  for (const phase of opts.phases) {
    const files = PHASES[phase] ?? [];
    out.br();
    console.log(`  ${c.dim}Phase ${phase}${c.reset}`);

    for (const rel of files) {
      const src  = path.join(TEMPLATES, 'commands', rel);
      const dest = path.join(cwd, '.claude', 'commands', rel);
      const display = `.claude/commands/${rel}`;
      try {
        const status = copyFile(src, dest, opts.force);
        if (status === 'skipped') {
          out.skip(display);
        } else {
          out.ok(`${display}  ${labelFor(status)}`);
        }
        record(status);
      } catch (e) {
        out.err(`${display}  — ${e.message}`);
        record('failed');
      }
    }
  }

  return tally;
}

// ── Prompt ─────────────────────────────────────────────────────────────────────

function confirm(question) {
  return new Promise(resolve => {
    const iface = rl.createInterface({ input: process.stdin, output: process.stdout });
    iface.question(question, ans => {
      iface.close();
      resolve(ans.trim().toLowerCase() === 'y');
    });
  });
}

// ── Help ───────────────────────────────────────────────────────────────────────

function showHelp() {
  console.log(`
  ${c.bold}agile-plugin${c.reset} ${c.dim}v${PKG.version}${c.reset}

  ${c.dim}Usage${c.reset}
    npx agile-plugin init [options]

  ${c.dim}Options${c.reset}
    --phase <n,n>          Install specific phases only  (e.g. --phase 1,2)
    --skip-constitution    Skip CLAUDE.md — preserves your existing constitution
    --force,  -f           Overwrite existing files
    --yes,    -y           Skip confirmation prompt
    --version,-v           Print version and exit
    --help,   -h           Show this help

  ${c.dim}Examples${c.reset}
    npx agile-plugin init
    npx agile-plugin init --phase 1,2
    npx agile-plugin init --skip-constitution --force
    npx agile-plugin init --yes
`);
}

// ── Main ───────────────────────────────────────────────────────────────────────

async function main() {
  const [subcommand, ...rest] = process.argv.slice(2);
  const opts = parseArgs(rest);

  if (opts.version) { console.log(PKG.version); return; }
  if (opts.help || subcommand !== 'init') { showHelp(); return; }

  const cwd        = process.cwd();
  const phaseLabel = opts.phases.length === 4
    ? 'all phases'
    : `phase${opts.phases.length > 1 ? 's' : ''} ${opts.phases.join(', ')}`;

  out.br();
  console.log(`  ${c.bold}AI-Agile Plugin${c.reset}  ${c.dim}v${PKG.version}${c.reset}`);
  out.line();
  console.log(`  ${c.dim}Target ${c.reset} ${cwd}`);
  console.log(`  ${c.dim}Scope  ${c.reset} ${phaseLabel}`);
  console.log(`  ${c.dim}Force  ${c.reset} ${opts.force ? 'yes' : 'no'}`);
  out.line();
  out.br();

  if (!opts.yes) {
    const go = await confirm('  Proceed? (y/n)  ');
    if (!go) { out.br(); out.info('Cancelled.'); out.br(); return; }
    out.br();
  }

  const tally = install(cwd, opts);

  out.br();
  out.line();

  const parts = [
    tally.created     && `${c.green}${tally.created} created${c.reset}`,
    tally.overwritten && `${c.yellow}${tally.overwritten} overwritten${c.reset}`,
    tally.skipped     && `${c.gray}${tally.skipped} skipped${c.reset}`,
    tally.failed      && `${c.red}${tally.failed} failed${c.reset}`,
  ].filter(Boolean);

  out.br();
  console.log(`  ${parts.join('  ')}`);
  out.br();

  if (tally.failed === 0) {
    console.log(`  ${c.bold}Done.${c.reset} Open your project in Claude Code and run ${c.cyan}/agile-start${c.reset}`);
  } else {
    console.log(`  ${c.yellow}Completed with errors.${c.reset} Check the output above.`);
    process.exit(1);
  }

  out.br();
}

main().catch(e => {
  console.error(`\n  ${c.red}Error:${c.reset} ${e.message}\n`);
  process.exit(1);
});
