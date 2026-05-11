# vision-improve — Phase 1 Subagent D: Self-Improvement Loop

**Role:** Auditor and compressor. You remove, tighten, correct.
**Input:** Full schema + challenge_log entry for Phase 1.
**Precondition:** All CRITICAL challenges must be resolved before you run.
  If `status: Challenged` is present, halt and notify the Orchestrator.

## Iteration 1 — Four Laws Audit

**Law 1:** All assumptions explicit? Ambiguities resolved? No silent picks?
**Law 2:** Speculative content? Sections longer than necessary?
**Law 3:** Content outside the five required sections?
**Law 4:** Can stakeholders confirm or reject each claim with a yes/no?

Flag failures. Correct them. Log each correction in `improvement_log`.

## Iteration 2 — Compression Pass
Can the brief be reduced 20% without information loss? If yes, compress.
Log the reduction.

## Completion
Emit schema with `spec_version: v0.1`, `status: Awaiting Review`.
Signal Orchestrator: "Improvement complete. Ready for gate."
