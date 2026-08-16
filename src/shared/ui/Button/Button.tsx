import { StyledButton } from './Button.style'
import type { ButtonProps } from './types'

export function Button({
  children,
  size = 'sm',
  type = 'button',
  variant = 'primary',
  fullWidth = false,
  ...buttonProps
}: ButtonProps) {
  return (
    <StyledButton
      type={type}
      $size={size}
      $variant={variant}
      $fullWidth={fullWidth}
      {...buttonProps}
    >
      {children}
    </StyledButton>
  )
}
