# Upstream Sync Workflow

This document describes the workflow for syncing OpenText Mobile Wallet with upstream Bifold updates.

## 🎯 Quick Reference

**Daily Development:**
```bash
# ALWAYS work on ot-mobile-wallet branch
git checkout ot-mobile-wallet
# Make changes, commit, push...
```

**Weekly/Monthly Sync:**
```bash
# 1. Sync main via GitHub UI (click "Sync fork" button) OR:
git checkout main && git fetch upstream && git reset --hard upstream/main

# 2. Update your work
git checkout ot-mobile-wallet && git rebase main

# 3. Test and push
yarn install && yarn build && yarn android
git push origin ot-mobile-wallet --force-with-lease
```

**NEVER:**
- ❌ Don't commit to main branch
- ❌ Don't add files to main branch
- ❌ Don't push to upstream remote (read-only)

## Repository Structure

```
Origin (Your Fork):     https://github.com/360infosoft-OT/bifold-wallet.git
Upstream (Bifold):      https://github.com/openwallet-foundation/bifold-wallet.git

Local Branches:
  - main                ← EXACT MIRROR of upstream/main (read-only, never commit here)
  - ot-mobile-wallet    ← YOUR WORKING BRANCH (all development happens here)
  - backup/main-before-restructure ← Safety backup of old main state
```

**IMPORTANT:** Main branch is now a pure mirror of upstream. All your work (including documentation) lives in the `ot-mobile-wallet` branch.

## Directory Structure

**Main Branch (mirrors upstream):**
```
samples/
└── app/                     ← Bifold reference implementation
```

**ot-mobile-wallet Branch (your work):**
```
samples/
├── app/                     ← Bifold reference (inherited from main)
└── ot-mobile-wallet/        ← Your OpenText customizations (ONLY in this branch)
    └── src/
        └── container-setup.ts  ← Your token overrides

Root Directory:
├── CLAUDE.md                         ← Project documentation
├── UPSTREAM_SYNC_WORKFLOW.md         ← This file
└── SYNC_IMPLEMENTATION_SUMMARY.md    ← Implementation record
```

**Note:** Documentation files and ot-mobile-wallet/ directory only exist in the `ot-mobile-wallet` branch, NOT in `main`.

## Weekly/Monthly Sync Workflow

### Option A: GitHub UI Sync (Recommended - Easiest)

**Step 1: Sync on GitHub**
1. Go to: https://github.com/360infosoft-OT/bifold-wallet
2. You'll see: "This branch is X commits behind openwallet-foundation:main"
3. Click **"Sync fork"** button
4. Click **"Update branch"**
5. GitHub will fast-forward origin/main to match upstream/main

**Step 2: Pull Locally**
```bash
# Pull the synced main
git checkout main
git pull origin main

# Review what changed
git log -10 --oneline
```

**Step 3: Update Your Work Branch**
```bash
# Rebase your work on updated main
git checkout ot-mobile-wallet
git rebase main

# Resolve conflicts if any (rare)
# Then: git rebase --continue
```

**Step 4: Test & Push**
```bash
# Test your wallet
yarn install && yarn build
cd samples/ot-mobile-wallet && yarn android

# Push updated branch
git push origin ot-mobile-wallet --force-with-lease
```

### Option B: Command Line Sync (Alternative)

**If you prefer terminal workflow:**

```bash
# 1. Update main from upstream
git checkout main
git fetch upstream
git reset --hard upstream/main  # Force main to match upstream
git push origin main --force-with-lease  # Keep origin in sync

# 2. Review changes
git log -10 --oneline

# 3. Update your work branch
git checkout ot-mobile-wallet
git rebase main

# 4. Test and push
yarn install && yarn build
cd samples/ot-mobile-wallet && yarn android
git push origin ot-mobile-wallet --force-with-lease
```

### Review Upstream Changes (Optional)

```bash
# See what's new in upstream (before syncing)
git fetch upstream
git log main..upstream/main --oneline -20

# See changes in core package (most important)
git log main..upstream/main --oneline -- packages/core/

# See changes in reference app (for pattern examples)
git log main..upstream/main --oneline -- samples/app/

# Check for breaking changes
git log main..upstream/main --grep="BREAKING"
```

### Review New Patterns (Optional)

```bash
# Check if reference app has new patterns you should adopt
git diff HEAD~1 samples/app/container-imp.tsx

# Look for new token override patterns
# Consider if any apply to OT wallet
```

## Current Sync Status

**Last Restructure:** 2026-02-01
**Last Sync:** 2026-02-01

**Branch Structure (After Restructuring):**
- `main`: `4c39a4b0` - Exact mirror of upstream (✅ synced)
- `ot-mobile-wallet`: `9f2d85f1` - Your working branch (4 commits ahead of main)
- `backup/main-before-restructure`: `6b0a8c8f` - Safety backup of old state

**What Changed:**
- ✅ Main now mirrors upstream exactly (no documentation, no ot-mobile-wallet/)
- ✅ All work moved to ot-mobile-wallet branch (includes CLAUDE.md, etc.)
- ✅ Rebased ot-mobile-wallet on latest upstream (5 new commits incorporated)
- ✅ Zero conflicts expected on future syncs

