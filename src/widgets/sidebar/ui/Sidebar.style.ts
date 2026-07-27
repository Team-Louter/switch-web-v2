import styled, { css } from 'styled-components'

import * as token from '@/shared/styles/values/token'

import type { IconFrame } from './SidebarIcon'

export const Aside = styled.aside`
  ${token.flexColumnStart}
  width: 100%;
  min-width: 220px;
  height: 100%;
  min-height: 0;
  gap: clamp(24px, 3.25dvh, 40px);
  overflow: hidden;
  padding: 36px 20px;
  border-radius: ${token.shapes.xlarge};
  background: ${token.colors.gray.gray0};
`

export const LogoArea = styled.div`
  ${token.flexLeft}
  flex: 0 0 auto;
  width: 100%;
  padding: 0 10px;
`

export const Logo = styled.img`
  width: 91.667px;
  height: 25px;
`

export const MenuList = styled.div`
  ${token.flexColumnStart}
  flex: 0 0 auto;
  width: 100%;
  gap: 15px;
`

export const MenuButton = styled.button<{ $active?: boolean }>`
  ${token.flexLeft}
  width: 100%;
  gap: 15px;
  overflow: hidden;
  padding: 13px 10px;
  border-radius: ${token.shapes.medium};
  background: ${({ $active }) => ($active ? token.colors.white : 'transparent')};
  transition:
    background-color 120ms ease,
    color 120ms ease;

  &:hover,
  &:focus-visible {
    background: ${({ $active }) =>
      $active ? token.colors.white : token.colors.gray.gray10};
  }

  &:focus-visible {
    outline: 2px solid ${token.colors.primary.primary40};
    outline-offset: 2px;
  }
`

export const IconBox = styled.span<{ $wide?: boolean }>`
  position: relative;
  flex: 0 0 20px;
  width: 20px;
  height: 20px;
  overflow: hidden;

  ${({ $wide }) =>
    $wide &&
    css`
      overflow: visible;
    `}
`

export const IconSvg = styled.span<{ $active: boolean; $frame: IconFrame }>`
  display: block;
  position: absolute;
  left: ${({ $frame }) => $frame.left}px;
  top: ${({ $frame }) => $frame.top}px;
  width: ${({ $frame }) => $frame.width}px;
  height: ${({ $frame }) => $frame.height}px;
  color: ${({ $active }) =>
    $active ? token.colors.gray.gray70 : token.colors.gray.gray30};
  transition: color 120ms ease;

  svg {
    width: 100%;
    height: 100%;
  }
`

export const MenuLabel = styled.span<{ $active?: boolean }>`
  color: ${({ $active }) =>
    $active ? token.colors.gray.gray90 : token.colors.gray.gray50};
  line-height: 1;
  white-space: nowrap;
  ${token.typography('body', 'md', 'semibold')}
`

export const Divider = styled.img`
  flex: 0 0 auto;
  width: 100%;
  height: 1px;
`

export const Spacer = styled.div`
  flex: 1 1 0;
  min-height: 0;
`

export const Profile = styled.div`
  ${token.flexLeft}
  flex: 0 0 auto;
  width: 100%;
  gap: 10px;
  overflow: hidden;
  padding: 13px 10px;
`

export const AvatarWrap = styled.div`
  position: relative;
  flex: 0 0 43px;
  width: 43px;
  height: 43px;
  overflow: hidden;
  border-radius: ${token.shapes.circle};
  background: ${token.colors.primary.primary10};
`

export const Avatar = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`

export const ProfileText = styled.div`
  ${token.flexColumn}
  align-items: flex-start;
  justify-content: center;
  gap: 5px;
  min-width: 0;
  overflow: hidden;
  white-space: nowrap;
`

export const ProfileName = styled.span`
  max-width: 100%;
  overflow: hidden;
  color: ${token.colors.gray.gray100};
  line-height: 1;
  text-overflow: ellipsis;
  ${token.typography('body', 'lg', 'semibold')}
`

export const ProfileMeta = styled.span`
  max-width: 100%;
  overflow: hidden;
  color: ${token.colors.gray.gray70};
  line-height: 1;
  text-overflow: ellipsis;
  ${token.typography('caption', 'sm', 'regular')}
`
