import styled from 'styled-components'

import * as token from '@/shared/styles/values/token'

export const Input = styled.input`
  width: 100%;
  box-sizing: border-box;
  padding: 15px 20px;
  border: 1px solid ${token.colors.gray.gray30};
  border-radius: ${token.shapes.medium};
  color: ${token.colors.gray.gray100};
  line-height: 1;
  outline: 0;
  ${token.typography('body', 'md', 'medium')}

  &::placeholder {
    color: ${token.colors.gray.gray40};
  }
`
