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
  align-items: flex-start;
  box-sizing: border-box;
  width: 500px;
  gap: 20px;
  padding: 30px;
  border-radius: ${token.shapes.medium};
  background: ${token.colors.white};
`

export const Title = styled.h3`
  margin: 0;
  color: ${token.colors.gray.gray100};
  line-height: 1;
  ${token.typography('heading', 'sm', 'semibold')}
`

export const Actions = styled.div`
  ${token.flexLeft}
  width: 100%;
  height: 39px;
  gap: 10px;
`

export const Button = styled.button<{ $variant?: 'primary' | 'danger' }>`
  ${token.flexCenter}
  flex: 1 1 0;
  min-width: 0;
  height: 100%;
  padding: 10px 20px;
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
