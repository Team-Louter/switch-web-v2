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

export const CodeInputGroup = styled.div`
  display: grid;
  grid-template-columns: repeat(6, minmax(0, 1fr));
  width: 426px;
  max-width: 100%;
  height: 89px;
  gap: 10px;
`

export const CodeInput = styled.input`
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  border: 0;
  border-radius: ${token.shapes.xsmall};
  outline: 0;
  background: ${token.colors.gray.gray0};
  color: ${token.colors.gray.gray100};
  text-align: center;
  caret-color: ${token.colors.primary.primary60};
  ${token.typography('heading', 'md', 'medium')}

  &:focus {
    box-shadow: inset 0 0 0 1px ${token.colors.primary.primary50};
  }
`
