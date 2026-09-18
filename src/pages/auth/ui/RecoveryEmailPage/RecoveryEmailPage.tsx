import { useEffect, useRef } from 'react'
import type { ChangeEvent, FormEvent } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import { useUserStore } from '@/entities/profile'
import { Turnstile } from '@/features/auth'
import {
  clearAccessToken,
  clearPendingAccessToken,
  getPendingAccessToken,
  getPendingAccessTokenFlow,
  promotePendingAccessToken,
} from '@/shared/lib/authToken'

import authHeroImage from '../../assets/images/auth-hero.jpg'
import { useRecoveryEmailForm } from '../../model/useRecoveryEmailForm'
import { AuthHeader } from '../AuthHeader'
import * as S from './RecoveryEmailPage.style'

export function RecoveryEmailPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const codeInputRef = useRef<HTMLInputElement>(null)
  const returnPath = getSafeReturnPath(location.state)

  async function handleRecoveryEmailComplete() {
    const profile = await useUserStore.getState().fetchUser()

    if (profile.recoveryEmail == null) {
      throw new Error('복구 이메일 등록 결과를 확인하지 못했습니다.')
    }

    if (!promotePendingAccessToken()) {
      throw new Error('로그인 토큰을 활성화하지 못했습니다.')
    }

    navigate(returnPath, { replace: true })
  }

  const controller = useRecoveryEmailForm(handleRecoveryEmailComplete)
  const {
    email,
    verificationCode,
    step,
    errorMessage,
    isSendingCode,
    isVerifyingCode,
    isResendingCode,
    isEmailSubmitDisabled,
    isVerificationSubmitDisabled,
    isResendDisabled,
    turnstileSiteKey,
    turnstileKey,
    resendTurnstileKey,
    handleEmailChange,
    handleVerificationCodeChange,
    handleSendCode,
    handleVerifyCode,
    handleResendCode,
    handleChangeEmail,
    handleTurnstileVerify,
    handleTurnstileReset,
    handleResendTurnstileVerify,
    handleResendTurnstileReset,
  } = controller

  const isVerificationStep = step === 'verification'
  const isBusy = isSendingCode || isVerifyingCode || isResendingCode

  useEffect(() => {
    const hasRecoveryFlow =
      Boolean(getPendingAccessToken()) &&
      getPendingAccessTokenFlow() === 'recovery-email'

    if (!hasRecoveryFlow) {
      navigate('/login', { replace: true })
    }
  }, [navigate])

  useEffect(() => {
    if (isVerificationStep) {
      codeInputRef.current?.focus()
    }
  }, [isVerificationStep])

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (isVerificationStep) {
      void handleVerifyCode()
      return
    }

    void handleSendCode()
  }

  function handleCodeInputChange(event: ChangeEvent<HTMLInputElement>) {
    handleVerificationCodeChange(event.currentTarget.value)
  }

  function handleLogout() {
    clearAccessToken()
    clearPendingAccessToken()
    useUserStore.getState().resetUser()
    navigate('/login', { replace: true })
  }

  return (
    <S.Page>
      <AuthHeader onSwitchClick={handleLogout} />
      <S.Content>
        <S.Card aria-labelledby="recovery-email-title">
          <S.Hero>
            <S.HeroImage
              src={authHeroImage}
              alt="Louter 캐릭터들이 함께 뛰어노는 모습"
            />
          </S.Hero>

          <S.Panel>
            <S.PanelContent>
              <S.Title id="recovery-email-title">복구 이메일 등록</S.Title>
              <S.Description>
                계정 복구를 위해 개인 이메일을 등록해주세요.
              </S.Description>

              <S.Form onSubmit={handleSubmit} noValidate>
                {!isVerificationStep ? (
                  <S.Fields>
                    <S.Input
                      type="email"
                      name="recoveryEmail"
                      value={email}
                      onChange={handleEmailChange}
                      aria-label="복구 이메일"
                      placeholder="복구 이메일을 입력해주세요"
                      autoComplete="email"
                      disabled={isBusy}
                      autoFocus
                    />

                    {turnstileSiteKey ? (
                      <Turnstile
                        key={turnstileKey}
                        siteKey={turnstileSiteKey}
                        action="email_verification"
                        onVerify={handleTurnstileVerify}
                        onExpire={handleTurnstileReset}
                        onError={handleTurnstileReset}
                      />
                    ) : (
                      <S.TurnstileConfigMessage role="alert">
                        보안 인증 설정이 필요합니다
                      </S.TurnstileConfigMessage>
                    )}
                  </S.Fields>
                ) : (
                  <S.Fields>
                    <S.EmailSummary>
                      <S.EmailSummaryText>{email}</S.EmailSummaryText>
                      <S.ChangeEmailButton
                        type="button"
                        onClick={handleChangeEmail}
                        disabled={isBusy}
                      >
                        변경
                      </S.ChangeEmailButton>
                    </S.EmailSummary>

                    <S.CodeField
                      onClick={() => codeInputRef.current?.focus()}
                    >
                      {Array.from({ length: 6 }).map((_, index) => {
                        const digit = verificationCode[index] ?? ''

                        return (
                          <S.DigitBox
                            key={index}
                            $isFilled={Boolean(digit)}
                            $isActive={index === verificationCode.length}
                            aria-hidden="true"
                          >
                            {digit}
                          </S.DigitBox>
                        )
                      })}
                      <S.CodeInput
                        ref={codeInputRef}
                        type="text"
                        value={verificationCode}
                        onChange={handleCodeInputChange}
                        aria-label="복구 이메일 인증번호 6자리"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        autoComplete="one-time-code"
                        maxLength={6}
                        disabled={isBusy}
                      />
                    </S.CodeField>

                    <S.ResendButton
                      type="button"
                      onClick={() => void handleResendCode()}
                      disabled={isResendDisabled}
                    >
                      {isResendingCode
                        ? '인증번호 전송 중'
                        : '인증번호 재전송'}
                    </S.ResendButton>

                    {turnstileSiteKey ? (
                      <Turnstile
                        key={resendTurnstileKey}
                        siteKey={turnstileSiteKey}
                        action="email_verification"
                        onVerify={handleResendTurnstileVerify}
                        onExpire={handleResendTurnstileReset}
                        onError={handleResendTurnstileReset}
                      />
                    ) : (
                      <S.TurnstileConfigMessage role="alert">
                        보안 인증 설정이 필요합니다
                      </S.TurnstileConfigMessage>
                    )}
                  </S.Fields>
                )}

                {errorMessage && (
                  <S.ErrorMessage role="alert">{errorMessage}</S.ErrorMessage>
                )}

                <S.ContinueButton
                  type="submit"
                  disabled={
                    isVerificationStep
                      ? isVerificationSubmitDisabled
                      : isEmailSubmitDisabled
                  }
                  aria-busy={isBusy}
                >
                  <S.ButtonContent>
                    {isBusy && <S.LoadingSpinner aria-hidden="true" />}
                    <span>
                      {isVerificationStep ? '복구 이메일 등록' : '인증번호 전송'}
                    </span>
                  </S.ButtonContent>
                </S.ContinueButton>
              </S.Form>

              <S.Footer>
                <S.PolicyLinks>
                  <span>서비스 이용약관</span>
                  <span>개인정보 처리방침</span>
                </S.PolicyLinks>
                <S.Team>Team. Louter</S.Team>
              </S.Footer>
            </S.PanelContent>
          </S.Panel>
        </S.Card>
      </S.Content>
    </S.Page>
  )
}

function getSafeReturnPath(locationState: unknown): string {
  if (
    typeof locationState !== 'object' ||
    locationState === null ||
    !('from' in locationState) ||
    typeof locationState.from !== 'string'
  ) {
    return '/home'
  }

  const returnPath = locationState.from

  return (
    returnPath.startsWith('/') &&
    !returnPath.startsWith('//') &&
    !/^\/(?:login|signup|extra-signup|recovery-email|oauth\/callback|main|my\/withdraw-complete)(?:[/?#]|$)/.test(
      returnPath,
    )
  )
    ? returnPath
    : '/home'
}
