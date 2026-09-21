import styled, { css } from 'styled-components'

import * as token from '@/shared/styles/values/token'

import type { ButtonSize, ButtonVariant } from './types'

// 색상 토큰에 대응 값이 없는 삭제 버튼 전용 색상입니다.
const DANGER_BACKGROUND = '#FF2B00'
const DANGER_HOVER_BACKGROUND = '#D92500'

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
    color: ${token.colors.primary.foreground};
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
  neutral: css`
    color: ${token.colors.gray.gray100};
    background: ${token.colors.gray.gray10};

    &:hover {
      background: ${token.colors.gray.gray20};
    }

    &:disabled {
      color: ${token.colors.gray.gray30};
      background: ${token.colors.gray.gray10};
    }
  `,
  danger: css`
    color: ${token.colors.white};
    background: ${DANGER_BACKGROUND};

    &:hover {
      background: ${DANGER_HOVER_BACKGROUND};
    }

    &:disabled {
      background: ${token.colors.gray.gray10};
    }
  `,
} satisfies Record<ButtonVariant, ReturnType<typeof css>>

export const StyledButton = styled.button<{
  $size: ButtonSize
  $variant: ButtonVariant
  $fullWidth: boolean
}>`
  ${token.flexCenter}
  flex: ${({ $fullWidth }) => ($fullWidth ? '1 1 0' : '0 0 auto')};
  min-width: ${({ $fullWidth }) => ($fullWidth ? '0' : 'auto')};
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
