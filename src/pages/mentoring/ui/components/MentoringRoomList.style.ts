import styled from 'styled-components'

import * as token from '@/shared/styles/values/token'

export const List = styled.div`
  ${token.flexColumn}
  width: 100%;
  gap: 3px;
`

export const RoomItem = styled.div<{ $selected: boolean }>`
  ${token.flexBetween}
  position: relative;
  box-sizing: border-box;
  width: 100%;
  min-height: 54px;
  gap: 10px;
  padding: 9px 10px 9px 12px;
  border: 0;
  border-radius: ${token.shapes.small};
  background: ${({ $selected }) =>
    $selected ? token.colors.white : 'transparent'};
  box-shadow: ${({ $selected }) =>
    $selected
      ? `inset 3px 0 0 ${token.colors.primary.primary50}, ${token.elevations.black_1}`
      : 'none'};
  cursor: pointer;
  transition:
    background-color 120ms ease,
    box-shadow 120ms ease;

  &:hover {
    background: ${({ $selected }) =>
      $selected ? token.colors.white : token.colors.gray.gray10};
  }

  &:focus-visible {
    outline: 2px solid ${token.colors.primary.primary60};
    outline-offset: 2px;
  }
`

export const RoomInfo = styled.div`
  ${token.flexRow}
  align-items: center;
  min-width: 0;
  flex: 1 1 auto;
  gap: 10px;
`

export const AvatarArea = styled.div`
  position: relative;
  width: 35px;
  height: 35px;
  flex-shrink: 0;
`

export const AvatarGroup = styled.div`
  position: relative;
  width: 35px;
  height: 35px;

  & > * {
    position: absolute;
  }

  & > :nth-child(1) {
    top: 0;
    left: 0;
  }

  & > :nth-child(2) {
    top: 0;
    right: 0;
  }

  & > :nth-child(3) {
    bottom: 0;
    left: 0;
  }

  & > :nth-child(4) {
    right: 0;
    bottom: 0;
  }
`

export const RoomName = styled.span`
  min-width: 0;
  overflow: hidden;
  color: ${token.colors.gray.gray90};
  text-overflow: ellipsis;
  white-space: nowrap;
  ${token.typography('body', 'sm', 'semibold')}
`

export const RoomActions = styled.div`
  position: relative;
  flex-shrink: 0;
`

export const MenuButton = styled.button`
  ${token.flexCenter}
  width: 24px;
  height: 32px;
  padding: 0;
  border: 0;
  border-radius: ${token.shapes.xsmall};
  background: transparent;
  color: ${token.colors.gray.gray50};
  cursor: pointer;

  svg {
    width: 20px;
    height: 20px;
  }

  &:hover {
    background: ${token.colors.gray.gray10};
    color: ${token.colors.gray.gray80};
  }
`

export const EmptyText = styled.p`
  margin: 0;
  padding: 20px 0;
  color: ${token.colors.gray.gray50};
  text-align: center;
  ${token.typography('body', 'sm', 'medium')}
`
