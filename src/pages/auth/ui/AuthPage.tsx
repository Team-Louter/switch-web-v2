import { useState } from 'react'
import { useLocation } from 'react-router-dom'

import { AuthHeader } from './AuthHeader'
import * as S from './AuthPage.style'
import { LoginCard } from './LoginCard'
import { SignupPage } from './SignupPage'

function isSignupView(locationState: unknown): boolean {
  return (
    typeof locationState === 'object' &&
    locationState !== null &&
    'authView' in locationState &&
    locationState.authView === 'signup'
  )
}

export function AuthPage() {
  const location = useLocation()
  const [loginCardKey, setLoginCardKey] = useState(0)

  function handleLoginReset() {
    setLoginCardKey((currentKey) => currentKey + 1)
  }

  if (isSignupView(location.state)) {
    return <SignupPage />
  }

  return (
    <S.Page>
      <AuthHeader onSwitchClick={handleLoginReset} />
      <S.Content>
        <LoginCard key={loginCardKey} />
      </S.Content>
    </S.Page>
  )
}
