# Agent Instructions

This project uses **bd** (beads) for issue tracking. Run `bd onboard` to get started.

## Quick Reference

```bash
bd ready              # Find available work
bd show <id>          # View issue details
bd update <id> --status in_progress  # Claim work
bd close <id>         # Complete work
bd sync               # Sync with git
```

## Git Workflow — Branch + PR (MANDATORY)

**NEVER commit directly to `main`.** All work goes through feature branches and pull requests.

### Starting work on an issue

```bash
# 1. Start from up-to-date main
git checkout main && git pull

# 2. Create a feature branch named after the issue
git checkout -b <issue-id>
# Example: git checkout -b docs-z6h.1

# 3. Claim the issue
bd update <issue-id> --status in_progress
```

### Committing and pushing

```bash
# Commit your changes on the feature branch
git add <files>
git commit -m "<description> (<issue-id>)"

# Push the branch to remote
git push -u origin <branch-name>
```

### Creating the PR

After pushing, create a pull request targeting `main`:

```bash
gh pr create --title "<description> (<issue-id>)" --body "<what changed and why>" --base main
```

### Closing the issue

After the PR is created and pushed:

```bash
bd close <issue-id> --reason "<commit-hash> <description>"
bd sync
git add .beads/ && git commit -m "beads: close <issue-id>" && git push
```

### Multiple issues in one branch

If you are working on multiple related issues (e.g. all children of one epic), you MAY use a single branch:

```bash
git checkout -b <epic-id>
# Work on all child issues, committing each separately
# Create one PR covering all changes
```

## Landing the Plane (Session Completion)

**When ending a work session**, you MUST complete ALL steps below. Work is NOT complete until `git push` succeeds.

**MANDATORY WORKFLOW:**

1. **File issues for remaining work** - Create issues for anything that needs follow-up
2. **Run quality gates** (if code changed) - Tests, linters, builds
3. **Update issue status** - Close finished work, update in-progress items
4. **PUSH TO REMOTE** - This is MANDATORY:
   ```bash
   git push
   git status  # MUST show "up to date with origin"
   ```
5. **Create PR if not already done** - Every branch needs a PR:
   ```bash
   gh pr create --title "<title>" --body "<body>" --base main
   ```
6. **Verify** - All changes committed, pushed, and PR created
7. **Hand off** - Provide context for next session

**CRITICAL RULES:**
- NEVER commit directly to `main` — always use a feature branch
- NEVER force push to `main`
- Work is NOT complete until `git push` succeeds AND a PR exists
- NEVER stop before pushing - that leaves work stranded locally
- NEVER say "ready to push when you are" - YOU must push
- If push fails, resolve and retry until it succeeds
