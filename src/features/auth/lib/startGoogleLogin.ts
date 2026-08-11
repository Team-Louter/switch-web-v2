const GOOGLE_AUTHORIZATION_PATH = '/oauth2/authorization/google'

export function startGoogleLogin(): void {
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim()

  if (!apiBaseUrl) {
    return
  }

  const normalizedApiBaseUrl = apiBaseUrl.replace(/\/+$/, '')

  window.location.href = `${normalizedApiBaseUrl}${GOOGLE_AUTHORIZATION_PATH}`
}
