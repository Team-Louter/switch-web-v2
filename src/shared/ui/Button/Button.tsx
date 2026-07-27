import { StyledButton } from './Button.style'
import type { ButtonProps } from './types'

export function Button({
  children,
  size = 'sm',
  type = 'button',
  variant = 'primary',
  ...buttonProps
}: ButtonProps) {
  return (
    <StyledButton
      type={type}
      $size={size}
      $variant={variant}
      {...buttonProps}
    >
      {children}
    </StyledButton>
  )
}
