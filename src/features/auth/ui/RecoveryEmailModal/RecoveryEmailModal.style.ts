import styled, { keyframes } from 'styled-components'

import * as token from '@/shared/styles/values/token'
import { Button } from '@/shared/ui'

const fireworksCelebrate = keyframes`
  0%,
  100% {
    opacity: 0.78;
    transform: scale(0.88) rotate(-4deg);
  }

  45% {
    opacity: 1;
    transform: scale(1.04) rotate(3deg);
  }

  70% {
    opacity: 0.9;
    transform: scale(0.96) rotate(-1deg);
  }
`

const errorToastEnter = keyframes`
  from {
    opacity: 0;
    transform: translate(-50%, 16px);
  }

  to {
    opacity: 1;
    transform: translate(-50%, 0);
  }
`

const errorToastLeave = keyframes`
  from {
    opacity: 1;
    transform: translate(-50%, 0);
  }

  to {
    opacity: 0;
    transform: translate(-50%, 16px);
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

export const Dialog = styled.div<{ $isVerificationStep: boolean }>`
  ${token.flexCenter}
  width: min(480px, 100%);
  min-height: ${({ $isVerificationStep }) =>
    $isVerificationStep ? '510px' : '382px'};
  max-height: calc(100dvh - 48px);
  overflow-y: auto;
  border-radius: ${token.shapes.large};
  background: ${token.colors.white};
  box-shadow: 0 8px 28px rgb(14 13 12 / 14%);

  @media (max-width: 480px) {
    min-height: min(382px, calc(100dvh - 48px));
  }
`

export const Form = styled.form`
  ${token.flexColumn}
  align-items: center;
  width: 100%;
  padding: 32px 65px;

  @media (max-width: 480px) {
    padding: 28px 20px;
  }
`

export const Title = styled.h2`
  color: ${token.colors.gray.gray80};
  line-height: normal;
  text-align: center;
  ${token.typography('heading', 'md', 'bold')}
`

export const Description = styled.p`
  max-width: 100%;
  color: ${token.colors.gray.gray90};
  line-height: normal;
  text-align: center;
  word-break: break-word;
  ${token.typography('body', 'sm', 'medium')}
`

export const EmailInput = styled.input`
  width: 350px;
  max-width: 100%;
  height: 40px;
  border: 1px solid ${token.colors.gray.gray20};
  border-radius: ${token.shapes.xsmall};
  padding: 0 14px;
  color: ${token.colors.gray.gray80};
  background: ${token.colors.white};
  line-height: normal;
  ${token.typography('body', 'sm', 'medium')}

  &::placeholder {
    color: ${token.colors.gray.gray40};
  }

  &:focus {
    border-color: ${token.colors.gray.gray60};
    outline: none;
  }

  &:-webkit-autofill,
  &:-webkit-autofill:hover,
  &:-webkit-autofill:focus,
  &:-webkit-autofill:active {
    -webkit-box-shadow: 0 0 0 1000px ${token.colors.white} inset;
    -webkit-text-fill-color: ${token.colors.gray.gray80};
    caret-color: ${token.colors.gray.gray80};
    transition: background-color 5000s ease-in-out 0s;
  }
`

export const EmailStepContent = styled.div`
  ${token.flexColumn}
  align-items: center;
  width: 350px;
  max-width: 100%;
  margin-top: 24px;
  gap: 24px;
`

export const CelebrationHeader = styled.div`
  ${token.flexColumn}
  align-items: center;
  gap: 8px;
`

export const FireworksImage = styled.img`
  display: block;
  width: 64px;
  height: 64px;
  object-fit: contain;
  pointer-events: none;
  animation: ${fireworksCelebrate} 2.4s ease-in-out infinite;

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`

export const CelebrationMessage = styled.p`
  color: hsla(44, 100%, 50%, 1);
  line-height: normal;
  text-align: center;
  ${token.typography('body', 'sm', 'semibold')}
`

export const ActionRow = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  margin-top: 32px;
`

export const SecondaryButton = styled.button`
  width: 100px;
  height: 36px;
  border: 1px solid ${token.colors.gray.gray20};
  border-radius: ${token.shapes.xsmall};
  color: ${token.colors.gray.gray80};
  background: ${token.colors.white};
  line-height: normal;
  ${token.typography('body', 'sm', 'bold')}

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
`

