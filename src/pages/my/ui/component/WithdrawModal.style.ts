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

const DialogButton = styled.button`
  ${token.flexCenter}
  flex: 1 1 0;
  min-width: 0;
  padding: 10px 20px;
  border-radius: ${token.shapes.small};
  line-height: 1;
  ${token.typography('body', 'md', 'medium')}
`

export const SecondaryButton = styled(DialogButton)`
  color: ${token.colors.gray.gray100};
  background: ${token.colors.gray.gray10};
`

export const PrimaryButton = styled(DialogButton)`
  color: ${token.colors.gray.gray100};
  background: ${token.colors.primary.primary50};

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`

export const DangerButton = styled(DialogButton)`
  color: ${token.colors.danger.danger20};
  background: ${token.colors.gray.gray10};
`
