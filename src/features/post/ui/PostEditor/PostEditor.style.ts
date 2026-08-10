import styled from 'styled-components'

import * as token from '@/shared/styles/values/token'

export const Editor = styled.div`
  ${token.flexColumnStart}
  flex: 1 1 0;
  gap: 16px;
  box-sizing: border-box;
  width: 100%;
  min-height: 0;
  padding: 16px;
  overflow: hidden;
  border-radius: ${token.shapes.small};
  background: ${token.colors.gray.gray0};
`

export const Toolbar = styled.div`
  ${token.flexBetween}
  width: 100%;
  overflow: hidden;
`

export const ToolGroup = styled.div`
  ${token.flexLeft}
  gap: 12px;
`

export const ToolButton = styled.button`
  ${token.flexCenter}
  flex: 0 0 auto;
  width: 24px;
  height: 24px;
  color: ${token.colors.gray.gray50};
  transition: color 120ms ease;

  &:hover {
    color: ${token.colors.gray.gray80};
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
`

export const AnonymousArea = styled.div`
  ${token.flexLeft}
  gap: 6px;
`

export const AnonymousLabel = styled.span`
  color: ${token.colors.gray.gray40};
  white-space: nowrap;
  ${token.typography('body', 'lg', 'medium')}
`

export const Switch = styled.button<{ $on: boolean }>`
  position: relative;
  flex: 0 0 auto;
  width: 37px;
  height: 19px;
  border-radius: ${token.shapes.circle};
  background: ${({ $on }) =>
    $on ? token.colors.primary.primary50 : token.colors.gray.gray30};
  transition: background-color 120ms ease;

  &::after {
    content: '';
    position: absolute;
    top: 2px;
    left: ${({ $on }) => ($on ? '20px' : '2px')};
    width: 15px;
    height: 15px;
    border-radius: ${token.shapes.circle};
    background: ${token.colors.white};
    box-shadow: 0 4px 12px rgb(0 0 0 / 6%);
    transition: left 120ms ease;
  }
`

export const Divider = styled.span`
  flex: 0 0 auto;
  width: 100%;
  height: 1px;
  background: ${token.colors.gray.gray20};
`

export const ContentInput = styled.textarea`
  flex: 1 1 0;
  width: 100%;
  min-height: 0;
  border: 0;
  background: transparent;
  color: ${token.colors.gray.gray90};
  resize: none;
  ${token.typography('body', 'lg', 'medium')}

  &::placeholder {
    color: ${token.colors.gray.gray40};
  }

  &:focus {
    outline: none;
  }
`

export const HiddenFileInput = styled.input`
  display: none;
`
