# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Bifold is an open-source React Native mobile wallet for managing digital identities and verifiable credentials, built on Credo (formerly Aries Framework Javascript). It uses a monorepo architecture with a token-based dependency injection system that enables complete customization.

## Monorepo Structure

This is a Yarn workspaces monorepo with two main directories:

- **packages/** - Reusable libraries:
  - `core` - Main Bifold framework (screens, components, services, DI container)
  - `oca` - Overlay Capture Architecture for credential styling
  - `verifier` - Proof request and verification utilities
  - `react-native-attestation` - Attestation functionality
  - `remote-logs` - Remote logging service

- **samples/** - Wallet implementations:
  - `app` - Reference Bifold wallet implementation
  - `ot-wallet-app` - OpenText wallet (custom branded wallet)

## Common Commands

### Setup & Installation
```bash
# Install all dependencies
yarn install

# Build all packages (required before running apps)
yarn build

# Clean all build artifacts
yarn clean
```

### Development
```bash
# Run tests in watch mode (from packages/core)
cd packages/core
yarn test:watch

# Run all tests
yarn test

# Type checking across all packages
yarn typecheck

# Linting
yarn lint

# Format code
yarn prettier --write .
```

### Running Sample Apps

#### Quick Start (if packages already built)

If you've already built the packages, run directly from the sample app directory:

```bash
# Navigate to sample app
cd samples/ot-wallet-app/

# Setup Android dependencies (first time only)
yarn android:setup

# Setup iOS dependencies (first time only, macOS only)
yarn ios:setup

# Start Metro bundler (Terminal 1)
yarn start

# Run on Android (Terminal 2)
yarn android

# Run on iOS (Terminal 2, macOS only)
yarn ios
```

#### Full Setup (first time or after package changes)

If this is your first time or you've made changes to packages (core, oca, etc.):

```bash
# 1. Build all packages from repository root
cd ~/workspace/acg-did/bifold-wallet
yarn build

# 2. Navigate to ot-wallet-app
cd samples/ot-wallet-app

# 3. Setup native dependencies (first time only)
yarn android:setup   # For Android
yarn ios:setup       # For iOS (macOS only)

# 4. Start Metro bundler (Terminal 1)
yarn start

# 5. Run the app (Terminal 2)
yarn android   # For Android
yarn ios       # For iOS
```

#### When to Run Each Command

**`yarn build` (from root)** - Run when:
- First time setup
- You've modified code in `packages/core` or `packages/oca`
- After pulling upstream changes
- After switching branches
- Build artifacts in `packages/*/lib` need to be regenerated

**`yarn android:setup` / `yarn ios:setup`** - Run when:
- First time running the app
- Native dependencies have changed
- After cleaning node_modules
- Gradle or Pods need to be updated

**`yarn start`** - Run:
- Every time you want to develop (keeps Metro bundler running)
- After changes to JavaScript/TypeScript code

**`yarn android` / `yarn ios`** - Run:
- To build and install the app on device/emulator
- After native code changes
- After Metro bundler is already running

#### Reference Sample vs OT Wallet

- **`samples/app/`** - Reference Bifold wallet (unbranded)
- **`samples/ot-wallet-app/`** - OpenText branded wallet (OT Wallet)

Both use the same commands, just run them from the respective directory.

### Testing

```bash
# Run core tests (must set TZ=GMT for datetime consistency)
cd packages/core
TZ=GMT jest

# Watch mode with coverage
yarn test:watch

# Coverage report
yarn coverage
```

### Build Individual Packages

```bash
cd packages/core
yarn build  # Uses react-native-builder-bob

cd packages/oca
yarn build  # Uses TypeScript compiler

