import styled from 'styled-components'

import * as token from '@/shared/styles/values/token'

export const Input = styled.input`
  width: 100%;
  box-sizing: border-box;
  margin-bottom: 40px;
  padding: 8px 24px;
  border: 1px solid ${token.colors.gray.gray10};
  border-radius: ${token.shapes.small};
  color: ${token.colors.gray.gray100};
  outline: 0;
  background: ${token.colors.white};
  text-align: center;
  ${token.typography('body', 'md', 'medium')}

  &::placeholder {
    color: ${token.colors.gray.gray40};
  }

  &:focus {
    border-color: ${token.colors.gray.gray80};
  }
`

export const CodeInputGroup = styled.div`
  display: flex;
  gap: 12px;
`

export const CodeInput = styled.input<{ $filled: boolean }>`
  width: 50px;
  height: 60px;
  box-sizing: border-box;
  border: 1.5px solid transparent;
  border-radius: ${token.shapes.small};
  outline: 0;
  background: ${({ $filled }) =>
    $filled ? token.colors.white : token.colors.gray.gray0};
  color: ${token.colors.gray.gray100};
  text-align: center;
  caret-color: ${token.colors.gray.gray80};
  ${token.typography('heading', 'lg', 'bold')}

  &:focus {
    border-color: ${token.colors.gray.gray80};
    background: ${token.colors.white};
  }
`
