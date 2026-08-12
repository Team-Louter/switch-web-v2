import styled from 'styled-components'

import * as token from '@/shared/styles/values/token'

export const Item = styled.article`
  ${token.flexBetween}
  width: 100%;
  min-height: 132px;
  padding: 20px 0;
  border-radius: ${token.shapes.medium};
`

export const Main = styled.div`
  ${token.flexRow}
  align-items: flex-start;
  gap: 20px;
  min-width: 0;
`

export const Avatar = styled.img`
  flex: 0 0 52px;
  width: 52px;
  height: 52px;
  object-fit: cover;
  overflow: hidden;
  border: 1px solid ${token.colors.gray.gray10};
  border-radius: ${token.shapes.circle};
`

export const Content = styled.div`
  ${token.flexColumnStart}
  justify-content: center;
  gap: 10px;
  min-width: 0;
`

export const Category = styled.span`
  color: ${token.colors.gray.gray70};
  line-height: 1;
  ${token.typography('body', 'lg', 'semibold')}
`

export const Message = styled.p`
  overflow: hidden;
  color: ${token.colors.gray.gray80};
  line-height: 1;
  text-overflow: ellipsis;
  white-space: nowrap;
  ${token.typography('body', 'lg', 'semibold')}
`

export const Subject = styled.p`
  overflow: hidden;
  color: ${token.colors.gray.gray80};
  line-height: 1;
  text-overflow: ellipsis;
  white-space: nowrap;
  ${token.typography('body', 'sm', 'regular')}
`

export const Meta = styled.div`
  ${token.flexColumn}
  align-items: flex-end;
  align-self: stretch;
  justify-content: space-between;
  gap: 12px;
`

export const UnreadIndicator = styled.span`
  display: block;
  width: 17px;
  height: 17px;
  border-radius: ${token.shapes.circle};
  background: ${token.colors.primary.primary50};
`

export const OccurredAt = styled.time`
  color: ${token.colors.gray.gray50};
  line-height: 1;
  white-space: nowrap;
  ${token.typography('body', 'lg', 'semibold')}
`
