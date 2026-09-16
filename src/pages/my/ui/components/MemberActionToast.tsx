import { useEffect, useState } from 'react'

import memberToastCheckIcon from '../assets/member-toast-check.svg'
import * as S from './MemberActionToast.style'

type MemberActionToastProps = {
  message: string
  onClose: () => void
}

export function MemberActionToast({
  message,
  onClose,
}: MemberActionToastProps) {
  const [isLeaving, setIsLeaving] = useState(false)

  useEffect(() => {
    const leaveTimerId = window.setTimeout(() => setIsLeaving(true), 2200)
    const closeTimerId = window.setTimeout(onClose, 2360)

    return () => {
      window.clearTimeout(leaveTimerId)
      window.clearTimeout(closeTimerId)
    }
  }, [onClose])

  return (
    <S.Toast role="status" $isLeaving={isLeaving}>
      <S.Icon src={memberToastCheckIcon} alt="" />
      {message}
    </S.Toast>
  )
}
