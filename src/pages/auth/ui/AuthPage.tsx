import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import { AuthHeader } from './AuthHeader'
import * as S from './AuthPage.style'
import { LoginCard } from './LoginCard'
import { SignupPage } from './SignupPage'

interface AuthViewState {
  authView: 'login' | 'signup'
  email: string
  returnPath: string
  authTransitionSessionId: string
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

export function AuthPage() {
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
        authTransitionSessionId,
      },
    })
  }

  if (authViewState.authView === 'signup') {
    return (
      <SignupPage
        initialEmail={authViewState.email}
        onChangeEmail={handleChangeSignupEmail}
        shouldAnimate={shouldAnimateAuthTransition}
      />
    )
  }

  return (
    <S.Page>
      <AuthHeader onSwitchClick={handleLoginReset} />
      <S.Content>
        <LoginCard
          key={loginCardKey}
          initialEmail={authViewState.email}
          returnPath={authViewState.returnPath}
          startsFromSignup={shouldAnimateAuthTransition}
          authTransitionSessionId={authTransitionSessionId}
        />
      </S.Content>
    </S.Page>
  )
}
