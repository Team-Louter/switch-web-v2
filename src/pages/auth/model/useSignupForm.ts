import { useCallback, useState } from 'react'
import type { ChangeEvent } from 'react'

import {
  sendVerificationCode,
  signup,
  verifyEmailCode,
} from '@/features/auth'

import { TURNSTILE_SITE_KEY } from '../config/turnstile'

const VERIFICATION_CODE_LENGTH = 6

export interface SignupFormValues {
  studentNumber: string
  name: string
  password: string
  passwordConfirmation: string
  email: string
  clubCode: string
}

export interface SignupFormController {
  values: SignupFormValues
  verificationCode: string
  isContinueDisabled: boolean
  isSendingVerificationCode: boolean
  isVerificationOpen: boolean
  isVerificationSubmitting: boolean
  isResendingVerificationCode: boolean
  isResendVerificationReady: boolean
  turnstileSiteKey: string
  turnstileKey: number
  resendTurnstileKey: number
  handleInputChange: (event: ChangeEvent<HTMLInputElement>) => void
  handleContinue: () => Promise<void>
  handleVerificationCodeChange: (code: string) => void
  handleVerificationClose: () => void
  handleVerificationSubmit: () => Promise<void>
  handleResendVerificationCode: () => Promise<void>
  handleTurnstileVerify: (token: string) => void
  handleTurnstileReset: () => void
  handleResendTurnstileVerify: (token: string) => void
  handleResendTurnstileReset: () => void
}

function isSignupFieldName(fieldName: string): fieldName is keyof SignupFormValues {
  return [
    'studentNumber',
    'name',
    'password',
    'passwordConfirmation',
    'email',
    'clubCode',
  ].includes(fieldName)
}

export function useSignupForm(
  initialEmail: string,
  onSignupComplete: (email: string) => void,
): SignupFormController {
  const [values, setValues] = useState<SignupFormValues>({
    studentNumber: '',
    name: '',
    password: '',
    passwordConfirmation: '',
    email: initialEmail,
    clubCode: '',
  })
  const [turnstileToken, setTurnstileToken] = useState('')
  const [turnstileKey, setTurnstileKey] = useState(0)
  const [resendTurnstileToken, setResendTurnstileToken] = useState('')
  const [resendTurnstileKey, setResendTurnstileKey] = useState(0)
  const [verificationCode, setVerificationCode] = useState('')
  const [isSendingVerificationCode, setIsSendingVerificationCode] =
    useState(false)
  const [isVerificationOpen, setIsVerificationOpen] = useState(false)
  const [isVerificationSubmitting, setIsVerificationSubmitting] =
    useState(false)
  const [isResendingVerificationCode, setIsResendingVerificationCode] =
    useState(false)
  const hasPasswordMismatch =
    Boolean(values.passwordConfirmation) &&
    values.password !== values.passwordConfirmation
  const hasEmptyField = Object.values(values).some(
    (value) => !value.trim(),
  )
  const isContinueDisabled =
    hasEmptyField ||
    hasPasswordMismatch ||
    !turnstileToken ||
    !TURNSTILE_SITE_KEY ||
    isSendingVerificationCode ||
    isVerificationOpen
  const isResendVerificationReady = Boolean(resendTurnstileToken)

  function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
    const { name: fieldName, value } = event.target

    if (!isSignupFieldName(fieldName)) {
      return
    }

    setValues((currentValues) => ({
      ...currentValues,
      [fieldName]: value,
    }))
  }

  async function handleContinue() {
    if (isContinueDisabled) {
      return
    }

    setIsSendingVerificationCode(true)

    try {
      await sendVerificationCode({
        userEmail: values.email.trim(),
        turnstileToken,
      })
      setVerificationCode('')
      setResendTurnstileToken('')
      setResendTurnstileKey((currentKey) => currentKey + 1)
      setIsVerificationOpen(true)
    } catch {
      setTurnstileToken('')
      setTurnstileKey((currentKey) => currentKey + 1)
    } finally {
      setIsSendingVerificationCode(false)
    }
  }

  function handleVerificationCodeChange(code: string) {
    setVerificationCode(code)
  }

  function handleVerificationClose() {
    if (isVerificationSubmitting || isResendingVerificationCode) {
      return
    }

    setIsVerificationOpen(false)
    setVerificationCode('')
    setTurnstileToken('')
    setTurnstileKey((currentKey) => currentKey + 1)
    setResendTurnstileToken('')
    setResendTurnstileKey((currentKey) => currentKey + 1)
  }

  async function handleVerificationSubmit() {
    if (
      verificationCode.length !== VERIFICATION_CODE_LENGTH ||
      isVerificationSubmitting ||
      isResendingVerificationCode
    ) {
      return
    }

    setIsVerificationSubmitting(true)

    try {
      await verifyEmailCode({
        userEmail: values.email.trim(),
        inputCode: verificationCode,
      })
      await signup({
        studentId: Number(values.studentNumber),
        userName: values.name.trim(),
        userEmail: values.email.trim(),
        userPassword: values.password,
        confirmPassword: values.passwordConfirmation,
        userProvider: 'SELF',
        clubCode: values.clubCode.trim(),
      })
      onSignupComplete(values.email.trim())
    } catch {
      return
    } finally {
      setIsVerificationSubmitting(false)
    }
  }

  async function handleResendVerificationCode() {
    if (
      !resendTurnstileToken ||
      isVerificationSubmitting ||
      isResendingVerificationCode
    ) {
      return
    }

    const submittedTurnstileToken = resendTurnstileToken

    setResendTurnstileToken('')
    setIsResendingVerificationCode(true)

    try {
      await sendVerificationCode({
        userEmail: values.email.trim(),
        turnstileToken: submittedTurnstileToken,
      })
      setVerificationCode('')
    } catch {
      return
    } finally {
      setIsResendingVerificationCode(false)
      setResendTurnstileKey((currentKey) => currentKey + 1)
    }
  }

  const handleTurnstileVerify = useCallback((token: string) => {
    setTurnstileToken(token)
  }, [])

  const handleTurnstileReset = useCallback(() => {
    setTurnstileToken('')
  }, [])

  const handleResendTurnstileVerify = useCallback((token: string) => {
    setResendTurnstileToken(token)
  }, [])

  const handleResendTurnstileReset = useCallback(() => {
    setResendTurnstileToken('')
  }, [])

  return {
    values,
    verificationCode,
    isContinueDisabled,
    isSendingVerificationCode,
    isVerificationOpen,
    isVerificationSubmitting,
    isResendingVerificationCode,
    isResendVerificationReady,
    turnstileSiteKey: TURNSTILE_SITE_KEY,
    turnstileKey,
    resendTurnstileKey,
    handleInputChange,
    handleContinue,
    handleVerificationCodeChange,
    handleVerificationClose,
    handleVerificationSubmit,
    handleResendVerificationCode,
    handleTurnstileVerify,
    handleTurnstileReset,
    handleResendTurnstileVerify,
    handleResendTurnstileReset,
  }
}
