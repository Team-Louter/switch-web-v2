import styled from 'styled-components'

import * as token from '@/shared/styles/values/token'

export const Header = styled.header`
  ${token.flexColumnStart}
  gap: 24px;
  width: 100%;
`

export const HeaderInner = styled.div`
  ${token.flexColumnStart}
  gap: 20px;
  width: 100%;
`

export const TitleRow = styled.div`
  ${token.flexBetween}
  gap: 16px;
  width: 100%;
`

export const FieldRow = styled.div`
  ${token.flexLeft}
  align-items: flex-start;
  gap: 12px;
  width: 100%;
`

export const TitleInput = styled.input`
  flex: 1 1 0;
  box-sizing: border-box;
  min-width: 0;
  height: 52px;
  padding: 15px 20px;
  border: 0;
  border-radius: ${token.shapes.medium};
  background: ${token.colors.gray.gray0};
  color: ${token.colors.gray.gray90};
  ${token.typography('body', 'lg', 'medium')}

  &::placeholder {
    color: ${token.colors.gray.gray40};
  }

  &:focus {
    outline: none;
  }
`

export const EditorArea = styled.div`
  ${token.flexColumnStart}
  flex: 1 1 0;
  width: 100%;
  min-height: 480px;
`

export const ErrorText = styled.p`
  color: ${token.colors.danger.danger20};
  ${token.typography('body', 'md', 'medium')}
`
