import { expect, test } from '@playwright/test'

import type { Schedule } from '../../src/entities/schedule'
import {
  getUpcomingSchedules,
  groupSchedulesByDate,
} from '../../src/features/home/lib/homeSchedule'

function schedule(overrides: Partial<Schedule> = {}): Schedule {
  return {
    scheduleId: 1,
    title: '일정',
    content: '',
    startDate: '2026-11-05T15:30:00Z',
    endDate: '2026-11-05T16:00:00Z',
    color: 'GOLD',
    users: [],
    ...overrides,
  }
}

for (const timestamp of [
  '2026-11-05T15:30:00',
  '2026-11-05T15:30:00Z',
  '2026-11-06T00:30:00+09:00',
]) {
  test(`${timestamp} 일정을 한국 시간의 11월 6일에 집계한다`, () => {
    const grouped = groupSchedulesByDate([
      schedule({ startDate: timestamp, endDate: timestamp }),
    ])

    expect(Object.keys(grouped)).toEqual(['2026-11-06'])
    expect(grouped['2026-11-06']).toHaveLength(1)
  })
}

test('한국 시간으로 변환한 기간의 양 끝과 윤년의 월말을 포함한다', () => {
  const grouped = groupSchedulesByDate([
    schedule({ startDate: '2028-02-28T15:00:00Z', endDate: '2028-03-01T14:59:59Z' }),
  ])

  expect(Object.keys(grouped)).toEqual(['2028-02-29', '2028-03-01'])
})

test('UTC로는 어제여도 한국 시간으로 오늘 끝나는 일정은 유지한다', () => {
  const expired = schedule({ scheduleId: 2, startDate: '2026-11-05T14:00:00Z', endDate: '2026-11-05T14:59:59Z' })
  const today = schedule()
  const schedules = [expired, today]

  expect(getUpcomingSchedules(schedules, '2026-11-06', 10)).toEqual([today])
  expect(getUpcomingSchedules(schedules, '2026-11-07', 10)).toEqual([])
  expect(schedules).toEqual([expired, today])
})

test('서로 다른 시간대 표기의 일정도 한국 날짜순으로 정렬한 뒤 개수를 제한한다', () => {
  const later = schedule({ scheduleId: 1, startDate: '2026-11-05T23:00:00-08:00', endDate: '2026-11-07' })
  const earlier = schedule({ scheduleId: 2, startDate: '2026-11-06T00:00:00+14:00', endDate: '2026-11-07' })
  const schedules = [later, earlier]

  expect(getUpcomingSchedules(schedules, '2026-11-05', 1)).toEqual([earlier])
  expect(schedules).toEqual([later, earlier])
})

test('시간대가 없는 날짜 전용 일정은 원래 날짜와 종료일을 유지한다', () => {
  const dateOnly = schedule({ startDate: '2026-11-05', endDate: '2026-11-06' })

  expect(Object.keys(groupSchedulesByDate([dateOnly]))).toEqual(['2026-11-05', '2026-11-06'])
  expect(getUpcomingSchedules([dateOnly], '2026-11-06', 1)).toEqual([dateOnly])
})
