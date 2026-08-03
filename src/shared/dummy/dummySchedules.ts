/**
 * 캘린더 더미 일정 데이터
 *
 * 서버 연동(GET /schedules) 전까지 사용하는 임시 데이터로,
 * 응답 스키마(ScheduleResponse)와 동일한 형태를 유지합니다.
 * 값은 디자인(2026년 7월) 기준입니다.
 */
import type { ScheduleResponse } from '@/shared/types/schedule'

export const dummySchedules: ScheduleResponse[] = [
  {
    scheduleId: 1,
    title: '1학기 기말고사',
    content: '1학기 기말고사 기간입니다.',
    startDate: '2026-07-01T00:00:00',
    endDate: '2026-07-03T23:59:59',
    color: 'LIGHTBLUE',
  },
  {
    scheduleId: 2,
    title: '나르샤 발표회',
    content: '나르샤 프로젝트 발표회입니다.',
    startDate: '2026-07-07T00:00:00',
    endDate: '2026-07-07T23:59:59',
    color: 'LIGHTBLUE',
  },
  {
    scheduleId: 3,
    title: '교내 해커톤',
    content: '교내 해커톤이 진행됩니다.',
    startDate: '2026-07-09T00:00:00',
    endDate: '2026-07-10T23:59:59',
    color: 'LIGHTGREEN',
  },
  {
    scheduleId: 4,
    title: '전공포폴대회',
    content: '전공 포트폴리오 대회입니다.',
    startDate: '2026-07-14T00:00:00',
    endDate: '2026-07-14T23:59:59',
    color: 'LIGHTGREEN',
  },
  {
    scheduleId: 5,
    title: '축제/가요제',
    content: '학교 축제 및 가요제입니다.',
    startDate: '2026-07-14T00:00:00',
    endDate: '2026-07-14T23:59:59',
    color: 'LIGHTGREY',
  },
  {
    scheduleId: 6,
    title: '스포츠 대항전',
    content: '학년별 스포츠 대항전입니다.',
    startDate: '2026-07-15T00:00:00',
    endDate: '2026-07-15T23:59:59',
    color: 'LIGHTGREY',
  },
  {
    scheduleId: 7,
    title: '여름방학식',
    content: '여름방학식이 진행됩니다.',
    startDate: '2026-07-16T00:00:00',
    endDate: '2026-07-16T23:59:59',
    color: 'GOLD',
  },
  {
    scheduleId: 8,
    title: '제헌절',
    content: '제헌절 공휴일입니다.',
    startDate: '2026-07-17T00:00:00',
    endDate: '2026-07-17T23:59:59',
    color: 'PINK',
  },
  {
    scheduleId: 9,
    title: '전공역량강화캠프',
    content: '전공역량강화캠프 1주차입니다.',
    startDate: '2026-07-20T00:00:00',
    endDate: '2026-07-24T23:59:59',
    color: 'LIGHTBLUE',
  },
  {
    scheduleId: 10,
    title: '전공역량강화캠프',
    content: '전공역량강화캠프 2주차입니다.',
    startDate: '2026-07-27T00:00:00',
    endDate: '2026-07-29T23:59:59',
    color: 'LIGHTBLUE',
  },
]
