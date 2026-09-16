import styled, { keyframes } from 'styled-components'

import * as token from '@/shared/styles/values/token'
import { Button } from '@/shared/ui'

const modalBackdropEnter = keyframes`
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
`

const modalContentEnter = keyframes`
  from {
    opacity: 0;
    transform: translateY(12px) scale(0.98);
  }

  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
`

export const Backdrop = styled.div`
  ${token.flexCenter}
  position: fixed;
  inset: 0;
  z-index: 1000;
  box-sizing: border-box;
  overflow-y: auto;
  padding: 24px;
  background-color: rgb(14 13 12 / 70%);

  animation: ${modalBackdropEnter} 180ms ease-out both;

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`

export const Modal = styled.div`
  ${token.flexColumnStart}
  width: min(500px, 100%);
  max-height: calc(100dvh - 48px);
  overflow-y: auto;
  gap: 20px;
  padding: 30px;
  border-radius: ${token.shapes.medium};
  background-color: ${token.colors.white};
  box-shadow: 0 16px 48px rgb(0 0 0 / 20%);

  animation: ${modalContentEnter} 220ms cubic-bezier(0.22, 1, 0.36, 1) both;

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`

export const Title = styled.h2`
  ${token.typography('heading', 'sm', 'semibold')}
  margin: 0;
  color: ${token.colors.gray.gray100};
`

export const TextInput = styled.input`
  ${token.typography('body', 'md', 'medium')}
  width: 100%;
  height: 44px;
  padding: 10px 12px;
  border: 0;
  border-radius: ${token.shapes.small};
  background-color: ${token.colors.gray.gray0};
  color: ${token.colors.gray.gray80};

  &::placeholder {
    color: ${token.colors.gray.gray30};
  }

  &:focus {
    outline: 1px solid ${token.colors.primary.primary50};
  }
`

export const ActionRow = styled.div`
  ${token.flexRow}
  width: 100%;
  gap: 10px;
`

export const ActionButton = styled(Button)`
  flex: 1 1 0;
`
