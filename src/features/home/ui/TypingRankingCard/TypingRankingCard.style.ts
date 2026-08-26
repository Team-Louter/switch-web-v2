import styled from 'styled-components'

import * as token from '@/shared/styles/values/token'

export const Tab = styled.button<{ $active: boolean }>`
  ${token.flexCenter}
  width: 74px;
  height: 26px;
  border: 1px solid
    ${({ $active }) =>
      $active ? 'transparent' : token.colors.primary.primary100};
  border-radius: 15px;
  background: ${({ $active }) =>
    $active ? token.colors.primary.primary50 : 'transparent'};
  color: ${token.colors.primary.primary100};
  line-height: 1;
  ${token.typography('caption', 'sm', 'medium')}

  &:focus-visible {
    outline: 2px solid ${token.colors.primary.primary60};
    outline-offset: 2px;
  }
`

export const List = styled.ul`
  ${token.flexColumn}
  width: 100%;
  gap: 13px;
`

export const Item = styled.li`
  ${token.flexBetween}
  gap: 10px;
  min-height: 20px;
`

export const Label = styled.div`
  ${token.flexLeft}
  gap: 4px;
  min-width: 0;
`

export const MedalIcon = styled.img`
  flex: 0 0 16px;
  width: 16px;
  height: 16px;
`

export const RankText = styled.span`
  ${token.flexCenter}
  flex: 0 0 16px;
  color: ${token.colors.gray.gray50};
  line-height: 1;
  ${token.typography('caption', 'md', 'medium')}
`

export const UserName = styled.span`
  overflow: hidden;
  color: ${token.colors.gray.gray100};
  line-height: 1;
  text-overflow: ellipsis;
  white-space: nowrap;
  ${token.typography('body', 'md', 'medium')}
`

export const Speed = styled.span`
  flex: 0 0 auto;
  color: ${token.colors.gray.gray100};
  line-height: 1;
  ${token.typography('body', 'md', 'medium')}
`
