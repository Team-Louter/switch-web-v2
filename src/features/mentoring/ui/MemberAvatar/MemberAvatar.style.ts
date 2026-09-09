import styled from 'styled-components'

import * as token from '@/shared/styles/values/token'

export const Avatar = styled.img<{ $size: number; $borderWidth: number }>`
  width: ${({ $size }) => $size}px;
  height: ${({ $size }) => $size}px;
  flex-shrink: 0;
  border: ${({ $borderWidth }) => $borderWidth}px solid
    ${token.colors.gray.gray10};
  border-radius: ${token.shapes.circle};
  background-color: ${token.colors.white};
  object-fit: cover;
`
