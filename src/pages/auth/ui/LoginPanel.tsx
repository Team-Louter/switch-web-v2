import type { LoginFormController } from '../model/useLoginForm'
import { AuthIntro } from './AuthIntro'
import { LoginForm } from './LoginForm'
import * as S from './LoginPanel.style'

interface LoginPanelProps {
  controller: LoginFormController
  heightOffset: number
}

export function LoginPanel({ controller, heightOffset }: LoginPanelProps) {
  return (
    <S.Panel $heightOffset={heightOffset}>
      <S.Content>
        <AuthIntro titleId="login-title" />
        <LoginForm controller={controller} />
      </S.Content>
    </S.Panel>
  )
}
