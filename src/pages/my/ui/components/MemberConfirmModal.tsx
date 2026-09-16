import { useState } from 'react'

import * as S from './MemberConfirmModal.style'

import type { ManagedMember } from '../../model/memberManagementModel'

interface MemberConfirmModalProps {
  member: ManagedMember
  onCancel: () => void
  onConfirm: () => Promise<void>
}

export function MemberConfirmModal({
  member,
  onCancel,
  onConfirm,
}: MemberConfirmModalProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleConfirm = async () => {
    if (isLoading) {
      return
    }

    setIsLoading(true)

    try {
      await onConfirm()
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <S.Scrim onClick={onCancel}>
      <S.Card
        role="dialog"
        aria-modal="true"
        aria-labelledby="member-kick-title"
        onClick={(event) => event.stopPropagation()}
      >
        <S.Title id="member-kick-title">제명 확인</S.Title>
        <S.Description>
          <strong>{member.name}</strong>님을
          <br />
          동아리에서 퇴출하시겠습니까?
          <br />
          <br />
          <S.SmallNote>이 작업은 되돌릴 수 없습니다.</S.SmallNote>
        </S.Description>
        <S.Actions>
          <S.CancelButton
            type="button"
            disabled={isLoading}
            onClick={onCancel}
          >
            취소
          </S.CancelButton>
          <S.ConfirmButton
            type="button"
            $active={!isLoading}
            disabled={isLoading}
            onClick={() => void handleConfirm()}
          >
            퇴출합니다.
          </S.ConfirmButton>
        </S.Actions>
      </S.Card>
    </S.Scrim>
  )
}
