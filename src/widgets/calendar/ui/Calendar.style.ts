import * as token from '../lib/calendarTokens';
import styled, { createGlobalStyle } from 'styled-components';

export const SkeletonStyle = createGlobalStyle`
  .skeleton-event {
    animation: pulse 1.5s ease-in-out infinite !important;
    pointer-events: none !important;
  }

  @keyframes pulse {
    0% { opacity: 1; }
    50% { opacity: 0.4; }
    100% { opacity: 1; }
  }
`;

export const CalendarWrapper = styled.div`
  width: 100%;
  height: 100%;
  min-width: 0;
  container-type: inline-size;
  ${token.flexColumn}

  .fc {
    font-family: ${token.fontFamily.system};
    border: 1px solid ${token.colors.line.light};
    border-radius: ${token.shapes.xsmall};
    ${token.elevation('black_2')}
    background: ${token.colors.fill.white};
    height: 100%;
    ${token.flexColumn}
  }

  .fc-header-toolbar.fc-toolbar {
    position: relative;
    ${token.flexCenter}
    padding: clamp(10px, 2cqw, 24px);
    flex-shrink: 0;
    margin: 0;
  }

  .fc-header-toolbar .fc-toolbar-chunk {
    display: flex;
    align-items: center;
  }

  .fc-header-toolbar .fc-toolbar-chunk:first-child,
  .fc-header-toolbar .fc-toolbar-chunk:last-child {
    flex-grow: 0;
  }

  .fc-header-toolbar .fc-toolbar-chunk:nth-child(2) {
    flex-grow: 0;
    display: flex;
    align-items: center;
  }

  .fc-header-toolbar .fc-toolbar-chunk:last-child {
    position: static;
  }

  .fc-header-toolbar .fc-prev-button {
    margin-right: 15px;
  }

  .fc-header-toolbar .fc-next-button {
    margin-left: 15px;
  }

  .fc-header-toolbar .fc-toolbar-title {
    ${token.typography("heading", "sm", "medium")}
    font-size: clamp(16px, 1.4cqw, 28px);
    color: ${token.colors.text.normal};
    margin: 0;
    padding: 0;
  }

  .fc .fc-button {
    background: none;
    border: none;
    color: ${token.colors.fill.a0};
    font-size: ${token.fontSize.heading.sm};
    padding: 0.4em 0.5em;
    box-shadow: none;
  }

  .fc .fc-button:hover {
    background: none;
    color: ${token.colors.text.normal};
  }

  .fc .fc-button:focus {
    outline: none !important;
    box-shadow: none !important;
  }

  .fc .fc-createSchedule-button {
    display: inline-flex;
    position: relative;
    align-items: center;
    gap: 6px;
    margin-left: 16px;
    padding: 8px 12px;
    border-radius: ${token.shapes.xsmall};
    background: ${token.colors.main.normal};
    color: ${token.colors.fill.white};
    font-size: ${token.fontSize.body.sm};
    font-weight: ${token.fontWeight.semibold};
  }

  .fc .fc-createSchedule-button::before {
    width: 12px;
    height: 2px;
    border-radius: 999px;
    background: ${token.colors.fill.white};
    content: '';
  }

  .fc .fc-createSchedule-button::after {
    position: absolute;
    top: 50%;
    left: 17px;
    width: 2px;
    height: 12px;
    border-radius: 999px;
    background: ${token.colors.fill.white};
    content: '';
    transform: translateY(-50%);
  }

  .fc .fc-createSchedule-button:hover {
    background: ${token.colors.fill.charcoal};
    color: ${token.colors.fill.white};
  }

  .fc-view-harness {
    flex: 1;
    min-height: 0;
    ${token.flexCenter}
  }

  .fc .fc-col-header-cell {
    padding: 10px 0;
    ${token.typography("caption", "md", "semibold")};
    color: ${token.colors.text.lightGray};
    background: ${token.colors.background.white};
    border: none;
    border-radius: ${token.shapes.xsmall};
    text-align: center;
  }

  .fc .fc-col-header-cell-cushion {
    display: block;
    width: 100%;
    text-align: center;
  }

  .fc .fc-scrollgrid {
    border: 1px solid ${token.colors.line.light};
    border-radius: ${token.shapes.xsmall};
    width: calc(100% - clamp(16px, 4cqw, 64px));
    max-width: none;
    margin: 0 auto;
    height: calc(100% - clamp(16px, 4cqw, 64px));
  }

  .fc .fc-scrollgrid-section-body > td {
    border: none;
    height: 100%;
  }

  .fc .fc-daygrid-day {
    background: ${token.colors.background.white};
    border: 0;
    border-top: 1px solid ${token.colors.line.light};
    border-left: 1px solid ${token.colors.line.light};
  }

  /* 첫 번째 열의 외곽선은 scrollgrid가 담당합니다. */
  .fc .fc-daygrid-body tr > .fc-daygrid-day:first-child {
    border-left: 0;
  }

  .fc .fc-daygrid-day-frame {
    height: 100%;
    position: relative;
  }

  .fc .fc-daygrid-day-top {
    justify-content: flex-start;
    padding: 5px;
  }

  .fc .fc-daygrid-day-number {
    ${token.typography("caption", "sm", "regular")};
    font-size: clamp(11px, 0.9cqw, 18px);
    padding: 8px;
    color: ${token.colors.calendar.black};
    position: absolute;
    top: 0;
    left: 0;
  }

  .fc .fc-day-sun .fc-daygrid-day-number {
    color: ${token.colors.calendar.red};
  }

  .fc .fc-day-sat .fc-daygrid-day-number {
    color: ${token.colors.calendar.blue};
  }

  .fc .fc-daygrid-day-events {
    margin-top: 20px;
  }

  .fc .fc-event {
    ${token.typography("caption", "md", "semibold")};
    font-size: clamp(11px, 0.9cqw, 18px);
    display: block;
    width: calc(100% - 8px);
    min-height: 22px;
    border: none;
    border-radius: 4px;
    padding: 4px 6px;
    margin: 2px 4px;
    cursor: pointer;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    box-sizing: border-box;
  }

  .fc .fc-h-event .fc-event-main {
    display: block;
    width: 100%;
    height: 100%;
  }

  .fc .fc-event:hover {
    background-color: rgb(252, 222, 25);
  }

  .fc .club-report-selected-event {
    box-shadow: inset 0 0 0 2px ${token.colors.main.alternative};
    filter: brightness(0.96);
  }

  .fc .fc-event-main {
    color: ${token.colors.calendar.black};
  }

  .fc .fc-day-today {
    background-color: rgba(66, 153, 225, 0.05);
  }

  .fc .fc-highlight {
    background-color: rgba(66, 153, 225, 0.05);
  }



  .fc .fc-daygrid-body tr {
    height: auto;
  }

  .fc .fc-popover {
    background: ${token.colors.fill.white} !important;
    border: 1px solid ${token.colors.line.light};
    border-radius: ${token.shapes.xsmall};
    ${token.elevation('black_2')}
  }

  .fc .fc-popover-body {
    background: ${token.colors.fill.white} !important;
  }

  .skeleton-event {
  height: 18px !important;
  }

  @media (max-width: 768px) {
    .fc {
      flex: 1 1 0;
      height: auto;
      min-height: 0;
      overflow: hidden;
    }

    .fc .fc-event {
      display: inline-flex;
      position: relative;
      z-index: 2;
      width: 10px;
      min-width: 10px;
      min-height: 10px;
      height: 10px;
      margin: 1px 2px;
      padding: 0;
      overflow: visible;
      border-radius: 999px;
      opacity: 1;
    }

    .fc .fc-event-main,
    .fc .fc-event-main-frame,
    .fc .fc-event-title-container {
      width: 10px;
      min-width: 10px;
      height: 10px;
      overflow: visible;
    }

    .fc .fc-event svg,
    .calendar-desktop-event,
    .fc .fc-daygrid-more-link {
      display: none;
    }

    .calendar-mobile-dot {
      display: block;
    }

    .fc .fc-event.calendar-mobile-range-event {
      display: block;
      width: calc(100% - 4px);
      min-width: 0;
      height: 10px;
      min-height: 10px;
      margin: 1px 2px;
      border-radius: 999px;
      overflow: hidden;
    }

    .fc .calendar-mobile-range-event .fc-event-main,
    .fc .calendar-mobile-range-event .fc-event-main-frame,
    .fc .calendar-mobile-range-event .fc-event-title-container {
      width: 100%;
      min-width: 0;
      height: 10px;
      overflow: hidden;
    }

    .calendar-mobile-range-event .calendar-mobile-dot {
      display: none;
    }

    .fc .fc-daygrid-day-events {
      display: flex;
      flex-wrap: wrap;
      align-content: flex-start;
      margin-top: 24px;
      padding-inline: 3px;
    }

    .fc .mobile-selected-day {
      box-shadow: inset 0 0 0 2px ${token.colors.main.normal};
    }
  }

  .fc .fc-daygrid-more-link {
    display: block;
    width: 100%;
    margin: 1px 0;
    padding: 2px 4px;
    box-sizing: border-box;
    border-radius: 4px;
    line-height: 1.5;
    font-size: 12px;
    cursor: pointer;

    &:hover {
      background-color: rgba(0, 0, 0, 0.08);
    }
  }

  @media (max-width: 768px) {
    .fc .fc-daygrid-more-link {
      display: none;
    }
  }

  @container (max-width: 600px) {
    .fc .fc-scrollgrid {
      width: calc(100% - 20px);
      height: calc(100% - 12px);
      margin-bottom: 10px;
    }

    .fc .fc-col-header-cell {
      padding: 8px 0;
      text-align: center;
    }

    .fc .fc-daygrid-day-number {
      padding: 4px;
    }

  }
`;

