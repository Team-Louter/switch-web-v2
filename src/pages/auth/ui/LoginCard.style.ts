import styled, { css, keyframes } from 'styled-components'

import * as token from '@/shared/styles/values/token'

const collapseSignupCard = keyframes`
  from {
    width: min(1157px, 100%);
    height: 721px;
  }

  to {
    width: min(969px, 100%);
    height: 549px;
  }
`

const collapseSignupHeight = keyframes`
  from {
    height: 721px;
  }

  to {
    height: 549px;
  }
`

const moveLoginEmail = keyframes`
  from {
    transform: translateY(-66px);
  }

  to {
    transform: translateY(0);
  }
`

const fadeInLoginHero = keyframes`
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
`

const fadeOutSignupHero = keyframes`
  from {
    opacity: 1;
  }

  to {
    opacity: 0;
  }
`

interface CardProps {
  $heightOffset: number
  $startsFromSignup: boolean
  $usesPasswordTransition: boolean
}

export const Card = styled.section<CardProps>`
  ${token.flexRow}
  --login-height-transition-duration: ${({ $usesPasswordTransition }) =>
    $usesPasswordTransition ? '480ms' : '320ms'};

  align-items: stretch;
  width: min(969px, 100%);
  height: ${({ $heightOffset }) => 549 + $heightOffset}px;
  margin-bottom: ${({ $heightOffset }) => -$heightOffset}px;
  overflow: hidden;
  view-transition-name: auth-card;
  border-radius: 20px;
  box-shadow: 0 6px 18px rgb(0 0 0 / 6%);
  transition:
    height var(--login-height-transition-duration)
      cubic-bezier(0.22, 1, 0.36, 1),
    margin-bottom var(--login-height-transition-duration)
      cubic-bezier(0.22, 1, 0.36, 1);

  ${({ $startsFromSignup }) =>
    $startsFromSignup &&
    css`
      animation: ${collapseSignupCard} 1000ms cubic-bezier(0.4, 0, 0.2, 1)
        both;

      > div {
        animation: ${collapseSignupHeight} 1000ms
          cubic-bezier(0.4, 0, 0.2, 1) both;
      }

      [data-auth-email-field] {
        animation: ${moveLoginEmail} 1000ms cubic-bezier(0.4, 0, 0.2, 1)
          both;
      }
    `}

  @media (prefers-reduced-motion: reduce) {
    transition: none;

    &,
    > div,
    [data-auth-email-field] {
      animation: none;
    }
  }

  @media (max-width: 900px) {
    width: 369px;

    ${({ $startsFromSignup }) =>
      $startsFromSignup &&
      css`
        animation-name: ${collapseSignupHeight};
      `}
  }

  @media (max-width: 420px) {
    width: 100%;
    height: auto;
    margin-bottom: 0;

    &,
    > div,
    [data-auth-email-field] {
      animation: none;
    }
  }
`

export const Hero = styled.div<{ $heightOffset: number }>`
  position: relative;
  flex: 0 0 600px;
  width: 600px;
  height: ${({ $heightOffset }) => 549 + $heightOffset}px;
  overflow: hidden;
  border-radius: 20px 0 0 20px;
  transition: height var(--login-height-transition-duration)
    cubic-bezier(0.22, 1, 0.36, 1);

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }

  @media (max-width: 900px) {
    display: none;
  }
`

export const HeroImage = styled.img<{
  $fadesIn?: boolean
  $isVisible: boolean
}>`
  position: absolute;
  top: -12px;
  left: -18px;
  z-index: 1;
  width: calc(100% + 36px);
  height: calc(100% + 36px);
  max-width: none;
  object-fit: cover;
  object-position: center top;
  opacity: ${({ $isVisible }) => ($isVisible ? 1 : 0)};
  transition: opacity 480ms ease-in-out;
  animation: ${({ $fadesIn }) =>
    $fadesIn
      ? css`${fadeInLoginHero} 720ms 160ms ease-in-out both`
      : 'none'};

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`

export const PreviousHeroImage = styled.img`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  animation: ${fadeOutSignupHero} 720ms 160ms ease-in-out both;

  @media (prefers-reduced-motion: reduce) {
    display: none;
    animation: none;
  }
`
