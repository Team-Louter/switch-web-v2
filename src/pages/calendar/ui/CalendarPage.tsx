import { getCreateFormValues, getEditFormValues } from '@/widgets/calendar/lib/scheduleForm'
import { toScheduleRequest } from '@/widgets/calendar/lib/scheduleRequest'
import type { ScheduleFormValues } from '@/widgets/calendar/model/types'
import { useMembers } from '@/widgets/calendar/model/useMembers'
import { useScheduleModal } from '@/widgets/calendar/model/useScheduleModal'
import { useSchedules } from '@/widgets/calendar/model/useSchedules'
import { MonthCalendar } from '@/widgets/calendar/ui/MonthCalendar'
import { ScheduleDetailModal } from '@/widgets/calendar/ui/ScheduleDetailModal'
import { ScheduleFormModal } from '@/widgets/calendar/ui/ScheduleFormModal'

import {
  Container,
  PageDescription,
  PageHeader,
  PageTitle,
  StateText,
} from './CalendarPage.style'

export function CalendarPage() {
  const {
    schedules,
    isLoading,
    hasError,
    createSchedule,
    updateSchedule,
    deleteSchedule,
  } = useSchedules()
  const { members } = useMembers()
  const {
    modalState,
    handleDateClick,
    handleScheduleClick,
    handleEditClick,
    handleModalClose,
  } = useScheduleModal()

  const handleCreateSubmit = async (values: ScheduleFormValues) => {
    try {
      await createSchedule(toScheduleRequest(values))
      handleModalClose()
    } catch {
      // 실패 시 모달을 유지해 사용자가 다시 시도할 수 있게 합니다.
    }
  }

  const handleEditSubmit = async (
    scheduleId: number,
    values: ScheduleFormValues,
  ) => {
    try {
      await updateSchedule(scheduleId, toScheduleRequest(values))
      handleModalClose()
    } catch {
      // 실패 시 모달을 유지해 사용자가 다시 시도할 수 있게 합니다.
    }
  }

  const handleDeleteClick = async (scheduleId: number) => {
    try {
      await deleteSchedule(scheduleId)
      handleModalClose()
    } catch {
      // 실패 시 모달을 유지해 사용자가 다시 시도할 수 있게 합니다.
    }
  }

  return (
    <Container>
      <PageHeader>
        <PageTitle>캘린더</PageTitle>
        <PageDescription>월별 일정을 확인해 보세요.</PageDescription>
      </PageHeader>

      {/* 일정을 불러오는 중이거나 실패한 경우를 구분해 안내합니다. */}
      {isLoading && <StateText>일정을 불러오는 중이에요.</StateText>}
      {hasError && <StateText>일정을 불러오지 못했어요.</StateText>}

      <MonthCalendar
        schedules={schedules}
        onDateSelect={handleDateClick}
        onScheduleSelect={handleScheduleClick}
      />

      {modalState.type === 'create' && (
        <ScheduleFormModal
          mode="create"
          initialValues={getCreateFormValues(modalState.date)}
          members={members}
          onSubmit={(values) => void handleCreateSubmit(values)}
          onClose={handleModalClose}
        />
      )}

      {modalState.type === 'detail' && (
        <ScheduleDetailModal
          schedule={modalState.schedule}
          onEdit={handleEditClick}
          onClose={handleModalClose}
        />
      )}

      {modalState.type === 'edit' && (
        <ScheduleFormModal
          mode="edit"
          initialValues={getEditFormValues(modalState.schedule)}
          members={members}
          onSubmit={(values) =>
            void handleEditSubmit(modalState.schedule.scheduleId, values)
          }
          onDelete={() => void handleDeleteClick(modalState.schedule.scheduleId)}
          onClose={handleModalClose}
        />
      )}
    </Container>
  )
}
