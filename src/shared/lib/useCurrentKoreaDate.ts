import { useEffect, useState } from 'react'

import type { CalendarDate } from './studyWeek'
import { getCurrentKoreaDate, KOREA_TIME_ZONE } from './studyWeek'

const DAY_MS = 24 * 60 * 60 * 1000
/** 자정 직전에 깨어나 날짜가 그대로인 일을 막기 위한 여유 시간. */
const MIDNIGHT_BUFFER_MS = 1000

/**
 * 한국 시간 기준으로 다음 자정까지 남은 밀리초를 구한다.
 *
 * 자정까지 흐른 시간을 시/분/초로 직접 계산해 타임존 변환을 피한다.
 */
function getMsUntilKoreaMidnight() {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: KOREA_TIME_ZONE,
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    hourCycle: 'h23',
  }).formatToParts(new Date())
  const getPart = (type: Intl.DateTimeFormatPartTypes) =>
    Number(parts.find((part) => part.type === type)?.value)
  const elapsed =
    (getPart('hour') * 60 * 60 + getPart('minute') * 60 + getPart('second')) *
    1000

  return DAY_MS - elapsed + MIDNIGHT_BUFFER_MS
}

function isSameDate(a: CalendarDate, b: CalendarDate) {
  return a.year === b.year && a.month === b.month && a.day === b.day
}

/**
 * 한국 시간 기준 오늘 날짜를 반환하고 자정이 지나면 자동으로 갱신한다.
 *
 * 화면을 켜둔 채 날짜가 바뀌어도 달력의 오늘 표시나 다가오는 일정이
 * 어제 기준으로 남지 않도록 한다.
 */
export function useCurrentKoreaDate(): CalendarDate {
  const [date, setDate] = useState(getCurrentKoreaDate)

  useEffect(() => {
    let timeoutId = 0

    const sync = () => {
      // 날짜가 그대로면 이전 값을 유지해 불필요한 리렌더를 막는다.
      setDate((prev) => {
        const next = getCurrentKoreaDate()

        return isSameDate(prev, next) ? prev : next
      })

      timeoutId = window.setTimeout(sync, getMsUntilKoreaMidnight())
    }

    timeoutId = window.setTimeout(sync, getMsUntilKoreaMidnight())

    // 백그라운드 탭에서는 타이머가 밀릴 수 있어 화면으로 돌아올 때 다시 맞춘다.
    const handleVisibilityChange = () => {
      if (document.visibilityState !== 'visible') return

      window.clearTimeout(timeoutId)
      sync()
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      window.clearTimeout(timeoutId)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [])

  return date
}
