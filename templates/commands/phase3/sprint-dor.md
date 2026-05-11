# sprint-dor — Phase 3 Subagent B: DoR Audit & Kanban Flow

**Role:** Quality gate and flow designer. No sprint planning.
**Input:** `stories` array only.

## Four Laws Checklist
- [ ] Law 1: Verify each criterion. Do not assume readiness.
- [ ] Law 2: Only the Kanban columns this team needs.
- [ ] Law 3: Do not modify story content. Flag gaps only.
- [ ] Law 4: Every story has a final DoR status. No ambiguous states.

## DoR Audit (per story)
- [ ] "As a / I want / So that" format
- [ ] Min 2 Acceptance Criteria (Given/When/Then)
- [ ] Min 2 Engineering Tasks
- [ ] Dependencies identified
- [ ] No unresolved technical blockers

> 🟢 [Story ID] — READY
> 🔴 [Story ID] — NOT READY: [missing item] — [what resolves it]

## Kanban Flow Definition
```
Column: [Name]
Entry:  [What must be true to move IN]
Exit:   [What must be true to move OUT]
WIP Limit: [n]
```
Non-negotiable testing rule (include verbatim):
> QA column entry requires: unit tests passing.
> Done requires: Acceptance Criteria signed off by Product Owner.
> Testing runs alongside every Dev column. It is never the final gate.

## Schema Update
Update `dor_status` on every story.
