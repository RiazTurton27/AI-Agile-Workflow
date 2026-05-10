# Changelog

All notable changes to this project are documented here.  
Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).  
Versioning follows [Semantic Versioning](https://semver.org/).

---

## [Unreleased]

_Planned for the next release. Not yet applied to any command files._

- npm initializer (`npx agile-plugin@latest init`) for one-command scaffolding
- `--skip-constitution` flag for updating command files without overwriting `CLAUDE.md`
- `agile-update` command to pull upstream patches while preserving local constitution edits

---

## [3.0.0] — 2026-05-10

### The adversarial release.

Every phase now includes a dedicated Challenger subagent whose sole function is to find the single most dangerous assumption before anything advances. The Retrospective was promoted from an optional step to a full phase — and the Challenger runs there too, applied to the patches themselves before any human sees them.

### Added

- **Adversarial Challenger (Subagent C) in every phase** — `vision-challenge.md`, `arch-challenge.md`, `sprint-challenge.md`, `retro-challenge.md`. Each Challenger answers one question: _"What would have to be true for this output to be confidently wrong?"_ Challengers do not edit, improve, or suggest fixes.
- **CRITICAL / WATCH severity system** — CRITICAL challenges set `status: Challenged` and halt phase advancement until a human resolves the assumption. WATCH challenges are logged and monitored across sprints.
- **Retrospective as Phase 4** — `/retro` now runs four subagents: pattern analysis, constitution patch generation, patch challenge, and patch audit. No file is modified without explicit per-patch human approval.
- **`retro-challenge.md`** — the Challenger applied to the Retrospective's own patches. Finds the patch most likely to make the system worse in the next sprint rather than better.
- **`challenge_log` in the Handoff Schema** — every challenge is recorded with phase, severity, dangerous assumption, break questions, resolution, and resolver. Carries across all phases and into the Retrospective.
- **Self-Improvement Loop (Subagent D) in every phase** — `vision-improve.md`, `arch-improve.md`, `sprint-improve.md`, `retro-improve.md`. Runs a Four Laws audit and a compression pass. Maximum 2 iterations. Halts if a CRITICAL challenge is unresolved.
- **`retro.unresolved_challenges`** — Retrospective now explicitly surfaces challenges that were carried unresolved into the sprint, for pattern analysis.
- **`retro.next_sprint_flags`** — early warning field populated by `retro-analyze` for WATCH items that didn't reach patch threshold but need monitoring.
- **`docs/index.html`** — plain-language (eli8) cover page, published via GitHub Pages.
- **`.github/ISSUE_TEMPLATE/bug_report.md`** — structured issue template requiring phase, subagent, and challenge severity.

### Changed

- **Handoff Schema** — extended with `challenge_log`, `improvement_log`, `retro.patterns_detected`, `retro.constitution_patches`, `retro.flagged_patches`, `retro.unresolved_challenges`, `retro.next_sprint_flags`, and `retro.law_violations`.
- **Phase gate language** — gates now explicitly require human confirmation that all CRITICAL challenges are resolved before marking a phase Approved.
- **`retro-prescribe.md`** — patch format tightened. Each patch now requires an `Assumption` field (root cause) and a `Prevents` field (pattern name). Max 3 lines of patch content enforced.
- **`retro-improve.md`** — renamed from `retro-patch.md`. Now audits patches against the Four Laws before presenting them for human approval. Moves FLAGGED patches to `retro.flagged_patches` rather than discarding them.
- **`CLAUDE.md` — Adversarial Principle section added** alongside the Four Laws. Defines Challenger role, CRITICAL/WATCH severity, and the rule that Challengers never edit.
- **Context slicing tightened** — every Orchestrator now lists exactly which schema fields each subagent receives. Subagents that previously received more context than needed have been narrowed.

### Fixed

- Subagent D in Phase 2 (`arch-improve.md`) previously ran before the challenge severity was evaluated in some edge cases. Precondition check (`status: Challenged` → halt) is now the first instruction in the file.
- `sprint-dor.md` non-negotiable testing rule was omitted from the schema update step in v2. Now explicitly included verbatim in the DoR audit output.

### Removed

- **`retro-patch.md`** — replaced by `retro-improve.md` with a broader audit scope.
- Freeform improvement notes in Phase 3 — replaced by the structured `improvement_log` array in the Handoff Schema.

---

## [2.0.0] — 2025-11-18

### The schema release.

Introduced the Handoff Schema as the sole means of passing context between subagents. Eliminated full conversation history passing, which was causing subagents to pick up assumptions from earlier phases they were not designed to handle.

### Added

- Handoff Schema (JSON) — single structured object passed between all subagents
- Phase gate confirmations — explicit human sign-off before phase advancement
- DoR (Definition of Ready) audit in Phase 3
- Kanban flow definition with entry/exit criteria and WIP limits
- `spec_version` versioning on schema output (`v0.1` → `v0.2` → `v1.0`)
- `architectural_guardrails` and `integration_flags` fields in the schema

### Changed

- Orchestrators now compress subagent output into the schema before dispatching the next subagent
- Phase 3 output renamed from "Sprint Plan" to "Sprint Readiness Package" to reflect its direct-paste intent

### Removed

- Full conversation history passing between subagents

---

## [1.0.0] — 2025-08-04

### Initial release.

Three-phase workflow: Vision, Architecture, Sprint Planning. Single-agent per phase. No adversarial validation. No schema. No retrospective.

Established the Four Laws and the principle that success criteria must be defined before any output is generated.

---

[Unreleased]: https://github.com/your-org/ai-agile-plugin/compare/v3.0.0...HEAD
[3.0.0]: https://github.com/your-org/ai-agile-plugin/compare/v2.0.0...v3.0.0
[2.0.0]: https://github.com/your-org/ai-agile-plugin/compare/v1.0.0...v2.0.0
[1.0.0]: https://github.com/your-org/ai-agile-plugin/releases/tag/v1.0.0
