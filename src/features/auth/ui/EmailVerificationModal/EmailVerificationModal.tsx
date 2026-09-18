import { useEffect, useRef, useState } from 'react'
import type { ChangeEvent, FormEvent, MouseEvent } from 'react'

import arrowIcon from '../../assets/svg/email-verification-arrow.svg'
import loadingIcon from '../../assets/svg/email-verification-loading.svg'
import { Turnstile } from '../Turnstile/Turnstile'
import * as S from './EmailVerificationModal.style'

const VERIFICATION_CODE_LENGTH = 6

interface EmailVerificationModalProps {
  code: string
  isSubmitting: boolean
  isResending: boolean
  isResendReady: boolean
  turnstileSiteKey: string
  turnstileKey: number
  title?: string
  description?: string
  resendLabel?: string
  resendingLabel?: string
  submitAriaLabel?: string
  loadingAlt?: string
  closeOnOverlayClick?: boolean
  onChangeCode: (code: string) => void
  onClose: () => void
  onResend: () => void
  onSubmit: () => void
  onTurnstileVerify: (token: string) => void
  onTurnstileReset: () => void
}

export function EmailVerificationModal({
  code,
  isSubmitting,
  isResending,
  isResendReady,
  turnstileSiteKey,
  turnstileKey,
  title = '코드를 입력하세요',
  description = '아래에 이메일로 전송된 6자리 코드를 입력하세요.',
  resendLabel = '인증 코드 재전송',
  resendingLabel = '인증 코드 전송 중',
  submitAriaLabel = '이메일 인증 완료',
  loadingAlt = '회원가입 처리 중',
  closeOnOverlayClick = true,
  onChangeCode,
  onClose,
  onResend,
  onSubmit,
  onTurnstileVerify,
  onTurnstileReset,
}: EmailVerificationModalProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [isInputFocused, setIsInputFocused] = useState(true)
  const isComplete = code.length === VERIFICATION_CODE_LENGTH
  const isBusy = isSubmitting || isResending

  function handleCodeChange(event: ChangeEvent<HTMLInputElement>) {
    const nextCode = event.currentTarget.value
      .replace(/\D/g, '')
      .slice(0, VERIFICATION_CODE_LENGTH)

    onChangeCode(nextCode)
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!isComplete || isBusy) {
      return
    }

    onSubmit()
  }

  function handleOverlayClick(event: MouseEvent<HTMLDivElement>) {
    if (
      !closeOnOverlayClick ||
      event.target !== event.currentTarget ||
      isBusy
    ) {
      return
    }

    onClose()
  }

  useEffect(() => {
    const previousOverflow = document.body.style.overflow

    document.body.style.overflow = 'hidden'
    inputRef.current?.focus()

    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [])

  return (
    <S.Overlay onClick={handleOverlayClick}>
      <S.Dialog
        role="dialog"
        aria-modal="true"
        aria-labelledby="email-verification-title"
        aria-describedby="email-verification-description"
        aria-busy={isSubmitting}
      >
        {isSubmitting ? (
          <S.LoadingIcon src={loadingIcon} alt={loadingAlt} />
        ) : (
          <S.Form onSubmit={handleSubmit} noValidate>
            <S.Title id="email-verification-title">{title}</S.Title>
            <S.Description id="email-verification-description">
              {description}
            </S.Description>

            <S.CodeField onClick={() => inputRef.current?.focus()}>
              {Array.from({ length: VERIFICATION_CODE_LENGTH }).map(
                (_, index) => {
                  const digit = code[index] ?? ''
                  const isActive =
                    isInputFocused && !isComplete && index === code.length

                  return (
                    <S.DigitBox
                      key={index}
                      $isFilled={Boolean(digit)}
                      $isActive={isActive}
                      aria-hidden="true"
                    >
                      {digit}
                    </S.DigitBox>
                  )
                },
              )}
              <S.CodeInput
                ref={inputRef}
                type="text"
                value={code}
                onChange={handleCodeChange}
                onFocus={() => setIsInputFocused(true)}
                onBlur={() => setIsInputFocused(false)}
                aria-label="이메일 인증 코드 6자리"
                inputMode="numeric"
                pattern="[0-9]*"
                autoComplete="one-time-code"
                maxLength={VERIFICATION_CODE_LENGTH}
                disabled={isBusy}
              />
            </S.CodeField>

            <S.ResendButton
              type="button"
              onClick={onResend}
              disabled={isBusy || !isResendReady}
            >
              {isResending ? resendingLabel : resendLabel}
            </S.ResendButton>

            <S.SubmitButton
              type="submit"
              disabled={!isComplete || isBusy}
              aria-label={submitAriaLabel}
            >
              <S.ArrowIcon
                src={arrowIcon}
                alt=""
                $isEnabled={isComplete && !isBusy}
              />
            </S.SubmitButton>
          </S.Form>
        )}
      </S.Dialog>

      {!isSubmitting && (
        <S.ResendTurnstile>
          <Turnstile
            key={turnstileKey}
            siteKey={turnstileSiteKey}
            action="email_verification"
            onVerify={onTurnstileVerify}
            onExpire={onTurnstileReset}
            onError={onTurnstileReset}
          />
        </S.ResendTurnstile>
      )}
    </S.Overlay>
  )
}