export const ActionButton = styled(Button)`
  width: 100px;
  height: 36px;
  border-radius: ${token.shapes.xsmall};
  padding: 0;
  color: ${token.colors.gray.gray80};
  background: ${token.colors.primary.primary40};
  line-height: normal;
  ${token.typography('body', 'sm', 'bold')}

  &:hover {
    background: ${token.colors.primary.primary40};
  }

  &:disabled {
    background: ${token.colors.primary.primary40};
    cursor: not-allowed;
    opacity: 0.5;
  }
`

export const EmailSummary = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  width: 100%;
  min-height: 44px;
  margin-top: 28px;
  border: 1px solid ${token.colors.gray.gray20};
  border-radius: ${token.shapes.xsmall};
  padding: 0 14px;
`

export const EmailSummaryText = styled.span`
  min-width: 0;
  overflow: hidden;
  color: ${token.colors.gray.gray70};
  text-overflow: ellipsis;
  white-space: nowrap;
  ${token.typography('body', 'sm', 'medium')}
`

export const ChangeEmailButton = styled.button`
  flex: 0 0 auto;
  color: ${token.colors.gray.gray60};
  ${token.typography('caption', 'md', 'semibold')}

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
`

export const CodeField = styled.div`
  position: relative;
  display: grid;
  grid-template-columns: repeat(6, minmax(0, 1fr));
  gap: 8px;
  width: 100%;
  margin-top: 28px;
`

export const DigitBox = styled.span<{
  $isFilled: boolean
  $isActive: boolean
}>`
  ${token.flexCenter}
  width: 100%;
  height: 56px;
  border: 1px solid
    ${({ $isActive }) =>
      $isActive ? token.colors.gray.gray80 : token.colors.gray.gray10};
  border-radius: ${token.shapes.xsmall};
  color: ${token.colors.gray.gray80};
  background: ${({ $isFilled }) =>
    $isFilled ? token.colors.white : token.colors.gray.gray0};
  line-height: 1;
  ${token.typography('heading', 'md', 'bold')}
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
  margin-top: 20px;
  color: ${token.colors.gray.gray70};
  ${token.typography('body', 'sm', 'semibold')}

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
`

export const TurnstileConfigMessage = styled.p`
  ${token.flexCenter}
  width: 100%;
  min-height: 65px;
  margin-top: 16px;
  border: 1px solid ${token.colors.gray.gray10};
  border-radius: ${token.shapes.xsmall};
  color: ${token.colors.gray.gray50};
  background: ${token.colors.gray.gray0};
  text-align: center;
  ${token.typography('caption', 'md', 'medium')}
`

export const OverlayTurnstile = styled.div`
  position: absolute;
  right: 24px;
  bottom: 24px;
  z-index: 1;
  width: min(300px, calc(100% - 48px));
  height: 65px;

  & > div {
    background: transparent;
  }
`

export const ErrorToast = styled.p<{ $isLeaving?: boolean }>`
  position: absolute;
  bottom: 24px;
  left: 50%;
  z-index: 2;
  max-width: min(360px, calc(100% - 48px));
  margin: 0;
  border-radius: ${token.shapes.small};
  padding: 10px 14px;
  color: ${token.colors.white};
  background: ${token.colors.gray.gray90};
  box-shadow: 0 4px 16px rgb(0 0 0 / 20%);
  text-align: center;
  word-break: keep-all;
  pointer-events: none;
  transform: translateX(-50%);
  animation: ${({ $isLeaving }) =>
      $isLeaving ? errorToastLeave : errorToastEnter}
    ${({ $isLeaving }) => ($isLeaving ? '200ms' : '220ms')} ease forwards;
  ${token.typography('caption', 'md', 'medium')}
`

export const PrimaryButton = styled(Button)`
  width: 100%;
  height: 48px;
  margin-top: 24px;
  border-radius: ${token.shapes.small};
  padding: 0;
  color: ${token.colors.gray.gray100};
  background: ${token.colors.primary.primary40};
  ${token.typography('body', 'sm', 'bold')}

  &:disabled {
    background: ${token.colors.primary.primary40};
    cursor: not-allowed;
    opacity: 0.5;
  }
`

export const LogoutButton = styled.button`
  margin-top: 18px;
  color: ${token.colors.gray.gray50};
  ${token.typography('caption', 'md', 'medium')}

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
`
