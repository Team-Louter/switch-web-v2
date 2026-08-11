const GOOGLE_AUTHORIZATION_PATH = '/oauth2/authorization/google'

export function startGoogleLogin(): boolean {
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim()

  if (!apiBaseUrl) {
    return false
  }

  const normalizedApiBaseUrl = apiBaseUrl.replace(/\/+$/, '')

  window.location.href = `${normalizedApiBaseUrl}${GOOGLE_AUTHORIZATION_PATH}`

  return true
}
