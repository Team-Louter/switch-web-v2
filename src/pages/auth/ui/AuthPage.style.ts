import styled from 'styled-components'

import * as token from '@/shared/styles/values/token'
import { Button } from '@/shared/ui'

export const Page = styled.div`
  min-width: 320px;
  min-height: 100dvh;
  background: ${token.colors.white};
`

export const Header = styled.header`
  ${token.flexRow}
  align-items: center;
  width: 100%;
  height: 72px;
  padding: 0 80px;

  @media (max-width: 768px) {
    padding: 0 24px;
  }
`

export const BrandGroup = styled.div`
  ${token.flexRow}
  align-items: center;
  gap: 12px;
`

export const SwitchLogo = styled.img`
  width: 88px;
  height: 24px;
`

export const CollaborationMark = styled.span`
  color: ${token.colors.gray.gray50};
  line-height: 1;
  ${token.typography('caption', 'md', 'semibold')}
`

export const HeaderPartnerLogo = styled.img`
  width: 24px;
  height: 24px;
  border-radius: ${token.shapes.circle};
`

export const Content = styled.main`
  ${token.flexCenter}
  min-height: calc(100dvh - 72px);
  padding: 48px 24px;
`

export const LoginCard = styled.section<{ $isPasswordStep: boolean }>`
  ${token.flexRow}
  align-items: stretch;
  width: min(969px, 100%);
  height: ${({ $isPasswordStep }) => ($isPasswordStep ? '597px' : '549px')};
  margin-bottom: ${({ $isPasswordStep }) =>
    $isPasswordStep ? '-48px' : '0'};
  border-radius: 20px;
  box-shadow: 0 6px 18px rgb(0 0 0 / 6%);
  transition:
    height 320ms cubic-bezier(0.22, 1, 0.36, 1),
    margin-bottom 320ms cubic-bezier(0.22, 1, 0.36, 1);

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }

  @media (max-width: 900px) {
    width: 369px;
  }

  @media (max-width: 420px) {
    width: 100%;
    height: auto;
    margin-bottom: 0;
  }
`

export const Hero = styled.div<{ $isPasswordStep: boolean }>`
  position: relative;
  flex: 0 0 600px;
  width: 600px;
  height: ${({ $isPasswordStep }) => ($isPasswordStep ? '597px' : '549px')};
  overflow: hidden;
  border-radius: 20px 0 0 20px;
  transition: height 320ms cubic-bezier(0.22, 1, 0.36, 1);

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }

  @media (max-width: 900px) {
    display: none;
  }
`

export const HeroImage = styled.img<{ $isVisible: boolean }>`
  position: absolute;
  top: -12px;
  left: -18px;
  width: calc(100% + 36px);
  height: auto;
  max-width: none;
  opacity: ${({ $isVisible }) => ($isVisible ? 1 : 0)};
`

export const LoginPanel = styled.div<{ $isPasswordStep: boolean }>`
  flex: 0 0 369px;
  width: 369px;
  height: ${({ $isPasswordStep }) => ($isPasswordStep ? '597px' : '549px')};
  overflow: hidden;
  border: 1px solid ${token.colors.gray.gray10};
  border-radius: 0 20px 20px 0;
  padding: 39px 27px;
  background: ${token.colors.white};
  transition: height 320ms cubic-bezier(0.22, 1, 0.36, 1);

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }

  @media (max-width: 900px) {
    border-radius: 20px;
  }

  @media (max-width: 420px) {
    flex-basis: 100%;
    width: 100%;
    height: auto;
    padding: 32px 20px;
  }
`

export const PanelContent = styled.div`
  ${token.flexColumn}
  align-items: center;
  gap: 20px;
  width: 313px;

  @media (max-width: 420px) {
    width: 100%;
  }
`

export const Intro = styled.div`
  ${token.flexColumn}
  align-items: center;
  gap: 20px;
`

export const PartnerLogo = styled.img`
  width: 40px;
  height: 40px;
  border-radius: ${token.shapes.small};
`

export const IntroCopy = styled.div`
  ${token.flexColumn}
  align-items: center;
  gap: 8px;
  text-align: center;
`

export const Title = styled.h1`
  color: ${token.colors.gray.gray80};
  line-height: 1.3;
  letter-spacing: -0.48px;
  ${token.typography('heading', 'md', 'bold')}
`

export const Subtitle = styled.p`
  color: ${token.colors.gray.gray50};
  line-height: 1.3;
  letter-spacing: -0.28px;
  ${token.typography('body', 'sm', 'medium')}
`

export const LoginOptions = styled.div`
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

export const EmailFields = styled.div`
  ${token.flexColumn}
  align-items: stretch;
  width: 100%;
`

export const EmailField = styled.div`
  position: relative;
  width: 100%;
  height: 38px;
`

export const EmailInput = styled.input`
  width: 100%;
  height: 38px;
  border: 1px solid ${token.colors.gray.gray10};
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
    border-color: ${token.colors.gray.gray60};
    outline: none;
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
