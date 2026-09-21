import { useEffect } from 'react'
import { Navigate, useParams } from 'react-router-dom'

import {
  getClubApplicationBySlug,
  setActiveClubSlug,
} from '@/entities/club'

import { AuthPage } from '../AuthPage'

export function ClubLoginPage() {
  const { clubSlug = '' } = useParams<{ clubSlug: string }>()
  const clubProfile = getClubApplicationBySlug(clubSlug)

  useEffect(() => {
    if (!clubProfile) {
      return
    }

    try {
      setActiveClubSlug(clubProfile.slug)
    } catch {
      // 저장소를 사용할 수 없는 환경에서는 로그인 화면을 기본 테마로 표시합니다.
    }
  }, [clubProfile?.slug])

  if (!clubProfile) {
    return <Navigate to="/login" replace />
  }

  return <AuthPage clubProfile={clubProfile} />
}
