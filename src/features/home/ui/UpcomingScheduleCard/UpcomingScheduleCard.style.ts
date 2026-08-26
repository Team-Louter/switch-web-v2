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

export const Label = styled.div`
  ${token.flexLeft}
  gap: 8px;
  min-width: 0;
`

export const ColorDot = styled.span<{ $color: string }>`
  flex: 0 0 10px;
  width: 10px;
  height: 10px;
  border-radius: ${token.shapes.circle};
  background: ${({ $color }) => $color};
`

export const Title = styled.span`
  overflow: hidden;
  color: ${token.colors.gray.gray100};
  line-height: 1;
  text-overflow: ellipsis;
  white-space: nowrap;
  ${token.typography('body', 'md', 'medium')}
`

export const DateText = styled.span`
  flex: 0 0 auto;
  color: ${token.colors.gray.gray100};
  line-height: 1;
  ${token.typography('body', 'md', 'medium')}
`
