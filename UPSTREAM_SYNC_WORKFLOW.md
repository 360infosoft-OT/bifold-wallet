# Upstream Sync Workflow

This document describes the workflow for syncing OpenText Mobile Wallet with upstream Bifold updates.

## Repository Structure

```
Origin (Your Fork):     https://github.com/360infosoft-OT/bifold-wallet.git
Upstream (Bifold):      https://github.com/openwallet-foundation/bifold-wallet.git

Local Branches:
  - main                ← Your main branch (tracks origin/main)
  - ot-mobile-wallet    ← Feature branch for OT wallet development
```

## Directory Structure

```
samples/
├── app/                     ← Bifold reference (DO NOT MODIFY)
│   └── container-imp.tsx    ← Reference implementation patterns
└── ot-mobile-wallet/        ← Your OpenText customizations
    └── src/
        └── container-setup.ts  ← Your token overrides
```

## Weekly/Monthly Sync Workflow

### 1. Prepare for Sync

```bash
# Ensure you're on main branch
git checkout main

# Commit or stash any work in progress
git status
git stash  # if needed

# Fetch latest from upstream
git fetch upstream
```

### 2. Review Upstream Changes

```bash
# See what's new in upstream (last 20 commits)
git log main..upstream/main --oneline -20

# See changes in core package (most important)
git log main..upstream/main --oneline -- packages/core/

# See changes in reference app (for pattern examples)
git log main..upstream/main --oneline -- samples/app/

# Check for breaking changes
git log main..upstream/main --grep="BREAKING"
```

### 3. Merge Upstream Changes

```bash
# Merge upstream main into your main
git merge upstream/main

# If there are conflicts (unlikely):
# - Resolve them (focus on packages/core changes)
# - Do NOT modify samples/app/ unless necessary
# - Keep ot-mobile-wallet/ unchanged
```

### 4. Update Dependencies

```bash
# Install any new dependencies
yarn install

# Rebuild all packages
yarn build
```

### 5. Test Your OT Wallet

```bash
cd samples/ot-mobile-wallet

# Test that everything still works
yarn android
# OR
yarn ios

# Verify recent bug fixes work (e.g., #1750 back button fix)
```

### 6. Review New Patterns

```bash
# Check if reference app has new patterns you should adopt
git diff HEAD~1 samples/app/container-imp.tsx

# Look for new token override patterns
# Consider if any apply to OT wallet
```

### 7. Update Your Branch

```bash
# Switch to your feature branch
git checkout ot-mobile-wallet

# Rebase on updated main
git rebase main

# Test again
cd samples/ot-mobile-wallet
yarn android
```

### 8. Push Updates

```bash
# Push updated main to origin
git checkout main
git push origin main

# Push updated feature branch
git checkout ot-mobile-wallet
git push origin ot-mobile-wallet --force-with-lease
```

## Current Sync Status

**Last Sync Date:** 2026-02-01

**Your Local State:**
- Local main: `435de05d` - "docs: add CLAUDE.md for Claude AI context"
- Feature branch: `ot-mobile-wallet`
- Custom sample: `samples/ot-mobile-wallet/` (473 lines, 9 files)

**Upstream State:**
- Upstream main: `4c39a4b0` - "chore(release): new version (#1772)"
- Commits behind: 5 commits
- Notable upstream changes since your branch:
  - `4c39a4b0` - chore(release): new version (#1772)
  - `fecd99e2` - fix(metro): update core package.json exports (#1771)
  - `e7585e3d` - chore: Remove Card11 and CredentialCard (#1748)
  - `1422cac7` - chore(release): new version (#1770)
  - `e26f1ff0` - chore: bump i18next (#1769)

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

🔧 **samples/ot-mobile-wallet/** (Your code)
- Never touched by upstream
- No merge conflicts
- Your customizations safe

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
| Zero merge conflicts in core | 85% of changes just work |
| Automatic bug fixes | Security updates flow through |
| Clear separation | Easy to see what's custom |
| Can upgrade anytime | Low risk, high confidence |
| Can contribute back | PRs to core are clean |
| Multiple wallets possible | Can add more branded variants |

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
