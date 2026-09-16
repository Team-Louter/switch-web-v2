import { useEffect, useState } from 'react'

import memberToastSuccessIcon from '../assets/member-toast-success.svg'
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
    const leaveTimerId = window.setTimeout(() => setIsLeaving(true), 2000)
    const closeTimerId = window.setTimeout(onClose, 2200)

    return () => {
      window.clearTimeout(leaveTimerId)
      window.clearTimeout(closeTimerId)
    }
  }, [onClose])

  return (
    <S.Toast role="status" $isLeaving={isLeaving}>
      <S.IconCircle>
        <S.Icon src={memberToastSuccessIcon} alt="" />
      </S.IconCircle>
      {message}
    </S.Toast>
  )
}
