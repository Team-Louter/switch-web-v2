import styled from 'styled-components'

import * as token from '@/shared/styles/values/token'

export const Field = styled.label`
  ${token.flexColumn}
  align-items: flex-start;
  flex: 1 1 0;
  min-width: 0;
  gap: 5px;
`

export const Label = styled.span`
  color: ${token.colors.gray.gray80};
  line-height: 1;
  ${token.typography('body', 'md', 'medium')}
`

export const InputBox = styled.div<{ $disabled: boolean }>`
  ${token.flexLeft}
  width: 100%;
  box-sizing: border-box;
  gap: 10px;
  padding: 15px 20px;
  border: 1px solid ${token.colors.gray.gray30};
  border-radius: ${token.shapes.medium};
  background: ${({ $disabled }) =>
    $disabled ? token.colors.gray.gray0 : token.colors.white};
`

export const Input = styled.input`
  flex: 1 1 0;
  min-width: 0;
  padding: 0;
  border: 0;
  outline: 0;
  color: ${token.colors.gray.gray100};
  background: transparent;
  line-height: 1;
  ${token.typography('body', 'md', 'medium')}

  &::placeholder {
    color: ${token.colors.gray.gray40};
  }
`
