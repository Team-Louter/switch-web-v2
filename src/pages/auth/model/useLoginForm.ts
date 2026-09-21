import { useCallback, useEffect, useRef, useState } from 'react'
import type { ChangeEvent } from 'react'
import { useNavigate } from 'react-router-dom'

import { useUserStore } from '@/entities/profile'
import {
  checkEmailExists,
  login,
  requiresRecoveryEmail,
} from '@/features/auth'
import {
  clearAccessToken,
  clearPendingAccessToken,
  promotePendingAccessToken,
  setPendingAccessToken,
} from '@/shared/lib/authToken'

import { TURNSTILE_SITE_KEY } from '../config/turnstile'

const EMAIL_CHECK_MIN_DURATION = 600
const PASSWORD_TRANSITION_DURATION = 480
const INVALID_EMAIL_MESSAGE = '잘못된 이메일 주소'
const LOGIN_FAILED_MESSAGE = '이메일 또는 비밀번호를 확인해주세요'

type LoginStep = 'email' | 'password'

export interface LoginFormController {
  email: string
  password: string
  isPasswordStep: boolean
  usesPasswordTransition: boolean
  isSubmitting: boolean
  isContinueDisabled: boolean
  emailValidationMessage: string
  loginValidationMessage: string
  turnstileSiteKey: string
  turnstileKey: number
  handleEmailChange: (event: ChangeEvent<HTMLInputElement>) => void
  handlePasswordChange: (event: ChangeEvent<HTMLInputElement>) => void
  handleContinue: () => Promise<void>
  handleChangeEmail: () => void
  handleTurnstileVerify: (token: string) => void
  handleTurnstileReset: () => void
}

export function useLoginForm(
  initialEmail = '',
  returnPath = '/home',
  authTransitionSessionId = '',
  requiresTurnstile = true,
): LoginFormController {
  const navigate = useNavigate()
  const [email, setEmail] = useState(initialEmail)
  const [password, setPassword] = useState('')
  const [loginStep, setLoginStep] = useState<LoginStep>('email')
  const [turnstileToken, setTurnstileToken] = useState('')
  const [turnstileKey, setTurnstileKey] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [usesPasswordTransition, setUsesPasswordTransition] = useState(false)
  const [emailValidationMessage, setEmailValidationMessage] = useState('')
  const [loginValidationMessage, setLoginValidationMessage] = useState('')
  const passwordTransitionTimerRef = useRef<number | null>(null)
  const isPasswordStep = loginStep === 'password'
  const isTurnstileReady =
    !requiresTurnstile || Boolean(turnstileToken && TURNSTILE_SITE_KEY)
  const isContinueDisabled =
    isSubmitting ||
    (isPasswordStep
      ? !password || !isTurnstileReady
      : !email.trim() || !isTurnstileReady)

  function handleEmailChange(event: ChangeEvent<HTMLInputElement>) {
    setEmail(event.target.value)
    setEmailValidationMessage('')
    setLoginValidationMessage('')
  }

  function handlePasswordChange(event: ChangeEvent<HTMLInputElement>) {
    setPassword(event.target.value)
    setLoginValidationMessage('')
  }

  async function handleContinue() {
    if (isContinueDisabled) {
      return
    }

    if (isPasswordStep) {
      setIsSubmitting(true)
      setLoginValidationMessage('')

      try {
        const { token } = await login({
          userEmail: email.trim(),
          userPassword: password,
          userProvider: 'SELF',
          turnstileToken,
        })

        clearAccessToken()
        clearPendingAccessToken()
        setPendingAccessToken(token, 'recovery-email')

        const profile = await useUserStore.getState().fetchUser()

        if (requiresRecoveryEmail(profile)) {
          navigate('/home', { replace: true })
          return
        }

        if (!promotePendingAccessToken()) {
          throw new Error('로그인 토큰을 활성화하지 못했습니다.')
        }

        navigate(returnPath, { replace: true })
      } catch {
        clearAccessToken()
        clearPendingAccessToken()
        setLoginValidationMessage(LOGIN_FAILED_MESSAGE)
        setTurnstileToken('')
        setTurnstileKey((currentKey) => currentKey + 1)
      } finally {
        setIsSubmitting(false)
      }

      return
    }

    const submittedEmail = email.trim()

    if (!isValidEmailAddress(submittedEmail)) {
      setEmailValidationMessage(INVALID_EMAIL_MESSAGE)
      return
    }

    setIsSubmitting(true)

    try {
      const [emailCheckResult] = await Promise.allSettled([
        checkEmailExists({ userEmail: submittedEmail }),
        waitForEmailLoadingMinimumDuration(),
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
        state: {
          authView: 'signup',
          email: submittedEmail,
          from: returnPath,
          authTransitionSessionId,
        },
      })
    } catch {
      setLoginStep('email')
    } finally {
      setIsSubmitting(false)
    }
  }

  function handleChangeEmail() {
    if (passwordTransitionTimerRef.current !== null) {
      window.clearTimeout(passwordTransitionTimerRef.current)
    }

    setLoginStep('email')
    setPassword('')
    setEmailValidationMessage('')
    setLoginValidationMessage('')
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
    isSubmitting,
    isContinueDisabled,
    emailValidationMessage,
    loginValidationMessage,
    turnstileSiteKey: TURNSTILE_SITE_KEY,
    turnstileKey,
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

function waitForEmailLoadingMinimumDuration(): Promise<void> {
  return new Promise((resolve) =>
    window.setTimeout(resolve, EMAIL_CHECK_MIN_DURATION),
  )
}
