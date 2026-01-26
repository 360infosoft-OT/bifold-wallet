/**
 * OpenText Mobile Wallet
 * Entry point - loads Bifold core with custom container setup
 */

import { AppRegistry } from 'react-native'
import App from '@bifold/core/App'
import container from './src/container-setup'

// Register the app with React Native
AppRegistry.registerComponent('OTWallet', () => App)

// Export container for testing
export { container }
