import styled, { css } from 'styled-components'

import * as token from '@/shared/styles/values/token'

export const Menu = styled.div`
  ${token.flexColumn}
  position: absolute;
  z-index: 2;
  top: 36px;
  right: 0;
  box-sizing: border-box;
  width: 165px;
  padding: 8px;
  border: 1px solid ${token.colors.gray.gray10};
  border-radius: ${token.shapes.xsmall};
  background: ${token.colors.white};
  box-shadow: 0 6px 18px rgb(0 0 0 / 6%);
`

export const MenuItem = styled.button<{ $danger?: boolean }>`
  width: 100%;
  padding: 8px 10px;
  border-radius: ${token.shapes.xsmall};
  color: ${token.colors.gray.gray80};
  line-height: 1;
  text-align: left;
  ${token.typography('caption', 'md', 'regular')}

  &:hover {
    background: ${token.colors.gray.gray0};
  }

  ${({ $danger }) =>
    $danger &&
    css`
      color: ${token.colors.danger.danger20};
    `}
`

export const Divider = styled.div`
  width: 100%;
  height: 1px;
  margin: 4px 0;
  background: ${token.colors.gray.gray10};
`
