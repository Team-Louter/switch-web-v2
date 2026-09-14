import styled, { keyframes } from 'styled-components'

import * as token from '@/shared/styles/values/token'

export const Overlay = styled.div`
  ${token.flexCenter}
  position: fixed;
  z-index: 1000;
  inset: 0;
  padding: 24px;
  background: rgb(0 0 0 / 60%);
`

export const DeleteDialog = styled.div`
  ${token.flexColumnStart}
  justify-content: flex-end;
  width: min(500px, 100%);
  min-height: 143px;
  gap: 20px;
  padding: 30px;
  overflow: hidden;
  border-radius: ${token.shapes.medium};
  background: ${token.colors.white};
`

export const DeleteTitle = styled.h2`
  color: ${token.colors.gray.gray100};
  line-height: normal;
  ${token.typography('heading', 'sm', 'semibold')}
`

export const DeleteActions = styled.div`
  ${token.flexRow}
  width: 100%;
  gap: 10px;
`

export const DeleteActionButton = styled.button<{ $danger?: boolean }>`
  ${token.flexCenter}
  flex: 1 1 0;
  min-width: 0;
  height: 39px;
  padding: 10px 20px;
  border-radius: ${token.shapes.small};
  color: ${({ $danger }) =>
    $danger ? token.colors.danger.danger20 : token.colors.gray.gray100};
  background: ${token.colors.gray.gray10};
  line-height: normal;
  ${token.typography('body', 'md', 'medium')}

  &:hover {
    background: ${token.colors.gray.gray20};
  }

  &:focus-visible {
    outline: 2px solid ${token.colors.primary.primary40};
    outline-offset: 2px;
  }

  &:disabled {
    cursor: wait;
    opacity: 0.6;
  }
`

export const SettingsContent = styled.div`
  ${token.flexColumnStart}
  max-height: calc(100dvh - 40px);
  gap: 16px;
  width: 100%;
  overflow-y: auto;
`

const settingsPopoverEnter = keyframes`
  from {
    opacity: 0;
    transform: translateY(-6px) scale(0.98);
  }

  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
`

export const SettingsPopover = styled.div`
  position: absolute;
  z-index: 200;
  top: calc(100% + 10px);
  right: 0;
  box-sizing: border-box;
  width: min(300px, calc(100vw - 40px));
  padding: 20px;
  border: 1px solid ${token.colors.gray.gray0};
  border-radius: 20px;
  background: ${token.colors.white};
  box-shadow: 0 4px 20px rgb(0 0 0 / 6%);
  transform-origin: top right;
  animation: ${settingsPopoverEnter} 180ms ease both;

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`

export const SettingsHeader = styled.header`
  ${token.flexBetween}
  width: 100%;
`

export const SettingsTitle = styled.h2`
  color: ${token.colors.gray.gray100};
  line-height: normal;
  ${token.typography('body', 'md', 'semibold')}
`

export const CloseButton = styled.button`
  ${token.flexCenter}
  width: 16px;
  height: 16px;
  border-radius: ${token.shapes.xsmall};

  &:focus-visible {
    outline: 2px solid ${token.colors.primary.primary40};
    outline-offset: 3px;
  }
`

export const CloseIcon = styled.img`
  display: block;
  width: 14px;
  height: 14px;
`

export const SettingsGroup = styled.div`
  ${token.flexColumnStart}
  width: 100%;
  gap: 12px;

  & + & {
    padding-top: 16px;
    border-top: 1px solid ${token.colors.gray.gray0};
  }
`

export const SettingRow = styled.div`
  ${token.flexBetween}
  gap: 16px;
  width: 100%;
  min-height: 24px;
`

export const SettingLabel = styled.span`
  color: ${token.colors.gray.gray100};
  line-height: normal;
  ${token.typography('body', 'sm', 'semibold')}
`

export const SettingsError = styled.p`
  width: 100%;
  color: ${token.colors.danger.danger20};
  line-height: 1.4;
  ${token.typography('body', 'sm', 'medium')}
`

export const ToggleButton = styled.button<{ $enabled: boolean }>`
  position: relative;
  flex: 0 0 44px;
  width: 44px;
  height: 24px;
  border-radius: ${token.shapes.circle};
  background: ${({ $enabled }) =>
    $enabled ? token.colors.primary.primary50 : token.colors.gray.gray20};
  transition: background-color 160ms ease;

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }

  &:focus-visible {
    outline: 2px solid ${token.colors.primary.primary40};
    outline-offset: 3px;
  }

  &:disabled {
    cursor: wait;
    opacity: 0.6;
  }
`

export const ToggleThumb = styled.span<{ $enabled: boolean }>`
  position: absolute;
  top: 2px;
  left: ${({ $enabled }) => ($enabled ? '22px' : '2px')};
  width: 20px;
  height: 20px;
  border-radius: ${token.shapes.circle};
  background: ${token.colors.white};
  transition: left 160ms ease;

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`
