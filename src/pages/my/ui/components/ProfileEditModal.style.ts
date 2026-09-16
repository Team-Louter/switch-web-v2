import styled, { css } from 'styled-components'

import * as token from '@/shared/styles/values/token'

export const Overlay = styled.div`
  ${token.flexCenter}
  position: fixed;
  z-index: 30;
  inset: 0;
  background: rgb(14 13 12 / 45%);
`

export const Modal = styled.div`
  ${token.flexColumn}
  box-sizing: border-box;
  width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  padding: 40px 40px 36px;
  border-radius: 12px;
  background: ${token.colors.white};
  box-shadow: 0 8px 28px rgb(14 13 12 / 14%);

  &::-webkit-scrollbar {
    display: none;
  }
`

export const Title = styled.h2`
  margin: 0 0 32px;
  color: ${token.colors.gray.gray80};
  ${token.typography('heading', 'md', 'semibold')}
`

export const Row = styled.div`
  ${token.flexLeft}
  align-items: center;
  width: 100%;
  min-height: 35px;
  margin-bottom: 24px;
`

export const Label = styled.label`
  min-width: 100px;
  flex-shrink: 0;
  color: ${token.colors.gray.gray70};
  ${token.typography('body', 'md', 'medium')}
`

export const InputWrapper = styled.div`
  position: relative;
  flex: 1;
`

export const Input = styled.input`
  flex: 1;
  width: 100%;
  height: 35px;
  box-sizing: border-box;
  padding: 0 12px;
  border: 1px solid ${token.colors.gray.gray20};
  border-radius: 5px;
  outline: 0;
  color: ${token.colors.gray.gray80};
  background: ${token.colors.white};
  ${token.typography('body', 'sm', 'medium')}

  &:focus {
    border-color: ${token.colors.primary.primary50};
  }
`

export const CharCount = styled.span`
  position: absolute;
  right: 12px;
  bottom: 9px;
  color: ${token.colors.gray.gray40};
  pointer-events: none;
  ${token.typography('caption', 'md', 'medium')}
`

export const MajorContainer = styled.div`
  position: relative;
  flex: 1;
`

export const MajorDropdownButton = styled.button<{
  $hasSelection: boolean
  $isOpen: boolean
}>`
  ${token.flexBetween}
  width: 100%;
  height: 35px;
  box-sizing: border-box;
  padding: 5px 12px;
  border: 1px solid ${token.colors.gray.gray10};
  border-radius: 5px;
  color: ${({ $hasSelection }) =>
    $hasSelection ? token.colors.gray.gray80 : token.colors.gray.gray50};
  background: ${token.colors.white};
  text-align: left;
  ${token.typography('body', 'sm', 'medium')}

  &:hover {
    border-color: ${token.colors.gray.gray30};
  }
`

export const MajorArrow = styled.span<{ $isOpen: boolean }>`
  display: inline-flex;
  flex-shrink: 0;
  color: ${token.colors.gray.gray80};
  font-size: 20px;
  line-height: 1;
  transform: ${({ $isOpen }) =>
    $isOpen ? 'rotate(270deg)' : 'rotate(180deg)'};
  transition: transform 0.2s;
`

export const MajorDropdownMenu = styled.div`
  ${token.flexColumn}
  position: absolute;
  z-index: 2;
  top: calc(100% + 6px);
  right: 0;
  left: 0;
  max-height: 260px;
  overflow-y: auto;
  gap: 6px;
  padding: 10px;
  border: 1px solid ${token.colors.gray.gray10};
  border-radius: ${token.shapes.xsmall};
  background: ${token.colors.white};
  box-shadow: 0 6px 18px rgb(0 0 0 / 6%);
`

export const MajorItem = styled.button<{ $selected: boolean }>`
  ${token.flexBetween}
  padding: 5px 12px;
  border: 1px solid ${token.colors.gray.gray10};
  border-radius: 5px;
  background: ${({ $selected }) =>
    $selected ? token.colors.primary.primary10 : token.colors.white};

  &:hover {
    background: ${({ $selected }) =>
      $selected ? token.colors.primary.primary10 : token.colors.gray.gray0};
  }
`

