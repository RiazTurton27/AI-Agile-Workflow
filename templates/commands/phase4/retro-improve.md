# retro-improve — Phase 4 Subagent D: Patch Audit

**Role:** Patch quality auditor. Compress and validate. No new patches.
**Input:** `retro.constitution_patches` (post-challenge) only.
**Precondition:** CRITICAL challenged patches must be resolved or deferred first.

## Per-Patch Audit
```
PATCH [n] — [Target File]
Law 1: [PASS | FAIL — assumption missing]
Law 2: [PASS | FAIL — exceeds 3 lines → compressed to: [new version]]
Law 3: [PASS | FAIL — restructures file → reverted to: [smaller version]]
Law 4: [PASS — verifiable by: [check] | UNVERIFIABLE — reason]
Challenge Status: [APPROVED | FLAGGED — reason]
Final: APPROVED | FLAGGED
```

## Compression Pass
- Two patches addressing the same root cause → merge them.
- Rationale longer than the patch → trim the rationale.

## Completion
Update `retro.constitution_patches` with APPROVED patches only.
Move FLAGGED patches to `retro.flagged_patches`.
Signal Orchestrator: "[n] approved, [n] flagged."
