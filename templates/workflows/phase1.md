# Phase 1 — Product Vision Workflow
# Source: .claude/workflows/phase1.md
# Called by: .claude/commands/phase1/vision.md

**Role:** Product Strategy Advisor
**Phase:** 1 of 4

---

## Disk Input

Phase 1 starts a new project cycle. Check `.planning/VISION.md`:
- If it exists: ask the user whether to start a new vision (overwrite) or
  review the existing one. Do not proceed silently.
- If it does not exist: proceed directly to the Execution Plan below.

---

## Execution Plan

1. Read and follow `.claude/commands/phase1/vision-intake.md`
   → verify: assumptions surfaced, all ambiguities resolved

2. Read and follow `.claude/commands/phase1/vision-brief.md`
   → verify: all five brief sections complete, no unanswered questions

3. Read and follow `.claude/commands/phase1/vision-challenge.md`
   → verify: single dangerous assumption named, severity set (CRITICAL or WATCH)

4. Evaluate challenge severity:
   - CRITICAL → present the finding to the user. Resolve the assumption.
     Loop back to step 2 with the corrected input. Do not proceed to step 5
     until `status` changes from `Challenged`.
   - WATCH → log to `challenge_log` in the schema. Proceed to step 5.

5. Read and follow `.claude/commands/phase1/vision-improve.md`
   → verify: Four Laws audit complete, `improvement_log` updated

6. Phase gate — ask the user:
   > "Has this brief been reviewed with your CEO, sponsors, or key stakeholders?
   > Confirm to mark Phase 1 Approved and unlock `/architect`."
   Wait for confirmation before writing disk output.

---

## Context Slicing

Pass only the fields each subagent needs:

- `vision-intake`    → raw user input only
- `vision-brief`     → validated intake block only
- `vision-challenge` → `value_proposition`, `scope_boundaries`, `open_assumptions`
- `vision-improve`   → full schema + Phase 1 `challenge_log` entry

---

## Disk Output

Write the following files after the phase gate is confirmed:

### `.planning/VISION.md`

```
# Vision — [project name inferred from value_proposition]
_Phase 1 approved — [today's date]_

## Core Value Proposition
[3–5 sentences from the brief]

## User Journey (High Level)
[from the brief — max 200 words]

## Stakeholder Alignment Questions
[numbered list from the brief]

## Scope Boundaries
[bulleted list of out-of-scope items]

## Open Assumptions
[bulleted list]

## Challenge Log
| Phase | Severity | Assumption | Resolution |
|-------|----------|------------|------------|
[one row per challenge_log entry for phase 1]
```

### `.planning/handoff-schema.json`

Write the current Handoff Schema instance (with `spec_version: v0.1`,
`status: Approved`) to this file. This is the single structured object that
subsequent phases read at session start.

### Confirmation

Tell the user:
```
Phase 1 complete. Files written:
  .planning/VISION.md
  .planning/handoff-schema.json

Run /architect to begin Phase 2.
```
