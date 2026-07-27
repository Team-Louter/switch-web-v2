import styled, { css } from 'styled-components'

import * as token from '@/shared/styles/values/token'

import type { ButtonSize, ButtonVariant } from './types'

const sizeStyles = {
  sm: css`
    padding: 8px 16px;
    ${token.typography('body', 'sm', 'medium')}
  `,
  md: css`
    padding: 10px 20px;
    ${token.typography('body', 'md', 'medium')}
  `,
  lg: css`
    padding: 10px 20px;
    ${token.typography('body', 'lg', 'medium')}
  `,
} satisfies Record<ButtonSize, ReturnType<typeof css>>

const variantStyles = {
  primary: css`
    color: ${token.colors.gray.gray100};
    background: ${token.colors.primary.primary50};

    &:hover {
      background: ${token.colors.primary.primary60};
    }

    &:disabled {
      background: ${token.colors.gray.gray10};
    }
  `,
  line: css`
    border: 1px solid ${token.colors.primary.primary50};
    color: ${token.colors.primary.primary50};
    background: transparent;

    &:hover {
      border-color: ${token.colors.primary.primary60};
      color: ${token.colors.primary.primary60};
    }

    &:disabled {
      border-color: ${token.colors.gray.gray10};
      color: ${token.colors.gray.gray10};
    }
  `,
  text: css`
    color: ${token.colors.primary.primary50};
    background: transparent;

    &:hover {
      color: ${token.colors.primary.primary60};
    }

    &:disabled {
      color: ${token.colors.gray.gray10};
    }
  `,
} satisfies Record<ButtonVariant, ReturnType<typeof css>>

export const StyledButton = styled.button<{
  $size: ButtonSize
  $variant: ButtonVariant
}>`
  ${token.flexCenter}
  flex: 0 0 auto;
  overflow: hidden;
  border-radius: ${token.shapes.small};
  line-height: 1;
  white-space: nowrap;
  transition:
    background-color 120ms ease,
    border-color 120ms ease,
    color 120ms ease;

  ${({ $size }) => sizeStyles[$size]}
  ${({ $variant }) => variantStyles[$variant]}

  &:disabled {
    cursor: not-allowed;
  }
`
