import { useEffect, useRef, useState } from 'react'
import type { ChangeEvent, FormEvent } from 'react'

import fireworksImage from '../../assets/party-popper.png'
import {
  SCHOOL_EMAIL_ERROR_MESSAGE,
  useRecoveryEmailForm,
} from '../../model/useRecoveryEmailForm'
import { Turnstile } from '../Turnstile/Turnstile'
import * as S from './RecoveryEmailModal.style'

interface RecoveryEmailModalProps {
  onComplete: () => Promise<void>
  onLogout: () => void
}

export function RecoveryEmailModal({
  onComplete,
  onLogout,
}: RecoveryEmailModalProps) {
  const codeInputRef = useRef<HTMLInputElement>(null)
  const controller = useRecoveryEmailForm(onComplete)
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
  const isSchoolEmailError =
    errorMessage === SCHOOL_EMAIL_ERROR_MESSAGE

  useEffect(() => {
    const previousOverflow = document.body.style.overflow

    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [])

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

  return (
    <S.Overlay>
      <S.Dialog
        $isVerificationStep={isVerificationStep}
        role="dialog"
        aria-modal="true"
        aria-labelledby="recovery-email-title"
        aria-describedby="recovery-email-description"
        aria-busy={isBusy}
      >
        <S.Form onSubmit={handleSubmit} noValidate>
          {isVerificationStep ? (
            <>
              <S.Title id="recovery-email-title">인증번호를 입력하세요</S.Title>
              <S.Description id="recovery-email-description">
                {email}으로 전송된 6자리 인증번호를 입력해주세요.
              </S.Description>

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

              <S.CodeField onClick={() => codeInputRef.current?.focus()}>
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
                {isResendingCode ? '인증번호 전송 중' : '인증번호 재전송'}
              </S.ResendButton>

              {!turnstileSiteKey && (
                <S.TurnstileConfigMessage role="alert">
                  보안 인증 설정이 필요합니다
                </S.TurnstileConfigMessage>
              )}

              {errorMessage && (
                <S.ErrorMessage role="alert">{errorMessage}</S.ErrorMessage>
              )}

              <S.PrimaryButton
                type="submit"
                disabled={isVerificationSubmitDisabled}
                aria-busy={isBusy}
              >
                {isVerifyingCode ? '등록 중...' : '복구 이메일 등록'}
              </S.PrimaryButton>
            </>
          ) : (
            <>
              <S.CelebrationHeader>
                <S.FireworksImage
                  src={fireworksImage}
                  alt=""
                  aria-hidden="true"
                />
                <S.CelebrationMessage>
                  3학년이 되신 것을 축하합니다!
                </S.CelebrationMessage>
                <S.Title id="recovery-email-title">복구 이메일 등록</S.Title>
              </S.CelebrationHeader>
              <S.EmailStepContent>
                <S.Description id="recovery-email-description">
                  졸업을 대비하여 개인 이메일을 등록해주세요.
                </S.Description>

                <S.EmailInput
                  type="email"
                  name="recoveryEmail"
                  value={email}
                  onChange={handleEmailChange}
                  aria-label="개인 이메일"
                  placeholder="개인 이메일을 입력해주세요"
                  autoComplete="email"
                  autoFocus
                  disabled={isBusy}
                />

                {!turnstileSiteKey && (
                  <S.TurnstileConfigMessage role="alert">
                    보안 인증 설정이 필요합니다
                  </S.TurnstileConfigMessage>
                )}

                {errorMessage && !isSchoolEmailError && (
                  <S.ErrorMessage role="alert">{errorMessage}</S.ErrorMessage>
                )}
              </S.EmailStepContent>

              <S.ActionRow>
                <S.SecondaryButton
                  type="button"
                  onClick={onLogout}
                  disabled={isBusy}
                >
                  로그아웃
                </S.SecondaryButton>
                <S.ActionButton
                  type="submit"
                  disabled={isEmailSubmitDisabled}
                  aria-busy={isBusy}
                >
                  {isSendingCode ? '인증 중...' : '인증하기'}
                </S.ActionButton>
              </S.ActionRow>
            </>
          )}

          {isVerificationStep && (
            <S.LogoutButton type="button" onClick={onLogout} disabled={isBusy}>
              로그아웃
            </S.LogoutButton>
          )}
        </S.Form>
      </S.Dialog>

      {isSchoolEmailError && (
        <SchoolEmailErrorToast message={SCHOOL_EMAIL_ERROR_MESSAGE} />
      )}

      {turnstileSiteKey && (
        <S.OverlayTurnstile>
          <Turnstile
            key={isVerificationStep ? resendTurnstileKey : turnstileKey}
            siteKey={turnstileSiteKey}
            action="email_verification"
            onVerify={
              isVerificationStep
                ? handleResendTurnstileVerify
                : handleTurnstileVerify
            }
            onExpire={
              isVerificationStep
                ? handleResendTurnstileReset
                : handleTurnstileReset
            }
            onError={
              isVerificationStep
                ? handleResendTurnstileReset
                : handleTurnstileReset
            }
          />
        </S.OverlayTurnstile>
      )}
    </S.Overlay>
  )
}

interface SchoolEmailErrorToastProps {
  message: string
}

function SchoolEmailErrorToast({ message }: SchoolEmailErrorToastProps) {
  const [isLeaving, setIsLeaving] = useState(false)
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const leaveTimerId = window.setTimeout(() => setIsLeaving(true), 2000)
    const closeTimerId = window.setTimeout(() => setIsVisible(false), 2200)

    return () => {
      window.clearTimeout(leaveTimerId)
      window.clearTimeout(closeTimerId)
    }
  }, [])

  if (!isVisible) {
    return null
  }

  return (
    <S.ErrorToast role="alert" $isLeaving={isLeaving}>
      {message}
    </S.ErrorToast>
  )
}
