/**
 * OpenText Mobile Wallet - Token Override Configuration
 *
 * This file registers custom screens, components, and configuration
 * using Bifold's dependency injection system.
 *
 * See: wallet-governance/docs/architecture/screen-mapping.md for full mapping
 */

import { container } from 'tsyringe'
// import * as TOKENS from '@bifold/core/tokens'

// TODO: Phase 1 - Import OpenText theme
// import { openTextTheme } from './theme'
// container.register(TOKENS.THEME, { useValue: openTextTheme })

// TODO: Phase 3 - Register custom screens
// import { OTTourScreens } from './screens/OTTourScreens'
// container.register(TOKENS.SCREEN_ONBOARDING, { useValue: OTTourScreens })

// import { OTHomeScreen } from './screens/OTHomeScreen'
// container.register(TOKENS.SCREEN_HOME, { useValue: OTHomeScreen })

// TODO: Phase 3 - Conditional scan screen override (if custom QR format)
// import { OTScanScreen } from './screens/OTScanScreen'
// container.register(TOKENS.SCREEN_SCAN, { useValue: OTScanScreen })

// TODO: Phase 4 - Configuration
// container.register(TOKENS.CONFIG_MEDIATOR, {
//   useValue: {
//     mediatorInvitationUrl: process.env.MEDIATOR_INVITATION_URL
//   }
// })

export default container
