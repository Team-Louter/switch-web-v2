import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

import { useUserStore } from '@/entities/profile'
import { getActiveClubSlug, getClubApplicationBySlug } from '@/entities/club'
import { getAllSchedules } from '@/entities/schedule'
import type { Schedule } from '@/entities/schedule'
import { RecoveryEmailModal } from '@/features/auth'
import { HomeCalendar, HomeSidebar } from '@/features/home'
import {
  clearAccessToken,
  clearPendingAccessToken,
  getPendingAccessToken,
  getPendingAccessTokenFlow,
  promotePendingAccessToken,
} from '@/shared/lib/authToken'

import { HomeMemberSection } from './HomeMemberSection/HomeMemberSection'
import * as S from './HomePage.style'

const HOME_TOP_CONTENT_HEIGHT = 675
const DEFAULT_CLUB_INSTITUTION = '대구소프트웨어마이스터고등학교'

function parseScheduleId(value: string | null): number | null {
  if (!value) {
    return null
  }

  const scheduleId = Number(value)

  return Number.isSafeInteger(scheduleId) && scheduleId > 0 ? scheduleId : null
}

export function HomePage() {
  const navigate = useNavigate()
  const viewport = useRef<HTMLDivElement>(null)
  const [searchParams, setSearchParams] = useSearchParams()
  const [scale, setScale] = useState(1)
  const [schedules, setSchedules] = useState<Schedule[]>([])
  const [loading, setLoading] = useState(true)
  const activeClubSlug = getActiveClubSlug()
  const activeClub = activeClubSlug
    ? getClubApplicationBySlug(activeClubSlug)
    : null
  const clubEnglishName = activeClub?.englishName ?? 'Louter'
  const clubDisplayName = activeClub
    ? `${activeClub.englishName}(${activeClub.koreanName})`
    : 'Louter(라우터)'
  const clubGithubUrl = activeClub?.clubOlga || 'https://github.com/Team-Louter'
  const [isRecoveryEmailModalOpen, setIsRecoveryEmailModalOpen] = useState(
    () =>
      Boolean(getPendingAccessToken()) &&
      getPendingAccessTokenFlow() === 'recovery-email',
  )
  const selectedScheduleId = parseScheduleId(searchParams.get('scheduleId'))

  async function handleRecoveryEmailComplete() {
    const profile = await useUserStore.getState().fetchUser()

    if (profile.recoveryEmail == null) {
      throw new Error('복구 이메일 등록 결과를 확인하지 못했습니다.')
    }

    if (!promotePendingAccessToken()) {
      throw new Error('로그인 토큰을 활성화하지 못했습니다.')
    }

    setIsRecoveryEmailModalOpen(false)
  }

  function handleRecoveryEmailLogout() {
    clearAccessToken()
    clearPendingAccessToken()
    useUserStore.getState().resetUser()
    navigate('/login', { replace: true })
  }

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
      <HomeMemberSection clubEnglishName={clubEnglishName} />
      <S.Footer>
        <S.FooterText>{clubDisplayName} / {DEFAULT_CLUB_INSTITUTION}</S.FooterText>
        <S.GithubLink href={clubGithubUrl} target="_blank" rel="noopener noreferrer">
          Github
        </S.GithubLink>
      </S.Footer>

      {isRecoveryEmailModalOpen && (
        <RecoveryEmailModal
          onComplete={handleRecoveryEmailComplete}
          onLogout={handleRecoveryEmailLogout}
        />
      )}
    </S.PageContainer>
  )
}
