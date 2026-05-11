# Phase 3 — Sprint Planning Workflow
# Source: .claude/workflows/phase3.md
# Called by: .claude/commands/phase3/sprint.md

**Role:** Expert Scrum Master
**Phase:** 3 of 4

---

## Disk Input

Read before doing anything else:

1. `.planning/handoff-schema.json`
   - If missing: "Phase 2 output not found. Run `/architect` first." Stop.
   - If `status` is not `Approved`: report the current status and stop.
   - Extract: `stories`, `epics`, `challenge_log`.

2. `.planning/ARCHITECTURE.md`
   - Read for human-readable context alongside the schema.
   - If missing but schema exists, continue from the schema alone.

3. Determine sprint number:
   - Count directories matching `.planning/sprints/sprint-*/`.
   - The new sprint number = count + 1, zero-padded to 2 digits (e.g. `01`, `02`).
   - Tell the user: "Planning Sprint NN."

---

## Execution Plan

1. Read and follow `.claude/commands/phase3/sprint-plan.md`
   → verify: Sprint Goals drafted (max 3), backlog priority-ordered

2. Read and follow `.claude/commands/phase3/sprint-dor.md`
   → verify: every story has a final DoR status, Kanban columns defined

3. Read and follow `.claude/commands/phase3/sprint-challenge.md`
   → verify: single dangerous assumption named, severity set

4. Evaluate challenge severity:
   - CRITICAL → present the finding to the user. Resolve before the sprint
     begins. Do not emit the Sprint Readiness Package while `status: Challenged`.
   - WATCH → log to `challenge_log` and to `retro.next_sprint_flags`.
     Proceed to step 5.

5. Read and follow `.claude/commands/phase3/sprint-improve.md`
   → verify: Four Laws audit complete, output is directly pasteable into an
     Agile tool with zero reformatting needed

6. Emit the Sprint Readiness Package. No human gate — this phase emits directly.
   Then write disk output.

---

## Context Slicing

- `sprint-plan`      → `stories`, `epics` (from disk)
- `sprint-dor`       → `stories` array only
- `sprint-challenge` → `sprint_goals`, `stories` (with DoR status)
- `sprint-improve`   → full schema + Phase 3 `challenge_log` entry

---

## Disk Output

Create the sprint directory and write the following files:

### `.planning/sprints/sprint-NN/PLAN.md`

```
# Sprint NN Plan
_Emitted — [today's date]_

## Sprint Goal
[chosen goal from sprint-plan output]

## Backlog (priority order)
| # | Story ID | Statement | Depends on | DoR |
|---|----------|-----------|-----------|-----|
[one row per story, in priority order]

## Challenge Log
| Phase | Severity | Assumption | Resolution |
|-------|----------|------------|------------|
[phase 3 entries]

## Next Sprint Flags
[WATCH items from retro.next_sprint_flags]
```

### `.planning/sprints/sprint-NN/KANBAN.md`

```
# Kanban — Sprint NN

## Columns
[Column name, entry criteria, exit criteria, WIP limit — one section per column]

## Non-Negotiable Testing Rule
QA column entry requires: unit tests passing.
Done requires: Acceptance Criteria signed off by Product Owner.
Testing runs alongside every Dev column. It is never the final gate.
```

### `.planning/handoff-schema.json`

Overwrite with the updated schema (`spec_version: v1.0`, `status: Sprint Ready`).

### Confirmation

```
Sprint NN plan written:
  .planning/sprints/sprint-NN/PLAN.md
  .planning/sprints/sprint-NN/KANBAN.md
  .planning/handoff-schema.json

Paste PLAN.md into your Agile tool. Run /retro after the sprint completes.
```
