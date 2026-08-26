import styled from 'styled-components'

import * as token from '@/shared/styles/values/token'

export const Content = styled.div`
  ${token.flexColumn}
  gap: 12px;
  width: 100%;
`

export const Title = styled.h2`
  margin: 0;
  color: ${token.colors.gray.gray100};
  ${token.typography('heading', 'sm', 'semibold')}
  line-height: 1.35;
`

export const Description = styled.p`
  margin: 0;
  color: ${token.colors.gray.gray70};
  ${token.typography('body', 'md', 'regular')}
  line-height: 1.5;
`

export const Actions = styled.div`
  ${token.flexRow}
  justify-content: flex-end;
  gap: 8px;
  width: 100%;
  margin-top: 12px;
`
