import { useCallback, useState } from 'react'
import type { ChangeEvent } from 'react'

import { TURNSTILE_SITE_KEY } from '../config/turnstile'

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
  passwordError: string
  isContinueDisabled: boolean
  turnstileSiteKey: string
  handleInputChange: (event: ChangeEvent<HTMLInputElement>) => void
  handleTurnstileVerify: (token: string) => void
  handleTurnstileReset: () => void
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

export function useSignupForm(initialEmail: string): SignupFormController {
  const [values, setValues] = useState<SignupFormValues>({
    studentNumber: '',
    name: '',
    password: '',
    passwordConfirmation: '',
    email: initialEmail,
    clubCode: '',
  })
  const [turnstileToken, setTurnstileToken] = useState('')
  const hasPasswordMismatch =
    Boolean(values.passwordConfirmation) &&
    values.password !== values.passwordConfirmation
  const passwordError = hasPasswordMismatch
    ? '비밀번호가 일치하지 않습니다.'
    : ''
  const hasEmptyField = Object.values(values).some(
    (value) => !value.trim(),
  )
  const isContinueDisabled =
    hasEmptyField ||
    hasPasswordMismatch ||
    !turnstileToken ||
    !TURNSTILE_SITE_KEY

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

  const handleTurnstileVerify = useCallback((token: string) => {
    setTurnstileToken(token)
  }, [])

  const handleTurnstileReset = useCallback(() => {
    setTurnstileToken('')
  }, [])

  return {
    values,
    passwordError,
    isContinueDisabled,
    turnstileSiteKey: TURNSTILE_SITE_KEY,
    handleInputChange,
    handleTurnstileVerify,
    handleTurnstileReset,
  }
}
