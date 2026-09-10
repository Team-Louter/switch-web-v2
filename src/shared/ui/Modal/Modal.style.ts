import styled, { keyframes } from 'styled-components'

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
  pointer-events: ${({ $placement }) =>
    $placement === 'bottom-right' ? 'none' : 'auto'};
  background: ${({ $placement }) => $placement === 'bottom-right' ? 'transparent' : 'rgba(0, 0, 0, 0.5)'};
`

const floatingCardEnter = keyframes`
  from {
    opacity: 0;
    transform: translateY(16px) scale(0.98);
  }

  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
`

const floatingCardExit = keyframes`
  from {
    opacity: 1;
    transform: translateY(0) scale(1);
  }

  to {
    opacity: 0;
    transform: translateY(16px) scale(0.98);
  }
`

export const Card = styled.div<{
  $width: number
  $minHeight?: number
  $placement: 'center' | 'bottom-right'
  $isClosing: boolean
}>`
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
  pointer-events: auto;
  animation: ${({ $placement, $isClosing }) =>
    $placement === 'bottom-right'
      ? `${$isClosing ? floatingCardExit : floatingCardEnter} 180ms ease both`
      : 'none'};
`
