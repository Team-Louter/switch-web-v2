import React, { useState, useEffect, useRef } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import koLocale from '@fullcalendar/core/locales/ko';
import type { DateSelectArg, EventClickArg, EventContentArg, EventInput } from '@fullcalendar/core';
import { FaFlag } from "react-icons/fa6";
import * as S from './Calendar.style.ts';
import { EventDetailCard } from './EventDetailCard';
import { EventEditModal } from './EventEditModal';
import { formatApiEvents } from '../lib/calendarEvents';
import { asCalendarDate, getLocalDateString } from '../lib/calendarDates';
import { useEvent } from '../model/useEvent';
import { toDateKeyFromServer } from '@/shared/lib/calendar';
import { addDays, formatDateInput, parseDateInput } from '@/shared/utils/date';

interface CalendarProps {
  readOnly?: boolean;
  initialDate?: Date | string;
  selectionMode?: 'default' | 'clubReport';
  selectedScheduleIds?: number[];
  showHeaderToolbar?: boolean;
  onSelectionToggle?: (event: EventInput) => void;
}

interface CalendarDateClickInfo {
  date: Date;
}

function getEventDateKey(value: NonNullable<EventInput['start']>) {
  return typeof value === 'string'
    ? toDateKeyFromServer(value)
    : getLocalDateString(asCalendarDate(value));
}

function isMultiDayEvent(event: EventInput) {
  if (!event.start || !event.end || String(event.id).startsWith('skeleton-')) {
    return false;
  }

  const startDate = parseDateInput(getEventDateKey(event.start));
  const dayAfterStartKey = formatDateInput(addDays(startDate, 1));
  const exclusiveEndKey = getEventDateKey(event.end);

  return dayAfterStartKey < exclusiveEndKey;
}

