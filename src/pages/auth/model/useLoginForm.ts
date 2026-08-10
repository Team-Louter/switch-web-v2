import { useCallback, useState } from 'react'
import type { ChangeEvent } from 'react'
import { useNavigate } from 'react-router-dom'

import { checkEmailExists } from '@/features/auth'

import { TURNSTILE_SITE_KEY } from '../config/turnstile'

const EMAIL_CHECK_MIN_DURATION = 600

type LoginStep = 'email' | 'password'

export interface LoginFormController {
  email: string
  password: string
  isPasswordStep: boolean
  isCheckingEmail: boolean
  isContinueDisabled: boolean
  emailCheckError: string
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
  const [emailCheckError, setEmailCheckError] = useState('')
  const isPasswordStep = loginStep === 'password'
  const isContinueDisabled =
    isCheckingEmail ||
    (isPasswordStep
      ? !password || !turnstileToken || !TURNSTILE_SITE_KEY
      : !email.trim() || !turnstileToken || !TURNSTILE_SITE_KEY)

  function handleEmailChange(event: ChangeEvent<HTMLInputElement>) {
    setEmail(event.target.value)
    setEmailCheckError('')
  }

  function handlePasswordChange(event: ChangeEvent<HTMLInputElement>) {
    setPassword(event.target.value)
  }

  async function handleContinue() {
    if (isContinueDisabled || isPasswordStep) {
      return
    }

    const submittedEmail = email.trim()
    setIsCheckingEmail(true)
    setEmailCheckError('')

    try {
      const [{ exists }] = await Promise.all([
        checkEmailExists({ email: submittedEmail }),
        new Promise((resolve) =>
          window.setTimeout(resolve, EMAIL_CHECK_MIN_DURATION),
        ),
      ])

      if (exists) {
        setLoginStep('password')
        return
      }

      navigate('/signup', { state: { email: submittedEmail } })
    } catch {
      setEmailCheckError(
        '이메일을 확인하지 못했습니다. 잠시 후 다시 시도해주세요.',
      )
    } finally {
      setIsCheckingEmail(false)
    }
  }

  function handleChangeEmail() {
    setLoginStep('email')
    setPassword('')
    setEmailCheckError('')
  }

  const handleTurnstileVerify = useCallback((token: string) => {
    setTurnstileToken(token)
  }, [])

  const handleTurnstileReset = useCallback(() => {
    setTurnstileToken('')
  }, [])

  return {
    email,
    password,
    isPasswordStep,
    isCheckingEmail,
    isContinueDisabled,
    emailCheckError,
    turnstileSiteKey: TURNSTILE_SITE_KEY,
    handleEmailChange,
    handlePasswordChange,
    handleContinue,
    handleChangeEmail,
    handleTurnstileVerify,
    handleTurnstileReset,
  }
}
