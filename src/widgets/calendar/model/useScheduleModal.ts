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
  | { type: 'create'; date: Date }
  | { type: 'detail'; schedule: Schedule }
  | { type: 'edit'; schedule: Schedule }

export function useScheduleModal() {
  const [modalState, setModalState] = useState<ScheduleModalState>({
    type: 'none',
  })

  const handleDateClick = (date: Date) => {
    setModalState({ type: 'create', date })
  }

  const handleScheduleClick = (schedule: Schedule) => {
    setModalState({ type: 'detail', schedule })
  }

  const handleEditClick = () => {
    setModalState((previousState) =>
      previousState.type === 'detail'
        ? { type: 'edit', schedule: previousState.schedule }
        : previousState,
    )
  }

  const handleModalClose = () => {
    setModalState({ type: 'none' })
  }

  return {
    modalState,
    handleDateClick,
    handleScheduleClick,
    handleEditClick,
    handleModalClose,
  }
}
