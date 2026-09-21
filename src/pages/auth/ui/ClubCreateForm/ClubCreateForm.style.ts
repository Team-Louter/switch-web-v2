import styled, { css } from 'styled-components'

import * as token from '@/shared/styles/values/token'

export const Form = styled.form<{
  $accentColor: string
  $isDarkAccent: boolean
}>`
  ${token.flexColumn}
  align-items: stretch;
  gap: 20px;
  width: 100%;
  --club-accent-color: ${({ $accentColor }) => $accentColor};
  --club-accent-foreground: ${({ $isDarkAccent }) =>
    $isDarkAccent ? token.colors.white : token.colors.gray.gray100};
`

export const FieldGroup = styled.div`
  ${token.flexColumn}
  align-items: stretch;
  gap: 8px;
  width: 100%;
`

export const Label = styled.label`
  color: ${token.colors.gray.gray70};
  line-height: 1.3;
  ${token.typography('caption', 'lg', 'semibold')}
`

export const RequiredMark = styled.span`
  margin-left: 4px;
  color: var(--club-accent-color);
`

const fieldStyle = css`
  box-sizing: border-box;
  width: 100%;
  border: 1px solid ${token.colors.gray.gray10};
  border-radius: ${token.shapes.xsmall};
  color: ${token.colors.gray.gray70};
  background: ${token.colors.white};
  line-height: 1;
  ${token.typography('caption', 'lg', 'medium')}

  &::placeholder {
    color: ${token.colors.gray.gray40};
    opacity: 1;
  }

  &:focus {
    border-color: ${token.colors.gray.gray60};
    outline: none;
  }
`

export const TextInput = styled.input`
  ${fieldStyle}
  height: 38px;
  padding: 0 14px;
`

export const FilePicker = styled.div`
  ${token.flexRow}
  align-items: center;
  gap: 12px;
  min-height: 72px;
  box-sizing: border-box;
  width: 100%;
  padding: 10px 12px;
  border: 1px dashed ${token.colors.gray.gray20};
  border-radius: ${token.shapes.small};
  background: ${token.colors.gray.gray0};
`

export const HiddenFileInput = styled.input`
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0 0 0 0);
  clip-path: inset(50%);
  white-space: nowrap;
`

export const FilePickerButton = styled.label`
  ${token.flexCenter}
  flex: 0 0 auto;
  height: 34px;
  padding: 0 14px;
  border: 1px solid ${token.colors.gray.gray20};
  border-radius: ${token.shapes.xsmall};
  color: ${token.colors.gray.gray70};
  background: ${token.colors.white};
  cursor: pointer;
  line-height: 1;
  ${token.typography('caption', 'md', 'semibold')}

  &:hover {
    border-color: ${token.colors.gray.gray40};
  }

  &:focus-within {
    outline: 2px solid ${token.colors.primary.primary20};
    outline-offset: 1px;
  }
`

export const ImagePreviewButton = styled.label<{ $isLogo?: boolean }>`
  position: relative;
  display: block;
  flex: 0 0 auto;
  width: ${({ $isLogo }) => ($isLogo ? '52px' : '84px')};
  height: 52px;
  overflow: hidden;
  border-radius: ${({ $isLogo }) =>
    $isLogo ? token.shapes.small : token.shapes.xsmall};
  cursor: pointer;

  &:focus-visible {
    outline: 2px solid ${token.colors.primary.primary20};
    outline-offset: 2px;
  }

  &:hover > div,
  &:focus-visible > div {
    opacity: 1;
  }
`

export const ImageEditOverlay = styled.div`
  ${token.flexCenter}
  position: absolute;
  inset: 0;
  color: ${token.colors.white};
  background: rgb(14 13 12 / 48%);
  opacity: 0;
  transition: opacity 120ms ease;
`

export const ImageEditIcon = styled.span`
  ${token.flexCenter}
  width: 24px;
  height: 24px;
  font-size: 18px;
`

export const FileInfo = styled.div`
  ${token.flexColumn}
  align-items: flex-start;
  min-width: 0;
  gap: 3px;
`

export const FileName = styled.span`
  max-width: 100%;
  overflow: hidden;
  color: ${token.colors.gray.gray70};
  text-overflow: ellipsis;
  white-space: nowrap;
  ${token.typography('caption', 'md', 'medium')}
`

export const FileHint = styled.span`
  color: ${token.colors.gray.gray40};
  line-height: 1.3;
  ${token.typography('caption', 'sm', 'medium')}
`

export const ImagePreview = styled.img<{ $isLogo?: boolean }>`
  display: block;
  width: 100%;
  height: 100%;
  border: 1px solid ${token.colors.gray.gray10};
  border-radius: ${({ $isLogo }) =>
    $isLogo ? token.shapes.small : token.shapes.xsmall};
  object-fit: ${({ $isLogo }) => ($isLogo ? 'contain' : 'cover')};
  background: ${token.colors.white};
`

export const Palette = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  width: 100%;
`

export const ColorOption = styled.button<{
  $color: string
  $selected: boolean
}>`
  position: relative;
  flex: 0 0 38px;
  width: 38px;
  height: 38px;
  border: 2px solid
    ${({ $selected }) =>
      $selected ? token.colors.gray.gray80 : token.colors.white};
  border-radius: ${token.shapes.circle};
  background: ${({ $color }) => $color};
  box-shadow: 0 0 0 1px ${token.colors.gray.gray10};
  cursor: pointer;
  transition: transform 120ms ease;

  &:hover {
    transform: translateY(-1px);
  }

  &:focus-visible {
    outline: 2px solid ${token.colors.primary.primary50};
    outline-offset: 3px;
  }

  &::after {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 6px;
    height: 10px;
    border-right: 2px solid ${token.colors.white};
    border-bottom: 2px solid ${token.colors.white};
    content: '';
    opacity: ${({ $selected }) => ($selected ? 1 : 0)};
    transform: translate(-50%, -60%) rotate(45deg);
  }
`

export const SubmitButton = styled.button`
  width: 100%;
  height: 44px;
  margin-top: 4px;
  border-radius: ${token.shapes.small};
  color: var(--club-accent-foreground);
  background: var(--club-accent-color);
  cursor: pointer;
  line-height: 1;
  ${token.typography('body', 'sm', 'bold')}

  &:hover {
    filter: brightness(0.96);
  }

  &:disabled {
    background: var(--club-accent-color);
    cursor: not-allowed;
    opacity: 0.5;
  }

  &:focus-visible {
    outline: 2px solid ${token.colors.primary.primary60};
    outline-offset: 2px;
  }
`

export const CreateBrand = styled.div`
  ${token.flexColumn}
  align-items: center;
  gap: 24px;
  margin-top: 12px;
  width: 100%;

  @media (max-width: 420px) {
    gap: 20px;
  }
`

export const CreateBrandDivider = styled.div`
  width: 100%;
  height: 1px;
  background: ${token.colors.gray.gray10};
`

export const CreateBrandText = styled.span`
  color: #59606d;
  line-height: 1;
  letter-spacing: -0.3px;
  ${token.typography('body', 'md', 'medium')}
  font-size: 14px;
`
