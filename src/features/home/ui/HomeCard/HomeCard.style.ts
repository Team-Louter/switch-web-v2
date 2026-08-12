import styled from 'styled-components'

import * as token from '@/shared/styles/values/token'

export const Card = styled.section`
  ${token.flexColumn}
  width: 100%;
  min-height: 0;
  padding: 24px;
  gap: 20px;
  border: 1px solid ${token.colors.gray.gray10};
  border-radius: ${token.shapes.small};
  background: ${token.colors.white};
`

export const Header = styled.header`
  ${token.flexBetween}
  flex: 0 0 auto;
  gap: 10px;
  min-height: 26px;
`

export const Title = styled.h2`
  color: ${token.colors.gray.gray100};
  line-height: 1;
  ${token.typography('heading', 'sm', 'medium')}
`

export const Actions = styled.div`
  ${token.flexRight}
  flex: 0 0 auto;
  gap: 7px;
`

export const Content = styled.div`
  ${token.flexColumn}
  flex: 1 1 auto;
  min-height: 0;
`

export const EmptyText = styled.p`
  color: ${token.colors.gray.gray40};
  ${token.typography('body', 'sm', 'medium')}
`
