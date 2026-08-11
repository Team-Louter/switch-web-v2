import styled from 'styled-components'

import * as token from '@/shared/styles/values/token'
import { Button } from '@/shared/ui'

import { EmailInput } from './LoginForm.style'

export const Page = styled.div`
  min-width: 320px;
  min-height: 100dvh;
  background: ${token.colors.white};
`

export const Content = styled.main`
  ${token.flexCenter}
  min-height: calc(100dvh - 72px);
  padding: 48px 24px;
`

export const Card = styled.section`
  ${token.flexRow}
  align-items: stretch;
  width: min(1157px, 100%);
  height: 721px;
  view-transition-name: auth-card;
  border-radius: 20px;
  box-shadow: 0 6px 18px rgb(0 0 0 / 6%);

  @media (max-width: 900px) {
    width: 369px;
  }

  @media (max-width: 420px) {
    width: 100%;
    height: auto;
  }
`

export const Hero = styled.div`
  position: relative;
  flex: 1 1 auto;
  min-width: 0;
  height: 721px;
  overflow: hidden;
  border-radius: 20px 0 0 20px;

  @media (max-width: 900px) {
    display: none;
  }
`

export const HeroImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`

export const Panel = styled.div`
  flex: 0 0 369px;
  width: 369px;
  height: 721px;
  overflow: hidden;
  border: 1px solid ${token.colors.gray.gray10};
  border-radius: 0 20px 20px 0;
  padding: 39px 27px 32px;
  background: ${token.colors.white};

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

export const FormOptions = styled.div`
  ${token.flexColumn}
  align-items: stretch;
  gap: 16px;
  width: 100%;
`

export const Divider = styled.div`
  width: 100%;
  height: 1px;
  background: ${token.colors.gray.gray10};
`

export const Fields = styled.div`
  ${token.flexColumn}
  align-items: stretch;
  gap: 10px;
  width: 100%;
`

export const Input = styled(EmailInput)`
  flex: 0 0 38px;
  padding: 0 14px;
`

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
