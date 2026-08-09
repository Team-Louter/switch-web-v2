import { useEffect, useState } from 'react'
import { TbCircleNumber1, TbCircleNumber2, TbCircleNumber3 } from 'react-icons/tb'

import * as S from './TypingCountdown.style'

const COUNTDOWN_ICONS = {
  1: TbCircleNumber1,
  2: TbCircleNumber2,
  3: TbCircleNumber3,
} as const

export function TypingCountdown() {
  const [count, setCount] = useState<keyof typeof COUNTDOWN_ICONS | 0>(3)

  useEffect(() => {
    if (count === 0) return

    const timeoutId = window.setTimeout(() => {
      setCount(previousCount => (previousCount - 1) as keyof typeof COUNTDOWN_ICONS | 0)
    }, 1000)

    return () => window.clearTimeout(timeoutId)
  }, [count])

  if (count === 0) return null

  const NumberIcon = COUNTDOWN_ICONS[count]

  return (
    <S.Overlay role="status" aria-live="assertive" aria-label={`${count}`}>
      <NumberIcon aria-hidden="true" />
    </S.Overlay>
  )
}
