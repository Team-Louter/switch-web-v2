import type { ScheduleColor } from '@/entities/schedule'
import * as token from '@/shared/styles/values/token'

/**
 * 서버 일정 색상(enum)을 디자인의 일정 칩 색상으로 변환한다.
 *
 * 디자인에는 3가지 색(personal / important / fun)만 있어서 나머지 2가지는
 * 같은 톤의 토큰 색상으로 맞췄다.
 */
const SCHEDULE_COLORS: Record<ScheduleColor, string> = {
  LIGHTGREY: token.colors.gray.gray10,
  PINK: '#FFD9D9',
  GOLD: '#FEE6C9',
  LIGHTGREEN: token.colors.success.success0,
  LIGHTBLUE: '#D2F0FF',
}

const DEFAULT_SCHEDULE_COLOR = SCHEDULE_COLORS.LIGHTGREY

/**
 * 일정 색상 enum에 대응하는 색상 값을 반환한다.
 */
export function getScheduleColor(color: ScheduleColor) {
  return SCHEDULE_COLORS[color] ?? DEFAULT_SCHEDULE_COLOR
}
