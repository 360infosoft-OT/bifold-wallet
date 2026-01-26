# Custom Screens

This directory contains OpenText-specific screen overrides.

## Screens to Implement (Phase 3)

### High Priority
- `OTTourScreens.tsx` - Custom onboarding tour (3 slides)
- `OTScanScreen.tsx` - Custom QR scanner (conditional, if custom QR format)
- `OTHomeScreen.tsx` - Context-aware home screen

### Medium Priority
- `OTCredentialCard.tsx` - Custom credential display (conditional, test OCA first)

## Implementation Pattern

Each screen should:
1. Import necessary Bifold components and hooks
2. Implement custom logic/UI
3. Export for container registration

Example:
```typescript
// OTTourScreens.tsx
import React from 'react'
import { View, Text } from 'react-native'
import { useNavigation } from '@react-navigation/native'

export const OTTourScreens = () => {
  const navigation = useNavigation()

  return (
    <View>
      {/* Custom tour slides */}
    </View>
  )
}
```

## Reference

See `~/workspace/mobile-wallets/wallet-governance/docs/architecture/migration-recommendation.md`
for detailed implementation specifications.
