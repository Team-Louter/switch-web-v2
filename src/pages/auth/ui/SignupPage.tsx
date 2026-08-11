import { useState } from 'react'
import type { AnimationEvent } from 'react'

import { Turnstile } from '@/features/auth'

import authHeroImage from '../assets/images/auth-hero.jpg'
import { useSignupForm } from '../model/useSignupForm'
import { AuthHeader } from './AuthHeader'
import { AuthIntro } from './AuthIntro'
import { EmailVerificationModal } from './EmailVerificationModal'
import * as S from './SignupPage.style'

interface SignupPageProps {
  initialEmail: string
  onChangeEmail: (email: string) => void
  onSignupComplete: (email: string) => void
  shouldAnimate?: boolean
}

export function SignupPage({
  initialEmail,
  onChangeEmail,
  onSignupComplete,
  shouldAnimate = false,
}: SignupPageProps) {
  const [isReturningToLogin, setIsReturningToLogin] = useState(false)
  const controller = useSignupForm(initialEmail, onSignupComplete)
  const {
    values,
    verificationCode,
    isContinueDisabled,
    isSendingVerificationCode,
    isVerificationOpen,
    isVerificationSubmitting,
    isResendingVerificationCode,
    verificationErrorMessage,
    verificationStatusMessage,
    turnstileSiteKey,
    turnstileKey,
    handleInputChange,
    handleContinue,
    handleVerificationCodeChange,
    handleVerificationSubmit,
    handleResendVerificationCode,
    handleTurnstileVerify,
    handleTurnstileReset,
  } = controller

  function handleChangeEmail() {
    if (isReturningToLogin) {
      return
    }

    if (
      window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
      window.matchMedia('(max-width: 420px)').matches
    ) {
      onChangeEmail(values.email)
      return
    }

    setIsReturningToLogin(true)
  }

  function handleCardAnimationEnd(event: AnimationEvent<HTMLElement>) {
    if (!isReturningToLogin || event.target !== event.currentTarget) {
      return
    }

    onChangeEmail(values.email)
  }

  return (
    <S.Page
      $shouldAnimate={shouldAnimate}
      $isReturningToLogin={isReturningToLogin}
      data-returning-to-login={isReturningToLogin}
    >
      <AuthHeader />
      <S.Content>
        <S.Card
          aria-labelledby="signup-title"
          onAnimationEnd={handleCardAnimationEnd}
        >
          <S.Hero>
            <S.HeroImage
              src={authHeroImage}
              alt="Louter 캐릭터들이 함께 뛰어노는 모습"
            />
          </S.Hero>

          <S.Panel>
            <S.PanelContent>
              <AuthIntro titleId="signup-title" />

              <S.FormOptions>
                <S.Divider aria-hidden="true" />
                <S.Fields>
                  <S.EmailField>
                    <S.SignupEmailInput
                      type="email"
                      name="email"
                      value={values.email}
                      aria-label="이메일"
                      autoComplete="email"
                      readOnly
                    />
                    <S.ChangeEmailButton
                      type="button"
                      $isVisible
                      onClick={handleChangeEmail}
                      disabled={
                        isReturningToLogin || isSendingVerificationCode
                      }
                    >
                      변경
                    </S.ChangeEmailButton>
                  </S.EmailField>

                  <S.AdditionalFields>
                    <S.Input
                      type="text"
                      name="studentNumber"
                      value={values.studentNumber}
                      onChange={handleInputChange}
                      aria-label="학번"
                      placeholder="학번"
                      inputMode="numeric"
                      autoComplete="off"
                    />
                    <S.Input
                      type="text"
                      name="name"
                      value={values.name}
                      onChange={handleInputChange}
                      aria-label="이름"
                      placeholder="이름"
                      autoComplete="name"
                    />
                    <S.Input
                      type="password"
                      name="password"
                      value={values.password}
                      onChange={handleInputChange}
                      aria-label="비밀번호"
                      placeholder="비밀번호"
                      autoComplete="new-password"
                    />
                    <S.Input
                      type="password"
                      name="passwordConfirmation"
                      value={values.passwordConfirmation}
                      onChange={handleInputChange}
                      aria-label="비밀번호 확인"
                      placeholder="비밀번호 확인"
                      autoComplete="new-password"
                    />
                    <S.Input
                      type="text"
                      name="clubCode"
                      value={values.clubCode}
                      onChange={handleInputChange}
                      aria-label="동아리 코드"
                      placeholder="동아리 코드"
                      autoComplete="off"
                    />

                    {turnstileSiteKey ? (
                      <Turnstile
                        key={turnstileKey}
                        siteKey={turnstileSiteKey}
                        onVerify={handleTurnstileVerify}
                        onExpire={handleTurnstileReset}
                        onError={handleTurnstileReset}
                      />
                    ) : (
                      <S.TurnstileConfigMessage role="alert">
                        보안 인증 설정이 필요합니다
                      </S.TurnstileConfigMessage>
                    )}
                  </S.AdditionalFields>
                </S.Fields>
              </S.FormOptions>

              <S.ActionArea>
                <S.ContinueButton
                  type="button"
                  onClick={() => void handleContinue()}
                  disabled={isContinueDisabled}
                  aria-busy={isSendingVerificationCode}
                >
                  {isSendingVerificationCode ? '전송 중' : '계속'}
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
          </S.Panel>
        </S.Card>
      </S.Content>

      {isVerificationOpen && (
        <EmailVerificationModal
          code={verificationCode}
          errorMessage={verificationErrorMessage}
          statusMessage={verificationStatusMessage}
          isSubmitting={isVerificationSubmitting}
          isResending={isResendingVerificationCode}
          onChangeCode={handleVerificationCodeChange}
          onResend={handleResendVerificationCode}
          onSubmit={handleVerificationSubmit}
        />
      )}
    </S.Page>
  )
}
