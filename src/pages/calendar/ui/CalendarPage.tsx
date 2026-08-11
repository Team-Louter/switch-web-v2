import { dummyMembers } from '@/shared/dummy/dummyMembers'
import { dummySchedules } from '@/shared/dummy/dummySchedules'
import { getCreateFormValues, getEditFormValues } from '@/widgets/calendar/lib/scheduleForm'
import { toScheduleRequest } from '@/widgets/calendar/lib/scheduleRequest'
import type { ScheduleFormValues } from '@/widgets/calendar/model/types'
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
} from './CalendarPage.style'

// 더미 데이터(2026년 7월)를 확인하기 위한 초기 월로, 서버 연동 시 제거합니다.
const DUMMY_INITIAL_DATE = new Date(2026, 6, 1)

export function CalendarPage() {
  const { schedules, createSchedule, updateSchedule, deleteSchedule } =
    useSchedules(dummySchedules, dummyMembers)
  const {
    modalState,
    handleDateClick,
    handleScheduleClick,
    handleEditClick,
    handleModalClose,
  } = useScheduleModal()

  const handleCreateSubmit = (values: ScheduleFormValues) => {
    createSchedule(toScheduleRequest(values))
    handleModalClose()
  }

  const handleEditSubmit = (scheduleId: number, values: ScheduleFormValues) => {
    updateSchedule(scheduleId, toScheduleRequest(values))
    handleModalClose()
  }

  const handleDeleteClick = (scheduleId: number) => {
    deleteSchedule(scheduleId)
    handleModalClose()
  }

  return (
    <Container>
      <PageHeader>
        <PageTitle>캘린더</PageTitle>
        <PageDescription>월별 일정을 확인해 보세요.</PageDescription>
      </PageHeader>

      <MonthCalendar
        schedules={schedules}
        initialDate={DUMMY_INITIAL_DATE}
        onDateSelect={handleDateClick}
        onScheduleSelect={handleScheduleClick}
      />

      {modalState.type === 'create' && (
        <ScheduleFormModal
          mode="create"
          initialValues={getCreateFormValues(modalState.date)}
          members={dummyMembers}
          onSubmit={handleCreateSubmit}
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
          members={dummyMembers}
          onSubmit={(values) =>
            handleEditSubmit(modalState.schedule.scheduleId, values)
          }
          onDelete={() => handleDeleteClick(modalState.schedule.scheduleId)}
          onClose={handleModalClose}
        />
      )}
    </Container>
  )
}
