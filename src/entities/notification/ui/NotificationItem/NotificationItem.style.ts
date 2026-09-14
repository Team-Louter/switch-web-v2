import styled, { css } from 'styled-components'

import * as token from '@/shared/styles/values/token'

export const Item = styled.article<{ $isClickable: boolean }>`
  ${token.flexBetween}
  position: relative;
  align-items: flex-start;
  box-sizing: border-box;
  width: 100%;
  padding: 14px 10px;
  border-radius: ${token.shapes.medium};
  transition: background-color 120ms ease;

  ${({ $isClickable }) =>
    $isClickable &&
    css`
      cursor: pointer;

      &:hover {
        background: ${token.colors.gray.gray0};
      }

      &:focus-visible {
        outline: 2px solid ${token.colors.primary.primary40};
        outline-offset: 3px;
      }
    `}

  @media (max-width: 760px) {
    gap: 12px;
  }
`

export const Main = styled.div`
  ${token.flexRow}
  flex: 1;
  align-items: flex-start;
  gap: 16px;
  min-width: 0;
`

export const AvatarWrap = styled.div`
  position: relative;
  flex: 0 0 44px;
  width: 44px;
  height: 44px;
`

export const Avatar = styled.img`
  width: 44px;
  height: 44px;
  object-fit: cover;
  border: 1px solid ${token.colors.gray.gray10};
  border-radius: ${token.shapes.circle};
`

export const TypeIcon = styled.img`
  position: absolute;
  right: -4px;
  bottom: -4px;
  width: 20px;
  height: 20px;
  object-fit: contain;
`

export const Content = styled.div`
  ${token.flexColumnStart}
  flex: 1;
  justify-content: center;
  gap: 7px;
  min-width: 0;
`

export const Category = styled.span`
  color: ${token.colors.gray.gray70};
  line-height: 1;
  ${token.typography('body', 'md', 'semibold')}
`

export const Message = styled.p`
  color: ${token.colors.gray.gray80};
  line-height: 1.4;
  overflow-wrap: anywhere;
  word-break: break-word;
  ${token.typography('body', 'md', 'semibold')}
`

export const Subject = styled.p`
  color: ${token.colors.gray.gray80};
  line-height: 1.4;
  overflow-wrap: anywhere;
  word-break: break-word;
  ${token.typography('caption', 'lg', 'regular')}
`

export const Controls = styled.div`
  ${token.flexRow}
  flex: 0 0 auto;
  align-items: flex-start;
  align-self: stretch;
  gap: 14px;
  margin-left: 16px;

  @media (max-width: 760px) {
    gap: 10px;
    margin-left: 0;
  }
`

export const Meta = styled.div`
  ${token.flexColumn}
  align-items: flex-end;
  align-self: stretch;
  justify-content: space-between;
  gap: 10px;
`

export const IndicatorSlot = styled.span`
  display: block;
  width: 14px;
  height: 14px;
`

export const UnreadIndicator = styled.span`
  display: block;
  width: 14px;
  height: 14px;
  border-radius: ${token.shapes.circle};
  background: ${token.colors.primary.primary50};
`

export const OccurredAt = styled.time`
  color: ${token.colors.gray.gray50};
  line-height: 1;
  white-space: nowrap;
  ${token.typography('body', 'sm', 'semibold')}

  @media (max-width: 760px) {
    font-size: ${token.fontSize.caption.lg};
  }
`

export const MoreButton = styled.button`
  ${token.flexCenter}
  width: 14px;
  height: 15px;
  border-radius: ${token.shapes.xsmall};

  &:hover {
    background: ${token.colors.gray.gray0};
  }

  &:focus-visible {
    outline: 2px solid ${token.colors.primary.primary40};
    outline-offset: 3px;
  }
`

export const MoreIcon = styled.img`
  width: 3.5px;
  height: 15px;
`

export const ContextMenu = styled.div`
  ${token.flexColumnStart}
  position: absolute;
  z-index: 10;
  top: 40px;
  right: 10px;
  width: 181px;
  padding: 8px;
  overflow: hidden;
  border: 1px solid #eeeeee;
  border-radius: ${token.shapes.xsmall};
  background: ${token.colors.white};
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.06);
`

export const MenuActionButton = styled.button`
  width: 100%;
  height: 31px;
  padding: 0 8px;
  border-radius: ${token.shapes.xsmall};
  color: ${token.colors.gray.gray80};
  line-height: 1;
  text-align: left;
  ${token.typography('body', 'sm', 'medium')}

  &:hover,
  &:focus-visible {
    background: ${token.colors.gray.gray0};
  }

  &:focus-visible {
    outline: 2px solid ${token.colors.primary.primary40};
    outline-offset: -2px;
  }

`
