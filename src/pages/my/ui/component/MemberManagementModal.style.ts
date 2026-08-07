import styled, { css } from 'styled-components'

import * as token from '@/shared/styles/values/token'

export const Overlay = styled.div`
  ${token.flexCenter}
  position: fixed;
  z-index: 30;
  inset: 0;
  background: rgb(14 13 12 / 50%);
`

export const Modal = styled.section`
  ${token.flexColumn}
  position: relative;
  width: 604px;
  max-height: min(70vh, 456px);
  overflow: hidden;
  border-radius: ${token.shapes.small};
  background: ${token.colors.white};
`

export const SearchBar = styled.div`
  ${token.flexLeft}
  box-sizing: border-box;
  flex: 0 0 52px;
  width: 100%;
  gap: 10px;
  padding: 0 16px;
  border-bottom: 1px solid ${token.colors.gray.gray10};
`

export const SearchIcon = styled.img`
  width: 16px;
  height: 16px;
  flex: 0 0 auto;
`

export const SearchInput = styled.input`
  flex: 1 1 0;
  min-width: 0;
  color: ${token.colors.gray.gray80};
  line-height: 1;
  ${token.typography('caption', 'md', 'regular')}

  &::placeholder {
    color: ${token.colors.gray.gray50};
  }
`

export const CloseButton = styled.button`
  ${token.flexCenter}
  width: 25px;
  height: 25px;
`

export const CloseIcon = styled.img`
  width: 14px;
  height: 14px;
`

export const List = styled.div`
  ${token.flexColumn}
  box-sizing: border-box;
  width: 100%;
  max-height: 324px;
  overflow-y: auto;
  padding: 0 18px;
`

export const Empty = styled.div`
  ${token.flexCenter}
  height: 216px;
  color: ${token.colors.gray.gray50};
  ${token.typography('caption', 'md', 'regular')}
`

export const Row = styled.div`
  display: grid;
  position: relative;
  grid-template-columns: 17px minmax(0, 1fr) 143px 25px;
  align-items: center;
  box-sizing: border-box;
  width: 568px;
  min-height: 54px;
  gap: 14px;
  padding: 12px 8px;
  border-bottom: 1px solid ${token.colors.gray.gray0};
  background: ${token.colors.white};
`

export const Checkbox = styled.button<{ $checked?: boolean }>`
  ${token.flexCenter}
  position: relative;
  width: 17px;
  height: 17px;
  border: 0.5px solid ${token.colors.gray.gray40};
  border-radius: ${token.shapes.xsmall};
  background: ${token.colors.white};
  overflow: hidden;

  ${({ $checked }) =>
    $checked &&
    css`
      border-color: transparent;
    `}
`

export const CheckboxIcon = styled.img`
  width: 17px;
  height: 17px;
`

export const MemberInfo = styled.div`
  ${token.flexLeft}
  min-width: 0;
  gap: 6px;
`

export const Avatar = styled.img`
  width: 30px;
  height: 30px;
  flex: 0 0 auto;
  border-radius: ${token.shapes.circle};
  object-fit: cover;
`

export const TextGroup = styled.div`
  ${token.flexColumn}
  align-items: flex-start;
  min-width: 0;
  gap: 1px;
`

export const Name = styled.span`
  width: 143px;
  overflow: hidden;
  color: ${token.colors.gray.gray80};
  line-height: 1.2;
  text-overflow: ellipsis;
  white-space: nowrap;
  ${token.typography('caption', 'lg', 'medium')}
`

export const ClassInfo = styled.span`
  width: 143px;
  overflow: hidden;
  color: ${token.colors.gray.gray50};
  line-height: 1.2;
  text-overflow: ellipsis;
  white-space: nowrap;
  ${token.typography('caption', 'sm', 'regular')}
`

export const Role = styled.span`
  color: ${token.colors.gray.gray50};
  line-height: 1.2;
  ${token.typography('caption', 'sm', 'regular')}
`

export const MoreButton = styled.button`
  ${token.flexCenter}
  width: 25px;
  height: 25px;
  border-radius: ${token.shapes.circle};

  &:hover {
    background: ${token.colors.gray.gray0};
  }
`

export const MoreIcon = styled.img`
  width: 3.125px;
  height: 13.375px;
`

export const Footer = styled.footer`
  ${token.flexBetween}
  box-sizing: border-box;
  flex: 0 0 40px;
  width: 100%;
  padding: 0 24px 0 18px;
  border-top: 1px solid ${token.colors.gray.gray10};
  background: ${token.colors.gray.gray0};
`

export const SelectedText = styled.span`
  color: ${token.colors.gray.gray50};
  line-height: 1;
  ${token.typography('caption', 'sm', 'regular')}
`

export const ShortcutGroup = styled.button`
  ${token.flexLeft}
  gap: 4px;
  color: ${token.colors.gray.gray50};
  line-height: 1;
  ${token.typography('caption', 'sm', 'regular')}
`

export const ShortcutKey = styled.span`
  ${token.flexCenter}
  width: 37px;
  height: 21px;
  border: 1px solid ${token.colors.gray.gray10};
  border-radius: ${token.shapes.xsmall};
  background: ${token.colors.white};
  ${token.typography('caption', 'sm', 'medium')}
`
