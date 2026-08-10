import louterLogoImage from '../assets/images/louter-logo.png'
import type { LoginFormController } from '../model/useLoginForm'
import { LoginForm } from './LoginForm'
import * as S from './LoginPanel.style'

interface LoginPanelProps {
  controller: LoginFormController
}

export function LoginPanel({ controller }: LoginPanelProps) {
  return (
    <S.Panel $isPasswordStep={controller.isPasswordStep}>
      <S.Content>
        <S.Intro>
          <S.PartnerLogo src={louterLogoImage} alt="" />
          <S.IntroCopy>
            <S.Title id="login-title">Louter (라우터)</S.Title>
            <S.Subtitle>로그인 및 회원가입</S.Subtitle>
          </S.IntroCopy>
        </S.Intro>

        <LoginForm controller={controller} />
      </S.Content>
    </S.Panel>
  )
}
