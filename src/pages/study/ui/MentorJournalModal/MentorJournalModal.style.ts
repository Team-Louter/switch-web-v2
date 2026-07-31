import styled from 'styled-components'

import * as token from '@/shared/styles/values/token'

export const Backdrop = styled.div`
  position: fixed;
  inset: 0;
  z-index: 1000;
  overflow-y: auto;
  padding: 64px 48px;
  background-color: rgb(14 13 12 / 70%);

  @media (max-width: 720px) {
    padding: 40px 20px;
  }
`

export const Content = styled.div`
  width: min(100%, 1488px);
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
`

export const Title = styled.h2`
  ${token.typography('heading', 'lg', 'bold')};
  margin: 0 0 50px;
  color: ${token.colors.white};
  text-align: center;
`

export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 300px));
  gap: 44px;
`
