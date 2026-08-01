import styled from 'styled-components'

import * as token from '@/shared/styles/values/token'

export const Page = styled.section`
  ${token.flexColumn}
  width: 100%;
  min-width: 1060px;
  min-height: 100dvh;
  background: ${token.colors.white};
`

export const Header = styled.header`
  ${token.flexLeft}
  width: 100%;
  height: 72px;
  box-sizing: border-box;
  padding: 0 80px;
`

export const HeaderLogo = styled.img`
  width: 88px;
  height: 24px;
`

export const Body = styled.div`
  ${token.flexColumnCenter}
  flex: 1 1 0;
  width: 100%;
  gap: 40px;
  padding: 50px 256px;
  box-sizing: border-box;
`

export const Logo = styled.img`
  width: 205px;
  height: 56px;
`

export const Title = styled.h1`
  margin: 0;
  color: ${token.colors.gray.gray100};
  line-height: 1;
  ${token.typography('heading', 'lg', 'medium')}
`

export const ButtonWrap = styled.div`
  width: 305px;

  button {
    width: 100%;
  }
`
