import styled from 'styled-components'

import { DAYS_IN_WEEK } from '@/shared/constants/calendar'
import * as token from '@/shared/styles/values/token'

import type { DayTone } from '../lib/dayTone'

/** v1 FullCalendar 레이아웃을 v2 토큰으로 유지합니다. */
export const CalendarWrapper = styled.div`
  ${token.flexColumn}
  flex: 1 1 auto;
  width: 100%;
  min-height: 640px;

  .fc {
    ${token.flexColumn}
    flex: 1 1 auto;
    height: 100%;
    border: 1px solid ${token.colors.gray.gray20};
    border-radius: ${token.shapes.xsmall};
    background: ${token.colors.white};
    font-family: ${token.fontFamily.system};
  }

  .fc-header-toolbar.fc-toolbar {
    display: flex;
    justify-content: center;
    margin: 0;
    padding: 20px;
  }

  .fc-header-toolbar .fc-toolbar-chunk {
    display: flex;
    align-items: center;
  }

  .fc-header-toolbar .fc-toolbar-title {
    color: ${token.colors.gray.gray90};
    ${token.typography('heading', 'sm', 'medium')}
  }

  .fc .fc-button {
    border: 0;
    background: transparent;
    color: ${token.colors.gray.gray90};
    box-shadow: none;
  }

  .fc .fc-button:hover,
  .fc .fc-button:focus {
    background: transparent;
    color: ${token.colors.gray.gray100};
    box-shadow: none;
  }

  .fc-scrollgrid {
    width: 90%;
    height: 90%;
    margin: 0 auto;
    overflow: hidden;
    border: 1px solid ${token.colors.gray.gray20};
    border-radius: ${token.shapes.xsmall};
  }

  .fc-view-harness {
    flex: 1 1 auto;
  }

  .fc-theme-standard td,
  .fc-theme-standard th {
    border-color: ${token.colors.gray.gray20};
  }

  .fc .fc-col-header-cell {
    padding: 10px 0 10px 10px;
    border: 0;
    text-align: left;
  }

  .fc .fc-col-header-cell-cushion {
    color: ${token.colors.gray.gray50};
    text-align: left;
    ${token.typography('body', 'sm', 'semibold')}
  }

  .fc .fc-daygrid-day {
    background: ${token.colors.white};
  }

  .fc .fc-daygrid-day-frame {
    min-height: 100px;
  }

  .fc .fc-daygrid-day-top {
    padding: 5px;
  }

  .fc .fc-daygrid-day-number {
    padding: 8px;
    color: ${token.colors.gray.gray100};
    ${token.typography('body', 'sm', 'regular')}
  }

  .fc .fc-day-sun .fc-daygrid-day-number {
    color: ${token.colors.danger.danger20};
  }

  .fc .fc-day-sat .fc-daygrid-day-number {
    color: ${token.colors.info.info20};
  }

  .fc .fc-daygrid-day-events {
    margin-top: 20px;
  }

  .fc .fc-event {
    width: calc(100% - 8px);
    min-height: 22px;
    margin: 2px 4px;
    padding: 4px 6px;
    border: 0;
    border-radius: 4px;
    color: ${token.colors.gray.gray100};
    cursor: pointer;
    ${token.typography('body', 'sm', 'semibold')}
  }

  .fc .fc-event-main {
    color: inherit;
  }

  .fc .fc-day-today,
  .fc .fc-highlight {
    background: rgba(66, 153, 225, 0.05);
  }
`

export const EventContentWrapper = styled.div`
  display: flex;
  width: 100%;
  gap: 4px;
  align-items: center;
  overflow: hidden;
  pointer-events: none;
`

export const EventLabel = styled.span`
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`

const CARD_RADIUS = '24px' // 디자인 전용 값으로 shape 토큰에 대응 값이 없습니다.
const WEEKDAY_ROW_HEIGHT = '36px'
const DATE_ROW_HEIGHT = '37px' // 날짜 숫자 영역 높이 (아래로 일정 칩이 쌓입니다)
const CHIP_HEIGHT = '26px'
const CHIP_GAP = '4px'
const WEEK_ROW_MIN_HEIGHT = '132px'
/** 날짜 칸 높이 안에 들어가는 일정 줄 수 (넘치면 주 높이가 늘어납니다) */
const CHIP_ROW_COUNT = 3

const dayToneColors: Record<DayTone, string> = {
  sunday: token.colors.danger.danger20,
  saturday: token.colors.info.info20,
  weekday: token.colors.gray.gray90,
}

/* 6주로 구성된 달에서도 잘리지 않도록 내용 높이 이상으로 유지합니다. */
export const CalendarCard = styled.section`
  ${token.flexColumnStart}
  flex: 1 1 auto;
  width: 100%;
  min-height: fit-content;
  gap: 10px;
  padding: 28px 0 10px;
  border-radius: ${CARD_RADIUS};
`

