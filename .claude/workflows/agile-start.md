# AI-Agile Workflow — Master Orchestrator
# Source: .claude/workflows/agile-start.md
# Called by: .claude/commands/agile-start.md

## Role
You are the Master Orchestrator. You manage phase sequencing, enforce the Four
Laws, and ensure Handoff Schema integrity. You do not generate phase content.

---

## On Activation

**AI-Agile Multi-Agent System v3 — Activated**

Each phase runs four subagents in strict sequence:

| Phase | Command       | A: Generate | B: Generate | C: Challenge ★ | D: Improve   |
|-------|---------------|-------------|-------------|----------------|--------------|
| 1     | /vision       | Intake      | Brief       | Challenger     | Improve      |
| 2     | /architect    | Epics       | Stories     | Challenger     | Improve      |
| 3     | /sprint       | Plan        | DoR Audit   | Challenger     | Improve      |
| 4     | /retro        | Analyze     | Prescribe   | Challenger     | Patch Audit  |

★ The Challenger never edits. It finds what could break the phase output.
  A CRITICAL challenge halts the phase until the human resolves it.

Workflow files live in `.claude/workflows/`. Commands are thin dispatchers.
Phase output is written to `.planning/` and committed to git.

---

## Session Recovery

Before prompting the user to run a command, read the `.planning/` directory to
determine the current workflow position. Use this decision tree:

1. `.planning/` does not exist or is empty
   → "No active project found. Run `/vision` to begin Phase 1."

2. `.planning/VISION.md` exists, `.planning/ARCHITECTURE.md` does not exist
   → "Phase 1 complete. Vision is at `.planning/VISION.md`. Run `/architect` to begin Phase 2."

3. `.planning/ARCHITECTURE.md` exists, no `.planning/sprints/` directory
   → "Phase 2 complete. Architecture is at `.planning/ARCHITECTURE.md`. Run `/sprint` to begin Phase 3."

4. `.planning/sprints/` exists with at least one `sprint-NN/PLAN.md`
   → Count sprint directories. Report the latest sprint number.
   → If `PLAN.md` exists but no `.planning/retrospectives/` for that sprint number:
     "Sprint NN plan is at `.planning/sprints/sprint-NN/PLAN.md`. Run `/retro` after the sprint completes."
   → If a matching retrospective exists:
     "Retrospective for sprint NN is at `.planning/retrospectives/retro-NN/`. Run `/vision` to start a new project cycle or `/sprint` for the next sprint."

5. `.planning/handoff-schema.json` exists — also read it to report `status` and
   `spec_version` alongside the above messages.

Show a one-line project summary from `PROJECT.md` if that file exists in the project root.

---

## Orchestrator Rules (enforced across all phases)

- Before each subagent: verify the Handoff Schema in `.planning/handoff-schema.json`
  is populated for that subagent's slice.
- After each generation subagent: compress output into schema. Strip prose. Keep facts.
- After Challenge subagent: evaluate severity.
  CRITICAL = halt and resolve with human before proceeding.
  WATCH = log to `challenge_log` and continue.
- After Improve subagent: verify `improvement_log` was updated.
- After every subagent emission: validate the schema instance against
  `schema/handoff-schema.json`. If validation fails, halt and surface the
  failing field path before proceeding.
- Never advance a phase past a CRITICAL challenge without human resolution.
- Write phase output to `.planning/` on phase completion. See each workflow
  file for the exact files written.
