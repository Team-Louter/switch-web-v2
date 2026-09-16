import styled, { keyframes } from 'styled-components'

import * as token from '@/shared/styles/values/token'

const skeletonPulse = keyframes`
  0%, 100% { opacity: 0.55; }
  50% { opacity: 1; }
`

export const Overlay = styled.div`
  ${token.flexCenter}
  position: fixed;
  z-index: 30;
  inset: 0;
  background: rgb(14 13 12 / 45%);
`

export const Modal = styled.section`
  ${token.flexColumn}
  position: relative;
  width: 680px;
  max-height: 80vh;
  overflow: hidden;
  border-radius: ${token.shapes.large};
  background: ${token.colors.white};
  box-shadow: 0 8px 28px rgb(14 13 12 / 14%);
`

export const SearchBar = styled.div`
  ${token.flexLeft}
  box-sizing: border-box;
  flex-shrink: 0;
  width: 100%;
  gap: 12px;
  padding: 16px 24px;
  border-bottom: 1px solid ${token.colors.gray.gray10};
`

export const SearchIcon = styled.img`
  width: 18px;
  height: 18px;
  flex: 0 0 auto;
`

export const SearchInput = styled.input`
  flex: 1 1 0;
  min-width: 0;
  border: 0;
  outline: 0;
  color: ${token.colors.gray.gray70};
  background: transparent;
  ${token.typography('body', 'md', 'regular')}

  &::placeholder {
    color: ${token.colors.gray.gray40};
  }
`

export const CloseButton = styled.button`
  ${token.flexCenter}
  width: 28px;
  height: 28px;
  border-radius: ${token.shapes.circle};

  &:hover {
    background: ${token.colors.gray.gray0};
  }
`

export const CloseIcon = styled.img`
  width: 18px;
  height: 18px;
`

export const List = styled.div`
  ${token.flexColumn}
  width: 100%;
  max-height: 288px;
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 4px;
  }

  &::-webkit-scrollbar-thumb {
    border-radius: 2px;
    background: ${token.colors.gray.gray10};
  }
`

export const Empty = styled.div`
  ${token.flexCenter}
  min-height: 216px;
  color: ${token.colors.gray.gray40};
  ${token.typography('body', 'md', 'medium')}
`

export const Row = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  align-items: center;
  box-sizing: border-box;
  width: 100%;
  padding: 16px 24px;
  border-bottom: 1px solid ${token.colors.gray.gray10};

  &:last-child {
    border-bottom: 0;
  }
`

export const MemberInfo = styled.div`
  ${token.flexLeft}
  min-width: 0;
  gap: 14px;
`

export const Avatar = styled.div`
  ${token.flexCenter}
  width: 30px;
  height: 30px;
  flex: 0 0 auto;
  overflow: hidden;
  border-radius: ${token.shapes.circle};
  background: ${token.colors.gray.gray0};
`

export const AvatarImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`

export const AvatarFallback = styled.span`
  color: ${token.colors.gray.gray80};
  ${token.typography('body', 'sm', 'bold')}
`

export const TextGroup = styled.div`
  ${token.flexColumn}
  align-items: flex-start;
  min-width: 0;
  gap: 1px;
`

export const Name = styled.span`
  max-width: 170px;
  overflow: hidden;
  color: ${token.colors.gray.gray80};
  text-overflow: ellipsis;
  white-space: nowrap;
  ${token.typography('caption', 'lg', 'semibold')}
`

export const ClassInfo = styled.span`
  max-width: 170px;
  overflow: hidden;
  color: ${token.colors.gray.gray40};
  text-overflow: ellipsis;
  white-space: nowrap;
  ${token.typography('caption', 'md', 'medium')}
`

export const Role = styled.span`
  ${token.flexCenter}
  gap: 4px;
  color: ${token.colors.gray.gray40};
  white-space: nowrap;
  ${token.typography('caption', 'md', 'medium')}
`

export const CrownIcon = styled.img`
  width: 15px;
  height: 15px;
`

export const CrownSpacer = styled.span`
  width: 15px;
  height: 15px;
`

export const MoreButton = styled.button`
  ${token.flexCenter}
  justify-self: end;
  width: 32px;
  height: 32px;
  border-radius: ${token.shapes.xsmall};

  &:hover {
    background: ${token.colors.gray.gray0};
  }
`

export const MoreIcon = styled.img`
  width: 4px;
  height: 16px;
`

export const Footer = styled.footer`
  ${token.flexBetween}
  box-sizing: border-box;
  flex: 0 0 49px;
  width: 100%;
  padding: 0 24px;
  border-top: 1px solid ${token.colors.gray.gray0};
  border-radius: 0 0 ${token.shapes.large} ${token.shapes.large};
  background: ${token.colors.gray.gray0};
`

export const MemberCount = styled.span`
  color: ${token.colors.gray.gray50};
  ${token.typography('caption', 'md', 'medium')}
`

export const ShortcutGroup = styled.button`
  ${token.flexLeft}
  gap: 6px;
  color: ${token.colors.gray.gray50};
  ${token.typography('caption', 'sm', 'medium')}
`

export const ShortcutKey = styled.span`
  ${token.flexCenter}
  box-sizing: border-box;
  min-width: 37px;
  height: 21px;
  padding: 0 7px;
  border: 1px solid ${token.colors.gray.gray10};
  border-radius: ${token.shapes.xsmall};
  background: ${token.colors.white};
  letter-spacing: 0.5px;
`

export const MenuPositioner = styled.div<{ $right: number; $top: number }>`
  position: fixed;
  z-index: 32;
  top: ${({ $top }) => $top}px;
  right: ${({ $right }) => $right}px;
`

export const SkeletonRow = styled(Row)`
  grid-template-columns: 30px minmax(0, 1fr) 80px;
  gap: 14px;
`

export const SkeletonAvatar = styled.div`
  width: 30px;
  height: 30px;
  border-radius: ${token.shapes.circle};
  background: ${token.colors.gray.gray10};
  animation: ${skeletonPulse} 1.2s ease-in-out infinite;
`

export const SkeletonTextGroup = styled.div`
  ${token.flexColumn}
  align-items: flex-start;
  gap: 6px;
`

export const SkeletonLine = styled.div<{ $width: string }>`
  width: ${({ $width }) => $width};
  height: 11px;
  border-radius: ${token.shapes.xsmall};
  background: ${token.colors.gray.gray10};
  animation: ${skeletonPulse} 1.2s ease-in-out infinite;
`
