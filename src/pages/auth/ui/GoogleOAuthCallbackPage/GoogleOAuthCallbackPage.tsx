import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

import {
  clearAccessToken,
  clearPendingAccessToken,
  setAccessToken,
} from '@/shared/lib/authToken'

export function GoogleOAuthCallbackPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const accessToken = searchParams.get('token')?.trim() ?? ''

  useEffect(() => {
    clearPendingAccessToken()

    if (!accessToken) {
      clearAccessToken()
      navigate('/login', { replace: true })
      return
    }

    setAccessToken(accessToken)
    navigate('/home', { replace: true })
  }, [accessToken, navigate])

  return null
}
