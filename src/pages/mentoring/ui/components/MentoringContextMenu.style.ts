import styled, { css } from 'styled-components'

import * as token from '@/shared/styles/values/token'

import type { MenuPlacement } from './menuPlacement'

interface MenuItemProps {
  $danger?: boolean
}

export const Panel = styled.div<{ $placement: MenuPlacement }>`
  ${token.flexColumn}
  position: absolute;
  z-index: 4;
  ${({ $placement }) =>
    $placement === 'top'
      ? 'bottom: calc(100% + 6px);'
      : 'top: calc(100% + 6px);'}
  right: 0;
  box-sizing: border-box;
  min-width: 120px;
  padding: 8px;
  border: 1px solid ${token.colors.gray.gray10};
  border-radius: ${token.shapes.large};
  background: ${token.colors.white};
  box-shadow: 0 6px 18px rgb(0 0 0 / 8%);
`

export const Item = styled.button<MenuItemProps>`
  width: 100%;
  min-height: 40px;
  padding: 8px 12px;
  border: 0;
  border-radius: ${token.shapes.small};
  color: ${token.colors.gray.gray100};
  background: transparent;
  ${token.typography('body', 'sm', 'semibold')}
  text-align: left;
  cursor: pointer;

  &:hover:not(:disabled) {
    background: ${token.colors.gray.gray0};
  }

  &:focus-visible {
    outline: 2px solid ${token.colors.primary.primary50};
    outline-offset: -2px;
  }

  &:disabled {
    cursor: wait;
    opacity: 0.6;
  }

  ${({ $danger }) =>
    $danger &&
    css`
      color: ${token.colors.danger.danger20};
    `}
`

export const Divider = styled.span`
  width: 100%;
  height: 1px;
  margin: 4px 0;
  background: ${token.colors.gray.gray10};
`
