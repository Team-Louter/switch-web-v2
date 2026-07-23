/**
 * 폰트 토큰
 *
 * font-family, font-size, font-weight 값을 직접 지정할 때 사용합니다.
 * 여러 속성을 한 번에 적용할 때는 typography.mixin.ts의 token.typography를 사용합니다.
 *
 * 예시:
 *   import * as token from '@/shared/styles/values/token';
 *
 *   font-family: ${token.fontFamily.system};
 *   font-size: ${token.fontSize.body.md};
 *   font-weight: ${token.fontWeight.semibold};
 */
export const fontFamily = {
  system: '"Pretendard", "Inter", "Noto Sans KR", system-ui, sans-serif',
} as const

export const fontSize = {
  heading: {
    xxl: '2.25rem',
    xl: '2rem',
    lg: '1.75rem',
    md: '1.5rem',
    sm: '1.25rem',
  },
  body: {
    lg: '1.125rem',
    md: '1rem',
    sm: '0.875rem',
  },
  caption: {
    lg: '0.8125rem',
    md: '0.75rem',
    sm: '0.6875rem',
  },
} as const

export const fontWeight = {
  regular: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
} as const