export const MajorItemLabel = styled.span<{ $selected: boolean }>`
  color: ${({ $selected }) =>
    $selected ? token.colors.gray.gray80 : token.colors.gray.gray60};
  ${token.typography('caption', 'lg', 'medium')}
`

export const ProfileFileName = styled.span`
  flex: 1;
  overflow: hidden;
  color: ${token.colors.gray.gray50};
  text-overflow: ellipsis;
  white-space: nowrap;
  ${token.typography('body', 'sm', 'regular')}
`

export const UploadButton = styled.button`
  ${token.flexCenter}
  flex: 1;
  height: 35px;
  border: 1px solid ${token.colors.gray.gray20};
  border-radius: 6px;
  color: ${token.colors.gray.gray80};
  background: ${token.colors.white};
  ${token.typography('body', 'sm', 'medium')}

  &:hover {
    border-color: ${token.colors.gray.gray30};
    background: ${token.colors.gray.gray0};
  }
`

export const HiddenFileInput = styled.input`
  display: none;
`

export const LinkToggle = styled.button`
  ${token.flexCenter}
  gap: 6px;
  margin: 0 0 24px;
  padding: 0;
  color: ${token.colors.gray.gray50};
  ${token.typography('body', 'md', 'medium')}

  &:hover {
    color: ${token.colors.gray.gray80};
  }
`

export const LinkToggleIcon = styled.span`
  color: ${token.colors.gray.gray50};
  font-size: 18px;
  line-height: 1;
`

export const LinkSection = styled.div`
  ${token.flexColumn}
  margin-bottom: 8px;
`

export const LinkRow = styled.div`
  ${token.flexLeft}
  align-items: center;
  margin-bottom: 16px;
`

export const LinkIconWrapper = styled.span`
  ${token.flexLeft}
  min-width: 100px;
  flex-shrink: 0;
  gap: 4px;
  color: ${token.colors.gray.gray70};
  ${token.typography('body', 'md', 'medium')}

  svg {
    width: 18px;
    height: 18px;
  }
`

export const LinkInputWrapper = styled.div`
  display: flex;
  flex: 1;
  align-items: center;
  overflow: hidden;
  border: 1px solid ${token.colors.gray.gray20};
  border-radius: 5px;
  background: ${token.colors.white};

  &:focus-within {
    border-color: ${token.colors.primary.primary50};
  }
`

export const LinkPrefix = styled.span`
  padding-left: 12px;
  flex-shrink: 0;
  color: ${token.colors.gray.gray80};
  white-space: nowrap;
  ${token.typography('body', 'sm', 'medium')}
`

export const LinkInput = styled.input`
  flex: 1;
  min-width: 0;
  height: 35px;
  padding: 0 12px 0 2px;
  border: 0;
  outline: 0;
  color: ${token.colors.gray.gray80};
  background: transparent;
  ${token.typography('body', 'sm', 'medium')}

  &::placeholder {
    color: ${token.colors.gray.gray40};
  }
`

export const Divider = styled.hr`
  width: 100%;
  margin: 8px 0 28px;
  border: 0;
  border-top: 1px solid ${token.colors.gray.gray10};
`

export const ButtonRow = styled.div`
  ${token.flexLeft}
  justify-content: flex-end;
  gap: 12px;
`

const actionButtonStyle = css`
  width: 100px;
  padding: 10px 0;
  border-radius: 4px;
  ${token.typography('body', 'md', 'bold')}
`

export const CancelButton = styled.button`
  ${actionButtonStyle}
  border: 1px solid ${token.colors.gray.gray20};
  color: ${token.colors.gray.gray80};
  background: ${token.colors.white};

  &:hover {
    background: ${token.colors.gray.gray0};
  }
`

export const SaveButton = styled.button`
  ${actionButtonStyle}
  border: 0;
  color: ${token.colors.gray.gray90};
  background: ${token.colors.primary.primary40};

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  &:hover:not(:disabled) {
    background: ${token.colors.primary.primary50};
  }
`
