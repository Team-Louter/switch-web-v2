import { useState } from 'react'

import { AuthHeader } from './AuthHeader'
import * as S from './AuthPage.style'
import { LoginCard } from './LoginCard'

export function AuthPage() {
  const [loginCardKey, setLoginCardKey] = useState(0)

  function handleLoginReset() {
    setLoginCardKey((currentKey) => currentKey + 1)
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
