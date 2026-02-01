import { ThemeBuilder, bifoldTheme } from '@bifold/core'

const otTheme = new ThemeBuilder(bifoldTheme)
  .withOverrides({
    themeName: 'opentext',
    ColorPalette: {
      brand: {
        primary: '#1555CC',
        primaryDisabled: 'rgba(21, 85, 204, 0.35)',
        secondary: '#FFFFFF',
        secondaryDisabled: 'rgba(21, 85, 204, 0.7)',
        tertiary: '#FFFFFF',
        tertiaryDisabled: 'rgba(21, 85, 204, 0.7)',
        primaryLight: 'rgba(21, 85, 204, 0.35)',
        highlight: '#E1BC36',
        primaryBackground: '#000000',
        secondaryBackground: '#000000',
        tertiaryBackground: '#000000',
        modalPrimary: '#1555CC',
        modalSecondary: '#FFFFFF',
        modalTertiary: '#FFFFFF',
        modalPrimaryBackground: '#000000',
        modalSecondaryBackground: '#000000',
        modalTertiaryBackground: '#000000',
        modalIcon: '#FFFFFF',
        unorderedList: '#FFFFFF',
        unorderedListModal: '#FFFFFF',
        link: '#1555CC',
        credentialLink: '#1555CC',
        text: '#FFFFFF',
        icon: '#FFFFFF',
        headerIcon: '#FFFFFF',
        headerText: '#FFFFFF',
        buttonText: '#FFFFFF',
        tabBarInactive: '#D3D3D3',
        inlineError: '#FF0000',
        inlineWarning: '#FF9000',
      },
      semantic: {
        error: '#D8292F',
        success: '#1555CC',
        focus: '#1555CC',
      },
      notification: {
        success: '#000000',
        successBorder: '#1555CC',
        successIcon: '#1555CC',
        successText: '#FFFFFF',
        info: '#000000',
        infoBorder: '#1555CC',
        infoIcon: '#1555CC',
        infoText: '#FFFFFF',
        warn: '#000000',
        warnBorder: '#E1BC36',
        warnIcon: '#E1BC36',
        warnText: '#FFFFFF',
        error: '#000000',
        errorBorder: '#D8292F',
        errorIcon: '#D8292F',
        errorText: '#FFFFFF',
        popupOverlay: 'rgba(0, 0, 0, 0.5)',
      },
    },
  })
  .build()

export { otTheme }
export const themes = [otTheme]
