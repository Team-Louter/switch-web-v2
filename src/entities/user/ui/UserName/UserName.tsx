import { getNameStylePreset } from '@/shared/styles'

import * as S from './UserName.style'

import type { CSSProperties, ReactNode } from 'react'

type UserNameProps = {
  children: ReactNode
  className?: string
  styleKey?: string
}

export function UserName({ children, className, styleKey }: UserNameProps) {
  const preset = getNameStylePreset(styleKey)
  const nameStyle: CSSProperties = {
    fontWeight: preset.fontWeight,
  }

  if ('backgroundImage' in preset) {
    nameStyle.backgroundImage = preset.backgroundImage
    nameStyle.backgroundClip = 'text'
    nameStyle.color = 'transparent'
    nameStyle.WebkitBackgroundClip = 'text'
    nameStyle.WebkitTextFillColor = 'transparent'
  } else {
    nameStyle.color = preset.color
  }

  if ('textShadow' in preset) {
    nameStyle.textShadow = preset.textShadow
  }

  return (
    <S.Name className={className} style={nameStyle}>
      {children}
    </S.Name>
  )
}
