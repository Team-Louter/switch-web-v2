export const NAME_STYLE_PRESETS = {
  default: {
    color: '#191919',
    fontWeight: 500,
  },

  PINK: { color: '#F06292', fontWeight: 600 },
  SKY: { color: '#3B82F6', fontWeight: 600 },
  MINT: { color: '#14B8A6', fontWeight: 600 },
  LOUTER: { color: '#FFBB00', fontWeight: 600 },
  LAVENDER: { color: '#9B87F5', fontWeight: 600 },
  CORAL: { color: '#FF6F61', fontWeight: 600 },
  LIME: { color: '#84CC16', fontWeight: 600 },
  PEACH: { color: '#FFAB91', fontWeight: 600 },
  VIOLET: { color: '#8B5CF6', fontWeight: 600 },
  ROSE: { color: '#FB7185', fontWeight: 600 },
  TEAL: { color: '#0D9488', fontWeight: 600 },

  PINK_GLOW: {
    color: '#FF8FB3',
    fontWeight: 600,
    textShadow: '0 0 6px rgba(255, 143, 179, 0.35)',
  },
  SKY_GLOW: {
    color: '#60A5FA',
    fontWeight: 600,
    textShadow: '0 0 6px rgba(96, 165, 250, 0.35)',
  },

  OCEAN_GRADIENT: {
    backgroundImage:
      'linear-gradient(90deg, #2563EB 0%, #06B6D4 50%, #2DD4BF 100%)',
    fontWeight: 600,
  },
  SUNSET_GRADIENT: {
    backgroundImage:
      'linear-gradient(90deg, #FB7185 0%, #FB923C 50%, #FACC15 100%)',
    fontWeight: 600,
  },
  CANDY_GRADIENT: {
    backgroundImage:
      'linear-gradient(90deg, #F472B6 0%, #A78BFA 50%, #818CF8 100%)',
    fontWeight: 600,
  },
  MINT_GRADIENT: {
    backgroundImage:
      'linear-gradient(90deg, #34D399 0%, #14B8A6 50%, #0EA5E9 100%)',
    fontWeight: 600,
  },
  PEACH_GRADIENT: {
    backgroundImage:
      'linear-gradient(90deg, #FDE68A 0%, #FCA5A5 50%, #F472B6 100%)',
    fontWeight: 600,
  },
  AURORA_GRADIENT: {
    backgroundImage:
      'linear-gradient(90deg, #6366F1 0%, #22D3EE 50%, #A3E635 100%)',
    fontWeight: 600,
  },
  RAINBOW_GRADIENT: {
    backgroundImage:
      'linear-gradient(90deg, #FF6B6B 0%, #FFD93D 20%, #6BCB77 40%, #4D96FF 60%, #9B72CF 80%, #FF6FB0 100%)',
    fontWeight: 600,
  },
} as const

export type NameStyleKey = keyof typeof NAME_STYLE_PRESETS
export type NameStylePreset = (typeof NAME_STYLE_PRESETS)[NameStyleKey]
