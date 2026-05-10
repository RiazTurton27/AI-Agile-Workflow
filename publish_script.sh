#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────
#  AI-Agile Plugin — repo setup + GitHub publish
#  Run from the folder where you want the repo to live.
#  Usage: bash setup-and-publish.sh
# ─────────────────────────────────────────────────────────────────

set -euo pipefail

REPO_NAME="AI-Agile-Workflow"
GITHUB_USER="RiazTurton27"
REMOTE="https://github.com/${GITHUB_USER}/${REPO_NAME}.git"

GREEN='\033[0;32m'; YELLOW='\033[1;33m'; RED='\033[0;31m'
CYAN='\033[0;36m';  DIM='\033[2m';       RESET='\033[0m'

ok()   { echo -e "  ${GREEN}✓${RESET}  $1"; }
info() { echo -e "  ${CYAN}i${RESET}  $1"; }
warn() { echo -e "  ${YELLOW}–${RESET}  $1"; }
fail() { echo -e "  ${RED}✗${RESET}  $1"; exit 1; }
line() { echo -e "  ${DIM}────────────────────────────────────────────────────${RESET}"; }

echo ""
echo -e "  ${GREEN}AI-Agile Plugin${RESET} — repo setup"
line

# ── 1. Preflight ──────────────────────────────────────────────────────────────

command -v git >/dev/null 2>&1 || fail "git not found. Install git and retry."
ok "git found"

GH_AVAILABLE=false
if command -v gh >/dev/null 2>&1; then
  GH_AVAILABLE=true
  ok "GitHub CLI found"
else
  warn "GitHub CLI not found — you'll create the repo manually (instructions below)"
fi

echo ""

# ── 2. Create directory structure ─────────────────────────────────────────────

info "Creating directory structure..."

mkdir -p .claude/commands/phase1
mkdir -p .claude/commands/phase2
mkdir -p .claude/commands/phase3
mkdir -p .claude/commands/phase4
mkdir -p .github/ISSUE_TEMPLATE
mkdir -p docs
mkdir -p bin
mkdir -p templates/commands/phase1
mkdir -p templates/commands/phase2
mkdir -p templates/commands/phase3
mkdir -p templates/commands/phase4

ok "Directories created"

# ── 3. Scaffold required files ────────────────────────────────────────────────
#
#  The files below need content from your session artifacts.
#  This script creates empty placeholders so the structure is
#  committed. Replace each file with the real content before
#  running /agile-start in Claude Code.
#
#  Files that DO have content written here:
#    - README.md       (paste from README artifact)
#    - CHANGELOG.md    (paste from CHANGELOG artifact)
#    - bin/cli.js      (paste from cli.js artifact)
#    - package.json
#    - .gitignore
#    - LICENSE
#    - docs/index.html (paste from eli8 cover page artifact)
#
#  Files that need content from your spec document:
#    - CLAUDE.md and all .claude/commands/*.md files

info "Creating support files..."

# ── package.json ──────────────────────────────────────────────────────────────

cat > package.json << 'EOF'
{
  "name": "agile-plugin",
  "version": "3.0.0",
  "description": "AI-Agile multi-agent workflow plugin for Claude Code",
  "bin": {
    "agile-plugin": "./bin/cli.js"
  },
  "files": [
    "bin/",
    "templates/"
  ],
  "scripts": {
    "prepublishOnly": "node scripts/validate-templates.js"
  },
  "engines": {
    "node": ">=18"
  },
  "keywords": [
    "claude",
    "claude-code",
    "agile",
    "ai",
    "multi-agent",
    "scrum"
  ],
  "license": "MIT",
  "repository": {
    "type": "git",
    "url": "https://github.com/RiazTurton27/AI-Agile-Workflow.git"
  },
  "homepage": "https://riazturton27.github.io/AI-Agile-Workflow"
}
EOF
ok "package.json"

# ── .gitignore ────────────────────────────────────────────────────────────────

cat > .gitignore << 'EOF'
# Claude Code cache
.claude/.cache/

# Local schema snapshots
*.schema.local.json
handoff-snapshot-*.json

# Node
node_modules/
npm-debug.log*

# OS
.DS_Store
Thumbs.db

# Editor
.vscode/
.idea/
*.swp
*.swo
EOF
ok ".gitignore"

# ── LICENSE (MIT) ─────────────────────────────────────────────────────────────

YEAR=$(date +%Y)
cat > LICENSE << EOF
MIT License

Copyright (c) ${YEAR} ${GITHUB_USER}

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
EOF
ok "LICENSE"

# ── Issue template ────────────────────────────────────────────────────────────

cat > .github/ISSUE_TEMPLATE/bug_report.md << 'EOF'
---
name: Bug report
about: Report an unexpected result from a subagent or orchestrator
---

**Phase**
<!-- 1 (Vision) / 2 (Architect) / 3 (Sprint) / 4 (Retro) -->

