import styled, { css } from 'styled-components'

import * as token from '@/shared/styles/values/token'

export const Overlay = styled.div`
  ${token.flexCenter}
  position: fixed;
  z-index: 20;
  inset: 0;
  background: rgb(14 13 12 / 70%);
`

export const Card = styled.div<{ $size: 'sm' | 'lg' }>`
  ${token.flexColumn}
  align-items: flex-start;
  box-sizing: border-box;
  gap: 20px;
  padding: 30px;
  border-radius: ${token.shapes.large};
  background: ${token.colors.white};

  ${({ $size }) =>
    $size === 'sm'
      ? css`
          width: 400px;
        `
      : css`
          width: 700px;
        `}
`

export const TextGroup = styled.div`
  ${token.flexColumn}
  align-items: flex-start;
  gap: 10px;
`

export const Title = styled.h2`
  margin: 0;
  color: ${token.colors.gray.gray80};
  line-height: 1;
  ${token.typography('heading', 'md', 'medium')}
`

export const Description = styled.p`
  margin: 0;
  color: ${token.colors.gray.gray60};
  line-height: 1;
  ${token.typography('body', 'lg', 'medium')}
`

export const Actions = styled.div`
  ${token.flexLeft}
  width: 100%;
  gap: 10px;
`
