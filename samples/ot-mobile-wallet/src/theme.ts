/**
 * OpenText Mobile Wallet - Theme Configuration
 *
 * This file defines the OpenText brand theme using Bifold's ThemeBuilder.
 *
 * See: wallet-governance/docs/architecture/migration-recommendation.md
 * Section: "Theme & Branding"
 */

import { ThemeBuilder } from '@bifold/core'

// TODO: Phase 1 - Extract exact brand colors from AuthentiGate app
// TODO: Phase 1 - Import custom fonts if needed
// TODO: Phase 1 - Import logo and tab icons

/**
 * OpenText brand theme
 * Based on AuthentiGate visual design
 */
export const openTextTheme = new ThemeBuilder()
  // TODO: Update with exact OpenText brand colors
  .withBrandColors({
    primary: '#0066CC',           // OpenText blue (placeholder - verify)
    secondary: '#4A90E2',         // Secondary blue (placeholder - verify)
    primaryBackground: '#FFFFFF',
    secondaryBackground: '#F5F7FA',
  })
  .withTextColors({
    normal: '#333333',
    label: '#666666',
    title: '#000000',
    error: '#D32F2F',
    success: '#2E7D32',
  })
  .withButtons({
    primary: {
      color: '#FFFFFF',
      backgroundColor: '#0066CC',
      border: '#0066CC',
    },
    secondary: {
      color: '#0066CC',
      backgroundColor: '#FFFFFF',
      border: '#0066CC',
    },
  })
  .withListItems({
    credentialBackground: '#F9FAFB',
    credentialBorder: '#E5E7EB',
  })
  // TODO: Add custom tab icons
  // TODO: Add custom header logo
  // TODO: Add typography overrides if custom fonts used
  .build()