## What Gets Updated Automatically

When you pull from upstream, these inherit changes automatically:

✅ **packages/core/** (85% of updates)
- Screen components
- Default UI components
- Business logic services
- Agent configuration
- Bug fixes

✅ **packages/oca/** (OCA implementation)

✅ **packages/verifier/** (Verification utilities)

✅ **Root configuration**
- Yarn workspace setup
- Build scripts
- CI/CD workflows

## What You Should Review

📖 **samples/app/** (Reference patterns only)
- New token override examples
- New configuration patterns
- Don't merge conflicts here - they're just examples

## What Stays Isolated

🔧 **ot-mobile-wallet Branch (Your code)**
- samples/ot-mobile-wallet/ (never touched by upstream)
- CLAUDE.md (project documentation)
- UPSTREAM_SYNC_WORKFLOW.md (this file)
- SYNC_IMPLEMENTATION_SUMMARY.md (implementation record)
- No merge conflicts ever
- Your customizations completely safe

## Comparison Commands

```bash
# See your customizations vs reference app
diff samples/app/container-imp.tsx samples/ot-mobile-wallet/src/container-setup.ts

# See what upstream changed in core
git diff HEAD..upstream/main packages/core/

# See what you've added locally
git log upstream/main..HEAD --oneline
```

## Common Scenarios

### Scenario 1: Bug Fix Released

Upstream fixes a bug in `packages/core/`:

```bash
git fetch upstream
git merge upstream/main
yarn install && yarn build
cd samples/ot-mobile-wallet && yarn android
```

Result: Bug fix automatically available in your wallet.

### Scenario 2: New Feature Added

Upstream adds a new screen to `packages/core/`:

```bash
git fetch upstream
git merge upstream/main
yarn build
```

Result: New screen automatically available. Decide if you want to:
- Use it as-is (do nothing)
- Override it with custom version (register token in container-setup.ts)

### Scenario 3: Reference App Updated

Upstream shows a new token override pattern in `samples/app/`:

```bash
git diff HEAD..upstream/main samples/app/container-imp.tsx
```

Result: Review the pattern, adopt if useful for OT wallet.

## Token Override Examples

When you need to customize, add to `samples/ot-mobile-wallet/src/container-setup.ts`:

```typescript
public init(): Container {
  // 1. Custom theme
  import { openTextTheme } from './theme'
  this.container.registerInstance(TOKENS.THEME, openTextTheme)

  // 2. Custom screen
  import { OTHomeScreen } from './screens/OTHomeScreen'
  this.container.registerInstance(TOKENS.SCREEN_HOME, OTHomeScreen)

  // 3. Custom component
  import { OTHeader } from './components/OTHeader'
  this.container.registerInstance(TOKENS.COMPONENT_HOME_HEADER, OTHeader)

  return this
}
```

## Troubleshooting

### Merge Conflicts in packages/core

**Unlikely** - This shouldn't happen unless you modified core directly.

Fix: Accept upstream version (they're the experts).

### Merge Conflicts in samples/app

**Not a problem** - This is just a reference. You can:
- Accept upstream version (recommended)
- Ignore conflicts (you don't use this sample)

### OT Wallet Breaks After Merge

Check:
1. Did dependencies change? Run `yarn install`
2. Did core API change? Check git log for BREAKING changes
3. Did token interface change? Update container-setup.ts

### Want to Contribute Back to Bifold

Found a bug in core? Want to improve something?

```bash
# Create a branch from upstream main
git checkout -b fix/my-bug-fix upstream/main

# Make changes to packages/core only
vim packages/core/src/...

# Create PR to upstream
git push origin fix/my-bug-fix
# Open PR on GitHub to openwallet-foundation/bifold-wallet
```

## Benefits of This Workflow

| Benefit | Impact |
|---------|--------|
| Main = upstream exactly | Can see upstream changes with `git log main` |
| Zero-effort syncs | Just click "Sync fork" button on GitHub |
| Zero merge conflicts | Main never diverges from upstream |
| Easy comparison | `git diff main..ot-mobile-wallet` shows all customizations |
| Clean history | Clear separation between upstream and custom code |
| No accidental changes to main | All work happens on feature branch |
| Can switch to any upstream version | `git reset --hard upstream/v2.12.0` |
| Automatic bug fixes | Security updates flow through |
| Can contribute back | PRs to core are clean |

## Next Steps

1. **Immediate:** Run your first sync now (see commands above)
2. **Schedule:** Set calendar reminder for weekly/monthly sync
3. **Document:** Note which tokens you override in container-setup.ts
4. **Test:** Set up automated tests for OT wallet customizations
5. **Monitor:** Watch Bifold Discord #bifold channel for major announcements

## Resources

- **Bifold Discord:** https://discord.gg/openwalletfoundation (#bifold channel)
- **GitHub Issues:** https://github.com/openwallet-foundation/bifold-wallet/issues
- **Bi-weekly User Group:** https://wiki.openwallet.foundation/display/BIFOLD/
- **This Repo:** https://github.com/360infosoft-OT/bifold-wallet
