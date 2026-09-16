import styled from 'styled-components'

import * as token from '@/shared/styles/values/token'

export const Menu = styled.div`
  ${token.flexColumn}
  position: absolute;
  z-index: 2;
  top: 0;
  right: 0;
  box-sizing: border-box;
  min-width: 160px;
  overflow: hidden;
  border: 1px solid ${token.colors.gray.gray10};
  border-radius: ${token.shapes.medium};
  background: ${token.colors.white};
  box-shadow: 0 4px 12px rgb(0 0 0 / 10%);
`

export const MenuItem = styled.button<{ $danger?: boolean }>`
  width: 100%;
  padding: 10px 16px;
  color: ${({ $danger }) =>
    $danger ? token.colors.danger.danger20 : token.colors.gray.gray80};
  text-align: left;
  white-space: nowrap;
  ${token.typography('body', 'sm', 'medium')}

  &:hover {
    background: ${({ $danger }) =>
      $danger ? token.colors.danger.danger0 : token.colors.gray.gray0};
  }
`

export const Divider = styled.div`
  width: 100%;
  height: 1px;
  margin: 2px 0;
  background: ${token.colors.gray.gray10};
`
