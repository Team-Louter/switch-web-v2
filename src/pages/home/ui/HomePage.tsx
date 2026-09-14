import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'

import { getAllSchedules } from '@/entities/schedule'
import type { Schedule } from '@/entities/schedule'
import { HomeCalendar, HomeSidebar } from '@/features/home'
import { HomeMemberSection } from './HomeMemberSection/HomeMemberSection'
import * as S from './HomePage.style'

const HOME_TOP_CONTENT_HEIGHT = 675

function parseScheduleId(value: string | null): number | null {
  if (!value) {
    return null
  }

  const scheduleId = Number(value)

  return Number.isSafeInteger(scheduleId) && scheduleId > 0 ? scheduleId : null
}

export function HomePage() {
  const viewport = useRef<HTMLDivElement>(null)
  const [searchParams, setSearchParams] = useSearchParams()
  const [scale, setScale] = useState(1)
  const [schedules, setSchedules] = useState<Schedule[]>([])
  const [loading, setLoading] = useState(true)
  const selectedScheduleId = parseScheduleId(searchParams.get('scheduleId'))

  useLayoutEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const handleScheduleDetailClose = useCallback(() => {
    if (!searchParams.has('scheduleId')) {
      return
    }

    const nextSearchParams = new URLSearchParams(searchParams)

    nextSearchParams.delete('scheduleId')
    setSearchParams(nextSearchParams, { replace: true })
  }, [searchParams, setSearchParams])

  useEffect(() => {
    if (!viewport.current) return
    const observer = new ResizeObserver(([entry]) => {
      setScale(Math.min(1, entry.contentRect.width / 1280))
    })
    observer.observe(viewport.current)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    let cancelled = false

    getAllSchedules()
      .then((data) => { if (!cancelled) setSchedules(data) })
      .catch(() => {})
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [])

  return (
    <S.PageContainer>
      <S.Viewport ref={viewport} style={{ height: HOME_TOP_CONTENT_HEIGHT * scale }}>
        <S.Canvas style={{ transform: `scale(${scale})` }}>
          <S.CalendarArea>
            <HomeCalendar
              schedules={schedules}
              loading={loading}
              selectedScheduleId={selectedScheduleId}
              onScheduleDetailClose={handleScheduleDetailClose}
            />
          </S.CalendarArea>
          <HomeSidebar />
        </S.Canvas>
      </S.Viewport>
      <HomeMemberSection />
      <S.Footer>
        <S.FooterText>Louter(라우터) / 대구소프트웨어마이스터고</S.FooterText>
        <S.GithubLink href="https://github.com/Team-Louter" target="_blank" rel="noopener noreferrer">
          Github
        </S.GithubLink>
      </S.Footer>
    </S.PageContainer>
  )
}
