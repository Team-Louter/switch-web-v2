/**
 * 그림자 단계별 토큰과 믹스인
 *
 * 카드, 모달, 플로팅 UI처럼 레이어 깊이가 필요한 곳에 사용합니다.
 *
 * @param level "black_1" | "black_2" | "black_3" | "none"
 *
 * 예시:
 *   import * as token from '@/shared/styles/values/token';
 *
 *   ${token.elevation('black_1')}
 *   ${token.elevation('black_3')}
 */
import { css } from 'styled-components'

export const elevations = {
  black_1: '0 1px 2px rgba(0, 0, 0, 0.05)',
  black_2: '0 2px 6px rgba(0, 0, 0, 0.08)',
  black_3: '0 4px 12px rgba(0, 0, 0, 0.12)',
  none: 'none',
} as const

export type ElevationLevel = keyof typeof elevations

export const elevation = (level: ElevationLevel) => css`
  box-shadow: ${elevations[level]};
`
