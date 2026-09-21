export type PaletteId = 'yellow' | 'blue'

export interface PaletteColors {
  primary0: string
  primary10: string
  primary20: string
  primary30: string
  primary40: string
  primary50: string
  primary60: string
  primary70: string
  primary80: string
  primary90: string
  primary100: string
  text: string
  foreground: string
}

export interface Palette {
  id: PaletteId
  label: string
  swatch: string
  colors: PaletteColors
}

export const PALETTES: Record<PaletteId, Palette> = {
  yellow: {
    id: 'yellow',
    label: 'Switch Yellow',
    swatch: '#FFD101',
    colors: {
      primary0: '#FFFAE5',
      primary10: '#FFF6CC',
      primary20: '#FFED99',
      primary30: '#FFE366',
      primary40: '#FFDA33',
      primary50: '#FFD101',
      primary60: '#CCA700',
      primary70: '#997D00',
      primary80: '#665400',
      primary90: '#332A00',
      primary100: '#1A1500',
      text: '#FFBB00',
      foreground: '#0E0D0C',
    },
  },
  blue: {
    id: 'blue',
    label: 'Blue',
    swatch: '#0066B3',
    colors: {
      primary0: '#EAF4FB',
      primary10: '#D5E9F6',
      primary20: '#AED4EC',
      primary30: '#7DB8DD',
      primary40: '#4A96C5',
      primary50: '#0066B3',
      primary60: '#005A9E',
      primary70: '#00497F',
      primary80: '#00385F',
      primary90: '#002943',
      primary100: '#001C2E',
      text: '#0066B3',
      foreground: '#FFFFFF',
    },
  },
}

export const PALETTE_OPTIONS = Object.values(PALETTES)
export const DEFAULT_PALETTE_ID: PaletteId = 'yellow'
