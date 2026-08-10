import { useCallback, useState } from 'react'
import type { ChangeEvent } from 'react'

const TURNSTILE_TEST_SITE_KEY = '1x00000000000000000000AA'
const TURNSTILE_SITE_KEY = import.meta.env.DEV
  ? TURNSTILE_TEST_SITE_KEY
  : import.meta.env.VITE_TURNSTILE_SITE_KEY || ''

type LoginStep = 'email' | 'password'

export interface LoginFormController {
  email: string
  password: string
  isPasswordStep: boolean
  isContinueDisabled: boolean
  turnstileSiteKey: string
  handleEmailChange: (event: ChangeEvent<HTMLInputElement>) => void
  handlePasswordChange: (event: ChangeEvent<HTMLInputElement>) => void
  handleContinue: () => void
  handleChangeEmail: () => void
  handleTurnstileVerify: (token: string) => void
  handleTurnstileReset: () => void
}

export function useLoginForm(): LoginFormController {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loginStep, setLoginStep] = useState<LoginStep>('email')
  const [turnstileToken, setTurnstileToken] = useState('')
  const isPasswordStep = loginStep === 'password'
  const isContinueDisabled = isPasswordStep
    ? !password || !turnstileToken || !TURNSTILE_SITE_KEY
    : !email.trim() || !turnstileToken || !TURNSTILE_SITE_KEY

  function handleEmailChange(event: ChangeEvent<HTMLInputElement>) {
    setEmail(event.target.value)
  }

  function handlePasswordChange(event: ChangeEvent<HTMLInputElement>) {
    setPassword(event.target.value)
  }

  function handleContinue() {
    if (!isContinueDisabled && !isPasswordStep) {
      setLoginStep('password')
    }
  }

  function handleChangeEmail() {
    setLoginStep('email')
    setPassword('')
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
    isContinueDisabled,
    turnstileSiteKey: TURNSTILE_SITE_KEY,
    handleEmailChange,
    handlePasswordChange,
    handleContinue,
    handleChangeEmail,
    handleTurnstileVerify,
    handleTurnstileReset,
  }
}
