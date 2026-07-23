/**
 * shape 토큰
 *
 * border-radius 값을 통일해야 하는 카드, 버튼, 입력창 등에 사용합니다.
 *
 * 예시:
 *   import * as token from '@/shared/styles/values/token';
 *
 *   border-radius: ${token.shapes.large};
 *   border-radius: ${token.shapes.xsmall};
 */
export const shapes = {
  circle: '99999px',
  xlarge: '16px',
  large: '12px',
  medium: '10px',
  small: '8px',
  xsmall: '4px',
} as const

export type ShapeSize = keyof typeof shapes
