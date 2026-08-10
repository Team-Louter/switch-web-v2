import styled, { keyframes } from 'styled-components'

import * as token from '@/shared/styles/values/token'
import { Button } from '@/shared/ui'

const rotate = keyframes`
  to {
    transform: rotate(360deg);
  }
`

export const Form = styled.form`
  ${token.flexColumn}
  align-items: stretch;
  gap: 20px;
  width: 100%;
`

export const Options = styled.div`
  ${token.flexColumn}
  align-items: stretch;
  gap: 16px;
  width: 100%;
`

export const GoogleButton = styled.button`
  position: relative;
  width: 100%;
  height: 38px;
  overflow: hidden;
  border: 1px solid ${token.colors.gray.gray10};
  border-radius: ${token.shapes.circle};
  color: ${token.colors.gray.gray70};
  background: ${token.colors.white};
  line-height: 1.3;
  letter-spacing: -0.28px;
  ${token.typography('body', 'sm', 'semibold')}

  &:focus-visible {
    outline: 2px solid ${token.colors.primary.primary50};
    outline-offset: 2px;
  }
`

export const GoogleLogo = styled.img`
  position: absolute;
  top: 10px;
  left: 23px;
  width: 16px;
  height: 16px;
`

export const Divider = styled.div`
  ${token.flexRow}
  align-items: center;
  gap: 12px;
  width: 100%;
`

export const DividerLine = styled.span`
  flex: 1;
  height: 1px;
  background: ${token.colors.gray.gray10};
`

export const DividerText = styled.span`
  color: ${token.colors.gray.gray50};
  line-height: 1.3;
  letter-spacing: -0.24px;
  ${token.typography('caption', 'md', 'medium')}
`

export const EmailGroup = styled.div`
  ${token.flexColumn}
  align-items: stretch;
  gap: 10px;
  width: 100%;
`

export const Fields = styled.div`
  ${token.flexColumn}
  align-items: stretch;
  width: 100%;
`

export const EmailField = styled.div`
  position: relative;
  width: 100%;
  height: 38px;
`

export const EmailInput = styled.input<{ $hasError?: boolean }>`
  width: 100%;
  height: 38px;
  border: 1px solid
    ${({ $hasError }) =>
      $hasError ? token.colors.danger.danger10 : token.colors.gray.gray10};
  border-radius: ${token.shapes.xsmall};
  padding: 0 56px 0 14px;
  color: ${token.colors.gray.gray70};
  background: ${token.colors.white};
  line-height: 1;
  ${token.typography('caption', 'lg', 'medium')}

  &::placeholder {
    color: ${token.colors.gray.gray40};
    opacity: 1;
  }

  &:focus {
    border-color: ${({ $hasError }) =>
      $hasError ? token.colors.danger.danger10 : token.colors.gray.gray60};
    outline: none;
  }

  &:autofill {
    box-shadow: 0 0 0 1000px ${token.colors.white} inset;
    caret-color: ${token.colors.gray.gray70};
  }

  &:-webkit-autofill,
  &:-webkit-autofill:hover,
  &:-webkit-autofill:focus,
  &:-webkit-autofill:active {
    box-shadow: 0 0 0 1000px ${token.colors.white} inset;
    caret-color: ${token.colors.gray.gray70};
    -webkit-text-fill-color: ${token.colors.gray.gray70};
  }
`

export const ValidationMessageSlot = styled.div<{ $isVisible: boolean }>`
  max-height: ${({ $isVisible }) => ($isVisible ? '24px' : '0')};
  overflow: hidden;
  opacity: ${({ $isVisible }) => ($isVisible ? 1 : 0)};
  transition:
    max-height 240ms cubic-bezier(0.22, 1, 0.36, 1),
    opacity 160ms ease-out;

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`

export const ValidationMessage = styled.p<{ $isVisible: boolean }>`
  padding-top: 6px;
  color: ${token.colors.danger.danger10};
  line-height: 1.3;
  transform: translateY(${({ $isVisible }) => ($isVisible ? '0' : '-4px')});
  transition: transform 240ms cubic-bezier(0.22, 1, 0.36, 1);
  ${token.typography('caption', 'md', 'medium')}

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`

export const ChangeEmailButton = styled.button<{ $isVisible: boolean }>`
  position: absolute;
  top: 50%;
  right: 14px;
  color: ${token.colors.primary.text};
  line-height: 1;
  opacity: ${({ $isVisible }) => ($isVisible ? 1 : 0)};
  pointer-events: ${({ $isVisible }) => ($isVisible ? 'auto' : 'none')};
  transform: translateY(-50%);
  visibility: ${({ $isVisible }) => ($isVisible ? 'visible' : 'hidden')};
  ${token.typography('caption', 'md', 'medium')}
`

export const PasswordFieldSlot = styled.div<{ $isVisible: boolean }>`
  max-height: ${({ $isVisible }) => ($isVisible ? '48px' : '0')};
  overflow: hidden;
  opacity: ${({ $isVisible }) => ($isVisible ? 1 : 0)};
  transition:
    max-height 320ms cubic-bezier(0.22, 1, 0.36, 1),
    opacity 160ms ease-out;

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`

export const PasswordFieldMotion = styled.div<{ $isVisible: boolean }>`
  padding-top: 10px;
  transform: translateY(${({ $isVisible }) => ($isVisible ? '0' : '12px')});
  transition: transform 320ms cubic-bezier(0.22, 1, 0.36, 1);

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`

export const PasswordInput = styled(EmailInput)``

export const TurnstileConfigMessage = styled.p`
  ${token.flexCenter}
  width: 100%;
  min-height: 65px;
  border: 1px solid ${token.colors.gray.gray10};
  border-radius: ${token.shapes.xsmall};
  color: ${token.colors.danger.danger20};
  background: ${token.colors.gray.gray0};
  text-align: center;
  ${token.typography('caption', 'md', 'medium')}
`

export const ActionArea = styled.div`
  position: relative;
  width: 100%;
  height: 122px;
  margin-top: -9px;
`

export const ContinueButton = styled(Button)`
  width: 100%;
  height: 38px;
  border-radius: ${token.shapes.small};
  padding: 0;
  color: ${token.colors.gray.gray100};
  background: ${token.colors.primary.primary40};
  line-height: 1;
  ${token.typography('caption', 'lg', 'bold')}

  &:disabled {
    background: ${token.colors.primary.primary40};
    cursor: not-allowed;
    opacity: 0.5;
  }
`

export const ButtonContent = styled.span`
  ${token.flexRow}
  align-items: center;
  gap: 8px;
`

export const LoadingSpinner = styled.span`
  width: 18px;
  height: 18px;
  border: 2px solid rgb(14 13 12 / 25%);
  border-top-color: ${token.colors.gray.gray100};
  border-radius: ${token.shapes.circle};
  animation: ${rotate} 700ms linear infinite;

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`

export const Footer = styled.footer`
  ${token.flexColumn}
  position: absolute;
  top: 78px;
  left: 50%;
  align-items: center;
  gap: 12px;
  transform: translateX(-50%);
  white-space: nowrap;
`

export const PolicyLinks = styled.div`
  ${token.flexRow}
  align-items: center;
  gap: 20px;
  color: ${token.colors.primary.text};
  line-height: 1.3;
  letter-spacing: -0.24px;
  ${token.typography('caption', 'md', 'medium')}
`

export const Team = styled.p`
  color: ${token.colors.gray.gray10};
  line-height: 1.3;
  letter-spacing: -0.24px;
  ${token.typography('caption', 'md', 'medium')}
`
