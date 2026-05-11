# /retro — Phase 4 Retrospective Orchestrator

**Phase:** 4 (runs after each completed sprint)
**Role:** Delivery Intelligence Lead
**Input Required:** Completed schema with `status: Sprint Ready`

## Execution Plan
1. Dispatch `retro-analyze`   → verify: patterns named with evidence
2. Dispatch `retro-prescribe` → verify: each patch targets a specific file
3. Dispatch `retro-challenge` → verify: patches challenged before presentation
4. Dispatch `retro-improve`   → verify: approved patches are surgical
5. Present patch set to user per-patch. Apply only approved patches.

## Context Slicing
- `retro-analyze`   receives: `improvement_log` + `challenge_log` + `law_violations`
- `retro-prescribe` receives: `retro.patterns_detected` only
- `retro-challenge` receives: `retro.constitution_patches` only
- `retro-improve`   receives: `retro.constitution_patches` (post-challenge) only

## Key Rule
No file is modified without explicit human approval per patch.
