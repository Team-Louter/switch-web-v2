import type { ScheduleColor } from '@/shared/types/schedule'

export const DAYS_IN_WEEK = 7

/** 일요일(0)부터 시작하는 요일 라벨 */
export const WEEKDAY_LABELS = [
  '일요일',
  '월요일',
  '화요일',
  '수요일',
  '목요일',
  '금요일',
  '토요일',
] as const

export const SUNDAY_INDEX = 0

export const SATURDAY_INDEX = 6

/**
 * 일정 색상 값 → 실제 칩 배경색
 *
 * 디자인 팔레트에는 보라색이 있으나 서버 enum에 대응하는 값이 없어
 * 남는 값인 LIGHTGREY에 임시로 매핑했습니다. (서버 색상 확정 시 수정 필요)
 */
export const SCHEDULE_CHIP_COLORS: Record<ScheduleColor, string> = {
  LIGHTBLUE: 'rgba(0, 123, 255, 0.4)',
  LIGHTGREEN: 'rgba(25, 255, 0, 0.4)',
  GOLD: 'rgba(255, 213, 0, 0.4)',
  PINK: 'rgba(255, 0, 0, 0.4)',
  LIGHTGREY: 'rgba(110, 0, 255, 0.4)',
}

/**
 * 일정 색상 값 → 일정 추가 모달의 색상 선택 원형 색
 *
 * 캘린더 칩과 다른 색상 값이 사용되어 별도로 정의합니다.
 */
export const SCHEDULE_SWATCH_COLORS: Record<ScheduleColor, string> = {
  PINK: '#BD2C0F',
  LIGHTBLUE: '#0F63BD',
  GOLD: '#FAD51C',
  LIGHTGREEN: '#20BD0F',
  LIGHTGREY: '#5A0FBD',
}

/**
 * 일정 색상 값 → 화면에 읽어줄 이름
 *
 * 색상 이름은 실제로 보이는 색을 따르므로, LIGHTGREY의 임시 매핑(보라)에 맞춥니다.
 */
export const SCHEDULE_COLOR_LABELS: Record<ScheduleColor, string> = {
  PINK: '빨강',
  LIGHTBLUE: '파랑',
  GOLD: '노랑',
  LIGHTGREEN: '초록',
  LIGHTGREY: '보라',
}

/** 색상 선택 원형이 노출되는 순서 (디자인 기준) */
export const SCHEDULE_COLOR_OPTIONS: ScheduleColor[] = [
  'PINK',
  'LIGHTBLUE',
  'GOLD',
  'LIGHTGREEN',
  'LIGHTGREY',
]

export const UNSELECTED_SWATCH_OPACITY = 0.28
