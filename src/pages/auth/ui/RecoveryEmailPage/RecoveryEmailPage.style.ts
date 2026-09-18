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
  min-height: 577px;
  overflow: hidden;
  border-radius: 20px;
  box-shadow: 0 6px 18px rgb(0 0 0 / 6%);

  @media (max-width: 900px) {
    width: 369px;
  }

  @media (max-width: 420px) {
    width: 100%;
  }
`

export const Hero = styled.div`
  position: relative;
  flex: 0 0 630px;
  width: 630px;
  min-height: 577px;
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
  min-height: 577px;
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
    min-height: 0;
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

export const Title = styled.h1`
  color: ${token.colors.gray.gray80};
  line-height: 1.3;
  text-align: center;
  ${token.typography('heading', 'md', 'bold')}
`

export const Description = styled.p`
  margin-top: -8px;
  color: ${token.colors.gray.gray50};
  line-height: 1.4;
  text-align: center;
  ${token.typography('body', 'sm', 'medium')}
`

export const Form = styled.form`
  ${token.flexColumn}
  align-items: stretch;
  gap: 16px;
  width: 100%;
  margin-top: 12px;
`

export const Fields = styled.div`
  ${token.flexColumn}
  align-items: stretch;
  gap: 12px;
  width: 100%;
`

export const Input = styled.input`
  width: 100%;
  height: 42px;
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

export const EmailSummary = styled.div`
  ${token.flexRow}
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  min-height: 42px;
  border: 1px solid ${token.colors.gray.gray10};
  border-radius: ${token.shapes.xsmall};
  padding: 0 14px;
`

export const EmailSummaryText = styled.span`
  overflow: hidden;
  color: ${token.colors.gray.gray70};
  text-overflow: ellipsis;
  white-space: nowrap;
  ${token.typography('caption', 'lg', 'medium')}
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
  gap: 6px;
  width: 100%;
`

export const DigitBox = styled.span<{
  $isFilled: boolean
  $isActive: boolean
}>`
  ${token.flexCenter}
  width: 100%;
  height: 48px;
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
  align-self: center;
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
  border: 1px solid ${token.colors.gray.gray10};
  border-radius: ${token.shapes.xsmall};
  color: ${token.colors.gray.gray50};
  background: ${token.colors.gray.gray0};
  text-align: center;
  ${token.typography('caption', 'md', 'medium')}
`

export const ErrorMessage = styled.p`
  width: 100%;
  color: ${token.colors.danger.danger20};
  line-height: 1.4;
  text-align: center;
  ${token.typography('caption', 'md', 'medium')}
`

export const ContinueButton = styled(Button)`
  width: 100%;
  height: 42px;
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
  justify-content: center;
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
  align-items: center;
  gap: 12px;
  margin-top: 8px;
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
