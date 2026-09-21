import { createGlobalStyle } from 'styled-components'

import type { Palette } from './values/_palettes'

interface PaletteThemeStyleProps {
  $palette: Palette
}

export const PaletteThemeStyle = createGlobalStyle<PaletteThemeStyleProps>`
  :root {
    --switch-primary-0: ${({ $palette }) => $palette.colors.primary0};
    --switch-primary-10: ${({ $palette }) => $palette.colors.primary10};
    --switch-primary-20: ${({ $palette }) => $palette.colors.primary20};
    --switch-primary-30: ${({ $palette }) => $palette.colors.primary30};
    --switch-primary-40: ${({ $palette }) => $palette.colors.primary40};
    --switch-primary-50: ${({ $palette }) => $palette.colors.primary50};
    --switch-primary-60: ${({ $palette }) => $palette.colors.primary60};
    --switch-primary-70: ${({ $palette }) => $palette.colors.primary70};
    --switch-primary-80: ${({ $palette }) => $palette.colors.primary80};
    --switch-primary-90: ${({ $palette }) => $palette.colors.primary90};
    --switch-primary-100: ${({ $palette }) => $palette.colors.primary100};
    --switch-primary-text: ${({ $palette }) => $palette.colors.text};
    --switch-primary-foreground: ${({ $palette }) =>
      $palette.colors.foreground};
  }
`
