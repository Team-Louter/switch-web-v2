import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

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
}: AuthPageProps) {
  const location = useLocation()
  const navigate = useNavigate()
  const [loginCardKey, setLoginCardKey] = useState(0)
  const [authTransitionSessionId] = useState(() => crypto.randomUUID())
  const authViewState = getAuthViewState(location.state)
  const shouldAnimateAuthTransition =
    authViewState.authTransitionSessionId === authTransitionSessionId

  function handleLoginReset() {
    setLoginCardKey((currentKey) => currentKey + 1)
  }

  function handleChangeSignupEmail(email: string) {
    navigate('/login', {
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
        />
      </S.Content>
    </S.Page>
  )
}