cd packages/verifier
yarn build  # Uses TypeScript compiler
```

## Architecture: Token Override Pattern

Bifold's core architecture is built on **tsyringe** dependency injection with a token system that allows complete customization without forking.

### Key Concepts

1. **Container System** (`packages/core/src/container-api.ts`, `container-impl.ts`):
   - All screens, components, and services are registered as tokens
   - `MainContainer` provides default implementations
   - Apps create child containers and override specific tokens
   - Type-safe via `TokenMapping` interface

2. **Token Categories**:
   - `SCREEN_*` - Screen components (onboarding, home, scan, etc.)
   - `COMPONENT_*` - UI components (headers, buttons, footers)
   - `UTIL_*` - Services (logger, OCA resolver, agent bridge)
   - `CONFIG` - App configuration and feature flags
   - `FN_*` - Injectable functions (PIN hashing, onboarding callbacks)

3. **Override Pattern** (see `samples/app/container-imp.tsx`):
   ```typescript
   class AppContainer implements Container {
     constructor(bifoldContainer: Container) {
       // Create child container - inherits parent, can override
       this._container = bifoldContainer.container.createChildContainer()
     }

     init(): Container {
       // Override specific tokens
       this.container.registerInstance(TOKENS.SCREEN_ONBOARDING, CustomOnboarding)
       this.container.registerInstance(TOKENS.THEME, customTheme)
       return this
     }
   }
   ```

4. **Component Resolution** (`useServices` hook):
   ```typescript
   const [header, config, notifications] = useServices([
     TOKENS.COMPONENT_HOME_HEADER,
     TOKENS.CONFIG,
     TOKENS.NOTIFICATIONS,
   ])
   ```

### When Customizing a Wallet

To create a branded wallet:

1. Create a new sample in `samples/your-wallet/`
2. Create `container-setup.ts` that registers token overrides
3. Override only what's needed:
   - `TOKENS.THEME` for branding
   - `TOKENS.SCREEN_*` for custom screens
   - `TOKENS.COMPONENT_*` for custom UI
   - `TOKENS.CONFIG` for feature flags
4. Reuse 85%+ of Bifold's production screens

**See `samples/ot-wallet-app/` for a minimal customization example.**

## Credo Integration

Bifold is tightly integrated with Credo for wallet functionality.

### Agent Modules Setup

The agent is configured in `packages/core/src/utils/agent.ts` via `getAgentModules()`:

- **AskarModule** - Secure wallet storage
- **AnonCredsModule** - Anonymous credentials
- **IndyVdrModule** - Indy ledger integration with caching
- **DidsModule** - **IMPORTANT**: Must explicitly register ALL DID resolvers:
  ```typescript
  dids: new DidsModule({
    resolvers: [
      new WebvhDidResolver(),  // from @credo-ts/webvh
      new WebDidResolver(),     // core
      new JwkDidResolver(),     // core
      new KeyDidResolver(),     // core
      new PeerDidResolver(),    // core
    ],
  })
  ```
  **When new DID methods are added to Credo packages, you must register them here.**

- **OpenId4VcHolderModule** - OpenID4VC credentials
- **MediationRecipientModule** - Mobile mediator support
- **PushNotificationsModule** - APNS/FCM

### AgentBridge Pattern

`AgentBridge` service (`packages/core/src/services/AgentBridge.ts`) decouples agent from React context:

```typescript
// Listen for agent ready (e.g., after PIN unlock)
agentBridge.onReady((agent) => { ... }, persistent = true)

// Listen for agent changes
agentBridge.onChange((agent) => { ... })

// Set agent on unlock
agentBridge.setAgent(agent)

