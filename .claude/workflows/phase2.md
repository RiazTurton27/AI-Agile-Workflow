# Phase 2 — Architecture Workflow
# Source: .claude/workflows/phase2.md
# Called by: .claude/commands/phase2/architect.md

**Role:** Senior Enterprise Architect
**Phase:** 2 of 4

---

## Disk Input

Read both files before doing anything else:

1. `.planning/handoff-schema.json`
   - If the file does not exist: tell the user "Phase 1 output not found.
     Run `/vision` first." Stop.
   - If `status` is not `Approved`: tell the user the current status and stop.
     Phase 2 cannot begin until Phase 1 is approved.
   - Extract: `value_proposition`, `scope_boundaries`, `open_assumptions`,
     `challenge_log`.

2. `.planning/VISION.md`
   - Read for human-readable context. Use alongside the schema fields above.
   - If missing but `handoff-schema.json` exists, continue from the schema alone
     and note the gap to the user.

---

## Execution Plan

1. Read and follow `.claude/commands/phase2/arch-epics.md`
   → verify: every Epic maps to a business outcome, guardrails defined

2. Read and follow `.claude/commands/phase2/arch-stories.md`
   → verify: Stories have Tasks + Given/When/Then criteria, DoR pre-check done

3. Read and follow `.claude/commands/phase2/arch-challenge.md`
   → verify: single dangerous assumption named, severity set

4. Evaluate challenge severity:
   - CRITICAL → present the finding to the user. Resolve. Loop to step 1 or 2
     as directed. Do not proceed to step 5 while `status: Challenged`.
   - WATCH → log to `challenge_log`. Proceed to step 5.

5. Read and follow `.claude/commands/phase2/arch-improve.md`
   → verify: Four Laws audit complete, `improvement_log` updated,
     all 🔴 NOT READY stories have explicit gap descriptions

6. Phase gate — ask the user:
   > "Have Architects and Feature Analysts reviewed this?
   > Confirm to mark Phase 2 Approved and unlock `/sprint`."
   Wait for confirmation before writing disk output.

---

## Context Slicing

- `arch-epics`     → `value_proposition`, `scope_boundaries` (from disk)
- `arch-stories`   → `epics` array only
- `arch-challenge` → `epics`, `stories`, `architectural_guardrails`
- `arch-improve`   → full schema + Phase 2 `challenge_log` entry

---

## Disk Output

Write the following files after the phase gate is confirmed:

### `.planning/ARCHITECTURE.md`

```
# Architecture — [project name]
_Phase 2 approved — [today's date]_

## Epics and Features
[Epic/Feature breakdown from the schema, preserving E1/F1.1 numbering]

## Architectural Guardrails
[bulleted list]

## Integration Flags
[bulleted list]

## Stories Summary
| ID | Epic | Statement | DoR |
|----|------|-----------|-----|
[one row per story]

## Challenge Log
| Phase | Severity | Assumption | Resolution |
|-------|----------|------------|------------|
[phase 2 entries]
```

### `.planning/handoff-schema.json`

Overwrite with the updated schema instance (`spec_version: v0.2`,
`status: Approved`).

### Confirmation

```
Phase 2 complete. Files written:
  .planning/ARCHITECTURE.md
  .planning/handoff-schema.json

Run /sprint to begin Phase 3.
```