export function Calendar({
  readOnly = false,
  initialDate,
  selectionMode = 'default',
  selectedScheduleIds = [],
  showHeaderToolbar = true,
  onSelectionToggle,
}: CalendarProps) {
  const [selectedEvent, setSelectedEvent] = useState<EventInput | null>(null);
  const [cardPosition, setCardPosition] = useState({ x: 0, y: 0 });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedEndDate, setSelectedEndDate] = useState<Date | null>(null);
  const [modalMode, setModalMode] = useState<string>('');
  const [isMobileCalendar, setIsMobileCalendar] = useState(false);
  const [mobileSelectedDate, setMobileSelectedDate] = useState(new Date());
  const calendarWrapperRef = useRef<HTMLDivElement>(null);
  const fullCalendarRef = useRef<FullCalendar>(null);
  const blockPopover = useRef(false);
  const isSelectionMode = selectionMode === 'clubReport';

  const { eventsInfo, setEventsInfo, isLoading, error } = useEvent();

  const today = new Date();
  const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();

  const skeletonEvents = isLoading
    ? [...Array(daysInMonth)].map((_, i) => ({
        id: `skeleton-${i}`,
        title: ' ',
        start: new Date(today.getFullYear(), today.getMonth(), i + 1).toISOString(),
        backgroundColor: '#e0e0e0',
        borderColor: '#e0e0e0',
        classNames: ['skeleton-event'],
        scheduleId: -1,
        color: '#e0e0e0',
      })) as EventInput[]
    : [] as EventInput[];

  useEffect(() => {
    const calendarWrapper = calendarWrapperRef.current;
    if (!calendarWrapper) return;
    let resizeFrame = 0;

    const updateLayoutMode = () => {
      setIsMobileCalendar(window.innerWidth <= 768);
    };

    updateLayoutMode();

    const resizeObserver = new ResizeObserver(() => {
      updateLayoutMode();
      window.cancelAnimationFrame(resizeFrame);
      resizeFrame = window.requestAnimationFrame(() => {
        fullCalendarRef.current?.getApi().updateSize();
      });
    });

    resizeObserver.observe(calendarWrapper);
    window.addEventListener('resize', updateLayoutMode);
    return () => {
      window.cancelAnimationFrame(resizeFrame);
      resizeObserver.disconnect();
      window.removeEventListener('resize', updateLayoutMode);
    };
  }, []);

  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isModalOpen]);

  useEffect(() => {
    const observer = new MutationObserver(() => {
      if (blockPopover.current) {
        const popover = document.querySelector('.fc-popover');
        if (popover) popover.remove();
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      const popover = document.querySelector('.fc-popover');
      if (popover) {
        blockPopover.current = true;
        popover.remove();
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleDateSelect = (selectInfo: DateSelectArg) => {
    if (readOnly) return;

    const endDate = new Date(selectInfo.end);
    endDate.setDate(endDate.getDate() - 1);

    setSelectedDate(selectInfo.start);
    setSelectedEndDate(endDate);
    setSelectedEvent(null);
    setIsModalOpen(true);
    setModalMode('추가');
  };

  const handleCreateScheduleClick = () => {
    const currentDate = new Date();

    setSelectedDate(currentDate);
    setSelectedEndDate(currentDate);
    setSelectedEvent(null);
    setIsModalOpen(true);
    setModalMode('추가');
  };

  const handleEventClick = (clickInfo: EventClickArg) => {
    if (isLoading) return;
    clickInfo.jsEvent.stopPropagation();
    blockPopover.current = true;

    setTimeout(() => {
      const popover = document.querySelector('.fc-popover');
      if (popover) popover.remove();
    }, 0);

    const clickedEvent = (
      clickInfo.event.extendedProps?.sourceEvent as EventInput | undefined
    ) ?? formatApiEvents(clickInfo.event);

    if (isSelectionMode) {
      const rawScheduleId =
        clickedEvent.scheduleId ??
        clickInfo.event.extendedProps?.scheduleId ??
        clickInfo.event.id;
      const clickedScheduleId = Number(rawScheduleId);

      if (!Number.isFinite(clickedScheduleId) || clickedScheduleId < 0) return;

      onSelectionToggle?.({
        ...clickedEvent,
        scheduleId: clickedScheduleId,
        extendedProps: {
          ...clickedEvent.extendedProps,
          scheduleId: clickedScheduleId,
        },
      });
      setSelectedEvent(null);
      return;
    }

    if (readOnly) {
      const rect = clickInfo.el.getBoundingClientRect();
      const isMobile = window.innerWidth <= 768;
      setCardPosition({
        x: isMobile ? clickInfo.jsEvent.clientX : rect.right + 10,
        y: isMobile ? clickInfo.jsEvent.clientY : rect.top,
      });
      setSelectedEvent(clickedEvent);
      return;
    }

    setSelectedDate(null);
    setSelectedEndDate(null);
    setSelectedEvent(clickedEvent);
    setIsModalOpen(true);
    setModalMode('편집');
  };

  const renderEventContent = (eventInfo: EventContentArg) => {
    if (eventInfo.event.classNames.includes('skeleton-event')) {
      return <div style={{ width: '100%', height: '100%' }} />;
    }
    return (
      <>
        <S.EventContentWrapper>
          <FaFlag size={12} style={{flexShrink: 0}}/>
          <S.EventLabel>{eventInfo.event.title}</S.EventLabel>
        </S.EventContentWrapper>
        <S.MobileEventDot
          aria-label={eventInfo.event.title}
          $color={
            eventInfo.event.backgroundColor ||
            String(eventInfo.event.extendedProps?.color ?? '#FFD000')
          }
        />
      </>
    );
  };

  const calendarEvents = (isLoading ? skeletonEvents : eventsInfo).map((event) => {
    const scheduleId = event.scheduleId ?? event.extendedProps?.scheduleId;
    const isSelected = !isLoading && typeof scheduleId === 'number' && selectedScheduleIds.includes(scheduleId);
    const classNames = [...(Array.isArray(event.classNames) ? event.classNames : [])];

    if (isSelected) {
      classNames.push('club-report-selected-event');
    }

    if (isMultiDayEvent(event)) {
      classNames.push('calendar-mobile-range-event');
    }

    return {
      ...event,
      classNames,
    };
  }) as EventInput[];

  const mobileSelectedEvents = calendarEvents.filter((event) => {
    if (!event.start || String(event.id).startsWith('skeleton-')) return false;
    const selectedDateKey = getLocalDateString(mobileSelectedDate);
    const eventStartKey = getEventDateKey(event.start);

    if (!event.end) return eventStartKey === selectedDateKey;

    // FullCalendar의 end는 exclusive이므로 종료 날짜 당일은 포함하지 않습니다.
    const eventEndKey = getEventDateKey(event.end);
    return eventStartKey <= selectedDateKey && selectedDateKey < eventEndKey;
  });

  const handleMobileDateClick = (info: CalendarDateClickInfo) => {
    setMobileSelectedDate(info.date);
  };

  const handleMobileEventSelect = (event: EventInput) => {
    if (isSelectionMode) {
      onSelectionToggle?.(event);
      return;
    }
    setSelectedEvent(event);
    if (readOnly) {
      setCardPosition({ x: window.innerWidth / 2, y: 120 });
      return;
    }
    setSelectedDate(null);
    setSelectedEndDate(null);
    setIsModalOpen(true);
    setModalMode('편집');
  };

  return (
    <>
      <S.SkeletonStyle />
      <S.CalendarWrapper ref={calendarWrapperRef}>
        {error && <p role="alert">{error}</p>}
        <FullCalendar
          ref={fullCalendarRef}
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          headerToolbar={
            showHeaderToolbar
              ? {
                  left: '',
                  center: 'prev title next',
                  right: readOnly || isMobileCalendar ? '' : 'createSchedule'
                }
              : false
          }
          customButtons={{
            createSchedule: {
              text: '일정 생성',
              click: handleCreateScheduleClick,
            },
          }}
          initialDate={initialDate}
          events={calendarEvents}
          editable={false}
          selectable={!readOnly && !isMobileCalendar}
          selectMirror={true}
          dayMaxEvents={!isMobileCalendar}
          weekends={true}
          select={handleDateSelect}
          dateClick={isMobileCalendar ? handleMobileDateClick : undefined}
          dayCellClassNames={(info) => {
            if (!isMobileCalendar) return [];
            return info.date.toDateString() === mobileSelectedDate.toDateString()
              ? ['mobile-selected-day']
              : [];
          }}
          eventClick={handleEventClick}
          eventContent={renderEventContent}
          locale={koLocale}
          fixedWeekCount={false}
          eventOrder={(a: unknown, b: unknown) => {
            const eventA = a as { start?: Date; end?: Date };
            const eventB = b as { start?: Date; end?: Date };

            const aStart = eventA.start ? new Date(eventA.start).getTime() : 0;
            const aEnd = eventA.end ? new Date(eventA.end).getTime() : aStart;

            const bStart = eventB.start ? new Date(eventB.start).getTime() : 0;
            const bEnd = eventB.end ? new Date(eventB.end).getTime() : bStart;

            const aDuration = aEnd - aStart;
            const bDuration = bEnd - bStart;

            if (bDuration !== aDuration) return bDuration - aDuration;
            return aStart - bStart;
          }}
          moreLinkClick={() => {
            blockPopover.current = false;
            return 'popover';
          }}
          eventDidMount={(info) => {
            info.el.style.backgroundColor = info.event.backgroundColor || '';
            info.el.style.border = 'none';
          }}
        />
        {isMobileCalendar && (
          <S.MobileScheduleSection aria-live="polite">
            <S.MobileScheduleHeader>
              <S.MobileScheduleHeading>
                {mobileSelectedDate.toLocaleDateString('ko-KR', {
                  month: 'long',
                  day: 'numeric',
                  weekday: 'short',
                })}
              </S.MobileScheduleHeading>
              {!readOnly && (
                <S.MobileCreateButton type="button" onClick={handleCreateScheduleClick}>
                  <span aria-hidden="true">+</span> 일정 생성
                </S.MobileCreateButton>
              )}
            </S.MobileScheduleHeader>
            {mobileSelectedEvents.length === 0 ? (
              <S.MobileScheduleEmpty>등록된 일정이 없습니다.</S.MobileScheduleEmpty>
            ) : (
              <S.MobileScheduleList>
                {mobileSelectedEvents.map((event, index) => (
                  <li key={`${event.id ?? event.title}-${index}`}>
                    <S.MobileScheduleButton
                      type="button"
                      $color={String(event.backgroundColor ?? '#FFD000')}
                      onClick={() => handleMobileEventSelect(event)}
                    >
                      <span>{event.title}</span>
                    </S.MobileScheduleButton>
                  </li>
                ))}
              </S.MobileScheduleList>
            )}
          </S.MobileScheduleSection>
        )}
      </S.CalendarWrapper>

      {readOnly && !isSelectionMode && selectedEvent && (
        <EventDetailCard
          event={selectedEvent}
          position={cardPosition}
          onClose={() => setSelectedEvent(null)}
        />
      )}

      {isModalOpen && (
        <EventEditModal
          selectedDate={selectedDate}
          selectedEndDate={selectedEndDate}
          setIsModalOpen={setIsModalOpen}
          modalMode={modalMode}
          event={selectedEvent}
          setEvents={setEventsInfo}
        />
      )}
    </>
  );
};
