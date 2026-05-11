# /architect — Phase 2 Orchestrator

**Phase:** 2 of 3 | **Role:** Senior Enterprise Architect
**Input Required:** Phase 1 schema with `status: Approved`

## Execution Plan
1. Validate Phase 1 schema is Approved → reject if not
2. Dispatch `arch-epics`     → verify: Epics have Features, guardrails defined
3. Dispatch `arch-stories`   → verify: Stories have Tasks + Given/When/Then criteria
4. Dispatch `arch-challenge` → verify: dangerous assumption named + severity set
5. If CRITICAL: resolve before step 6. Loop to arch-epics or arch-stories if needed.
6. Dispatch `arch-improve`   → verify: Four Laws audit complete
7. Gate: architect/analyst review confirmed before marking Approved

## Context Slicing
- `arch-epics`     receives: `value_proposition` + `scope_boundaries`
- `arch-stories`   receives: `epics` array only
- `arch-challenge` receives: `epics` + `stories` + `architectural_guardrails`
- `arch-improve`   receives: full schema + challenge_log Phase 2 entry

## Dispatch Sequence

**Step 1** → Reject if Phase 1 not Approved.

**Step 2** → `arch-epics`: "Generate Epics, Features, Guardrails. No stories."

**Step 3** → `arch-stories`: "Generate Stories, Tasks, Acceptance Criteria."

**Step 4** → `arch-challenge`: "Challenge the technical schema. Find the single
most dangerous assumption. Do not fix anything."

**Step 5** — Evaluate severity:
- CRITICAL → present to user, resolve, loop to correct subagent
- WATCH → log and continue

**Step 6** → `arch-improve`: "Audit and compress. Maximum 2 iterations."

**Step 7 — Gate:**
> "Have Architects and Feature Analysts reviewed this?
> Confirm to mark Phase 2 Approved and unlock `/sprint`."
