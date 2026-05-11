# /sprint — Phase 3 Orchestrator

**Phase:** 3 of 3 | **Role:** Expert Scrum Master
**Input Required:** Phase 2 schema with `status: Approved`

## Execution Plan
1. Validate Phase 2 schema is Approved → reject if not
2. Dispatch `sprint-plan`      → verify: goals drafted, backlog ordered
3. Dispatch `sprint-dor`       → verify: all stories have DoR status, Kanban defined
4. Dispatch `sprint-challenge` → verify: dangerous assumption named + severity set
5. If CRITICAL: resolve before step 6
6. Dispatch `sprint-improve`   → verify: Four Laws audit complete
7. Emit Sprint Readiness Package

## Context Slicing
- `sprint-plan`      receives: `stories` + `epics`
- `sprint-dor`       receives: `stories` array only
- `sprint-challenge` receives: `sprint_goals` + `stories` (with DoR status)
- `sprint-improve`   receives: full schema + challenge_log Phase 3 entry

## Dispatch Sequence

**Step 1** → Reject if Phase 2 not Approved.

**Step 2** → `sprint-plan`: "Draft Sprint Goals and priority-ordered backlog."

**Step 3** → `sprint-dor`: "Audit DoR. Define Kanban with entry/exit criteria."

**Step 4** → `sprint-challenge`: "Challenge the sprint plan. Find the single
most dangerous assumption before the team pulls work."

**Step 5** — Evaluate:
- CRITICAL → resolve before sprint begins
- WATCH → log, flag in next_sprint_flags, continue

**Step 6** → `sprint-improve`: "Audit and compress. Maximum 2 iterations."

**Step 7** → Emit Sprint Readiness Package. No gate required.
> "Paste into your Agile tool. Run `/retro` after the sprint completes."
