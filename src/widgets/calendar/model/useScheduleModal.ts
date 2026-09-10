/**
 * 일정 모달 상태 훅
 *
 * 날짜 칸 클릭 → 추가, 일정 칩 클릭 → 세부 조회, 세부 조회의 수정 버튼 → 수정
 * 순서로 모달을 전환합니다.
 */
import { useState } from 'react'

import type { Schedule } from '@/shared/types/schedule'

type ScheduleModalState =
  | { type: 'none' }
  | { type: 'create'; startDate: Date; endDate: Date }
  | { type: 'edit'; schedule: Schedule }

export function useScheduleModal() {
  const [modalState, setModalState] = useState<ScheduleModalState>({
    type: 'none',
  })

  const handleDateClick = (startDate: Date, endDate: Date = startDate) => {
    setModalState({ type: 'create', startDate, endDate })
  }

  const handleScheduleClick = (schedule: Schedule) => {
    setModalState({ type: 'edit', schedule })
  }

  const handleModalClose = () => {
    setModalState({ type: 'none' })
  }

  return {
    modalState,
    handleDateClick,
    handleScheduleClick,
    handleModalClose,
  }
}
