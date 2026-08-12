import styled from 'styled-components'

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
  line-height: 1;
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
  line-height: 1;
  ${token.typography('body', 'md', 'medium')}

  &:hover {
    background: ${token.colors.gray.gray20};
  }

  &:focus-visible {
    outline: 2px solid ${token.colors.primary.primary40};
    outline-offset: 2px;
  }
`

export const SettingsDialog = styled.div`
  ${token.flexColumnStart}
  width: min(424px, 100%);
  max-height: calc(100dvh - 48px);
  gap: 40px;
  padding: 30px;
  overflow-y: auto;
  border-radius: ${token.shapes.large};
  background: ${token.colors.white};
`

export const SettingsHeader = styled.header`
  ${token.flexBetween}
  width: 100%;
`

export const SettingsTitle = styled.h2`
  color: ${token.colors.gray.gray80};
  line-height: 1;
  ${token.typography('heading', 'md', 'medium')}
`

export const CloseButton = styled.button`
  ${token.flexCenter}
  width: 20px;
  height: 20px;
  border-radius: ${token.shapes.xsmall};

  &:focus-visible {
    outline: 2px solid ${token.colors.primary.primary40};
    outline-offset: 3px;
  }
`

export const CloseIcon = styled.img`
  width: 20px;
  height: 20px;
`

export const SettingsGroup = styled.div`
  ${token.flexColumnStart}
  width: 100%;
  gap: 20px;
`

export const SettingRow = styled.div`
  ${token.flexBetween}
  width: 100%;
  min-height: 25px;
`

export const SettingLabel = styled.span`
  color: ${token.colors.primary.primary90};
  line-height: 1;
  ${token.typography('body', 'lg', 'medium')}
`

export const ToggleButton = styled.button<{ $enabled: boolean }>`
  position: relative;
  flex: 0 0 48px;
  width: 48px;
  height: 25px;
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
`

export const ToggleThumb = styled.span<{ $enabled: boolean }>`
  position: absolute;
  top: 2px;
  left: ${({ $enabled }) => ($enabled ? '25px' : '2px')};
  width: 21px;
  height: 21px;
  border-radius: ${token.shapes.circle};
  background: ${token.colors.white};
  transition: left 160ms ease;

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`
