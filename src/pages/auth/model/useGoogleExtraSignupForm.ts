import { useCallback, useEffect, useState } from 'react'
import type { ChangeEvent } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

import { useUserStore } from '@/entities/profile'
import { requiresRecoveryEmail, signupGoogleExtra } from '@/features/auth'
import {
  clearAccessToken,
  clearPendingAccessToken,
  getAccessToken,
  getPendingAccessToken,
  getPendingAccessTokenFlow,
  promotePendingAccessToken,
  setPendingAccessToken,
} from '@/shared/lib/authToken'

import { TURNSTILE_SITE_KEY } from '../config/turnstile'

interface GoogleExtraSignupValues {
  studentNumber: string
  name: string
  clubCode: string
}

export interface GoogleExtraSignupFormController {
  values: GoogleExtraSignupValues
  isSubmitting: boolean
  isSubmitDisabled: boolean
  turnstileSiteKey: string
  turnstileKey: number
  handleInputChange: (event: ChangeEvent<HTMLInputElement>) => void
  handleSubmit: () => Promise<void>
  handleCancel: () => void
  handleTurnstileVerify: (token: string) => void
  handleTurnstileReset: () => void
}

function isGoogleExtraSignupField(
  fieldName: string,
): fieldName is keyof GoogleExtraSignupValues {
  return ['studentNumber', 'name', 'clubCode'].includes(fieldName)
}

export function useGoogleExtraSignupForm(): GoogleExtraSignupFormController {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const tokenFromUrl = searchParams.get('token')?.trim() ?? ''
  const [values, setValues] = useState<GoogleExtraSignupValues>({
    studentNumber: '',
    name: '',
    clubCode: '',
  })
  const [turnstileToken, setTurnstileToken] = useState('')
  const [turnstileKey, setTurnstileKey] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const hasOAuthToken = Boolean(
    tokenFromUrl ||
      (getPendingAccessToken() &&
        getPendingAccessTokenFlow() === 'google-extra-signup'),
  )
  const hasEmptyField = Object.values(values).some(
    (value) => !value.trim(),
  )
  const isSubmitDisabled =
    hasEmptyField ||
    !hasOAuthToken ||
    !turnstileToken ||
    !TURNSTILE_SITE_KEY ||
    isSubmitting

  function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
    const { name: fieldName, value } = event.target

    if (!isGoogleExtraSignupField(fieldName)) {
      return
    }

    setValues((currentValues) => ({
      ...currentValues,
      [fieldName]:
        fieldName === 'studentNumber' ? value.replace(/\D/g, '') : value,
    }))
  }

  async function handleSubmit() {
    if (isSubmitDisabled) {
      return
    }

    setIsSubmitting(true)

    try {
      await signupGoogleExtra({
        studentId: Number(values.studentNumber),
        userName: values.name.trim(),
        clubCode: values.clubCode.trim(),
      })

      if (!promotePendingAccessToken()) {
        navigate('/login', { replace: true })
        return
      }

      const profile = await useUserStore.getState().fetchUser()

      if (requiresRecoveryEmail(profile)) {
        const accessToken = getAccessToken()

        if (!accessToken) {
          throw new Error('로그인 토큰을 확인하지 못했습니다.')
        }

        clearAccessToken()
        setPendingAccessToken(accessToken, 'recovery-email')
        navigate('/home', { replace: true })
        return
      }

      navigate('/home', { replace: true })
    } catch {
      setTurnstileToken('')
      setTurnstileKey((currentKey) => currentKey + 1)

      if (!getPendingAccessToken()) {
        clearAccessToken()
        navigate('/login', { replace: true })
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  function handleCancel() {
    clearPendingAccessToken()
    navigate('/login', { replace: true })
  }

  const handleTurnstileVerify = useCallback((token: string) => {
    setTurnstileToken(token)
  }, [])

  const handleTurnstileReset = useCallback(() => {
    setTurnstileToken('')
  }, [])

  useEffect(() => {
    if (tokenFromUrl) {
      clearAccessToken()
      setPendingAccessToken(tokenFromUrl, 'google-extra-signup')
      navigate('/extra-signup', { replace: true })
      return
    }

    if (
      !getPendingAccessToken() ||
      getPendingAccessTokenFlow() !== 'google-extra-signup'
    ) {
      navigate('/login', { replace: true })
    }
  }, [navigate, tokenFromUrl])

  return {
    values,
    isSubmitting,
    isSubmitDisabled,
    turnstileSiteKey: TURNSTILE_SITE_KEY,
    turnstileKey,
    handleInputChange,
    handleSubmit,
    handleCancel,
    handleTurnstileVerify,
    handleTurnstileReset,
  }
}
