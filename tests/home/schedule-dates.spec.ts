import { expect, test } from '../community/fixtures'

import type { Schedule } from '../../src/entities/schedule'
import {
  getUpcomingSchedules,
  groupSchedulesByDate,
} from '../../src/features/home/lib/homeSchedule'
import { toScheduleDateKey } from '../../src/shared/utils/schedule'
import { formatEvents } from '../../src/widgets/calendar/lib/calendarEvents'

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

test('배포 API의 시간대 없는 하루 일정은 다음 날로 늘어나지 않는다', () => {
  const deployedSchedule = schedule({
    startDate: '2026-11-04T00:00:00',
    endDate: '2026-11-04T23:59:59',
  })

  expect(toScheduleDateKey(deployedSchedule.startDate)).toBe('2026-11-04')
  expect(toScheduleDateKey(deployedSchedule.endDate)).toBe('2026-11-04')
  expect(Object.keys(groupSchedulesByDate([deployedSchedule]))).toEqual(['2026-11-04'])
  expect(formatEvents([deployedSchedule])[0]).toMatchObject({
    start: '2026-11-04',
    end: '2026-11-05',
    allDay: true,
  })
  expect(getUpcomingSchedules([deployedSchedule], '2026-11-04', 1)).toEqual([deployedSchedule])
  expect(getUpcomingSchedules([deployedSchedule], '2026-11-05', 1)).toEqual([])
})

test('배포 API의 여러 날 일정은 월말을 넘어도 원래 종료일까지 포함한다', () => {
  const deployedSchedule = schedule({
    startDate: '2028-02-28T15:30:00',
    endDate: '2028-03-01T23:59:59.999',
  })

  expect(Object.keys(groupSchedulesByDate([deployedSchedule])))
    .toEqual(['2028-02-28', '2028-02-29', '2028-03-01'])
  expect(formatEvents([deployedSchedule])[0]).toMatchObject({
    start: '2028-02-28',
    end: '2028-03-02',
  })
})

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

for (const timezoneId of ['Asia/Seoul', 'America/Los_Angeles']) {
  test.describe(`배포 일정 표시 (${timezoneId})`, () => {
    test.use({ timezoneId })

    test('하루 일정은 한 칸, 기간 일정은 종료일까지 표시하고 상세 날짜도 유지한다', async ({ page, api }) => {
      void api
      await page.clock.setFixedTime(new Date('2026-11-10T03:00:00Z'))
      await page.route('**/api/schedules', (route) => route.fulfill({ json: [
        schedule({ title: '하루 일정', startDate: '2026-11-04T00:00:00', endDate: '2026-11-04T23:59:59' }),
        schedule({ scheduleId: 2, title: '기간 일정', startDate: '2026-11-11T00:00:00', endDate: '2026-11-13T23:59:59' }),
      ] }))
      await page.goto('/home')

      const calendar = page.getByLabel('월간 일정')
      await expect(calendar).toHaveAttribute('aria-busy', 'false')

      for (const { title, start, end } of [
        { title: '하루 일정', start: '2026-11-04', end: '2026-11-04' },
        { title: '기간 일정', start: '2026-11-11', end: '2026-11-13' },
      ]) {
        const event = calendar.locator('.fc-event').filter({ hasText: title })
        await expect(event).toBeVisible()
        const startCell = calendar.locator(`[data-date="${start}"]`)
        const endCell = calendar.locator(`[data-date="${end}"]`)

        await expect.poll(async () => {
          const [eventBox, startBox, endBox] = await Promise.all([
            event.boundingBox(), startCell.boundingBox(), endCell.boundingBox(),
          ])
          if (!eventBox || !startBox || !endBox) return false

          const eventRight = eventBox.x + eventBox.width
          return eventBox.x >= startBox.x - 1 &&
            eventBox.x < startBox.x + startBox.width / 2 &&
            eventRight > endBox.x + endBox.width / 2 &&
            eventRight <= endBox.x + endBox.width + 1
        }).toBe(true)

        await event.click()
        await expect(page.getByRole('dialog', { name: '일정 상세' }))
          .toContainText(`${start} ~ ${end}`)
        await page.keyboard.press('Escape')
      }
    })
  })
}
