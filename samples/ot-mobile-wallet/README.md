# OpenText Mobile Wallet

A self-sovereign identity (SSI) mobile wallet built on Bifold core using the token override pattern.

## Architecture

This app is built on the [Bifold Wallet](https://github.com/openwallet-foundation/bifold-wallet) framework and reuses 85%+ of Bifold's production-ready screens and functionality.

### Custom Overrides

This wallet overrides specific Bifold screens to provide OpenText-specific user experience:

- **Onboarding** (`TOKENS.SCREEN_ONBOARDING`): Custom tour slides
- **Scan** (`TOKENS.SCREEN_SCAN`): Custom QR code handling (conditional)
- **Home** (`TOKENS.SCREEN_HOME`): Context-aware welcome screen
- **Theme**: OpenText branding (colors, logos, typography)

All other functionality (PIN/biometry, credentials, proofs, settings, agent setup) is provided by Bifold core.

## Architecture Documentation

See the [wallet-governance repo](https://github.com/jasbir-s-minhas/wallet-governance) for:
- **Migration strategy**: `docs/architecture/migration-recommendation.md`
- **Screen mapping**: `docs/architecture/screen-mapping.md`
- **QR format spec**: `docs/architecture/qr-format-spec.md`
- **Risk register**: `docs/architecture/risks.md`
- **Implementation backlog**: `docs/backlog/backlog.md`

## Development

### Prerequisites
- Node.js 18+
- Yarn 3+
- Xcode 15+ (for iOS)
- Android Studio (for Android)
- Ruby 2.7+ (for iOS CocoaPods)

### Setup

```bash
# Install dependencies (from monorepo root)
cd ~/workspace/mobile-wallets/bifold-wallet
yarn install

# Set up mobile app
cd samples/ot-mobile-wallet
yarn setup

# Start Metro bundler
yarn start

# Run on platform (in separate terminal)
yarn android
# or
yarn ios
```

## Project Structure

```
samples/ot-mobile-wallet/
├── src/
│   ├── screens/          # Custom screen overrides
│   │   ├── OTTourScreens.tsx
│   │   ├── OTScanScreen.tsx (conditional)
│   │   └── OTHomeScreen.tsx
│   ├── components/       # Custom components
│   ├── utils/            # Helper functions
│   ├── theme.ts          # OpenText theme configuration
│   └── container-setup.ts # Token registrations
├── android/              # Android native code
├── ios/                  # iOS native code
├── index.js              # App entry point
└── package.json          # Dependencies
```

## Token Override Pattern

This app uses Bifold's dependency injection system to override screens:

```typescript
// src/container-setup.ts
import { container } from 'tsyringe'
import * as TOKENS from '@bifold/core/tokens'

container.register(TOKENS.SCREEN_ONBOARDING, { useValue: OTTourScreens })
container.register(TOKENS.SCREEN_HOME, { useValue: OTHomeScreen })
container.register(TOKENS.THEME, { useValue: openTextTheme })
```

## Upstream Syncing

This app is maintained on the `ot-mobile-wallet` branch of the Bifold fork:

```bash
# Sync with upstream Bifold
git checkout main
git fetch upstream
git merge upstream/main
git push origin main

# Merge updates into OT wallet branch
git checkout ot-mobile-wallet
git merge main
```

See `~/workspace/mobile-wallets/wallet-governance/docs/architecture/repository-strategy.md` for detailed branching strategy.

## License

Apache License 2.0 (inherited from Bifold Wallet)
