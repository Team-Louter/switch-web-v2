import styled from 'styled-components'

import * as token from '@/shared/styles/values/token'

// 달력 컴포넌트에서만 쓰는 디자인 색상 (토큰에 없는 값)
const CALENDAR_TEXT = '#252525'
const MORE_EVENTS_TEXT = '#015DE7'

export const Card = styled.section`
  ${token.flexColumn}
  width: 100%;
  height: 100%;
  min-height: 0;
  padding: 24px 48px;
  gap: 24px;
  border: 1px solid ${token.colors.gray.gray10};
  border-radius: ${token.shapes.small};
  background: ${token.colors.white};
`

export const Header = styled.header`
  ${token.flexBetween}
  flex: 0 0 auto;
  gap: 12px;
`

export const MonthTitle = styled.h2`
  ${token.flexLeft}
  gap: 12px;
  padding: 12px;
  color: ${CALENDAR_TEXT};
  font-size: 28px;
  line-height: 1.25;
`

export const Month = styled.span`
  font-weight: ${token.fontWeight.bold};
`

export const Year = styled.span`
  font-weight: ${token.fontWeight.regular};
`

export const Nav = styled.div`
  ${token.flexRight}
  gap: 10px;
`

export const NavButton = styled.button`
  ${token.flexCenter}
  width: 24px;
  height: 24px;
  color: ${CALENDAR_TEXT};
  font-size: 14px;

  &:focus-visible {
    outline: 2px solid ${token.colors.primary.primary40};
    outline-offset: 2px;
  }
`

export const Grid = styled.div`
  ${token.flexColumn}
  flex: 1 1 auto;
  gap: 8px;
  min-height: 0;
`

export const WeekdayRow = styled.div`
  ${token.flexRow}
  flex: 0 0 auto;
  padding-bottom: 4px;
`

export const Weekday = styled.span`
  ${token.flexCenter}
  flex: 1 1 0;
  min-width: 0;
  height: 24px;
  color: ${CALENDAR_TEXT};
  font-size: ${token.fontSize.body.sm};
  line-height: 1.25;
  opacity: 0.5;
`

export const Week = styled.div`
  ${token.flexRow}
  flex: 1 1 0;
  align-items: flex-start;
  min-height: 0;
`

export const DayCell = styled.div`
  ${token.flexColumn}
  align-items: center;
  flex: 1 1 0;
  gap: 2px;
  min-width: 0;
  height: 100%;
  padding: 2px;
  overflow: hidden;
`

export const DateBadge = styled.span<{
  $isCurrentMonth: boolean
  $isToday: boolean
}>`
  ${token.flexCenter}
  flex: 0 0 auto;
  width: ${({ $isToday }) => ($isToday ? '24px' : '28px')};
  height: ${({ $isToday }) => ($isToday ? '24px' : '28px')};
  margin: ${({ $isToday }) => ($isToday ? '2px 0' : '0')};
  border-radius: ${token.shapes.circle};
  background: ${({ $isToday }) => ($isToday ? CALENDAR_TEXT : 'transparent')};
  color: ${({ $isToday }) => ($isToday ? token.colors.white : CALENDAR_TEXT)};
  font-size: ${token.fontSize.body.sm};
  line-height: 1.25;
  opacity: ${({ $isCurrentMonth }) => ($isCurrentMonth ? 1 : 0.5)};
`

export const EventChip = styled.span<{ $color: string }>`
  ${token.flexLeft}
  flex: 0 0 auto;
  width: 100%;
  height: 20px;
  padding: 0 6px;
  overflow: hidden;
  border-radius: ${token.shapes.xsmall};
  background: ${({ $color }) => $color};
  color: ${token.colors.gray.gray100};
  font-size: ${token.fontSize.caption.md};
  line-height: 1.25;
  text-overflow: ellipsis;
  white-space: nowrap;
`

export const MoreEventsButton = styled.button`
  ${token.flexRight}
  flex: 0 0 auto;
  align-items: flex-end;
  width: 100%;
  height: 14px;
  color: ${MORE_EVENTS_TEXT};
  font-size: ${token.fontSize.caption.sm};
  line-height: 1.25;
`
