import { AuthHeader } from './AuthHeader'
import * as S from './AuthPage.style'
import { LoginCard } from './LoginCard'

export function AuthPage() {
  return (
    <S.Page>
      <AuthHeader />
      <S.Content>
        <LoginCard />
      </S.Content>
    </S.Page>
  )
}
