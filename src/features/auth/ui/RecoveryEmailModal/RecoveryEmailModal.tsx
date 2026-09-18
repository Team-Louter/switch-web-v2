import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'

import fireworksImage from '../../assets/party-popper.png'
import { useRecoveryEmailForm } from '../../model/useRecoveryEmailForm'
import { EmailVerificationModal } from '../EmailVerificationModal'
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
    isResendDisabled,
    turnstileSiteKey,
    turnstileKey,
    resendTurnstileKey,
    handleEmailChange,
    handleVerificationCodeChange,
    handleSendCode,
    handleVerifyCode,
    handleResendCode,
    handleTurnstileVerify,
    handleTurnstileReset,
    handleResendTurnstileVerify,
    handleResendTurnstileReset,
  } = controller

  const isVerificationStep = step === 'verification'
  const isBusy = isSendingCode || isVerifyingCode || isResendingCode

  useEffect(() => {
    const previousOverflow = document.body.style.overflow

    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [])

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    void handleSendCode()
  }

  if (isVerificationStep) {
    return (
      <>
        <EmailVerificationModal
          code={verificationCode}
          isSubmitting={isVerifyingCode}
          isResending={isResendingCode}
          isResendReady={!isResendDisabled}
          turnstileSiteKey={turnstileSiteKey}
          turnstileKey={resendTurnstileKey}
          title="인증번호를 입력하세요"
          description={`${email}으로 전송된 6자리 인증번호를 입력해주세요.`}
          resendLabel="인증번호 재전송"
          resendingLabel="인증번호 전송 중"
          submitAriaLabel="복구 이메일 등록"
          loadingAlt="복구 이메일 등록 중"
          closeOnOverlayClick={false}
          onChangeCode={handleVerificationCodeChange}
          onClose={onLogout}
          onResend={() => void handleResendCode()}
          onSubmit={() => void handleVerifyCode()}
          onTurnstileVerify={handleResendTurnstileVerify}
          onTurnstileReset={handleResendTurnstileReset}
        />
        {errorMessage && (
          <RecoveryEmailErrorToast key={errorMessage} message={errorMessage} />
        )}
      </>
    )
  }

  return (
    <>
      <S.Overlay>
        <S.Dialog
          role="dialog"
          aria-modal="true"
          aria-labelledby="recovery-email-title"
          aria-describedby="recovery-email-description"
          aria-busy={isBusy}
        >
          <S.Form onSubmit={handleSubmit} noValidate>
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
          </S.Form>

          {turnstileSiteKey && (
            <S.OverlayTurnstile>
              <Turnstile
                siteKey={turnstileSiteKey}
                action="email_verification"
                resetKey={turnstileKey}
                onVerify={handleTurnstileVerify}
                onExpire={handleTurnstileReset}
                onError={handleTurnstileReset}
              />
            </S.OverlayTurnstile>
          )}
        </S.Dialog>
      </S.Overlay>
      {errorMessage && (
        <RecoveryEmailErrorToast key={errorMessage} message={errorMessage} />
      )}
    </>
  )
}

interface RecoveryEmailErrorToastProps {
  message: string
}

function RecoveryEmailErrorToast({ message }: RecoveryEmailErrorToastProps) {
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
