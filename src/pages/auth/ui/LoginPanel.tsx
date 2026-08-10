import type { LoginFormController } from '../model/useLoginForm'
import { AuthIntro } from './AuthIntro'
import { LoginForm } from './LoginForm'
import * as S from './LoginPanel.style'

interface LoginPanelProps {
  controller: LoginFormController
}

export function LoginPanel({ controller }: LoginPanelProps) {
  return (
    <S.Panel $isPasswordStep={controller.isPasswordStep}>
      <S.Content>
        <AuthIntro titleId="login-title" />
        <LoginForm controller={controller} />
      </S.Content>
    </S.Panel>
  )
}
