import styled from 'styled-components'

import * as token from '@/shared/styles/values/token'

export const Badge = styled.span`
  ${token.flexCenter}
  box-sizing: border-box;
  flex: 0 0 auto;
  width: 80px;
  padding: 6px 12px;
  overflow: hidden;
  border-radius: ${token.shapes.small};
  background: ${token.colors.primary.primary40};
  color: ${token.colors.gray.gray90};
  line-height: 1;
  white-space: nowrap;
  ${token.typography('body', 'sm', 'bold')}
`
