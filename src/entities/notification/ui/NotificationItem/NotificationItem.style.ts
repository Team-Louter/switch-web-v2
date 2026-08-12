import styled from 'styled-components'

import * as token from '@/shared/styles/values/token'

export const Item = styled.article`
  ${token.flexBetween}
  position: relative;
  align-items: flex-start;
  width: 100%;
  padding: 20px 0;
  border-radius: ${token.shapes.medium};

  @media (max-width: 760px) {
    gap: 16px;
  }
`

export const Main = styled.div`
  ${token.flexRow}
  align-items: flex-start;
  gap: 20px;
  min-width: 0;
`

export const AvatarWrap = styled.div`
  position: relative;
  flex: 0 0 52px;
  width: 52px;
  height: 52px;
`

export const Avatar = styled.img`
  width: 52px;
  height: 52px;
  object-fit: cover;
  border: 1px solid ${token.colors.gray.gray10};
  border-radius: ${token.shapes.circle};
`

export const TypeIcon = styled.img`
  position: absolute;
  right: -5px;
  bottom: -5px;
  width: 24px;
  height: 24px;
  object-fit: contain;
`

export const Content = styled.div`
  ${token.flexColumnStart}
  justify-content: center;
  gap: 10px;
  min-width: 0;
`

export const Category = styled.span`
  color: ${token.colors.gray.gray70};
  line-height: 1;
  ${token.typography('body', 'lg', 'semibold')}
`

export const Message = styled.p`
  overflow: hidden;
  color: ${token.colors.gray.gray80};
  line-height: 1;
  text-overflow: ellipsis;
  white-space: nowrap;
  ${token.typography('body', 'lg', 'semibold')}
`

export const Subject = styled.p`
  overflow: hidden;
  color: ${token.colors.gray.gray80};
  line-height: 1;
  text-overflow: ellipsis;
  white-space: nowrap;
  ${token.typography('body', 'sm', 'regular')}
`

export const Controls = styled.div`
  ${token.flexRow}
  align-items: flex-start;
  align-self: stretch;
  gap: 20px;
  margin-left: 20px;

  @media (max-width: 760px) {
    gap: 12px;
    margin-left: 0;
  }
`

export const Meta = styled.div`
  ${token.flexColumn}
  align-items: flex-end;
  align-self: stretch;
  justify-content: space-between;
  gap: 12px;
`

export const IndicatorSlot = styled.span`
  display: block;
  width: 17px;
  height: 17px;
`

export const UnreadIndicator = styled.span`
  display: block;
  width: 17px;
  height: 17px;
  border-radius: ${token.shapes.circle};
  background: ${token.colors.primary.primary50};
`

export const OccurredAt = styled.time`
  color: ${token.colors.gray.gray50};
  line-height: 1;
  white-space: nowrap;
  ${token.typography('body', 'lg', 'semibold')}

  @media (max-width: 760px) {
    font-size: ${token.fontSize.body.sm};
  }
`

export const MoreButton = styled.button`
  ${token.flexCenter}
  width: 17px;
  height: 18px;
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
  width: 4px;
  height: 17.542px;
`

export const ContextMenu = styled.div`
  ${token.flexColumnStart}
  position: absolute;
  z-index: 10;
  top: 48px;
  right: 0;
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
