import styled, { keyframes } from 'styled-components'

import * as token from '@/shared/styles/values/token'
import { Button } from '@/shared/ui'

const rotate = keyframes`
  to {
    transform: rotate(360deg);
  }
`

export const Page = styled.div`
  min-width: 320px;
  min-height: 100dvh;
  background: ${token.colors.white};

  @media (min-width: 901px) {
    min-height: 111.111111dvh;
    zoom: 0.9;
  }
`

export const Content = styled.main`
  ${token.flexCenter}
  min-height: calc(100dvh - 72px);
  padding: 48px 24px;

  @media (min-width: 901px) {
    min-height: calc(111.111111dvh - 72px);
  }
`

export const Card = styled.section`
  ${token.flexRow}
  align-items: stretch;
  width: min(999px, 100%);
  height: 577px;
  overflow: hidden;
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
  flex: 0 0 630px;
  width: 630px;
  height: 577px;
  overflow: hidden;
  border-radius: 20px 0 0 20px;
  background: ${token.colors.primary.primary50};

  @media (max-width: 900px) {
    display: none;
  }
`

export const HeroImage = styled.img`
  width: 100%;
  height: 100%;
  max-width: none;
  object-fit: cover;
  object-position: center;
`

export const Panel = styled.div`
  flex: 0 0 369px;
  width: 369px;
  height: 577px;
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

export const Form = styled.form`
  ${token.flexColumn}
  align-items: stretch;
  gap: 20px;
  width: 100%;
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

export const Input = styled.input`
  width: 100%;
  height: 38px;
  border: 1px solid ${token.colors.gray.gray10};
  border-radius: ${token.shapes.xsmall};
  padding: 0 14px;
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

export const TurnstileConfigMessage = styled.p`
  ${token.flexCenter}
  width: 100%;
  min-height: 65px;
  border: 1px solid ${token.colors.gray.gray10};
  border-radius: ${token.shapes.xsmall};
  color: ${token.colors.gray.gray50};
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
