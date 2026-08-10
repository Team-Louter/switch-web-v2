import styled from 'styled-components'

import * as token from '@/shared/styles/values/token'

export const Section = styled.section`
  ${token.flexColumnStart}
  gap: 20px;
  width: 100%;
`

export const WriteArea = styled.div`
  ${token.flexColumnStart}
  gap: 12px;
  align-items: flex-end;
  width: 100%;
`

export const Heading = styled.h2`
  align-self: flex-start;
  color: ${token.colors.gray.gray100};
  ${token.typography('heading', 'sm', 'semibold')}
`

export const InputRow = styled.div`
  ${token.flexBetween}
  gap: 12px;
  box-sizing: border-box;
  width: 100%;
  height: 52px;
  padding: 15px 20px;
  overflow: hidden;
  border-radius: ${token.shapes.medium};
  background: ${token.colors.gray.gray0};
`

export const CommentInput = styled.input`
  flex: 1 1 0;
  min-width: 0;
  border: 0;
  background: transparent;
  color: ${token.colors.gray.gray90};
  ${token.typography('body', 'lg', 'medium')}

  &::placeholder {
    color: ${token.colors.gray.gray40};
  }

  &:focus {
    outline: none;
  }
`

export const SendButton = styled.button`
  ${token.flexCenter}
  flex: 0 0 auto;
  width: 32px;
  height: 32px;
  color: ${token.colors.gray.gray60};
  transition: color 120ms ease;

  &:hover:not(:disabled) {
    color: ${token.colors.gray.gray90};
  }

  &:disabled {
    cursor: not-allowed;
    color: ${token.colors.gray.gray30};
  }
`

export const AnonymousLabel = styled.label`
  ${token.flexLeft}
  gap: 8px;
  color: ${token.colors.gray.gray70};
  cursor: pointer;
  ${token.typography('body', 'lg', 'medium')}
`

export const Checkbox = styled.input`
  appearance: none;
  flex: 0 0 auto;
  width: 20px;
  height: 20px;
  margin: 0;
  border: 1.6px solid ${token.colors.gray.gray40};
  border-radius: ${token.shapes.xsmall};
  background: ${token.colors.white};
  cursor: pointer;
  position: relative;

  &:checked {
    border-color: ${token.colors.primary.primary50};
    background: ${token.colors.primary.primary50};
  }

  &:checked::after {
    content: '';
    position: absolute;
    top: 2px;
    left: 5.5px;
    width: 5px;
    height: 9px;
    border: solid ${token.colors.gray.gray100};
    border-width: 0 2px 2px 0;
    transform: rotate(45deg);
  }
`

export const CommentListArea = styled.div`
  ${token.flexColumnStart}
  width: 100%;
  padding: 5px 4px;
  overflow: hidden;
`

export const StatusText = styled.p`
  width: 100%;
  padding: 24px 0;
  color: ${token.colors.gray.gray40};
  ${token.typography('body', 'lg', 'medium')}
`
