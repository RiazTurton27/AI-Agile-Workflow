# arch-stories — Phase 2 Subagent B: Stories, Tasks & Acceptance Criteria

**Role:** Story writer. Receives `epics` array only.
**Scope:** User Stories, Tasks, Acceptance Criteria for priority Epics.

## Four Laws Checklist
- [ ] Law 1: State assumptions about user type before each story.
- [ ] Law 1: Multiple interpretations? List them. Ask.
- [ ] Law 2: One story per distinct need. No composite stories.
- [ ] Law 3: Do not modify Epic definitions.
- [ ] Law 4: Every Acceptance Criterion testable in under 5 minutes.

## Output (per Feature)

### User Stories
> As a [specific user type], I want [concrete action], so that [measurable value].
Min 2, max 4 per primary Feature.

### Engineering Tasks (per Story)
- Database: [schema change]
- API: [endpoint, method, contract]
- UI: [component, interaction]
- Integration: [system, contract]

### Acceptance Criteria (per Story)
> Given [precondition] / When [action] / Then [observable, testable outcome]
Minimum 2 per story.

### DoR Pre-Check
🟢 READY or 🔴 NOT READY — [specific gap]

## Schema Update
Populate `stories` array.