**Subagent**
<!-- e.g. vision-challenge, arch-improve -->

**Challenge severity (if applicable)**
<!-- CRITICAL / WATCH / N/A -->

**Schema status at point of failure**
<!-- Paste the relevant Handoff Schema fields -->

**What happened**
<!-- Describe the unexpected output -->

**What you expected**
<!-- Describe the correct output -->

**Claude Code version**
EOF
ok ".github/ISSUE_TEMPLATE/bug_report.md"

# ── Placeholder files for spec content ───────────────────────────────────────

COMMAND_FILES=(
  "CLAUDE.md"
  ".claude/commands/agile-start.md"
  ".claude/commands/phase1/vision.md"
  ".claude/commands/phase1/vision-intake.md"
  ".claude/commands/phase1/vision-brief.md"
  ".claude/commands/phase1/vision-challenge.md"
  ".claude/commands/phase1/vision-improve.md"
  ".claude/commands/phase2/architect.md"
  ".claude/commands/phase2/arch-epics.md"
  ".claude/commands/phase2/arch-stories.md"
  ".claude/commands/phase2/arch-challenge.md"
  ".claude/commands/phase2/arch-improve.md"
  ".claude/commands/phase3/sprint.md"
  ".claude/commands/phase3/sprint-plan.md"
  ".claude/commands/phase3/sprint-dor.md"
  ".claude/commands/phase3/sprint-challenge.md"
  ".claude/commands/phase3/sprint-improve.md"
  ".claude/commands/phase4/retro.md"
  ".claude/commands/phase4/retro-analyze.md"
  ".claude/commands/phase4/retro-prescribe.md"
  ".claude/commands/phase4/retro-challenge.md"
  ".claude/commands/phase4/retro-improve.md"
)

for f in "${COMMAND_FILES[@]}"; do
  if [ ! -f "$f" ]; then
    echo "# PLACEHOLDER — paste content from spec" > "$f"
  fi
done
ok "Command file placeholders created (22 files)"

# ── Empty stubs for artifacts you'll paste ────────────────────────────────────

touch README.md CHANGELOG.md docs/index.html bin/cli.js
ok "README.md, CHANGELOG.md, docs/index.html, bin/cli.js — created (paste content from session)"
echo ""

# ── 4. Git init ───────────────────────────────────────────────────────────────

info "Initialising git repository..."

if [ ! -d ".git" ]; then
  git init -b main
  ok "git init (branch: main)"
else
  warn ".git already exists — skipping init"
fi

# ── 5. Create GitHub repo ─────────────────────────────────────────────────────

echo ""
if [ "$GH_AVAILABLE" = true ]; then
  info "Creating GitHub repository via gh CLI..."
  gh repo create "${GITHUB_USER}/${REPO_NAME}" \
    --public \
    --description "AI-Agile multi-agent workflow plugin for Claude Code" \
    --homepage "https://${GITHUB_USER}.github.io/${REPO_NAME}" \
    || warn "Repo may already exist — continuing"
  ok "GitHub repo ready: https://github.com/${GITHUB_USER}/${REPO_NAME}"
else
  echo ""
  echo -e "  ${YELLOW}Manual step required:${RESET}"
  echo -e "  1. Go to https://github.com/new"
  echo -e "  2. Repository name: ${CYAN}${REPO_NAME}${RESET}"
  echo -e "  3. Set to ${CYAN}Public${RESET}"
  echo -e "  4. Do NOT initialise with README, .gitignore, or license"
  echo -e "  5. Press Enter here when done"
  read -r
fi

# ── 6. Remote + initial commit ────────────────────────────────────────────────

echo ""
info "Configuring remote..."

if git remote get-url origin >/dev/null 2>&1; then
  warn "Remote 'origin' already set — skipping"
else
  git remote add origin "$REMOTE"
  ok "Remote added: $REMOTE"
fi

info "Staging files..."
git add .

info "Committing..."
git commit -m "feat: initial scaffold — AI-Agile Plugin v3

- CLAUDE.md (Agent Constitution placeholder)
- 22 subagent command files (placeholders)
- bin/cli.js (npm initializer)
- package.json, .gitignore, LICENSE
- docs/index.html (eli8 cover page placeholder)
- .github/ISSUE_TEMPLATE/bug_report.md

Next: paste real content into placeholder files,
then commit and push."

info "Pushing to GitHub..."
git push -u origin main

echo ""
line
ok "Repo live: https://github.com/${GITHUB_USER}/${REPO_NAME}"
echo ""
echo -e "  ${DIM}Next steps:${RESET}"
echo -e "  1. Paste real content into the placeholder files"
echo -e "  2. ${CYAN}git add . && git commit -m 'feat: add spec content' && git push${RESET}"
echo -e "  3. Enable GitHub Pages → Settings → Pages → Branch: main → /docs"
echo -e "  4. ${CYAN}npm publish --access public${RESET} when ready"
echo ""
