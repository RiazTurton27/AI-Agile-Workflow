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
- `retro-analyze` → `improvement_log`, `challenge_log`, `law_violations`
- `retro-prescribe` → `retro.patterns_detected` only
- `retro-challenge` → `retro.constitution_patches` only
- `retro-improve` → `retro.constitution_patches` (post-challenge) only

---

## Handoff Schema

```json
{
  "phase": "[1 | 2 | 3]",
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
    "phase": "", "severity": "[CRITICAL | WATCH]",
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
      "rationale": "", "patch_content": ""
    }],
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
