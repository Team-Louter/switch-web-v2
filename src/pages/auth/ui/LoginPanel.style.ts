import styled from 'styled-components'

import * as token from '@/shared/styles/values/token'

export const Panel = styled.div<{ $heightOffset: number }>`
  flex: 0 0 369px;
  width: 369px;
  height: ${({ $heightOffset }) => 549 + $heightOffset}px;
  overflow: hidden;
  border: 1px solid ${token.colors.gray.gray10};
  border-radius: 0 20px 20px 0;
  padding: 39px 27px 32px;
  background: ${token.colors.white};
  transition: height var(--login-height-transition-duration)
    var(--login-height-transition-easing);

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

export const Content = styled.div`
  ${token.flexColumn}
  align-items: center;
  gap: 20px;
  width: 313px;

  @media (max-width: 420px) {
    width: 100%;
  }
`
