import styled from 'styled-components'

import * as token from '@/shared/styles/values/token'

export const FilterBar = styled.div`
  ${token.flexLeft}
  align-items: flex-start;
  width: 100%;
  gap: 10px;
  overflow: hidden;
`

export const FilterItem = styled.button<{ $active: boolean }>`
  ${token.flexCenter}
  flex: 0 0 auto;
  box-sizing: border-box;
  padding: 10px 4px;
  border-bottom: 2px solid
    ${({ $active }) =>
      $active ? token.colors.primary.primary50 : 'transparent'};
  color: ${({ $active }) =>
    $active ? token.colors.gray.gray100 : token.colors.gray.gray50};
  line-height: 1;
  transition:
    border-color 200ms ease,
    color 200ms ease;
  ${token.typography('body', 'md', 'medium')}

  &:hover {
    border-color: ${({ $active }) =>
      $active ? token.colors.primary.primary50 : token.colors.gray.gray20};
    color: ${token.colors.gray.gray100};
  }
`
