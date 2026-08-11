import { useCallback, useEffect, useRef, useState } from 'react'
import type { ChangeEvent } from 'react'
import { useNavigate } from 'react-router-dom'

import { checkEmailExists } from '@/features/auth'

import { TURNSTILE_SITE_KEY } from '../config/turnstile'

const EMAIL_CHECK_MIN_DURATION = 600
const PASSWORD_TRANSITION_DURATION = 480
const INVALID_EMAIL_MESSAGE = '잘못된 이메일 주소'

type LoginStep = 'email' | 'password'

export interface LoginFormController {
  email: string
  password: string
  isPasswordStep: boolean
  usesPasswordTransition: boolean
  isCheckingEmail: boolean
  isContinueDisabled: boolean
  emailValidationMessage: string
  turnstileSiteKey: string
  handleEmailChange: (event: ChangeEvent<HTMLInputElement>) => void
  handlePasswordChange: (event: ChangeEvent<HTMLInputElement>) => void
  handleContinue: () => Promise<void>
  handleChangeEmail: () => void
  handleTurnstileVerify: (token: string) => void
  handleTurnstileReset: () => void
}

export function useLoginForm(): LoginFormController {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loginStep, setLoginStep] = useState<LoginStep>('email')
  const [turnstileToken, setTurnstileToken] = useState('')
  const [isCheckingEmail, setIsCheckingEmail] = useState(false)
  const [usesPasswordTransition, setUsesPasswordTransition] = useState(false)
  const [emailValidationMessage, setEmailValidationMessage] = useState('')
  const passwordTransitionTimerRef = useRef<number | null>(null)
  const isPasswordStep = loginStep === 'password'
  const isContinueDisabled =
    isCheckingEmail ||
    (isPasswordStep
      ? !password || !turnstileToken || !TURNSTILE_SITE_KEY
      : !email.trim() || !turnstileToken || !TURNSTILE_SITE_KEY)

  function handleEmailChange(event: ChangeEvent<HTMLInputElement>) {
    setEmail(event.target.value)
    setEmailValidationMessage('')
  }

  function handlePasswordChange(event: ChangeEvent<HTMLInputElement>) {
    setPassword(event.target.value)
  }

  async function handleContinue() {
    if (isContinueDisabled || isPasswordStep) {
      return
    }

    const submittedEmail = email.trim()

    if (!isValidEmailAddress(submittedEmail)) {
      setEmailValidationMessage(INVALID_EMAIL_MESSAGE)
      return
    }

    setIsCheckingEmail(true)

    try {
      const [emailCheckResult] = await Promise.allSettled([
        checkEmailExists({ userEmail: submittedEmail }),
        new Promise((resolve) =>
          window.setTimeout(resolve, EMAIL_CHECK_MIN_DURATION),
        ),
      ] as const)

      if (emailCheckResult.status === 'rejected') {
        throw emailCheckResult.reason
      }

      const { exists } = emailCheckResult.value

      if (exists) {
        setUsesPasswordTransition(true)
        setLoginStep('password')
        return
      }

      navigate('/login', {
        replace: true,
        state: { authView: 'signup', email: submittedEmail },
        viewTransition: true,
      })
    } catch {
      setLoginStep('email')
    } finally {
      setIsCheckingEmail(false)
    }
  }

  function handleChangeEmail() {
    if (passwordTransitionTimerRef.current !== null) {
      window.clearTimeout(passwordTransitionTimerRef.current)
    }

    setLoginStep('email')
    setPassword('')
    setEmailValidationMessage('')
    setUsesPasswordTransition(true)
    passwordTransitionTimerRef.current = window.setTimeout(() => {
      setUsesPasswordTransition(false)
      passwordTransitionTimerRef.current = null
    }, PASSWORD_TRANSITION_DURATION)
  }

  const handleTurnstileVerify = useCallback((token: string) => {
    setTurnstileToken(token)
  }, [])

  const handleTurnstileReset = useCallback(() => {
    setTurnstileToken('')
  }, [])

  useEffect(
    () => () => {
      if (passwordTransitionTimerRef.current !== null) {
        window.clearTimeout(passwordTransitionTimerRef.current)
      }
    },
    [],
  )

  return {
    email,
    password,
    isPasswordStep,
    usesPasswordTransition,
    isCheckingEmail,
    isContinueDisabled,
    emailValidationMessage,
    turnstileSiteKey: TURNSTILE_SITE_KEY,
    handleEmailChange,
    handlePasswordChange,
    handleContinue,
    handleChangeEmail,
    handleTurnstileVerify,
    handleTurnstileReset,
  }
}

function isValidEmailAddress(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}
