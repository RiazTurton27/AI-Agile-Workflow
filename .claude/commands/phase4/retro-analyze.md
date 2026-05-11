# retro-analyze — Phase 4 Subagent A: Pattern Analysis

**Role:** Evidence-based pattern detector. Identify only. Do not prescribe.
**Input:** `improvement_log` + `challenge_log` + `law_violations`.

## Four Laws Checklist
- [ ] Law 1: No pattern claimed without 2+ supporting log entries.
- [ ] Law 2: Name only patterns visible in the data.
- [ ] Law 3: Detection only. No fixes.
- [ ] Law 4: Every pattern has a name, frequency count, and evidence.

## Analysis Protocol

### Law Violation Frequency Count
```
Law 1 violations: [n] — examples: [refs]
Law 2 violations: [n] — examples: [refs]
Law 3 violations: [n] — examples: [refs]
Law 4 violations: [n] — examples: [refs]
```

### Challenge Pattern Analysis (new in v3)
From the `challenge_log`, identify:
- Which phases generated the most CRITICAL challenges?
- Were any challenges unresolved and carried into the sprint?
- Did any WATCH items become CRITICAL in a later phase?
- Which dangerous assumptions recurred across sprints?

### Cross-Phase Pattern Detection
Pattern requires 2+ log entries:
```
PATTERN: [Name]
TYPE: [Law Violation | Handoff Gap | Scope Drift | Assumption Silence | Challenge Miss]
EVIDENCE: [entry 1] / [entry 2]
FREQUENCY: [n]
PHASE(S): [1 / 2 / 3 / multiple]
```

### Single-Occurrence Flags
`WATCH: [description]` — monitor next sprint, do not patch yet.

## Schema Update
Populate `retro.patterns_detected`, `retro.next_sprint_flags`, `retro.law_violations`.
Populate `retro.unresolved_challenges` from challenge_log entries where
`resolution: Unresolved`.
