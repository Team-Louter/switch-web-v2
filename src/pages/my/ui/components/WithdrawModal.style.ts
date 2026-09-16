import styled, { keyframes } from 'styled-components'

import * as token from '@/shared/styles/values/token'

const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`

export const Overlay = styled.div`
  ${token.flexCenter}
  position: fixed;
  z-index: 30;
  inset: 0;
  background: rgb(14 13 12 / 45%);
`

export const Modal = styled.div`
  ${token.flexColumnCenter}
  box-sizing: border-box;
  width: 460px;
  padding: 40px 56px;
  border-radius: ${token.shapes.large};
  background: ${token.colors.white};
  box-shadow: 0 8px 28px rgb(14 13 12 / 14%);
`

export const Title = styled.h2`
  margin: 0 0 32px;
  color: ${token.colors.gray.gray80};
  ${token.typography('heading', 'lg', 'bold')}
`

export const Description = styled.p`
  margin: 0 0 32px;
  color: ${token.colors.gray.gray80};
  text-align: center;
  ${token.typography('body', 'md', 'medium')}
`

export const ButtonRow = styled.div`
  ${token.flexCenter}
  gap: 20px;
`

export const CancelButton = styled.button`
  width: 100px;
  padding: 10px 0;
  border: 1px solid ${token.colors.gray.gray20};
  border-radius: ${token.shapes.small};
  color: ${token.colors.gray.gray80};
  background: ${token.colors.white};
  ${token.typography('body', 'sm', 'bold')}

  &:hover:not(:disabled) {
    background: ${token.colors.gray.gray0};
  }
`

export const ConfirmButton = styled.button<{ $active: boolean }>`
  width: 100px;
  padding: 10px 0;
  border-radius: ${token.shapes.small};
  color: ${token.colors.gray.gray80};
  background: ${token.colors.primary.primary40};
  opacity: ${({ $active }) => ($active ? 1 : 0.5)};
  cursor: ${({ $active }) => ($active ? 'pointer' : 'not-allowed')};
  ${token.typography('body', 'sm', 'bold')}

  &:hover:not(:disabled) {
    background: ${token.colors.primary.primary50};
  }
`

export const VerifyModal = styled.div`
  ${token.flexColumnCenter}
  box-sizing: border-box;
  width: 460px;
  min-height: 480px;
  padding: 64px 32px;
  border-radius: ${token.shapes.large};
  background: ${token.colors.white};
  box-shadow: 0 8px 28px rgb(14 13 12 / 14%);
`

export const VerifyTitle = styled.h2`
  margin: 0 0 16px;
  color: ${token.colors.gray.gray80};
  ${token.typography('heading', 'lg', 'bold')}
`

export const Subtitle = styled.p`
  margin: 0;
  color: ${token.colors.gray.gray50};
  text-align: center;
  ${token.typography('heading', 'sm', 'semibold')}
`

export const CodeInputWrap = styled.div`
  margin-top: 40px;
`

export const ResendButton = styled.button`
  margin-top: 40px;
  padding: 0;
  color: ${token.colors.gray.gray80};
  background: transparent;
  ${token.typography('body', 'sm', 'semibold')}
`

export const SubmitButton = styled.button<{ $active: boolean }>`
  ${token.flexCenter}
  width: 80px;
  height: 80px;
  margin-top: 40px;
  border: 1px solid
    ${({ $active }) =>
      $active ? token.colors.primary.primary40 : token.colors.gray.gray40};
  border-radius: 20px;
  background: ${({ $active }) =>
    $active ? token.colors.primary.primary40 : token.colors.white};
  cursor: ${({ $active }) => ($active ? 'pointer' : 'not-allowed')};

  img {
    filter: ${({ $active }) => ($active ? 'brightness(0) invert(1)' : 'none')};
  }

  &:hover:not(:disabled) {
    background: ${token.colors.primary.primary50};
  }
`

export const Spinner = styled.div`
  width: 44px;
  height: 44px;
  margin: 40px auto;
  border: 4px solid ${token.colors.gray.gray0};
  border-top-color: ${token.colors.primary.primary40};
  border-radius: ${token.shapes.circle};
  animation: ${spin} 750ms linear infinite;
`
