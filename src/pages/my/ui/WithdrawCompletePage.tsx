import { useNavigate } from 'react-router-dom'

import switchLogo from '@/shared/assets/sidebar/switch-logo.svg'
import {
  clearAccessToken,
  clearPendingAccessToken,
} from '@/shared/lib/authToken'
import { Button } from '@/shared/ui'

import * as S from './WithdrawCompletePage.style'

export function WithdrawCompletePage() {
  const navigate = useNavigate()

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
      <S.Header>
        <S.HeaderLogo src={switchLogo} alt="Switch" />
      </S.Header>
      <S.Body>
        <S.Logo src={switchLogo} alt="Switch" />
        <S.Title>회원 탈퇴가 완료되었습니다</S.Title>
        <S.ButtonWrap>
          <Button onClick={handleSignupClick}>회원가입 하러 가기</Button>
        </S.ButtonWrap>
      </S.Body>
    </S.Page>
  )
}
