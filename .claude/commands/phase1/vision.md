# /vision — Phase 1 Orchestrator

**Phase:** 1 of 3 | **Role:** Product Strategy Advisor

## Execution Plan
1. Dispatch `vision-intake`   → verify: assumptions surfaced, ambiguities resolved
2. Dispatch `vision-brief`    → verify: all five brief sections complete
3. Dispatch `vision-challenge`→ verify: dangerous assumption named + severity set
4. If CRITICAL: resolve challenge before step 5. Loop back to vision-brief if needed.
5. Dispatch `vision-improve`  → verify: Four Laws audit complete
6. Gate: stakeholder review confirmed before marking Approved

## Context Slicing
- `vision-intake`   receives: raw user input only
- `vision-brief`    receives: validated intake block only
- `vision-challenge`receives: Handoff Schema fields — value_proposition,
                              scope_boundaries, open_assumptions only
- `vision-improve`  receives: full schema + challenge_log entry for this phase

## Dispatch Sequence

**Step 1** → `vision-intake`: "Capture and validate raw input. Surface all
assumptions and ambiguities before brief generation begins."

**Step 2** → `vision-brief`: "Generate Executive Product Brief from validated
intake only. Apply Law 2. Minimum viable output."

**Step 3** → `vision-challenge`: "Challenge the schema. Find the single most
dangerous assumption. Do not fix anything."

**Step 4** — Evaluate challenge severity:
- CRITICAL → present to user, resolve, loop to Step 2 with corrected input
- WATCH → log to challenge_log, proceed to Step 5

**Step 5** → `vision-improve`: "Audit and improve. Apply all Four Laws.
Maximum 2 iterations."

**Step 6 — Gate:**
> "Has this brief been reviewed with your CEO/Sponsors?
> Confirm to mark Phase 1 Approved and unlock `/architect`."