export const EventContentWrapper = styled.div.attrs({
  className: 'calendar-desktop-event',
})`
  display: flex;
  align-items: center;
  gap: 4px;
  width: 100%;
  min-height: 14px;
  overflow: hidden;
  pointer-events: none;
`;

export const EventLabel = styled.span`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  pointer-events: none;
`;

export const MobileEventDot = styled.span.attrs({
  className: 'calendar-mobile-dot',
})<{ $color: string }>`
  display: none;
  width: 10px;
  min-width: 10px;
  height: 10px;
  border-radius: 999px;
  background: ${({ $color }) => $color};
  box-shadow: 0 0 0 1px ${({ $color }) => $color};
`;

export const MobileScheduleSection = styled.section`
  flex: 0 0 auto;
  box-sizing: border-box;
  width: 100%;
  padding: 16px 12px 4px;
`;

export const MobileScheduleHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 12px;
`;

export const MobileScheduleHeading = styled.h3`
  margin: 0;
  color: ${token.colors.text.normal};
  ${token.typography('body', 'md', 'semibold')}
`;

export const MobileCreateButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 auto;
  min-height: 40px;
  gap: 6px;
  padding: 0 14px;
  border: 0;
  border-radius: ${token.shapes.xsmall};
  color: ${token.colors.fill.white};
  background: ${token.colors.fill.charcoal};
  ${token.typography('body', 'sm', 'semibold')}

  span {
    font-size: 22px;
    font-weight: 300;
    line-height: 1;
  }
`;

export const MobileScheduleList = styled.ul`
  display: grid;
  gap: 8px;
  margin: 0;
  padding: 0;
  list-style: none;
`;

export const MobileScheduleButton = styled.button<{ $color: string }>`
  display: flex;
  align-items: center;
  width: 100%;
  min-height: 44px;
  padding: 10px 12px;
  border: 1px solid ${token.colors.line.light};
  border-left: 5px solid ${({ $color }) => $color};
  border-radius: ${token.shapes.xsmall};
  background: ${token.colors.fill.white};
  color: ${token.colors.text.normal};
  text-align: left;
  ${token.typography('body', 'sm', 'medium')}
`;

export const MobileScheduleEmpty = styled.p`
  margin: 0;
  padding: 18px 0;
  color: ${token.colors.text.lightGray};
  text-align: center;
  ${token.typography('body', 'sm', 'medium')}
`;
