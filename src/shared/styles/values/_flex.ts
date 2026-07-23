/**
 * flex 레이아웃 믹스인
 *
 * styled-components 안에서 반복되는 flex 선언을 줄일 때 사용합니다.
 *
 * 예시:
 *   import * as token from '@/shared/styles/values/token';
 *
 *   ${token.flexRow}
 *   ${token.flexCenter}
 *   ${token.flexBetween}
 */
import { css } from 'styled-components'

export const flexRow = css`
  display: flex;
  flex-direction: row;
`

export const flexColumn = css`
  display: flex;
  flex-direction: column;
`

export const flexCenter = css`
  display: flex;
  align-items: center;
  justify-content: center;
`

export const flexLeft = css`
  display: flex;
  align-items: center;
  justify-content: flex-start;
`

export const flexRight = css`
  display: flex;
  align-items: center;
  justify-content: flex-end;
`

export const flexBetween = css`
  display: flex;
  align-items: center;
  justify-content: space-between;
`

export const flexColumnCenter = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`

export const flexColumnStart = css`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
`
