const GOOGLE_OAUTH_START_PATH = '/auth/oauth/google/start'

export function startGoogleLogin(): boolean {
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim()

  if (!apiBaseUrl) {
    return false
  }

  const normalizedApiBaseUrl = apiBaseUrl.replace(/\/+$/, '')
  const callbackUrl = `${window.location.origin}/oauth/callback`
  const redirectUri = encodeURIComponent(callbackUrl)

  window.location.href = `${normalizedApiBaseUrl}${GOOGLE_OAUTH_START_PATH}?redirect_uri=${redirectUri}`

  return true
}
