import styled, { css } from 'styled-components'

import * as token from '@/shared/styles/values/token'

export const Scrim = styled.div`
  ${token.flexCenter}
  position: absolute;
  z-index: 3;
  inset: 0;
  background: rgb(14 13 12 / 50%);
`

export const Card = styled.div`
  ${token.flexColumn}
  align-items: center;
  box-sizing: border-box;
  width: 460px;
  gap: 32px;
  padding: 40px 56px;
  border-radius: ${token.shapes.large};
  background: ${token.colors.white};
`

export const Title = styled.h3`
  margin: 0;
  color: ${token.colors.gray.gray100};
  line-height: 1;
  ${token.typography('heading', 'sm', 'semibold')}
`

export const Actions = styled.div`
  ${token.flexCenter}
  gap: 20px;
`

export const Button = styled.button<{ $variant?: 'primary' | 'danger' }>`
  ${token.flexCenter}
  width: 100px;
  padding: 10px 0;
  border-radius: ${token.shapes.small};
  background: ${token.colors.gray.gray10};
  color: ${token.colors.gray.gray100};
  line-height: 1;
  ${token.typography('body', 'sm', 'medium')}

  ${({ $variant }) =>
    $variant === 'primary' &&
    css`
      background: ${token.colors.primary.primary50};
    `}

  ${({ $variant }) =>
    $variant === 'danger' &&
    css`
      color: ${token.colors.danger.danger20};
    `}
`
