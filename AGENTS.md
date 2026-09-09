# Agent Instructions

## Git Workflow — Branch + PR (MANDATORY)

**NEVER commit directly to `main`.** All work goes through feature branches and pull requests.

### Starting work

```bash
# 1. Start from up-to-date main
git checkout main && git pull

# 2. Create a feature branch
git checkout -b <branch-name>
```

### Committing and pushing

```bash
# Commit your changes on the feature branch
git add <files>
git commit -m "<description>"

# Push the branch to remote
git push -u origin <branch-name>
```

### Creating the PR

After pushing, create a pull request targeting `main`:

```bash
gh pr create --title "<description>" --body "<what changed and why>" --base main
```

## Landing the Plane (Session Completion)

**When ending a work session**, you MUST complete ALL steps below. Work is NOT complete until `git push` succeeds.

**MANDATORY WORKFLOW:**

1. **Run quality gates** (if code changed) - Tests, linters, builds
2. **PUSH TO REMOTE** - This is MANDATORY:
   ```bash
   git push
   git status  # MUST show "up to date with origin"
   ```
3. **Create PR if not already done** - Every branch needs a PR:
   ```bash
   gh pr create --title "<title>" --body "<body>" --base main
   ```
4. **Verify** - All changes committed, pushed, and PR created
5. **Hand off** - Provide context for next session

**CRITICAL RULES:**
- NEVER commit directly to `main` — always use a feature branch
- NEVER force push to `main`
- Work is NOT complete until `git push` succeeds AND a PR exists
- NEVER stop before pushing - that leaves work stranded locally
- NEVER say "ready to push when you are" - YOU must push
- If push fails, resolve and retry until it succeeds
