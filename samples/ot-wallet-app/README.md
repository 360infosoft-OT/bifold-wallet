# OpenText Wallet

OpenText Wallet is a branded mobile wallet based on the Bifold framework for managing digital identities and verifiable credentials.

## Overview

This wallet is built on top of the Bifold core framework and uses the token-based dependency injection pattern to enable customization while maintaining compatibility with upstream Bifold updates.

## Quick Start

### Prerequisites

- Node.js >= 20.19.2 < 21.0.0
- Yarn 4.9.2
- For iOS: macOS with Xcode
- For Android: Android Studio with SDK

### Installation

From the repository root:

```bash
# Install all dependencies
yarn install

# Build all packages
yarn build
```

### Running the App

#### Android

```bash
cd samples/ot-wallet-app

# Setup Android dependencies (first time only)
yarn android:setup

# Run on Android device/emulator
yarn android
```

#### iOS

```bash
cd samples/ot-wallet-app

# Setup iOS dependencies (first time only)
yarn ios:setup

# Run on iOS simulator
yarn ios
```

## Configuration

### Environment Variables

Copy `.env.example` to `.env` and configure:

```bash
cp .env.example .env
```

Key configuration options:
- `MEDIATOR_URL`: URL for the mediator service (required for mobile wallet operation)

### Customization

This wallet uses Bifold's token override pattern for customization. See `container-imp.tsx` for examples of how to override:

- **Theme**: Colors, logos, typography
- **Screens**: Custom onboarding, home screen, etc.
- **Components**: Headers, buttons, footers
- **Configuration**: Feature flags, settings

## Project Structure

```
samples/ot-wallet-app/
├── android/          # Android native code
├── ios/              # iOS native code
├── src/              # Source code (if customizations added)
├── container-imp.tsx # DI container overrides
├── index.js          # App entry point
├── package.json      # Dependencies and scripts
└── .env              # Environment configuration (not in git)
```

## App Details

- **Package Name (Android)**: com.opentext.wallet
- **Bundle ID (iOS)**: com.opentext.wallet (or as configured in Xcode)
- **Display Name**: OpenText Wallet
- **App Name**: OTWallet

## Development

### Available Scripts

- `yarn android` - Run on Android
- `yarn ios` - Run on iOS
- `yarn start` - Start Metro bundler
- `yarn android:setup` - Setup Android dependencies
- `yarn ios:setup` - Setup iOS dependencies

### Building for Production

See the main Bifold documentation for production build instructions.

## Based on Bifold

This wallet is built using the [Bifold Wallet](https://github.com/openwallet-foundation/bifold-wallet) framework from the OpenWallet Foundation.

For more information about Bifold's architecture and customization options, see:
- [Main Documentation](../../README.md)
- [CLAUDE.md](../../CLAUDE.md) - Developer guide
- [Bifold Community](https://discord.gg/openwalletfoundation)
