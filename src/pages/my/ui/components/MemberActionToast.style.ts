import styled, { keyframes } from 'styled-components'

import * as token from '@/shared/styles/values/token'

const toastEnter = keyframes`
  from {
    opacity: 0;
    transform: translate(-50%, -20px);
  }

  to {
    opacity: 1;
    transform: translate(-50%, 0);
  }
`

const toastLeave = keyframes`
  from {
    opacity: 1;
    transform: translate(-50%, 0);
  }

  to {
    opacity: 0;
    transform: translate(-50%, -20px);
  }
`

export const Toast = styled.div<{ $isLeaving?: boolean }>`
  ${token.flexLeft}
  position: fixed;
  z-index: 40;
  top: 24px;
  left: 50%;
  gap: 10px;
  max-width: 420px;
  padding: 12px 20px 12px 12px;
  border-radius: ${token.shapes.circle};
  background: ${token.colors.white};
  color: ${token.colors.gray.gray90};
  box-shadow: 0 4px 20px rgb(0 0 0 / 12%);
  word-break: keep-all;
  transform: translateX(-50%);
  animation: ${({ $isLeaving }) => ($isLeaving ? toastLeave : toastEnter)}
    ${({ $isLeaving }) => ($isLeaving ? '200ms' : '220ms')} ease forwards;
  ${token.typography('body', 'sm', 'semibold')}
`

export const IconCircle = styled.span`
  ${token.flexCenter}
  width: 36px;
  height: 36px;
  flex: 0 0 auto;
  border-radius: ${token.shapes.circle};
  background: #ecfdf5;
`

export const Icon = styled.img`
  width: 24px;
  height: 24px;
`
