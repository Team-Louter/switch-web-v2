import styled from 'styled-components'

import * as token from '@/shared/styles/values/token'

export const Track = styled.div`
  width: 100%;
  height: 8px;
  overflow: hidden;
  border-radius: ${token.shapes.circle};
  background-color: ${token.colors.primary.primary10};
`

export const Fill = styled.div<{ $value: number }>`
  width: max(8px, ${({ $value }) => $value}%);
  height: 100%;
  border-radius: inherit;
  background-color: ${token.colors.primary.primary50};
  transition: width 200ms ease;
`