// Clear agent on lock
agentBridge.clearAgent()
```

Use this instead of directly accessing agent from context in services.

### Mediator Configuration

Mobile wallets need a mediator since devices don't have fixed IPs. Configure via:

1. Create `samples/app/.env`:
   ```
   MEDIATOR_URL=https://us-east.public.mediator.indiciotech.io/message?oob=...
   ```

2. Mediator invitations must include goal code: `"aries.vc.mediate"`

## State Management

Bifold uses a Redux-style reducer pattern with persistent storage:

- **Store Context** (`packages/core/src/contexts/store.ts`):
  - LoginAttempt, Preferences, Migration, Tours, Onboarding state
  - Loaded from AsyncStorage on app start via `TOKENS.LOAD_STATE`
  - State persists across app restarts

- **Context Providers** (see `createApp()` in `packages/core/src/App.tsx`):
  ```
  ContainerProvider (DI)
    └─ StoreProvider (State)
       └─ ThemeProvider (Branding)
          └─ AuthProvider (PIN/Biometry)
             └─ NetworkProvider (Connectivity)
                └─ TourProvider (Onboarding)
  ```

## Build System

### Build Order (Topological)

```bash
yarn build  # Builds all workspaces in dependency order
```

Internally runs: `yarn workspaces foreach --all --topological-dev -p run build`

### Package Build Targets

**packages/core** uses `react-native-builder-bob`:
- Output: `lib/commonjs/`, `lib/module/`, `lib/typescript/`
- Configured in `react-native-builder-bob` section of package.json

**packages/oca** and **packages/verifier** use TypeScript compiler:
- Output: `build/`

### Native Builds

**iOS** (requires macOS):
```bash
cd samples/app/ios
pod install
cd ..
yarn ios
```

**Android**:
```bash
cd samples/app
yarn android
```

## Testing

### Test Setup

- **Jest** with React Native preset
- **12s timeout** for async credential operations
- **TZ=GMT required** for consistent datetime tests
- Mock files: `__mocks__/` directories for file system, styles, i18n, Credo modules

### Running Tests

```bash
# Core tests (most comprehensive)
cd packages/core
TZ=GMT jest

# Watch mode
yarn test:watch

