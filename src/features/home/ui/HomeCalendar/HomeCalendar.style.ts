import * as token from '@/shared/styles/values/token';
import styled, { createGlobalStyle, css, keyframes } from 'styled-components';

function calendarSize(pixels: number) {
  return `calc(${pixels} * var(--home-calendar-unit))`;
}

const eventShimmer = keyframes`
  from { background-position: 100% 0; }
  to { background-position: -100% 0; }
`;

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

  @keyframes calendar-shimmer {
    from { background-position: 100% 0; }
    to { background-position: -100% 0; }
  }
`;

export const CalendarWrapper = styled.div<{
  $loading: boolean
}>`
  width: 100%;
  height: 100%;
  container-type: inline-size;
  ${token.flexColumn}


  .fc {
    /* 888px 기준 디자인을 실제 크기로 배치해 일정 좌표에 확대가 중복되지 않게 한다. */
    --home-calendar-unit: calc(100cqw / 888);
    font-family: ${token.fontFamily.system};
    font-size: ${calendarSize(16)};
    border: 1px solid #eeeeee;
    border-radius: ${calendarSize(8)};
    box-shadow: 0 ${calendarSize(2)} ${calendarSize(6)} rgba(0, 0, 0, 0.08);
    background: #ffffff;
    height: 100%;
    ${token.flexColumn}
  }

  .fc-header-toolbar.fc-toolbar {
    ${token.flexCenter}
    padding: ${calendarSize(20)};
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

  .fc-header-toolbar .fc-prev-button {
    margin-right: ${calendarSize(15)};
  }

  .fc-header-toolbar .fc-next-button {
    margin-left: ${calendarSize(15)};
  }

  .fc-header-toolbar .fc-toolbar-title {
    font-size: ${calendarSize(20)};
    font-weight: 500;
    color: #333333;
    margin: 0;
    padding: 0;
  }

  .fc .fc-button {
    background: none;
    border: none;
    color: #a0a0a0;
    font-size: ${calendarSize(20)};
    padding: 0.4em 0.5em;
    box-shadow: none;
  }

  .fc .fc-button:hover {
    background: none;
    color: #333333;
  }

  .fc .fc-button:focus {
    outline: none;
    box-shadow: none;
  }

  .fc .fc-button:focus:not(:focus-visible) {
    outline: none;
    box-shadow: none;
  }

  .fc .fc-button:focus-visible {
    outline: 2px solid #2ca4fb;
    outline-offset: 2px;
  }

  .fc-view-harness {
    flex: 1;
    ${token.flexCenter}
  }

  .fc .fc-col-header-cell {
    padding: ${calendarSize(10)} 0 ${calendarSize(10)} ${calendarSize(10)};
    font-size: ${calendarSize(12)};
    font-weight: 600;
    color: #b8b8b8;
    background: #ffffff;
    border: none;
    border-radius: ${calendarSize(8)};
    text-align: left;
  }

  .fc .fc-col-header-cell-cushion {
    padding: ${calendarSize(2)} ${calendarSize(4)};
    text-align: left;
  }

  .fc .fc-scrollgrid {
    border: 1px solid #eeeeee;
    border-radius: ${calendarSize(8)};
    width: 90%;
    max-width: ${calendarSize(1200)};
    margin: 0 auto;
    height: 90%;
  }

  .fc .fc-scrollgrid-section-body > td {
    border: none;
    height: 100%;
  }

  /* v2 본문 폭에서 FullCalendar가 계산한 초기 inline 폭을 격자에 맞춘다. */
  .fc .fc-col-header,
  .fc .fc-daygrid-body,
  .fc .fc-daygrid-body table {
    width: 100% !important;
  }

  /* FullCalendar의 내부 계산 높이가 남는 영역을 비우지 않도록 본문 표를 채운다. */
  .fc .fc-daygrid-body,
  .fc .fc-daygrid-body table {
    height: 100% !important;
  }

  .fc .fc-daygrid-day {
    background: #ffffff;
    border: 0;
    border-top: 1px solid #eeeeee;
    border-left: 1px solid #eeeeee;
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
    padding: ${calendarSize(5)};
  }

  .fc .fc-daygrid-day-number {
    font-size: ${calendarSize(11)};
    font-weight: 400;
    padding: ${calendarSize(8)};
    color: #191a1a;
    position: absolute;
    top: 0;
    left: 0;
  }

  .fc .fc-day-sun .fc-daygrid-day-number {
    color: #fc675f;
  }

  .fc .fc-day-sat .fc-daygrid-day-number {
    color: #2ca4fb;
  }

  .fc .fc-daygrid-day-events {
    margin-top: ${calendarSize(20)};
  }

  .fc .fc-event {
    font-size: ${calendarSize(12)};
    font-weight: 600;
    display: block;
    width: calc(100% - ${calendarSize(8)});
    min-height: ${calendarSize(22)};
    border: none;
    border-radius: ${calendarSize(4)};
    padding: ${calendarSize(4)} ${calendarSize(6)};
    margin: ${calendarSize(2)} ${calendarSize(4)};
    cursor: pointer;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    box-sizing: border-box;

    ${({ $loading }) => $loading && css`
      border: 0;
      background: linear-gradient(90deg, #edf0f3 25%, #f7f8f9 37%, #edf0f3 63%) !important;
      background-size: 400% 100% !important;
      animation: ${eventShimmer} 1.2s ease-in-out infinite;
      color: transparent !important;
      cursor: default;
    `}
  }

  .fc .fc-h-event .fc-event-main {
    display: block;
    width: 100%;
    height: 100%;
  }

  .fc .fc-event:hover {
    background-color: rgb(252, 222, 25);
  }

  .fc .fc-event.calendar-event-skeleton,
  .fc .fc-event.calendar-event-skeleton:hover {
    border: 0;
    background: linear-gradient(90deg, #edf0f3 25%, #f7f8f9 37%, #edf0f3 63%) !important;
    background-size: 400% 100% !important;
    animation: ${eventShimmer} 1.2s ease-in-out infinite;
    color: transparent !important;
    cursor: default;
  }

  .fc .club-report-selected-event {
    box-shadow: inset 0 0 0 2px #ffd600;
    filter: brightness(0.96);
  }

  .fc .fc-event-main {
    color: #191a1a;
  }

  .fc .fc-day-today {
    background-color: rgba(66, 153, 225, 0.05);
  }

  .fc .fc-highlight {
    background-color: rgba(66, 153, 225, 0.05);
  }

  /* v1 메인 달력은 6번째 주를 숨기고 나머지 5개 행을 같은 높이로 유지한다. */
  .fc .fc-daygrid-body tr:nth-child(6) {
    display: none;
  }

  .fc .fc-daygrid-body tr {
    height: 20%;
  }

  .fc .fc-popover {
    background: #ffffff !important;
    border: 1px solid #eeeeee;
    border-radius: 8px;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
  }

  .fc .fc-popover-body {
    background: #ffffff !important;
  }

  .skeleton-event {
    height: 18px !important;
  }

  .fc .fc-daygrid-more-link {
    display: block;
    width: 100%;
    margin: ${calendarSize(1)} 0;
    padding: ${calendarSize(2)} ${calendarSize(4)};
    box-sizing: border-box;
    border-radius: ${calendarSize(4)};
    line-height: 1.5;
    font-size: ${calendarSize(12)};
    cursor: pointer;

    &:hover {
      background-color: rgba(0, 0, 0, 0.08);
    }
  }
`;

export const EventContentWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: ${calendarSize(4)};
  width: 100%;
  min-height: ${calendarSize(14)};
  overflow: hidden;
  pointer-events: none;

  svg {
    width: ${calendarSize(12)};
    height: ${calendarSize(12)};
  }
`;


export const EventLabel = styled.span`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  pointer-events: none;
`;

export const EventSkeleton = styled.span`
  display: block;
  width: 100%;
  height: 100%;
`;
