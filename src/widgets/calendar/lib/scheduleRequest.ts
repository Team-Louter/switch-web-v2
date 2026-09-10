/**
 * 일정 폼 값 → 서버 요청 본문 변환
 *
 * 서버 문서의 CreateScheduleRequest / UpdateScheduleRequest 스키마를 따릅니다.
 */
import type { CreateScheduleRequest } from '@/shared/types/schedule'
import { toEndDateTime, toStartDateTime } from '@/shared/utils/schedule'

import type { ScheduleFormValues } from '../model/types'

export function toScheduleRequest(
  values: ScheduleFormValues,
): CreateScheduleRequest {
  return {
    title: values.title.trim(),
    content: values.content.trim(),
    startDate: toStartDateTime(values.startDate),
    endDate: toEndDateTime(values.endDate),
    color: values.color,
    scheduleTarget: values.userIds.length === 0 ? 'ALL' : 'PERSONAL',
    userIds: values.userIds,
  }
}