export const CalendarHeader = styled.div`
  ${token.flexBetween}
  flex: 0 0 auto;
  width: 100%;
  padding: 0 24px;
`

export const MonthTitle = styled.h2`
  color: ${token.colors.gray.gray100};
  line-height: 1;
  white-space: nowrap;
  ${token.typography('heading', 'lg', 'semibold')}
`

export const MonthNav = styled.div`
  ${token.flexLeft}
  flex: 0 0 auto;
`

export const MonthNavButton = styled.button`
  ${token.flexCenter}
  flex: 0 0 auto;
  width: 20px;
  height: 28px;
  border-radius: ${token.shapes.xsmall};
  transition: background-color 120ms ease;

  &:hover,
  &:focus-visible {
    background: ${token.colors.gray.gray0};
  }

  &:focus-visible {
    outline: 2px solid ${token.colors.primary.primary40};
    outline-offset: 2px;
  }
`

export const MonthNavIcon = styled.img<{ $flipped?: boolean }>`
  width: 12px;
  height: 20px;
  transform: ${({ $flipped }) => ($flipped ? 'rotate(180deg)' : 'none')};
`

export const CalendarBody = styled.div`
  ${token.flexColumn}
  flex: 1 1 auto;
  width: 100%;
  padding: 15px 26px 0;
`

export const WeekdayRow = styled.div`
  display: grid;
  grid-template-columns: repeat(${DAYS_IN_WEEK}, 1fr);
  flex: 0 0 auto;
  width: 100%;
`

export const WeekdayLabel = styled.span<{ $tone: DayTone }>`
  ${token.flexCenter}
  height: ${WEEKDAY_ROW_HEIGHT};
  opacity: 0.8;
  color: ${({ $tone }) => dayToneColors[$tone]};
  line-height: 1;
  ${token.typography('body', 'lg', 'semibold')}
`

export const WeekList = styled.div`
  ${token.flexColumn}
  flex: 1 1 auto;
  width: 100%;
`

export const WeekRow = styled.div`
  display: grid;
  grid-template-columns: repeat(${DAYS_IN_WEEK}, 1fr);
  grid-template-rows: ${DATE_ROW_HEIGHT} repeat(${CHIP_ROW_COUNT}, ${CHIP_HEIGHT});
  grid-auto-rows: ${CHIP_HEIGHT};
  row-gap: ${CHIP_GAP};
  flex: 1 1 auto;
  min-height: ${WEEK_ROW_MIN_HEIGHT};
`

/*
 * 날짜 숫자 아래 빈 곳을 눌러도 일정을 추가할 수 있도록 칸 전체를 덮습니다.
 * 일정 칩과 같은 칸을 쓰므로 열을 직접 지정해 자동 배치가 밀리지 않게 합니다.
 */
export const DayCell = styled.button<{ $column: number }>`
  display: flex;
  grid-column: ${({ $column }) => $column + 1};
  grid-row: 1 / -1;
  align-items: flex-start;
  overflow: hidden;
  padding: 6px 8px;
  border-radius: ${token.shapes.small};
  text-align: left;
  transition: background-color 120ms ease;

  &:hover {
    background: ${token.colors.gray.gray0};
  }

  &:focus-visible {
    outline: 2px solid ${token.colors.primary.primary40};
    outline-offset: -2px;
  }
`

export const DayNumber = styled.span<{ $tone: DayTone; $outsideMonth: boolean }>`
  display: block;
  opacity: ${({ $outsideMonth }) => ($outsideMonth ? 0.4 : 1)};
  color: ${({ $tone }) => dayToneColors[$tone]};
  line-height: 1;
  ${token.typography('body', 'lg', 'semibold')}
`

export const ScheduleChipItem = styled.button<{
  $color: string
  $startColumn: number
  $columnSpan: number
  $lane: number
}>`
  ${token.flexCenter}
  grid-column: ${({ $startColumn, $columnSpan }) =>
    `${$startColumn + 1} / span ${$columnSpan}`};
  grid-row: ${({ $lane }) => $lane + 2};
  overflow: hidden;
  padding: 0 8px;
  border-radius: ${token.shapes.xsmall};
  background: ${({ $color }) => $color};
  transition: filter 120ms ease;

  &:hover {
    filter: brightness(0.95);
  }

  &:focus-visible {
    outline: 2px solid ${token.colors.gray.gray70};
    outline-offset: -2px;
  }
`

export const ScheduleChipTitle = styled.span`
  max-width: 100%;
  overflow: hidden;
  color: ${token.colors.gray.gray90};
  line-height: 1;
  white-space: nowrap;
  text-overflow: ellipsis;
  ${token.typography('body', 'lg', 'medium')}
`
