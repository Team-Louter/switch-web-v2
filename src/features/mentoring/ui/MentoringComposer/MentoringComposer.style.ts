import styled, { css } from 'styled-components'

import * as token from '@/shared/styles/values/token'

export const Wrapper = styled.div`
  width: 100%;
  flex-shrink: 0;
  overflow: hidden;
  border: 1px solid ${token.colors.gray.gray20};
  border-radius: ${token.shapes.medium};
  background: ${token.colors.gray.gray0};
`

export const TextareaWrap = styled.div`
  max-height: calc(3 * 1.5em + 20px);
  overflow-y: auto;
  padding: 12px 16px 0;
`

export const Textarea = styled.textarea`
  box-sizing: border-box;
  width: 100%;
  min-height: 24px;
  resize: none;
  overflow: hidden;
  border: 0;
  outline: 0;
  background: transparent;
  color: ${token.colors.gray.gray80};
  line-height: 1.45;
  ${token.typography('body', 'sm', 'medium')}

  &::placeholder {
    color: ${token.colors.gray.gray30};
  }
`

export const Toolbar = styled.div`
  ${token.flexBetween}
  gap: 12px;
  padding: 8px 12px;
  border-top: 1px solid ${token.colors.gray.gray10};
`

export const ToolGroup = styled.div`
  ${token.flexRow}
  align-items: center;
  gap: 4px;
`

const iconButtonStyle = css`
  ${token.flexCenter}
  position: relative;
  width: 32px;
  height: 32px;
  padding: 0;
  border: 0;
  border-radius: ${token.shapes.small};
  background: transparent;
  color: ${token.colors.gray.gray60};
  cursor: pointer;

  svg {
    width: 18px;
    height: 18px;
  }

  input {
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
    clip: rect(0 0 0 0);
    white-space: nowrap;
  }

  &:hover:not(:disabled) {
    background: ${token.colors.gray.gray0};
    color: ${token.colors.gray.gray90};
  }

  &:disabled {
    color: ${token.colors.gray.gray30};
    cursor: not-allowed;
  }
`

export const IconButton = styled.button`
  ${iconButtonStyle}
`

export const ImageButton = styled.label`
  ${iconButtonStyle}
`

export const CharacterCount = styled.span`
  color: ${token.colors.gray.gray40};
  ${token.typography('caption', 'md', 'medium')}
`

export const ImagePreviewArea = styled.div`
  ${token.flexRow}
  flex-wrap: wrap;
  gap: 8px;
  padding: 8px 16px 0;
`

export const ImagePreviewItem = styled.div`
  position: relative;
  width: 72px;
  height: 72px;
`

export const PreviewImage = styled.img`
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  border: 1px solid ${token.colors.gray.gray20};
  border-radius: ${token.shapes.small};
  object-fit: cover;
`

export const RemoveImageButton = styled.button`
  ${token.flexCenter}
  position: absolute;
  top: -6px;
  right: -6px;
  width: 22px;
  height: 22px;
  padding: 0;
  border: 0;
  border-radius: ${token.shapes.circle};
  background: ${token.colors.gray.gray80};
  color: ${token.colors.white};
  cursor: pointer;

  svg {
    width: 12px;
    height: 12px;
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }
`
