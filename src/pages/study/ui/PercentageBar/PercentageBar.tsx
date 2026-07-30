import type { CSSProperties } from 'react'

import * as S from './PercentageBar.style'

interface PercentageBarProps {
  value: number
  label?: string
  className?: string
  style?: CSSProperties
}

export function PercentageBar({
  value,
  label = '진행률',
  className,
  style,
}: PercentageBarProps) {
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
