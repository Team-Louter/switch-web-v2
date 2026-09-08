import { useEffect, useRef, useState } from 'react'
import { getAllSchedules } from '@/entities/schedule'
import type { Schedule } from '@/entities/schedule'
import { HomeCalendar, HomeSidebar } from '@/features/home'
import { HomeMemberSection } from './HomeMemberSection/HomeMemberSection'
import * as S from './HomePage.style'

const HOME_TOP_CONTENT_HEIGHT = 675

export function HomePage() {
  const viewport = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(1)
  const [schedules, setSchedules] = useState<Schedule[]>([])
  const [loading, setLoading] = useState(true)

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
          <S.CalendarArea><HomeCalendar schedules={schedules} loading={loading} /></S.CalendarArea>
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
