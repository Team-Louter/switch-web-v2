import styled from 'styled-components'

import * as token from '@/shared/styles/values/token'

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
