import { SCHEDULE_CHIP_COLORS } from '@/shared/constants/calendar'
import type { Schedule } from '@/shared/types/schedule'

import type { ScheduleSegment } from '../lib/scheduleLayout'

import { ScheduleChipItem, ScheduleChipTitle } from './MonthCalendar.style'

type ScheduleChipProps = {
  segment: ScheduleSegment
  onSelect: (schedule: Schedule) => void
}

export function ScheduleChip({ segment, onSelect }: ScheduleChipProps) {
  const { schedule, startColumn, columnSpan, lane } = segment

  return (
    <ScheduleChipItem
      type="button"
      title={schedule.title}
      $color={SCHEDULE_CHIP_COLORS[schedule.color]}
      $startColumn={startColumn}
      $columnSpan={columnSpan}
      $lane={lane}
      onClick={() => onSelect(schedule)}
    >
      <ScheduleChipTitle>{schedule.title}</ScheduleChipTitle>
    </ScheduleChipItem>
  )
}