# All workspaces
yarn test
```

### Test Patterns

When testing credential operations:
- Use 12s timeout (configured in jest.config.js)
- Mock Credo agent via `__mocks__/@credo-ts/`
- Mock AsyncStorage via `@react-native-async-storage/async-storage`

## CI/CD Workflows

### .github/workflows/

- **main.yaml** - Native builds on push/PR
  - iOS: Xcode build + pod install
  - Android: Gradle build
  - Caches: CocoaPods, Gradle, derived data

- **publish.yaml** - npm publishing via Changesets
  - Uses `@changesets/cli`
  - Run `yarn changeset` to create changeset
  - Run `yarn changeset-version` to bump versions
  - Run `yarn release` to publish

- **quality.yaml** - Linting, formatting, type checking

## Important Development Notes

### Node & Yarn Versions

**Strict version requirements** (enforced in package.json):
- Node: `>=20.19.2 <21.0.0`
- Yarn: `4.9.2`

Use exact versions to avoid dependency issues.

### TypeScript Configuration

- Strict mode enabled
- Path resolution configured for monorepo (`@bifold/*` imports)
- Shared configs in `@react-native/typescript-config`

### Dependency Resolutions

Root `package.json` includes critical resolutions:
- `tsyringe: "4.8.0"` - Pinned for DI stability
- Several Credo patches in `.yarn/patches/`
- React Native version locked to `0.81.5`

**Do not change these resolutions without testing thoroughly.**

### Credo Patches

Several Credo packages use Yarn patches (see `resolutions` in root package.json):
- `@credo-ts/anoncreds`
- `@credo-ts/core`
- `@credo-ts/indy-vdr`
- `@credo-ts/openid4vc`

Patches are in `.yarn/patches/`. When upgrading Credo, reapply or regenerate patches.

### .env Configuration

Sample apps need `.env` file:
```bash
# samples/ot-wallet-app/.env
MEDIATOR_URL=https://...

# Or for reference app
# samples/app/.env
MEDIATOR_URL=https://...
```

**Never commit .env files** - they may contain environment-specific URLs or credentials.

### OpenID4VC Credential Refresh

Bifold supports automated credential refresh (OpenID4VCI + SD-JWT). See:
- `docs/openid-refresh.md` - Flow overview
- `docs/cred-lifecycle-arc.md` - Technical diagrams

Key components:
- `RefreshOrchestrator` - Manages refresh lifecycle
- Status list verification for SD-JWT credentials
- Automated refresh with stored refresh tokens

## File Structure Reference

```
bifold-wallet/
├── packages/
│   ├── core/                         # Main framework
│   │   ├── src/
│   │   │   ├── container-api.ts      # Token definitions
│   │   │   ├── container-impl.ts     # Default container
│   │   │   ├── App.tsx               # App factory
│   │   │   ├── screens/              # Default screens
│   │   │   ├── components/           # Reusable components
│   │   │   ├── contexts/             # React contexts
│   │   │   ├── services/             # Business logic
│   │   │   │   └── AgentBridge.ts    # Agent lifecycle
│   │   │   └── utils/
│   │   │       └── agent.ts          # Credo agent setup
│   │   ├── lib/                      # Build output
│   │   └── __tests__/                # Tests
│   ├── oca/                          # OCA implementation
│   ├── verifier/                     # Verification utils
│   └── remote-logs/                  # Logging service
├── samples/
│   ├── app/                          # Reference wallet
│   │   ├── container-imp.tsx         # Custom container
│   │   ├── android/                  # Android native
│   │   ├── ios/                      # iOS native
│   │   └── .env.example              # Config template
│   └── ot-wallet-app/             # OpenText wallet
│       └── src/
│           └── container-setup.ts    # Token overrides
├── .github/workflows/                # CI/CD
├── docs/                             # Architecture docs
└── package.json                      # Root workspace config
```

## Customization Checklist

When creating a new branded wallet (like ot-wallet-app):

1. **Create sample directory**: `samples/your-wallet/`
2. **Copy package.json** from `samples/ot-wallet-app/` (OpenText example) or `samples/app/` (reference)
3. **Update workspace dependency**: `"@bifold/core": "workspace:*"`
4. **Create container-setup.ts** with token overrides:
   - Theme (colors, logos, typography)
   - Custom screens (onboarding, home, etc.)
   - Configuration (feature flags, mediator URL)
5. **Copy native projects** from `samples/ot-wallet-app/android/` and `samples/ot-wallet-app/ios/`
6. **Update bundle identifiers** and app names in native projects
7. **Create .env file** with mediator configuration
8. **Build packages from root**: `cd ~/workspace/acg-did/bifold-wallet && yarn build`
9. **Setup native dependencies**: `cd samples/your-wallet && yarn android:setup`
10. **Run app**: `yarn start` (Terminal 1) then `yarn android` (Terminal 2)

**Example: OT Wallet** - See `samples/ot-wallet-app/` for a working example of a branded wallet with custom theme and configuration.

## Troubleshooting Common Issues

### Build fails after dependency update
```bash
yarn clean
yarn install
yarn build
```

### Metro bundler cache issues
```bash
yarn start --reset-cache
```

### iOS pod install issues
```bash
cd samples/app/ios
pod deintegrate
pod install
```

### Android build issues
```bash
cd samples/app/android
./gradlew clean
```

### Agent initialization fails
- Check mediator URL in `.env`
- Verify DID resolvers registered in `getAgentModules()`
- Check AsyncStorage permissions

### Tests fail with timeout
- Ensure `TZ=GMT jest` is used
- Check 12s timeout in jest.config.js
- Verify mocks in `__mocks__/` directories

## Additional Documentation

- **Main README**: `/README.md` - Setup instructions, developer guide
- **OpenID Refresh**: `/docs/openid-refresh.md` - Credential lifecycle
- **Architecture Diagrams**: `/docs/cred-lifecycle-arc.md` - Technical flows
- **Contributing Guide**: Referenced in README (community guidelines)
- **Bi-weekly User Group**: https://wiki.openwallet.foundation/display/BIFOLD/

## Community

- **Discord**: https://discord.gg/openwalletfoundation (#bifold, #credo channels)
- **GitHub Issues**: https://github.com/openwallet-foundation/bifold-wallet/issues
- **Design Roadmap**: https://github.com/openwallet-foundation/bifold-wallet/issues/754
