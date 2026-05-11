## Developing this plugin

### Source of truth

`templates/CLAUDE.md` is the canonical end-user constitution. The root
`CLAUDE.md` you are reading is **generated** by appending this file to
`templates/CLAUDE.md`. Do not edit root `CLAUDE.md` by hand — your changes
will be overwritten the next time `scripts/sync-claude.js` runs.

To edit shared content: change `templates/CLAUDE.md`.
To edit developer-only content: change `scripts/dev-section.md`.
Then run: `node scripts/sync-claude.js`.

CI / `prepublishOnly` runs `node scripts/sync-claude.js --check` and fails
if the two are out of sync.

### Two-layer architecture

Commands are thin dispatchers; workflow files contain all phase behaviour.
When editing the workflow for a phase, edit the `templates/workflows/` file
then sync it to `.claude/workflows/`. Never put behaviour in command files.

```
templates/                 ← what npm publishes
  CLAUDE.md
  commands/
    agile-start.md         ← thin dispatcher (3 lines)
    phase1/vision.md       ← thin dispatcher
    phase1/vision-intake.md    ← subagent behaviour (unchanged)
    ...
  workflows/
    agile-start.md         ← full behaviour source
    phase1.md
    phase2.md
    phase3.md
    phase4.md

.claude/commands/          ← working copies (mirrors templates/commands/)
.claude/workflows/         ← working copies (mirrors templates/workflows/)
schema/                    ← Handoff Schema definition + example instances
scripts/                   ← sync + validation helpers
bin/cli.js                 ← npm installer CLI
```

When editing workflow files: update both `templates/workflows/` (canonical)
and `.claude/workflows/` (working copy) in sync.

### npm CLI usage (end-user install)

```bash
npx agile-plugin init                        # install all phases
npx agile-plugin init --phase 1,2            # specific phases only
npx agile-plugin init --skip-constitution    # preserve existing CLAUDE.md
npx agile-plugin init --force                # overwrite existing files
```

The installer copies both `templates/commands/` and `templates/workflows/`
into the user's project under `.claude/`.

### Publishing

```bash
npm publish --access public
```

This triggers `prepublishOnly`, which runs:
1. `node scripts/validate-templates.js` — confirms all command and workflow
   files are present and not placeholders; checks command orchestrators are
   ≤ 10 lines (thin dispatcher rule enforced)
2. `node scripts/sync-claude.js --check` — confirms root CLAUDE.md matches
3. `node scripts/validate-schema.js schema/examples/*.json` — confirms the
   schema definition validates the example instances

### Bug reports

Issue template is at `.github/ISSUE_TEMPLATE/bug_report.md`. It captures:
phase, subagent, challenge severity, schema state at failure, actual vs.
expected output, and Claude Code version.
