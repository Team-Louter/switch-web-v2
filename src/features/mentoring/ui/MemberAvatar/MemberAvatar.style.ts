import styled from 'styled-components'

import { ProfileAvatar } from '@/shared/ui'
import * as token from '@/shared/styles/values/token'

interface AvatarStyleProps {
  $borderWidth: number
  $hasCustomBorder: boolean
}

export const Avatar = styled(ProfileAvatar)<AvatarStyleProps>`
  &::after {
    position: absolute;
    inset: 0;
    box-sizing: border-box;
    border: ${({ $borderWidth, $hasCustomBorder }) =>
      $hasCustomBorder ? 0 : $borderWidth}px solid ${token.colors.gray.gray10};
    border-radius: ${token.shapes.circle};
    pointer-events: none;
    content: '';
  }
`
