import axios from 'axios'
import { useCallback, useState } from 'react'
import type { ChangeEvent } from 'react'

import { sendRecoveryEmailVerification } from '../api/sendRecoveryEmailVerification'
import { verifyRecoveryEmail } from '../api/verifyRecoveryEmail'

import { TURNSTILE_SITE_KEY } from '../config/turnstile'

const VERIFICATION_CODE_LENGTH = 6
const SEND_CODE_FAILED_MESSAGE =
  '복구 이메일 인증번호를 전송하지 못했습니다. 다시 시도해주세요.'
const VERIFY_CODE_FAILED_MESSAGE =
  '복구 이메일 등록을 완료하지 못했습니다. 다시 시도해주세요.'
export const SCHOOL_EMAIL_ERROR_MESSAGE =
  '학교 이메일은 복구 이메일로 등록할 수 없습니다.'

export type RecoveryEmailStep = 'email' | 'verification'

export interface RecoveryEmailFormController {
  email: string
  verificationCode: string
  step: RecoveryEmailStep
  errorMessage: string
  isSendingCode: boolean
  isVerifyingCode: boolean
  isResendingCode: boolean
  isEmailSubmitDisabled: boolean
  isVerificationSubmitDisabled: boolean
  isResendDisabled: boolean
  turnstileSiteKey: string
  turnstileKey: number
  resendTurnstileKey: number
  handleEmailChange: (event: ChangeEvent<HTMLInputElement>) => void
  handleVerificationCodeChange: (code: string) => void
  handleSendCode: () => Promise<void>
  handleVerifyCode: () => Promise<void>
  handleResendCode: () => Promise<void>
  handleChangeEmail: () => void
  handleTurnstileVerify: (token: string) => void
  handleTurnstileReset: () => void
  handleResendTurnstileVerify: (token: string) => void
  handleResendTurnstileReset: () => void
}

export function useRecoveryEmailForm(
  onComplete: () => Promise<void>,
): RecoveryEmailFormController {
  const [email, setEmail] = useState('')
  const [verificationCode, setVerificationCode] = useState('')
  const [step, setStep] = useState<RecoveryEmailStep>('email')
  const [errorMessage, setErrorMessage] = useState('')
  const [sendTurnstileToken, setSendTurnstileToken] = useState('')
  const [sendTurnstileKey, setSendTurnstileKey] = useState(0)
  const [resendTurnstileToken, setResendTurnstileToken] = useState('')
  const [resendTurnstileKey, setResendTurnstileKey] = useState(0)
  const [isSendingCode, setIsSendingCode] = useState(false)
  const [isVerifyingCode, setIsVerifyingCode] = useState(false)
  const [isResendingCode, setIsResendingCode] = useState(false)

  const isEmailSubmitDisabled =
    !isValidEmailAddress(email.trim()) ||
    !sendTurnstileToken ||
    !TURNSTILE_SITE_KEY ||
    isSendingCode
  const isVerificationSubmitDisabled =
    verificationCode.length !== VERIFICATION_CODE_LENGTH ||
    isVerifyingCode ||
    isResendingCode
  const isResendDisabled =
    !resendTurnstileToken || isVerifyingCode || isResendingCode

  function handleEmailChange(event: ChangeEvent<HTMLInputElement>) {
    setEmail(event.target.value)
    setErrorMessage('')
  }

  function handleVerificationCodeChange(code: string) {
    setVerificationCode(
      code.replace(/\D/g, '').slice(0, VERIFICATION_CODE_LENGTH),
    )
    setErrorMessage('')
  }

  async function handleSendCode() {
    if (isEmailSubmitDisabled) {
      return
    }

    const submittedEmail = email.trim()

    setIsSendingCode(true)
    setErrorMessage('')

    try {
      await sendRecoveryEmailVerification({
        recoveryEmail: submittedEmail,
        turnstileToken: sendTurnstileToken,
      })
      setVerificationCode('')
      setResendTurnstileToken('')
      setResendTurnstileKey((currentKey) => currentKey + 1)
      setStep('verification')
    } catch (error: unknown) {
      setErrorMessage(getApiErrorMessage(error, SEND_CODE_FAILED_MESSAGE))
      setSendTurnstileToken('')
      setSendTurnstileKey((currentKey) => currentKey + 1)
    } finally {
      setIsSendingCode(false)
    }
  }

  async function handleVerifyCode() {
    if (isVerificationSubmitDisabled) {
      return
    }

    setIsVerifyingCode(true)
    setErrorMessage('')

    try {
      await verifyRecoveryEmail({
        recoveryEmail: email.trim(),
        verificationCode,
      })
    } catch (error: unknown) {
      setErrorMessage(getApiErrorMessage(error, VERIFY_CODE_FAILED_MESSAGE))
      setIsVerifyingCode(false)
      return
    }

    try {
      await onComplete()
    } catch (error: unknown) {
      setErrorMessage(getApiErrorMessage(error, VERIFY_CODE_FAILED_MESSAGE))
    } finally {
      setIsVerifyingCode(false)
    }
  }

  async function handleResendCode() {
    if (isResendDisabled) {
      return
    }

    const submittedTurnstileToken = resendTurnstileToken

    setResendTurnstileToken('')
    setIsResendingCode(true)
    setErrorMessage('')

    try {
      await sendRecoveryEmailVerification({
        recoveryEmail: email.trim(),
        turnstileToken: submittedTurnstileToken,
      })
      setVerificationCode('')
    } catch (error: unknown) {
      setErrorMessage(getApiErrorMessage(error, SEND_CODE_FAILED_MESSAGE))
    } finally {
      setIsResendingCode(false)
      setResendTurnstileKey((currentKey) => currentKey + 1)
    }
  }

  function handleChangeEmail() {
    setStep('email')
    setVerificationCode('')
    setErrorMessage('')
    setSendTurnstileToken('')
    setSendTurnstileKey((currentKey) => currentKey + 1)
    setResendTurnstileToken('')
    setResendTurnstileKey((currentKey) => currentKey + 1)
  }

  const handleTurnstileVerify = useCallback((token: string) => {
    setSendTurnstileToken(token)
  }, [])

  const handleTurnstileReset = useCallback(() => {
    setSendTurnstileToken('')
  }, [])

  const handleResendTurnstileVerify = useCallback((token: string) => {
    setResendTurnstileToken(token)
  }, [])

  const handleResendTurnstileReset = useCallback(() => {
    setResendTurnstileToken('')
  }, [])

  return {
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
    turnstileSiteKey: TURNSTILE_SITE_KEY,
    turnstileKey: sendTurnstileKey,
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
  }
}

function isValidEmailAddress(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

function getApiErrorMessage(error: unknown, fallback: string): string {
  if (!axios.isAxiosError(error)) {
    return fallback
  }

  const responseData: unknown = error.response?.data

  if (
    typeof responseData === 'object' &&
    responseData !== null &&
    'message' in responseData
  ) {
    const message = responseData.message

    if (typeof message === 'string' && message.trim()) {
      return message
    }
  }

  return fallback
}
