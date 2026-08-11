import styled from 'styled-components'

import * as token from '@/shared/styles/values/token'

export const Column = styled.div`
  ${token.flexColumnStart}
  width: 280px;
  flex: 0 0 280px;
  gap: 11px;
  height: 100%;
  overflow-y: auto;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }
`

export const Header = styled.div`
  ${token.flexBetween}
  position: relative;
  width: 100%;
  flex-shrink: 0;
  padding: 18px 20px;
  border-radius: ${token.shapes.large};
  background-color: ${token.colors.primary.text};
`

export const HeaderInfo = styled.div`
  ${token.flexLeft}
  gap: 8px;
  min-width: 0;
`

export const AvatarGroup = styled.div`
  ${token.flexLeft}
  flex-shrink: 0;

  & > *:not(:first-child) {
    margin-left: -19px;
  }
`

export const RoomName = styled.p`
  ${token.typography('heading', 'sm', 'semibold')}
  margin: 0;
  overflow: hidden;
  color: ${token.colors.white};
  text-overflow: ellipsis;
  white-space: nowrap;
`

export const MenuButton = styled.button`
  ${token.flexCenter}
  width: 24px;
  height: 24px;
  flex-shrink: 0;
  padding: 0;
  border: 0;
  background-color: transparent;
  color: ${token.colors.white};
  cursor: pointer;

  svg {
    width: 24px;
    height: 24px;
  }
`

export const Menu = styled.div`
  ${token.flexColumnStart}
  position: absolute;
  top: calc(100% + 4px);
  right: 12px;
  z-index: 10;
  width: 120px;
  padding: 4px;
  border-radius: ${token.shapes.small};
  background-color: ${token.colors.white};
  ${token.elevation('black_3')}
`

export const MenuItem = styled.button<{ $isDanger?: boolean }>`
  ${token.typography('body', 'sm', 'medium')}
  width: 100%;
  padding: 8px 10px;
  border: 0;
  border-radius: ${token.shapes.xsmall};
  background-color: transparent;
  color: ${({ $isDanger }) =>
    $isDanger ? token.colors.danger.danger20 : token.colors.gray.gray80};
  text-align: left;
  cursor: pointer;

  &:hover {
    background-color: ${token.colors.gray.gray0};
  }
`

export const AskButton = styled.button`
  ${token.flexCenter}
  width: 100%;
  flex-shrink: 0;
  gap: 4px;
  padding: 8px 20px;
  border: 0;
  border-radius: ${token.shapes.large};
  background-color: ${token.colors.gray.gray10};
  ${token.typography('body', 'lg', 'semibold')}
  color: ${token.colors.gray.gray60};
  cursor: pointer;

  svg {
    width: 32px;
    height: 32px;
  }

  &:hover {
    background-color: ${token.colors.gray.gray20};
  }
`

export const EmptyText = styled.p`
  ${token.typography('body', 'sm', 'medium')}
  width: 100%;
  margin: 0;
  padding: 19px 20px;
  border-radius: ${token.shapes.large};
  background-color: ${token.colors.white};
  color: ${token.colors.gray.gray40};
`
