# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

A four-phase AI-Agile workflow: Vision → Architecture → Sprint Planning → Retrospective. Each phase dispatches four subagents in strict sequence (Generate → Generate → Challenge → Improve) and passes context exclusively through a structured Handoff Schema.

---

## Agent Constitution — The Four Laws (Immutable)

**These laws apply to every subagent at every step. They cannot be modified by the Retrospective.**

### Law 1 — Think Before Acting
State assumptions explicitly before any output. List all interpretations when ambiguous; never pick silently. Stop and ask if something is unclear.

### Law 2 — Simplicity First
Minimum output that solves the stated problem. No speculative content, no unrequested features, no abstractions for single-use deliverables.

### Law 3 — Surgical Changes
Touch only what the current task requires. Flag issues outside scope — do not fix them.

### Law 4 — Goal-Driven Execution
Transform every task into a verifiable goal before starting. Define a success condition and explicit verify checkpoints.

---

## The Adversarial Principle

Every phase has a **Challenger subagent (C)** whose sole function is to find the single most dangerous assumption before the phase advances.

Challengers:
- Do **not** edit, improve, or fix output.
- Answer one question: *"What would have to be true for this schema to be confidently wrong?"*
- Set severity: **CRITICAL** (phase halts, human must resolve) or **WATCH** (logged, monitored).

A `status: Challenged` schema must not advance until the CRITICAL challenge is resolved.

---

## Phase Commands and Subagent Sequence

```
/agile-start  → activates the system, shows phase table
/vision       → Phase 1: Product Vision
/architect    → Phase 2: Architecture (requires Phase 1 Approved)
/sprint       → Phase 3: Sprint Planning (requires Phase 2 Approved)
/retro        → Phase 4: Retrospective (runs after sprint completes)
```

Each phase runs four subagents in strict order:

| Step | Role | Constraint |
|------|------|-----------|
| A | Generate (primary) | Produces phase output |
| B | Generate (secondary) | Extends or validates A |
| C ★ | **Challenger** | Finds the single most dangerous assumption. Never edits. |
| D | Improve | Four Laws audit + compression. Max 2 iterations. Halts if `status: Challenged`. |

### Phase gates (human confirmation required)
- After `/vision`: stakeholder review confirmed → mark `Approved`, unlock `/architect`
- After `/architect`: architect + feature analyst review confirmed → mark `Approved`, unlock `/sprint`
- After `/sprint`: no gate — emits Sprint Readiness Package directly
- After `/retro`: per-patch human approval before any file is modified

---

## Schema Validation

Every subagent emits a Handoff Schema instance. The instance must validate
against `schema/handoff-schema.json` (JSON Schema Draft 2020-12).

After each subagent emission, the orchestrator must parse the emitted JSON
and check it against the schema. If validation fails, halt and surface the
failing field path to the user before proceeding.

Local maintainers and CI can validate any saved snapshot offline:

```bash
node scripts/validate-schema.js path/to/snapshot.json
```

`npm test` validates the example schema instances in `schema/examples/`.

---

## Context Management

Subagents receive only the schema fields they need. Orchestrators compress each subagent's output into the Handoff Schema before dispatching the next subagent. **Never pass full conversation history between agents.**

### Context slicing per phase

**Phase 1 (/vision):**
- `vision-intake` → raw user input only
- `vision-brief` → validated intake block only
- `vision-challenge` → `value_proposition`, `scope_boundaries`, `open_assumptions`
- `vision-improve` → full schema + Phase 1 `challenge_log` entry

**Phase 2 (/architect):**
- `arch-epics` → `value_proposition`, `scope_boundaries`
- `arch-stories` → `epics` array only
- `arch-challenge` → `epics`, `stories`, `architectural_guardrails`
- `arch-improve` → full schema + Phase 2 `challenge_log` entry

**Phase 3 (/sprint):**
- `sprint-plan` → `stories`, `epics`
- `sprint-dor` → `stories` array only
- `sprint-challenge` → `sprint_goals`, `stories` (with DoR status)
- `sprint-improve` → full schema + Phase 3 `challenge_log` entry

**Phase 4 (/retro):**
- `retro-analyze` → `improvement_log`, `challenge_log`
- `retro-prescribe` → `retro.patterns_detected` only
- `retro-challenge` → `retro.constitution_patches` only
- `retro-improve` → `retro.constitution_patches` (post-challenge) only

`retro-analyze` produces `retro.law_violations` as part of its output — it is
not an input. Read the formal schema at `schema/handoff-schema.json` for
authoritative field definitions.

---

## Handoff Schema

The authoritative definition lives at `schema/handoff-schema.json`. The block
below is a human-readable summary; if the two disagree, the JSON Schema wins.

