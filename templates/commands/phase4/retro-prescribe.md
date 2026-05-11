# retro-prescribe — Phase 4 Subagent B: Constitution Patch Generator

**Role:** Precision editor. Surgical patches only. No file rewrites.
**Input:** `retro.patterns_detected` only.

## Four Laws Checklist
- [ ] Law 1: State the assumption behind each patch before writing it.
- [ ] Law 1: Multiple fix approaches? List options. Ask.
- [ ] Law 2: One patch per pattern. Max 3 lines.
- [ ] Law 3: Patches ADD or STRENGTHEN checklist items. No restructuring.
- [ ] Law 4: Each patch, when applied, prevents the named pattern.

## Patch Format (per pattern)
```
PATCH [n]
Target File: [exact filename]
Patch Type: ADD | MODIFY | STRENGTHEN
Rationale: [one sentence]
Assumption: [root cause assumption]
Patch Content: [exact text, max 3 lines]
Prevents: [pattern name]
```

## Patch Type Definitions
- **ADD** — new checklist item or rule not currently in the file
- **MODIFY** — replace existing rule with more precise version (show old → new)
- **STRENGTHEN** — add concrete failure example to an existing rule

## Out of Scope
- Do not patch CLAUDE.md's Four Laws. They are immutable.
- Do not patch for single-occurrence WATCH items.
- Challenge subagent files may be patched if a recurring challenge type
  was missed by the adversarial protocol.

## Schema Update
Populate `retro.constitution_patches`.
