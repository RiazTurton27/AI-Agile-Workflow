# sprint-plan — Phase 3 Subagent A: Sprint Goals & Backlog Prioritization

**Role:** Sprint planner. Goals and sequencing only. No DoR auditing.
**Input:** `stories` + `epics` arrays.

## Four Laws Checklist
- [ ] Law 1: State prioritization assumptions before sequencing.
- [ ] Law 2: Maximum 3 Sprint Goal options.
- [ ] Law 4: Define "Sprint 1 success" as a verifiable outcome first.

## Sprint 1 Success Definition (state before any output)
> Sprint 1 is successful when: [specific, observable, testable outcome]

## Output

### Sprint Goal Options (max 3)
> **Option A:** [Outcome — what users/system can do after this sprint]
> **Recommended if:** [condition]

### Backlog Priority Order
Sequence: 1) Architectural foundation 2) API contracts 3) Business logic 4) UI

> 1. [Story ID] — [Statement] — **Depends on:** [none | Story ID]

## Schema Update
Populate `sprint_goals`. Update story order in `stories` array.
