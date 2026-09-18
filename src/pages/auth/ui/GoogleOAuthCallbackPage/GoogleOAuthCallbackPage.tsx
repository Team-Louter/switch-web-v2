import { useEffect, useRef } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

import { useUserStore } from '@/entities/profile'
import {
  exchangeGoogleOAuthCode,
  requiresRecoveryEmail,
} from '@/features/auth'
import {
  clearAccessToken,
  clearPendingAccessToken,
  promotePendingAccessToken,
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

    async function activateLoginToken(accessToken: string) {
      clearAccessToken()
      clearPendingAccessToken()
      setPendingAccessToken(accessToken, 'recovery-email')

      const profile = await useUserStore.getState().fetchUser()

      if (requiresRecoveryEmail(profile)) {
        navigate('/recovery-email', {
          replace: true,
          state: { from: '/home' },
        })
        return
      }

      if (!promotePendingAccessToken()) {
        throw new Error('로그인 토큰을 활성화하지 못했습니다.')
      }

      navigate('/home', { replace: true })
    }

    async function handleLegacyAccessToken() {
      try {
        await activateLoginToken(legacyAccessToken)
      } catch {
        clearAccessToken()
        clearPendingAccessToken()
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
          setPendingAccessToken(response.token, 'google-extra-signup')
          navigate('/extra-signup', { replace: true })
          return
        }

        await activateLoginToken(response.token)
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
