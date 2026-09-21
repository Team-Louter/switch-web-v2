import styled from 'styled-components'

import * as token from '@/shared/styles/values/token'

export const Panel = styled.div<{
  $heightOffset: number
  $isFullWidth: boolean
}>`
  display: flex;
  flex-direction: ${({ $isFullWidth }) =>
    $isFullWidth ? 'column' : 'row'};
  align-items: ${({ $isFullWidth }) =>
    $isFullWidth ? 'center' : 'stretch'};
  justify-content: ${({ $isFullWidth }) =>
    $isFullWidth ? 'center' : 'flex-start'};
  flex: ${({ $isFullWidth }) =>
    $isFullWidth ? '1 1 auto' : '0 0 369px'};
  width: ${({ $isFullWidth }) => ($isFullWidth ? '100%' : '369px')};
  height: ${({ $heightOffset, $isFullWidth }) =>
    $isFullWidth ? 'auto' : `${549 + $heightOffset}px`};
  min-height: ${({ $heightOffset, $isFullWidth }) =>
    $isFullWidth ? `${721 + $heightOffset}px` : 'auto'};
  overflow: hidden;
  border: 1px solid ${token.colors.gray.gray10};
  border-radius: ${({ $isFullWidth }) =>
    $isFullWidth ? '20px' : '0 20px 20px 0'};
  padding: ${({ $isFullWidth }) =>
    $isFullWidth ? '0 20px 24px' : '39px 27px 32px'};
  background: ${token.colors.white};
  transition: height var(--login-height-transition-duration)
    cubic-bezier(0.22, 1, 0.36, 1);

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
    min-height: 0;
    padding: ${({ $isFullWidth }) =>
      $isFullWidth ? '0 16px 24px' : '32px 20px'};
  }
`

export const Content = styled.div<{
  $isFullWidth: boolean
  $hasBanner: boolean
}>`
  ${token.flexColumn}
  align-items: center;
  gap: ${({ $isFullWidth }) => ($isFullWidth ? '28px' : '20px')};
  margin-top: ${({ $hasBanner }) => ($hasBanner ? '28px' : '0')};
  width: ${({ $isFullWidth }) =>
    $isFullWidth ? 'min(720px, 100%)' : '313px'};
  max-width: 100%;

  @media (max-width: 420px) {
    width: 100%;
  }
`

export const ClubCreateBannerFrame = styled.div`
  flex: 0 0 auto;
  width: calc(100% + 40px);
  aspect-ratio: 3088 / 780;
  margin: 0 -20px;
  overflow: hidden;
`

export const ClubCreateBanner = styled.img`
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
`
