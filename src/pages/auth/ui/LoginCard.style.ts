import styled from 'styled-components'

import * as token from '@/shared/styles/values/token'

interface CardProps {
  $heightOffset: number
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
  view-transition-name: auth-card;
  border-radius: 20px;
  box-shadow: 0 6px 18px rgb(0 0 0 / 6%);
  transition:
    height var(--login-height-transition-duration)
      cubic-bezier(0.22, 1, 0.36, 1),
    margin-bottom var(--login-height-transition-duration)
      cubic-bezier(0.22, 1, 0.36, 1);

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

export const HeroImage = styled.img<{ $isVisible: boolean }>`
  position: absolute;
  top: -12px;
  left: -18px;
  width: calc(100% + 36px);
  height: calc(100% + 36px);
  max-width: none;
  object-fit: cover;
  object-position: center top;
  opacity: ${({ $isVisible }) => ($isVisible ? 1 : 0)};
`
