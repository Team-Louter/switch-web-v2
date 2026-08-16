import type { CSSProperties } from 'react'

import * as S from './PercentBar.style'

interface PercentBarProps {
  value: number
  label?: string
  className?: string
  style?: CSSProperties
}

export function PercentBar({
  value,
  label = '진행률',
  className,
  style,
}: PercentBarProps) {
  const normalizedValue = Math.min(100, Math.max(0, value))

  return (
    <S.Track
      className={className}
      style={style}
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={normalizedValue}
    >
      <S.Fill $value={normalizedValue} />
    </S.Track>
  )
}
