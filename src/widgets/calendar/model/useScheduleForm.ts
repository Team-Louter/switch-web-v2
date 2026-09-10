import { useState } from 'react'

import type { ScheduleFormValues } from './types'

export function useScheduleForm(initialValues: ScheduleFormValues) {
  const [values, setValues] = useState<ScheduleFormValues>(initialValues)

  const handleValueChange = <Key extends keyof ScheduleFormValues>(
    key: Key,
    value: ScheduleFormValues[Key],
  ) => {
    setValues((previousValues) => ({ ...previousValues, [key]: value }))
  }

  // 제목과 기간이 모두 입력되고, 시작일이 종료일보다 늦지 않아야 제출할 수 있습니다.
  const isSubmittable =
    values.title.trim().length > 0 &&
    values.startDate.length > 0 &&
    values.endDate.length > 0 &&
    values.startDate <= values.endDate &&
    values.content.trim().length > 0 &&
    values.userIds.length > 0

  return { values, handleValueChange, isSubmittable }
}
