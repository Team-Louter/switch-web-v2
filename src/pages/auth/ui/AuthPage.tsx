import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import { AuthHeader } from './AuthHeader'
import * as S from './AuthPage.style'
import { LoginCard } from './LoginCard'
import { SignupPage } from './SignupPage'

interface AuthViewState {
  authView: 'login' | 'signup'
  email: string
  startsFromSignup: boolean
}

function getAuthViewState(locationState: unknown): AuthViewState {
  if (typeof locationState !== 'object' || locationState === null) {
    return { authView: 'login', email: '', startsFromSignup: false }
  }

  const authView =
    'authView' in locationState && locationState.authView === 'signup'
      ? 'signup'
      : 'login'
  const email =
    'email' in locationState && typeof locationState.email === 'string'
      ? locationState.email
      : ''
  const startsFromSignup =
    'startsFromSignup' in locationState &&
    locationState.startsFromSignup === true

  return { authView, email, startsFromSignup }
}

export function AuthPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const [loginCardKey, setLoginCardKey] = useState(0)
  const authViewState = getAuthViewState(location.state)

  function handleLoginReset() {
    setLoginCardKey((currentKey) => currentKey + 1)
  }

  function handleChangeSignupEmail(email: string) {
    navigate('/login', {
      replace: true,
      state: { authView: 'login', email, startsFromSignup: true },
      viewTransition: true,
    })
  }

  if (authViewState.authView === 'signup') {
    return (
      <SignupPage
        initialEmail={authViewState.email}
        onChangeEmail={handleChangeSignupEmail}
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
          startsFromSignup={authViewState.startsFromSignup}
        />
      </S.Content>
    </S.Page>
  )
}
