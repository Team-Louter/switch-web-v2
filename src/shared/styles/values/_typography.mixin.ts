/**
 * typography 믹스인
 *
 * 텍스트의 font-family, font-size, font-weight를 한 번에 적용합니다.
 *
 * @param type "heading" | "body" | "caption"
 * @param size type에 속한 크기 값
 * @param weight "regular" | "medium" | "semibold" | "bold"
 *
 * 예시:
 *   import * as token from '@/shared/styles/values/token';
 *
 *   ${token.typography('heading', 'lg', 'bold')}
 *   ${token.typography('body', 'md', 'semibold')}
 *   ${token.typography('caption', 'sm', 'medium')}
 */
import { css } from 'styled-components'

import { fontFamily, fontSize, fontWeight } from './_typography'

type TypographyType = keyof typeof fontSize
type TypographyWeight = keyof typeof fontWeight

export const typography = <T extends TypographyType>(
  type: T,
  size: keyof (typeof fontSize)[T],
  weight: TypographyWeight,
) => css`
  font-family: ${fontFamily.system};
  font-size: ${(fontSize[type] as Record<string, string>)[size as string]};
  font-weight: ${fontWeight[weight]};
`
