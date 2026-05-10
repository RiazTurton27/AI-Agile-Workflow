# AI-Agile Multi-Agent Workflow

A self-improving, adversarially-validated delivery workflow for [Claude Code](https://claude.ai/code).  
Each phase generates output, challenges its own assumptions, and improves before anything moves forward.

---

## What this is

A set of Claude Code slash commands that run your project through four phases — Vision, Architecture, Sprint Planning, and Retrospective — using a team of specialised subagents. Each phase includes an **Adversarial Challenger** whose only job is to find the single most dangerous assumption before the phase advances.

Nothing moves forward past a CRITICAL challenge without a human resolving it first.

---

## Prerequisites

- [Claude Code](https://claude.ai/code) installed and authenticated
- A project directory (existing or new)

---

## Quick start

### Option A — GitHub Template (recommended)

1. Click **Use this template** at the top of this repo
2. Name your new repo and clone it locally
3. Open the project in Claude Code
4. Run `/agile-start`

### Option B — Manual copy

```bash
# From your project root
curl -sSL https://raw.githubusercontent.com/your-org/ai-agile-plugin/main/install.sh | bash
```

> The install script copies `CLAUDE.md` and `.claude/commands/` into your project. It does not overwrite an existing `CLAUDE.md`.

---

## How it works

Run commands in order. Each phase requires the previous one to be approved before it unlocks.

```
/agile-start    Activates the system and shows the phase table
/vision         Phase 1 — define what to build and for whom
/architect      Phase 2 — break the vision into Epics, Stories, and Tasks
/sprint         Phase 3 — plan and gate the sprint, emit a readiness package
/retro          Phase 4 — after the sprint, detect patterns and patch the system
```

### Inside each phase

Every phase runs four subagents in strict sequence:

| Step | Subagent | Job |
|------|----------|-----|
| A | Generate | Produces the phase output |
| B | Generate | Extends or validates A's output |
| C ★ | **Challenge** | Finds the single most dangerous assumption. Does not fix anything. |
| D | Improve | Audits against the Four Laws. Max 2 iterations. |

A challenge marked **CRITICAL** halts the phase. You resolve it. Then D runs.  
A challenge marked **WATCH** is logged and monitored in the next sprint.

---

## The Four Laws

Every subagent follows these rules at every step.

| Law | Rule |
|-----|------|
| **Think first** | State assumptions before any output. If uncertain, stop and ask. |
| **Keep it simple** | Minimum output that solves the stated problem. Nothing speculative. |
| **Only touch your bit** | If you notice an issue outside your scope, flag it — don't fix it. |
| **Know what done looks like** | Define a verifiable success condition before starting. |

These laws are immutable. The Retrospective can patch subagent files but never the Four Laws in `CLAUDE.md`.

---

## The Handoff Schema

Subagents do not pass full conversation history to each other. The Orchestrator compresses each phase output into a structured JSON schema — the **Handoff Schema** — and passes only the relevant fields to the next subagent.

This keeps context lean, prevents subagents from being confused by irrelevant history, and makes the system auditable at every step.

The schema tracks: value proposition, scope boundaries, open assumptions, epics, stories, sprint goals, challenge log, improvement log, and retrospective patches.

---

## Phase gates

| After | Gate |
|-------|------|
| `/vision` | Stakeholder review confirmed |
| `/architect` | Architect and Feature Analyst review confirmed |
| `/sprint` | No gate — emits Sprint Readiness Package directly |
| `/retro` | Human approves each constitution patch individually |

---

## Repository structure

```
your-project/
├── CLAUDE.md                        ← Agent Constitution (immutable)
└── .claude/
    └── commands/
        ├── agile-start.md           ← Entry point
        ├── phase1/                  ← Vision (5 files)
        ├── phase2/                  ← Architecture (5 files)
        ├── phase3/                  ← Sprint (5 files)
        └── phase4/                  ← Retrospective (5 files)
```

Full file reference: see [docs/index.html](./docs/index.html) or the [project site](https://your-org.github.io/ai-agile-plugin).

---

## Integrations

The Sprint Readiness Package produced by `/sprint` is designed to be pasted directly into:

- Jira
- Azure DevOps
- Linear
- GitHub Projects

No reformatting required.

---

## Updating the plugin

The Retrospective phase (`/retro`) generates surgical patches to the command files based on patterns detected across sprints. Each patch is challenged before it is presented to you, and applied only after your explicit per-patch approval.

To pull upstream changes to the command files without affecting your `CLAUDE.md`:

```bash
curl -sSL https://raw.githubusercontent.com/your-org/ai-agile-plugin/main/install.sh | bash --skip-constitution
```

---

## Contributing

1. Fork the repo
2. Create a branch: `git checkout -b patch/your-change`
3. Make changes to command files only — do not modify the Four Laws
4. Open a pull request with the phase and subagent affected in the title

Bug reports: use the issue template. Include the phase, subagent, challenge severity, and the schema state at the point of failure.

---

## License

MIT — free to use, fork, and adapt. See [LICENSE](./LICENSE).

---

> **Plain language overview:** [docs/index.html](./docs/index.html)
