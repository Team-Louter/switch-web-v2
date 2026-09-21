/**
 * 색상 토큰
 *
 * 컴포넌트의 color, background, border 등에 직접 사용합니다.
 *
 * 예시:
 *   import * as token from '@/shared/styles/values/token';
 *
 *   color: ${token.colors.text.strong};
 *   background: ${token.colors.background.f5};
 *   border: 1px solid ${token.colors.line.normal};
 */
export const colors = {
  white: '#FFFFFF',

  primary: {
    primary0: 'var(--switch-primary-0, #FFFAE5)',
    primary10: 'var(--switch-primary-10, #FFF6CC)',
    primary20: 'var(--switch-primary-20, #FFED99)',
    primary30: 'var(--switch-primary-30, #FFE366)',
    primary40: 'var(--switch-primary-40, #FFDA33)',
    primary50: 'var(--switch-primary-50, #FFD101)',
    primary60: 'var(--switch-primary-60, #CCA700)',
    primary70: 'var(--switch-primary-70, #997D00)',
    primary80: 'var(--switch-primary-80, #665400)',
    primary90: 'var(--switch-primary-90, #332A00)',
    primary100: 'var(--switch-primary-100, #1A1500)',
    text: 'var(--switch-primary-text, #FFBB00)',
    foreground: 'var(--switch-primary-foreground, #0E0D0C)',
  },

  point: {
    primary: '#FFD600',
    text: '#997D00',
  },

  gray: {
    gray0: '#F3F2F1',
    gray10: '#E8E7E3',
    gray20: '#D0CFC8',
    gray30: '#B9B6AC',
    gray40: '#A19E91',
    gray50: '#8A8676',
    gray60: '#6E6B5E',
    gray70: '#535046',
    gray80: '#37362F',
    gray90: '#1C1B17',
    gray100: '#0E0D0C',
  },

  danger: {
    danger0: '#FCDFD9',
    danger10: '#F48771',
    danger20: '#BD2C0F',
    danger30: '#5C180A',
    danger40: '#260903',
  },

  warning: {
    warning0: '#FFE5CC',
    warning10: '#FFB266',
    warning20: '#FF8914',
    warning30: '#994D00',
    warning40: '#331A00',
  },

  success: {
    success0: '#D8EEDD',
    success10: '#7EC88E',
    success20: '#228738',
    success30: '#1F4727',
    success40: '#0E2012',
  },

  info: {
    info0: '#D3EBFD',
    info10: '#5FB5F7',
    info20: '#096AB3',
    info30: '#053961',
    info40: '#021A2C',
  },
} as const

export type Colors = typeof colors
