import { useState } from 'react'

import { ScheduleDropdown } from './ScheduleDropdown/ScheduleDropdown'
import type { ScheduleOption } from './ScheduleDropdown/ScheduleDropdown'
import * as S from './MentorTotalJournalModal.style'

interface MentorTotalJournalModalProps {
  isOpen: boolean
  onClose: () => void
}

const SCHEDULES: ScheduleOption[] = [
  { id: 1, title: '테스트', date: '6월 1일' },
  { id: 2, title: '테스트2', date: '6월 1일 ~ 6월 4일' },
  { id: 3, title: '테스트3', date: '6월 2일' },
  { id: 4, title: '테스트4', date: '6월 7일' },
  { id: 5, title: '테스트5', date: '6월 7일 ~ 6월 18일' },
]

export function MentorTotalJournalModal({
  isOpen,
  onClose,
}: MentorTotalJournalModalProps) {
  const [selectedScheduleIds, setSelectedScheduleIds] = useState<number[]>([1, 5,])

  if (!isOpen) return null

  return (
    <S.Backdrop>
      <S.Modal>
        <S.Title>6월 1주차 종합 학습일지 생성</S.Title>
        <S.FormRow>
          <S.Label>관련 일정</S.Label>
          <ScheduleDropdown
            options={SCHEDULES}
            selectedIds={selectedScheduleIds}
            onChange={setSelectedScheduleIds}
          />
        </S.FormRow>
        <S.ButtonContainer>
          <S.CancelButton type="button" onClick={onClose}>
            취소
          </S.CancelButton>
          <S.SubmitButton
            type="button"
            disabled={selectedScheduleIds.length === 0}
          >
            생성
          </S.SubmitButton>
        </S.ButtonContainer>
      </S.Modal>
    </S.Backdrop>
  )
}
