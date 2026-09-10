import styled from 'styled-components'

import * as token from '@/shared/styles/values/token'

export const Overlay = styled.div<{ $placement: 'center' | 'bottom-right' }>`
  ${token.flexCenter}
  position: fixed;
  z-index: 100;
  inset: 0;
  overflow: auto;
  padding: 20px;
  align-items: ${({ $placement }) => $placement === 'bottom-right' ? 'flex-end' : 'center'};
  justify-content: ${({ $placement }) => $placement === 'bottom-right' ? 'flex-end' : 'center'};
  background: ${({ $placement }) => $placement === 'bottom-right' ? 'transparent' : 'rgba(0, 0, 0, 0.5)'};
`

export const Card = styled.div<{ $width: number; $minHeight?: number; $placement: 'center' | 'bottom-right' }>`
  ${token.flexColumnStart}
  box-sizing: border-box;
  width: ${({ $width }) => $width}px;
  max-width: 100%;
  min-height: ${({ $minHeight }) => ($minHeight ? `${$minHeight}px` : 'auto')};
  overflow: hidden;
  padding: ${({ $placement }) => $placement === 'bottom-right' ? '20px' : '30px'};
  box-shadow: ${({ $placement }) => $placement === 'bottom-right' ? '0 4px 20px rgba(0, 0, 0, 0.06)' : 'none'};
  border: ${({ $placement }) => $placement === 'bottom-right' ? `1px solid ${token.colors.gray.gray0}` : 'none'};
  border-radius: ${({ $placement }) => $placement === 'bottom-right' ? '20px' : token.shapes.large};
  background: ${token.colors.white};
`
