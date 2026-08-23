import styled from 'styled-components'

import * as token from '@/shared/styles/values/token'

export const Page = styled.section`
  ${token.flexCenter}
  width: 100%;
  min-height: 100dvh;
  box-sizing: border-box;
  padding: 80px 100px;
  background: ${token.colors.white};

  @media (max-width: 1180px) {
    padding: 56px 48px;
  }
`

export const ActionWrap = styled.div`
  width: 180px;

  button {
    width: 100%;
  }
`
