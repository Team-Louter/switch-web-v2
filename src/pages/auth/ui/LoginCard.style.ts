import styled from 'styled-components'

import * as token from '@/shared/styles/values/token'

export const Card = styled.section<{ $isPasswordStep: boolean }>`
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
