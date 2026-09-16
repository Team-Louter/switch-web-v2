import { useNavigate } from 'react-router-dom'

import {
  clearAccessToken,
  clearPendingAccessToken,
} from '@/shared/lib/authToken'

import authLogo from './assets/v1-auth-logo.svg'
import * as S from './WithdrawCompletePage.style'

export function WithdrawCompletePage() {
  const navigate = useNavigate()

  const handleLoginClick = () => {
    clearAccessToken()
    clearPendingAccessToken()
    navigate('/login', { replace: true })
  }

  const handleSignupClick = () => {
    clearAccessToken()
    clearPendingAccessToken()
    navigate('/login', {
      replace: true,
      state: {
        authView: 'signup',
      },
    })
  }

  return (
    <S.Page>
      <S.Logo src={authLogo} alt="Louter" />
      <S.Title>
        <strong>회원 탈퇴</strong>
        <span>가 </span>
        <strong>완료</strong>
        <span>되었습니다</span>
      </S.Title>
      <S.Description>그동안 함께해 주셔서 감사합니다</S.Description>
      <S.ButtonRow>
        <S.LoginButton type="button" onClick={handleLoginClick}>
          로그인
        </S.LoginButton>
        <S.SignupButton type="button" onClick={handleSignupClick}>
          회원가입
        </S.SignupButton>
      </S.ButtonRow>
      <S.Footer>
        <S.FooterLouter>
          Louter(라우터)&nbsp;&nbsp;&nbsp;대구소프트웨어마이스터고등학교
        </S.FooterLouter>
        <S.FooterGithub
          href="https://github.com/Team-Louter"
          target="_blank"
          rel="noreferrer"
        >
          Github
        </S.FooterGithub>
      </S.Footer>
    </S.Page>
  )
}
