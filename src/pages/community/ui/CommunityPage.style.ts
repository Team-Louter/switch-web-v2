import styled from 'styled-components'

import * as token from '@/shared/styles/values/token'

export const Header = styled.header`
  ${token.flexColumnStart}
  gap: 20px;
  width: 100%;
`

export const TitleRow = styled.div`
  ${token.flexBetween}
  gap: 16px;
  width: 100%;
`

export const TitleGroup = styled.div`
  ${token.flexLeft}
  gap: 16px;
`

export const Description = styled.p`
  color: ${token.colors.gray.gray50};
  white-space: nowrap;
  ${token.typography('body', 'lg', 'medium')}
`

export const ListArea = styled.div`
  ${token.flexColumnStart}
  width: 100%;
  overflow: hidden;
`
