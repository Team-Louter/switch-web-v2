import styled from 'styled-components'

import * as token from '@/shared/styles/values/token'

export const Overlay = styled.div`
  ${token.flexCenter}
  position: fixed;
  z-index: 100;
  inset: 0;
  overflow: auto;
  padding: 20px;
  background: rgba(0, 0, 0, 0.5);
`

export const Card = styled.div<{ $width: number; $minHeight?: number }>`
  ${token.flexColumnStart}
  box-sizing: border-box;
  width: ${({ $width }) => $width}px;
  max-width: 100%;
  min-height: ${({ $minHeight }) => ($minHeight ? `${$minHeight}px` : 'auto')};
  overflow: hidden;
  padding: 30px;
  border-radius: ${token.shapes.large};
  background: ${token.colors.white};
`
