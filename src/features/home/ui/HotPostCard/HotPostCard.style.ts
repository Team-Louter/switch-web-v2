import styled from 'styled-components'

import * as token from '@/shared/styles/values/token'

export const List = styled.ul`
  ${token.flexColumn}
  width: 100%;
  gap: 13px;
`

export const Item = styled.li`
  ${token.flexBetween}
  gap: 10px;
  min-height: 20px;
`

export const Title = styled.span`
  overflow: hidden;
  color: ${token.colors.gray.gray100};
  line-height: 1;
  text-overflow: ellipsis;
  white-space: nowrap;
  ${token.typography('body', 'md', 'medium')}
`

export const Counts = styled.div`
  ${token.flexRight}
  flex: 0 0 auto;
`

export const Count = styled.span`
  ${token.flexLeft}
  gap: 4px;
  min-width: 37px;
  color: #404040;
  line-height: 1;
  ${token.typography('body', 'sm', 'medium')}
`

export const CountIcon = styled.img`
  width: 20px;
  height: 20px;
`
