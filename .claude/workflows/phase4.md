# Phase 4 — Retrospective Workflow
# Source: .claude/workflows/phase4.md
# Called by: .claude/commands/phase4/retro.md

**Role:** Delivery Intelligence Lead
**Phase:** 4 of 4 (runs after each completed sprint)

---

## Disk Input

Read before doing anything else:

1. `.planning/handoff-schema.json`
   - Extract: `improvement_log`, `challenge_log`.

2. Determine the sprint and retro numbers:
   - Count directories matching `.planning/sprints/sprint-*/`.
   - Use the highest-numbered sprint as the sprint being retrospected.
   - Count directories matching `.planning/retrospectives/retro-*/`.
   - The new retro number = count + 1, zero-padded to 2 digits.

3. Read `.planning/sprints/sprint-NN/PLAN.md` (where NN is the latest sprint).
   - If missing: "Sprint plan not found for sprint NN. Cannot run retrospective." Stop.

4. Read any prior retrospective PATTERNS.md files from
   `.planning/retrospectives/retro-*/PATTERNS.md` (if they exist) to give
   `retro-analyze` cross-sprint pattern history.

---

## Execution Plan

1. Read and follow `.claude/commands/phase4/retro-analyze.md`
   → verify: every pattern has a name, frequency count, and 2+ evidence entries

2. Read and follow `.claude/commands/phase4/retro-prescribe.md`
   → verify: each patch targets a specific file, max 3 lines of patch content

3. Read and follow `.claude/commands/phase4/retro-challenge.md`
   → verify: the single most dangerous patch assumption named, severity set

4. Evaluate challenge severity:
   - CRITICAL → present the dangerous-patch finding to the user.
     Options: revise the patch (loop to step 2), defer the patch (move to
     `retro.flagged_patches`), or split it into a smaller patch.
     Do not dispatch `retro-improve` while any `challenge_status: CRITICAL`
     patch remains in `retro.constitution_patches`.
   - WATCH → log to `challenge_log`. Proceed to step 5.

5. Read and follow `.claude/commands/phase4/retro-improve.md`
   → verify: every patch is APPROVED or FLAGGED, flagged patches moved to
     `retro.flagged_patches`

6. Present approved patches to the user one at a time.
   For each patch, show: target file, patch type, rationale, and exact content.
   Ask: "Apply this patch? (yes / no / defer)"
   Apply only patches explicitly approved. Never apply silently.

---

## Context Slicing

- `retro-analyze`   → `improvement_log`, `challenge_log` (from disk + schema)
- `retro-prescribe` → `retro.patterns_detected` only
- `retro-challenge` → `retro.constitution_patches` only
- `retro-improve`   → `retro.constitution_patches` (post-challenge) only

---

## Disk Output

Write the following files after all per-patch decisions are made:

### `.planning/retrospectives/retro-NN/PATTERNS.md`

```
# Retrospective NN — Pattern Analysis
_Sprint NN → [today's date]_

## Law Violations
| Law | Count | Examples |
|-----|-------|---------|
[one row per law]

## Patterns Detected
[one section per pattern, with name, type, evidence, frequency, phases]

## Unresolved Challenges (carried into sprint)
[bulleted list from retro.unresolved_challenges]

## Next Sprint Flags
[bulleted list of WATCH items]
```

### `.planning/retrospectives/retro-NN/PATCHES.md`

```
# Retrospective NN — Patches
_Sprint NN → [today's date]_

## Approved Patches Applied
[one section per applied patch, with target, type, rationale, content]

## Flagged Patches (deferred)
[one section per flagged patch, with reason for deferral]
```

### `.planning/handoff-schema.json`

Overwrite with the final schema including the completed `retro` block.

### Confirmation

```
Retrospective NN complete. Files written:
  .planning/retrospectives/retro-NN/PATTERNS.md
  .planning/retrospectives/retro-NN/PATCHES.md
  .planning/handoff-schema.json

[N] patches applied. [N] patches deferred.
Run /vision to start a new project cycle, or /sprint for the next sprint.
```
