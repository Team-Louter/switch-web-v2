/**
 * 주(week) 단위 일정 배치 계산
 *
 * 여러 날에 걸친 일정을 주 단위로 잘라서
 * "몇 번째 칸에서 시작해 몇 칸을 차지하는지(startColumn/columnSpan)"와
 * "몇 번째 줄에 놓일지(lane)"를 계산합니다.
 */
import { DAYS_IN_WEEK } from '@/shared/constants/calendar'
import type { Schedule } from '@/shared/types/schedule'
import { getDayDiff } from '@/shared/utils/date'

export type ScheduleSegment = {
  key: string
  schedule: Schedule
  startColumn: number // 0(일요일) ~ 6(토요일)
  columnSpan: number // 이 주에서 차지하는 칸 수
  lane: number // 0부터 시작하는 줄 번호
}

/** 이번 주에서 일정이 차지하는 시작/끝 칸을 계산합니다. (겹치지 않으면 null) */
function getColumnRange(schedule: Schedule, weekStartDate: Date) {
  const startColumn = Math.max(getDayDiff(weekStartDate, schedule.startDate), 0)
  const endColumn = Math.min(
    getDayDiff(weekStartDate, schedule.endDate),
    DAYS_IN_WEEK - 1,
  )

  if (startColumn > DAYS_IN_WEEK - 1 || endColumn < 0 || startColumn > endColumn) {
    return null
  }

  return { startColumn, endColumn }
}

/** 앞선 일정과 겹치지 않는 가장 위쪽 줄 번호를 찾습니다. */
function findAvailableLane(
  lanes: boolean[][],
  startColumn: number,
  endColumn: number,
) {
  const laneIndex = lanes.findIndex((lane) =>
    lane.every((isOccupied, column) => {
      const isInRange = column >= startColumn && column <= endColumn

      return !isInRange || !isOccupied
    }),
  )

  if (laneIndex !== -1) {
    return laneIndex
  }

  lanes.push(Array.from({ length: DAYS_IN_WEEK }, () => false))

  return lanes.length - 1
}

/**
 * 한 주에 표시할 일정 조각 목록을 반환합니다.
 *
 * 시작일이 빠른 일정, 기간이 긴 일정이 위쪽 줄을 차지합니다.
 */
export function getWeekScheduleSegments(
  weekDates: Date[],
  schedules: Schedule[],
): ScheduleSegment[] {
  const weekStartDate = weekDates[0]
  const lanes: boolean[][] = []

  return schedules
    .map((schedule) => ({ schedule, range: getColumnRange(schedule, weekStartDate) }))
    .filter(
      (item): item is { schedule: Schedule; range: { startColumn: number; endColumn: number } } =>
        item.range !== null,
    )
    .sort((a, b) => {
      const startDiff = getDayDiff(b.schedule.startDate, a.schedule.startDate)

      if (startDiff !== 0) {
        return startDiff
      }

      const spanDiff =
        getDayDiff(b.schedule.startDate, b.schedule.endDate) -
        getDayDiff(a.schedule.startDate, a.schedule.endDate)

      if (spanDiff !== 0) {
        return spanDiff
      }

      return a.schedule.scheduleId - b.schedule.scheduleId
    })
    .map(({ schedule, range }) => {
      const lane = findAvailableLane(lanes, range.startColumn, range.endColumn)

      for (let column = range.startColumn; column <= range.endColumn; column += 1) {
        lanes[lane][column] = true
      }

      return {
        key: `${schedule.scheduleId}-${weekStartDate.getTime()}`,
        schedule,
        startColumn: range.startColumn,
        columnSpan: range.endColumn - range.startColumn + 1,
        lane,
      }
    })
}
