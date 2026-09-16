import styled from 'styled-components'

import * as token from '@/shared/styles/values/token'

export const Card = styled.button`
  ${token.flexColumnStart}
  width: 100%;
  gap: 10px;
  padding: 19px 20px;
  border: 0;
  border-radius: ${token.shapes.large};
  background-color: ${token.colors.white};
  text-align: left;
  cursor: pointer;

  &:hover {
    background-color: ${token.colors.primary.primary0};
  }
`

export const Status = styled.span<{ $color: string }>`
  ${token.typography('body', 'md', 'bold')}
  color: ${({ $color }) => $color};
`

export const Title = styled.span`
  ${token.typography('heading', 'sm', 'bold')}
  width: 100%;
  color: ${token.colors.gray.gray80};
  word-break: break-word;
`

export const CreatedAt = styled.span`
  ${token.typography('caption', 'lg', 'semibold')}
  margin-top: 5px;
  color: ${token.colors.gray.gray30};
`
