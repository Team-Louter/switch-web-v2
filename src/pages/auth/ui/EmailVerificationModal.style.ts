import styled, { keyframes } from 'styled-components'

import * as token from '@/shared/styles/values/token'
import { Button } from '@/shared/ui'

const rotate = keyframes`
  to {
    transform: rotate(360deg);
  }
`

export const Overlay = styled.div`
  ${token.flexCenter}
  position: fixed;
  z-index: 1000;
  inset: 0;
  padding: 24px;
  background: rgb(12 16 20 / 70%);
  backdrop-filter: blur(4px);
`

export const Dialog = styled.div`
  ${token.flexCenter}
  position: relative;
  width: min(452px, 100%);
  height: 510px;
  overflow: hidden;
  border-radius: ${token.shapes.large};
  background: ${token.colors.white};

  @media (max-width: 480px) {
    height: min(510px, calc(100dvh - 48px));
  }
`

export const ResendTurnstile = styled.div`
  position: absolute;
  right: 12px;
  bottom: 12px;
  z-index: 1;
  width: 150px;
  height: 140px;
`

export const Form = styled.form`
  ${token.flexColumn}
  align-items: center;
  width: 100%;
  padding: 0 32px;

  @media (max-width: 480px) {
    padding: 0 20px;
  }
`

export const Title = styled.h2`
  color: ${token.colors.gray.gray80};
  line-height: 1;
  text-align: center;
  ${token.typography('heading', 'lg', 'bold')}
`

export const Description = styled.p`
  margin-top: 16px;
  color: ${token.colors.gray.gray50};
  line-height: 1;
  text-align: center;
  white-space: nowrap;
  ${token.typography('heading', 'sm', 'semibold')}

  @media (max-width: 480px) {
    line-height: 1.35;
    white-space: normal;
    ${token.typography('body', 'md', 'semibold')}
  }
`

export const CodeField = styled.div`
  position: relative;
  display: grid;
  grid-template-columns: repeat(6, minmax(0, 50px));
  gap: 10px;
  width: 350px;
  max-width: 100%;
  margin-top: 40px;

  @media (max-width: 480px) {
    gap: 6px;
  }
`

export const DigitBox = styled.span<{
  $isFilled: boolean
  $isActive: boolean
}>`
  ${token.flexCenter}
  width: 100%;
  height: 60px;
  border: 1px solid
    ${({ $isActive }) =>
      $isActive ? token.colors.gray.gray80 : 'transparent'};
  border-radius: ${token.shapes.xsmall};
  color: ${token.colors.gray.gray80};
  background: ${({ $isActive, $isFilled }) =>
    $isActive || $isFilled
      ? token.colors.white
      : token.colors.gray.gray0};
  line-height: 1;
  ${token.typography('heading', 'lg', 'bold')}
`

export const CodeInput = styled.input`
  position: absolute;
  z-index: 1;
  inset: 0;
  width: 100%;
  height: 100%;
  border: 0;
  outline: 0;
  color: transparent;
  background: transparent;
  caret-color: transparent;
  opacity: 0.01;
`

export const ResendButton = styled.button`
  margin-top: 26px;
  color: ${token.colors.gray.gray80};
  line-height: 1;
  text-align: center;
  ${token.typography('body', 'sm', 'semibold')}

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
`

export const StatusMessage = styled.p<{ $hasError: boolean }>`
  width: 100%;
  min-height: 18px;
  margin-top: 10px;
  color: ${({ $hasError }) =>
    $hasError
      ? token.colors.danger.danger20
      : token.colors.success.success20};
  line-height: 1.3;
  text-align: center;
  ${token.typography('caption', 'md', 'medium')}
`

export const SubmitButton = styled(Button)`
  width: 80px;
  height: 80px;
  margin-top: 12px;
  border: 1px solid ${token.colors.primary.primary50};
  border-radius: ${token.shapes.xlarge};
  padding: 0;
  background: ${token.colors.primary.primary50};

  &:hover {
    background: ${token.colors.primary.primary50};
  }

  &:disabled {
    border-color: ${token.colors.gray.gray30};
    background: ${token.colors.white};
  }
`

export const ArrowIcon = styled.img<{ $isEnabled: boolean }>`
  width: 40px;
  height: 40px;
  transform: rotate(90deg);
  filter: ${({ $isEnabled }) =>
    $isEnabled ? 'brightness(0) invert(1)' : 'none'};
`

export const LoadingIcon = styled.img`
  width: 60px;
  height: 60px;
  animation: ${rotate} 900ms linear infinite;

  @media (prefers-reduced-motion: reduce) {
    animation-duration: 1800ms;
  }
`
