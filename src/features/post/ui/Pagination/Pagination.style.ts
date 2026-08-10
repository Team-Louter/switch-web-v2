import styled from 'styled-components'

import * as token from '@/shared/styles/values/token'

export const Nav = styled.nav`
  ${token.flexCenter}
  gap: 12px;
  width: 100%;
`

export const PageButton = styled.button<{ $active: boolean }>`
  ${token.flexCenter}
  flex: 0 0 auto;
  width: 36px;
  height: 36px;
  padding: 7px 12px;
  overflow: hidden;
  border-radius: ${token.shapes.large};
  background: ${({ $active }) =>
    $active ? token.colors.primary.primary30 : 'transparent'};
  color: ${token.colors.gray.gray90};
  line-height: 1;
  transition: background-color 120ms ease;
  ${token.typography('heading', 'sm', 'semibold')}

  &:hover {
    background: ${({ $active }) =>
      $active ? token.colors.primary.primary30 : token.colors.gray.gray0};
  }
`
