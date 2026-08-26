import styled, { keyframes } from 'styled-components'

import * as token from '@/shared/styles/values/token'

const toastEnter = keyframes`
  from {
    opacity: 0;
    transform: translate(-50%, -8px) scale(0.98);
  }

  to {
    opacity: 1;
    transform: translate(-50%, 0) scale(1);
  }
`

const toastLeave = keyframes`
  from {
    opacity: 1;
    transform: translate(-50%, 0) scale(1);
  }

  to {
    opacity: 0;
    transform: translate(-50%, -8px) scale(0.98);
  }
`

export const Toast = styled.div<{ $isLeaving?: boolean }>`
  ${token.flexLeft}
  position: fixed;
  z-index: 40;
  top: 50px;
  left: 50%;
  gap: 10px;
  padding: 10px 15px;
  border-radius: ${token.shapes.circle};
  background: ${token.colors.white};
  color: ${token.colors.gray.gray90};
  line-height: 1;
  transform: translateX(-50%);
  animation: ${({ $isLeaving }) => ($isLeaving ? toastLeave : toastEnter)}
    120ms ease forwards;
  ${token.typography('body', 'sm', 'medium')}
`

export const Icon = styled.img`
  width: 30px;
  height: 30px;
  flex: 0 0 auto;
`
