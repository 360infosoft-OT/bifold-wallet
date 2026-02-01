/**
 * OpenText Mobile Wallet - Container Setup
 *
 * This file sets up the dependency injection container for OT Mobile Wallet.
 * It creates a child container from Bifold's MainContainer and registers
 * custom token overrides for OpenText-specific functionality.
 */

import { Container } from '@bifold/core/src/container-api'
// import * as TOKENS from '@bifold/core/src/container-api'

/**
 * OTWalletContainer
 *
 * Extends Bifold's core functionality with OpenText-specific customizations.
 * Currently uses default Bifold configuration - customizations can be added by
 * registering token overrides in the init() method.
 */
export class OTWalletContainer implements Container {
  private _container: Container['container']

  public get container(): Container['container'] {
    return this._container
  }

  public constructor(bifoldContainer: Container) {
    // Create child container that inherits all Bifold defaults
    this._container = bifoldContainer.container.createChildContainer()
  }

  public init(): Container {
    // Register custom token overrides here
    // Examples:
    //
    // Custom theme:
    // import { openTextTheme } from './theme'
    // this.container.registerInstance(TOKENS.THEME, openTextTheme)
    //
    // Custom onboarding:
    // import { OTTourScreens } from './screens/OTTourScreens'
    // this.container.registerInstance(TOKENS.SCREEN_ONBOARDING, OTTourScreens)
    //
    // Custom home screen:
    // import { OTHomeScreen } from './screens/OTHomeScreen'
    // this.container.registerInstance(TOKENS.SCREEN_HOME, OTHomeScreen)

    return this
  }

  public resolve<K extends keyof import('@bifold/core/src/container-api').TokenMapping>(
    token: K
  ): import('@bifold/core/src/container-api').TokenMapping[K] {
    return this.container.resolve(token) as import('@bifold/core/src/container-api').TokenMapping[K]
  }

  public resolveAll<K extends keyof import('@bifold/core/src/container-api').TokenMapping>(
    token: K
  ): Array<import('@bifold/core/src/container-api').TokenMapping[K]> {
    return this.container.resolveAll(token) as Array<import('@bifold/core/src/container-api').TokenMapping[K]>
  }
}
