import { useState } from 'react'
import { toast } from 'react-toastify'
import { useLocation, useNavigate } from 'react-router-dom'

import type { ClubApplication, ClubApplicationInput } from '@/entities/club'
import {
  createClubApplication,
  InvalidClubSlugError,
} from '@/features/club-create'

import { AuthHeader } from '../AuthHeader'
import { LoginCard } from '../LoginCard'
import { SignupPage } from '../SignupPage'
import * as S from './AuthPage.style'

interface AuthViewState {
  authView: 'login' | 'signup'
  email: string
  returnPath: string
  authTransitionSessionId: string
}

interface AuthPageProps {
  hideHeroImage?: boolean
  useSwitchLogo?: boolean
  requiresTurnstile?: boolean
  title?: string
  subtitle?: string
  isClubCreation?: boolean
  clubProfile?: ClubApplication
}

function getAuthViewState(locationState: unknown): AuthViewState {
  if (typeof locationState !== 'object' || locationState === null) {
    return {
      authView: 'login',
      email: '',
      returnPath: '/home',
      authTransitionSessionId: '',
    }
  }

  const authView =
    'authView' in locationState && locationState.authView === 'signup'
      ? 'signup'
      : 'login'
  const email =
    'email' in locationState && typeof locationState.email === 'string'
      ? locationState.email
      : ''
  const authTransitionSessionId =
    'authTransitionSessionId' in locationState &&
    typeof locationState.authTransitionSessionId === 'string'
      ? locationState.authTransitionSessionId
      : ''
  const requestedReturnPath =
    'from' in locationState && typeof locationState.from === 'string'
      ? locationState.from
      : ''
  const returnPath = isSafeReturnPath(requestedReturnPath)
    ? requestedReturnPath
    : '/home'

  return { authView, email, returnPath, authTransitionSessionId }
}

function isSafeReturnPath(returnPath: string): boolean {
  return (
    returnPath.startsWith('/') &&
    !returnPath.startsWith('//') &&
    !/^\/(?:login|signup)(?:[/?#]|$)/.test(returnPath)
  )
}

export function AuthPage({
  hideHeroImage = false,
  useSwitchLogo = false,
  requiresTurnstile = true,
  title,
  subtitle,
  isClubCreation = false,
  clubProfile,
}: AuthPageProps) {
  const location = useLocation()
  const navigate = useNavigate()
  const [loginCardKey, setLoginCardKey] = useState(0)
  const [clubLogoPreview, setClubLogoPreview] = useState('')
  const [representativeImagePreview, setRepresentativeImagePreview] =
    useState('')
  const [authTransitionSessionId] = useState(() => crypto.randomUUID())
  const authViewState = getAuthViewState(location.state)
  const shouldAnimateAuthTransition =
    authViewState.authTransitionSessionId === authTransitionSessionId
  const authPath = clubProfile ? `/${clubProfile.slug}/login` : '/login'

  function handleLoginReset() {
    setLoginCardKey((currentKey) => currentKey + 1)
  }

  function handleClubCreateSubmit(values: ClubApplicationInput) {
    try {
      const application = createClubApplication(values)
      navigate(`/${application.slug}/login`, { replace: true })
    } catch (error) {
      if (error instanceof InvalidClubSlugError) {
        toast.error(error.message)
        return
      }

      toast.error(
        error instanceof Error
          ? error.message
          : '동아리 신청 내용을 저장하지 못했습니다.',
      )
    }
  }

  function handleChangeSignupEmail(email: string) {
    navigate(authPath, {
      replace: true,
      state: {
        authView: 'login',
        email,
        from: authViewState.returnPath,
      },
    })
  }

  if (authViewState.authView === 'signup') {
    return (
      <SignupPage
        initialEmail={authViewState.email}
        onChangeEmail={handleChangeSignupEmail}
        onSignupComplete={handleChangeSignupEmail}
        shouldAnimate={shouldAnimateAuthTransition}
      />
    )
  }

  return (
    <S.Page>
      <AuthHeader
        onSwitchClick={handleLoginReset}
        isClubCreation={isClubCreation}
        clubLogoPreview={clubLogoPreview}
      />
      <S.Content>
        <LoginCard
          key={loginCardKey}
          initialEmail={authViewState.email}
          returnPath={authViewState.returnPath}
          authTransitionSessionId={authTransitionSessionId}
          hideHeroImage={hideHeroImage}
          useSwitchLogo={useSwitchLogo}
          requiresTurnstile={requiresTurnstile}
          title={title}
          subtitle={subtitle}
          isClubCreation={isClubCreation}
          onClubCreateSubmit={
            isClubCreation ? handleClubCreateSubmit : undefined
          }
          representativeImagePreview={representativeImagePreview}
          onClubLogoPreviewChange={setClubLogoPreview}
          onRepresentativeImagePreviewChange={setRepresentativeImagePreview}
        />
      </S.Content>
    </S.Page>
  )
}
