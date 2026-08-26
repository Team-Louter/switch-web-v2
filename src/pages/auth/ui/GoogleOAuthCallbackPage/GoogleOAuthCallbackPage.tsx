import { useEffect, useRef } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

import { useUserStore } from '@/entities/profile'
import { exchangeGoogleOAuthCode } from '@/features/auth'
import {
  clearAccessToken,
  clearPendingAccessToken,
  setAccessToken,
  setPendingAccessToken,
} from '@/shared/lib/authToken'

export function GoogleOAuthCallbackPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const hasHandledOAuthRef = useRef(false)
  const legacyAccessToken = searchParams.get('token')?.trim() ?? ''
  const authorizationCode = searchParams.get('code')?.trim() ?? ''
  const oauthError = searchParams.get('error')?.trim() ?? ''

  useEffect(() => {
    if (hasHandledOAuthRef.current) {
      return
    }

    hasHandledOAuthRef.current = true

    async function handleLegacyAccessToken() {
      clearPendingAccessToken()
      setAccessToken(legacyAccessToken)

      try {
        await useUserStore.getState().fetchUser()
        navigate('/home', { replace: true })
      } catch {
        clearAccessToken()
        useUserStore.getState().resetUser()
        navigate('/login', { replace: true })
      }
    }

    if (legacyAccessToken) {
      void handleLegacyAccessToken()
      return
    }

    if (oauthError || !authorizationCode) {
      clearAccessToken()
      clearPendingAccessToken()
      navigate('/login', { replace: true })
      return
    }

    async function exchangeCode() {
      clearAccessToken()
      clearPendingAccessToken()

      try {
        const response = await exchangeGoogleOAuthCode({
          code: authorizationCode,
        })

        if (response.requiresExtraSignup) {
          setPendingAccessToken(response.token)
          navigate('/extra-signup', { replace: true })
          return
        }

        setAccessToken(response.token)
        await useUserStore.getState().fetchUser()
        navigate('/home', { replace: true })
      } catch {
        clearAccessToken()
        clearPendingAccessToken()
        useUserStore.getState().resetUser()
        navigate('/login', { replace: true })
      }
    }

    void exchangeCode()
  }, [authorizationCode, legacyAccessToken, navigate, oauthError])

  return null
}
