import { useCallback, useState } from 'react'
import type { ChangeEvent } from 'react'

import { Turnstile } from '@/features/auth'

import loginHeroImage from '../assets/images/login-hero.png'
import loginPasswordHeroImage from '../assets/images/login-password-hero.png'
import louterLogoImage from '../assets/images/louter-logo.png'
import googleLogo from '../assets/svg/google-logo.svg'
import switchLogo from '../assets/svg/switch-logo.svg'
import * as S from './AuthPage.style'

const TURNSTILE_TEST_SITE_KEY = '1x00000000000000000000AA'
const TURNSTILE_SITE_KEY = import.meta.env.DEV
  ? TURNSTILE_TEST_SITE_KEY
  : import.meta.env.VITE_TURNSTILE_SITE_KEY || ''

type LoginStep = 'email' | 'password'

export function AuthPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loginStep, setLoginStep] = useState<LoginStep>('email')
  const [turnstileToken, setTurnstileToken] = useState('')
  const isPasswordStep = loginStep === 'password'
  const isContinueDisabled = isPasswordStep
    ? !password || !turnstileToken || !TURNSTILE_SITE_KEY
    : !email.trim() || !turnstileToken || !TURNSTILE_SITE_KEY

  function handleEmailChange(event: ChangeEvent<HTMLInputElement>) {
    setEmail(event.target.value)
  }

  function handlePasswordChange(event: ChangeEvent<HTMLInputElement>) {
    setPassword(event.target.value)
  }

  function handleContinue() {
    if (!isContinueDisabled && !isPasswordStep) {
      setLoginStep('password')
    }
  }

  function handleChangeEmail() {
    setLoginStep('email')
    setPassword('')
  }

  const handleTurnstileVerify = useCallback((token: string) => {
    setTurnstileToken(token)
  }, [])

  const handleTurnstileReset = useCallback(() => {
    setTurnstileToken('')
  }, [])

  return (
    <S.Page>
      <S.Header>
        <S.BrandGroup>
          <S.SwitchLogo src={switchLogo} alt="Switch" />
          <S.CollaborationMark aria-hidden="true">X</S.CollaborationMark>
          <S.HeaderPartnerLogo src={louterLogoImage} alt="Louter" />
        </S.BrandGroup>
      </S.Header>

      <S.Content>
        <S.LoginCard
          $isPasswordStep={isPasswordStep}
          aria-labelledby="login-title"
        >
          <S.Hero $isPasswordStep={isPasswordStep}>
            <S.HeroImage
              src={loginHeroImage}
              alt={isPasswordStep ? '' : 'Louter 캐릭터들이 함께 노는 모습'}
              aria-hidden={isPasswordStep}
              $isVisible
            />
            <S.HeroImage
              src={loginPasswordHeroImage}
              alt={isPasswordStep ? 'Louter 캐릭터들이 함께 노는 모습' : ''}
              aria-hidden={!isPasswordStep}
              $isVisible={isPasswordStep}
            />
          </S.Hero>

          <S.LoginPanel $isPasswordStep={isPasswordStep}>
            <S.PanelContent>
              <S.Intro>
                <S.PartnerLogo src={louterLogoImage} alt="" />
                <S.IntroCopy>
                  <S.Title id="login-title">Louter (라우터)</S.Title>
                  <S.Subtitle>로그인 및 회원가입</S.Subtitle>
                </S.IntroCopy>
              </S.Intro>

              <S.LoginOptions>
                <S.GoogleButton type="button">
                  <S.GoogleLogo src={googleLogo} alt="" />
                  Google으로 계속하기
                </S.GoogleButton>

                <S.Divider aria-hidden="true">
                  <S.DividerLine />
                  <S.DividerText>또는</S.DividerText>
                  <S.DividerLine />
                </S.Divider>

                <S.EmailGroup>
                  {isPasswordStep ? (
                    <>
                      <S.EmailSummary>
                        <S.EmailValue>{email}</S.EmailValue>
                        <S.ChangeEmailButton
                          type="button"
                          onClick={handleChangeEmail}
                        >
                          변경
                        </S.ChangeEmailButton>
                      </S.EmailSummary>
                      <S.PasswordInput
                        type="password"
                        name="password"
                        value={password}
                        onChange={handlePasswordChange}
                        aria-label="비밀번호"
                        placeholder="비밀번호를 입력해주세요"
                        autoComplete="current-password"
                      />
                    </>
                  ) : (
                    <S.EmailInput
                      type="email"
                      name="email"
                      value={email}
                      onChange={handleEmailChange}
                      aria-label="이메일"
                      placeholder="이메일을 입력해주세요"
                      autoComplete="email"
                    />
                  )}
                  {TURNSTILE_SITE_KEY ? (
                    <Turnstile
                      key="turnstile"
                      siteKey={TURNSTILE_SITE_KEY}
                      onVerify={handleTurnstileVerify}
                      onExpire={handleTurnstileReset}
                      onError={handleTurnstileReset}
                    />
                  ) : (
                    <S.TurnstileConfigMessage role="alert">
                      보안 인증 설정이 필요합니다
                    </S.TurnstileConfigMessage>
                  )}
                </S.EmailGroup>
              </S.LoginOptions>

              <S.ActionArea>
                <S.ContinueButton
                  type="button"
                  disabled={isContinueDisabled}
                  onClick={handleContinue}
                >
                  계속
                </S.ContinueButton>
                <S.Footer>
                  <S.PolicyLinks>
                    <span>서비스 이용약관</span>
                    <span>개인정보 처리방침</span>
                  </S.PolicyLinks>
                  <S.Team>Team. Louter</S.Team>
                </S.Footer>
              </S.ActionArea>
            </S.PanelContent>
          </S.LoginPanel>
        </S.LoginCard>
      </S.Content>
    </S.Page>
  )
}
