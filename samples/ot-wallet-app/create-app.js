import React, { useEffect } from 'react'
import { StatusBar } from 'react-native'
import SplashScreen from 'react-native-splash-screen'
import Toast from 'react-native-toast-message'

import { useNavigationContainerRef } from '@react-navigation/native'
import { isTablet } from 'react-native-device-info'
import Orientation from 'react-native-orientation-locker'
import {
  AnimatedComponentsProvider,
  AuthProvider,
  ContainerProvider,
  ErrorBoundaryWrapper,
  ErrorModal,
  NavContainer,
  NetworkProvider,
  StoreProvider,
  ThemeProvider,
  TourProvider,
  animatedComponents,
  bifoldLoggerInstance,
  initStoredLanguage,
  toastConfig,
  tours,
  RootStack,
} from '@bifold/core'
import { KeyboardProvider } from 'react-native-keyboard-controller'

import { themes, otTheme } from './ot-theme'

const createApp = (container) => {
  const AppComponent = () => {
    const navigationRef = useNavigationContainerRef()

    useEffect(() => {
      initStoredLanguage().then()
    }, [])

    useEffect(() => {
      // Hide the native splash / loading screen so that our
      // RN version can be displayed.
      SplashScreen.hide()
    }, [])

    if (!isTablet()) {
      Orientation.lockToPortrait()
    }

    return (
      <ErrorBoundaryWrapper logger={bifoldLoggerInstance}>
        <ContainerProvider value={container}>
          <StoreProvider>
            <ThemeProvider themes={themes} defaultThemeName={otTheme.themeName}>
              <NavContainer navigationRef={navigationRef}>
                <AnimatedComponentsProvider value={animatedComponents}>
                  <AuthProvider>
                    <NetworkProvider>
                      <StatusBar
                        hidden={false}
                        barStyle="light-content"
                        backgroundColor={otTheme.ColorPalette.brand.primary}
                        translucent={false}
                      />
                      <ErrorModal />
                      <TourProvider tours={tours} overlayColor={'gray'} overlayOpacity={0.7}>
                        <KeyboardProvider statusBarTranslucent={true} navigationBarTranslucent={true}>
                          <RootStack />
                        </KeyboardProvider>
                      </TourProvider>
                      <Toast topOffset={15} config={toastConfig} />
                    </NetworkProvider>
                  </AuthProvider>
                </AnimatedComponentsProvider>
              </NavContainer>
            </ThemeProvider>
          </StoreProvider>
        </ContainerProvider>
      </ErrorBoundaryWrapper>
    )
  }

  return AppComponent
}

export default createApp