```json
{
  "phase": "[1 | 2 | 3 | 4]",
  "spec_version": "[v0.1 | v0.2 | v1.0]",
  "status": "[In Progress | Challenged | Awaiting Review | Approved | Sprint Ready]",
  "value_proposition": "",
  "scope_boundaries": [],
  "open_assumptions": [],
  "epics": [{ "id": "E1", "name": "", "features": [] }],
  "stories": [{
    "id": "S1", "epic": "E1",
    "statement": "As a [user], I want [action], so that [value].",
    "tasks": [], "acceptance_criteria": [],
    "dor_status": "[READY | NOT READY — reason]"
  }],
  "architectural_guardrails": [],
  "integration_flags": [],
  "sprint_goals": [],
  "challenge_log": [{
    "phase": "[1 | 2 | 3 | 4]",
    "severity": "[CRITICAL | WATCH]",
    "dangerous_assumption": "",
    "break_questions": [],
    "resolution": "Unresolved",
    "resolved_by": "Pending"
  }],
  "improvement_log": [],
  "retro": {
    "sprint_ref": "",
    "patterns_detected": [],
    "law_violations": { "law1": [], "law2": [], "law3": [], "law4": [] },
    "unresolved_challenges": [],
    "constitution_patches": [{
      "target_file": "", "patch_type": "[ADD | MODIFY | STRENGTHEN]",
      "rationale": "", "patch_content": "",
      "challenge_status": "[APPROVED | CRITICAL | WATCH]"
    }],
    "flagged_patches": [],
    "next_sprint_flags": []
  }
}
```

`spec_version` increments: `v0.1` (end of Phase 1) → `v0.2` (end of Phase 2) → `v1.0` (Sprint Ready).

---

## Retrospective patch rules

- `retro-prescribe` may ADD, MODIFY, or STRENGTHEN checklist items in any command file.
- **The Four Laws in this file are immutable — retro-prescribe must never patch them.**
- Each patch requires: `target_file`, `patch_type`, `rationale`, `assumption` (root cause), `patch_content` (max 3 lines), `prevents` (pattern name).
- CRITICAL-challenged patches must be resolved or deferred before `retro-improve` runs.
- No file is modified without explicit per-patch human approval.

---

## Sprint Readiness Package

The output of `/sprint` (`status: Sprint Ready`, `spec_version: v1.0`) is designed to be pasted directly into Jira, Azure DevOps, Linear, or GitHub Projects without reformatting.

---

## File Architecture

This plugin uses a two-layer file structure. Commands are thin dispatchers;
all phase behaviour lives in workflow files.

```
.claude/
  commands/                    ← thin dispatchers (3 lines each, user-facing)
    agile-start.md             → reads .claude/workflows/agile-start.md
    phase1/vision.md           → reads .claude/workflows/phase1.md
    phase2/architect.md        → reads .claude/workflows/phase2.md
    phase3/sprint.md           → reads .claude/workflows/phase3.md
    phase4/retro.md            → reads .claude/workflows/phase4.md
    phase1/vision-intake.md    ← subagent A behaviour (referenced by workflow)
    phase1/vision-brief.md     ← subagent B behaviour
    phase1/vision-challenge.md ← subagent C behaviour (Challenger)
    phase1/vision-improve.md   ← subagent D behaviour
    phase2/ phase3/ phase4/    ← same pattern for each phase
  workflows/                   ← source of behaviour (edit here, not in commands)
    agile-start.md             ← activation + session recovery logic
    phase1.md                  ← Phase 1 orchestration + disk write spec
    phase2.md                  ← Phase 2 orchestration + disk write spec
    phase3.md                  ← Phase 3 orchestration + disk write spec
    phase4.md                  ← Phase 4 orchestration + disk write spec

.planning/                     ← persistent state (committed to git)
  VISION.md                    ← Phase 1 human-readable output
  ARCHITECTURE.md              ← Phase 2 human-readable output
  handoff-schema.json          ← Handoff Schema instance (updated each phase)
  sprints/
    sprint-01/
      PLAN.md                  ← Sprint Readiness Package
      KANBAN.md                ← Kanban column definitions
  retrospectives/
    retro-01/
      PATTERNS.md              ← Pattern analysis
      PATCHES.md               ← Applied and deferred patches
```

**Do not edit command orchestrators** (e.g. `phase1/vision.md`) — they are
thin dispatchers. Edit the corresponding `.claude/workflows/phase1.md` instead.

---

## Persistent State (.planning/)

Phase outputs are written to `.planning/` and committed to git. This means:

- Sessions survive context resets. Run `/agile-start` to recover position.
- Phase N reads from disk at the start, not from in-context memory, so
  cross-session handoffs are reliable.
- Progress is reviewable as git diffs.

The `.planning/handoff-schema.json` file is the machine-readable state.
The markdown files (`VISION.md`, `ARCHITECTURE.md`, sprint plans, retro
reports) are human-readable summaries for stakeholder review.
