const ACCESS_TOKEN_STORAGE_KEY = 'accessToken'

export const AUTH_STATE_CHANGED_EVENT = 'auth:state-changed'

export function getAccessToken(): string | null {
  return localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY)
}

export function hasAccessToken(): boolean {
  return Boolean(getAccessToken())
}

export function setAccessToken(accessToken: string) {
  localStorage.setItem(ACCESS_TOKEN_STORAGE_KEY, accessToken)
  window.dispatchEvent(new Event(AUTH_STATE_CHANGED_EVENT))
}

export function clearAccessToken() {
  localStorage.removeItem(ACCESS_TOKEN_STORAGE_KEY)
  window.dispatchEvent(new Event(AUTH_STATE_CHANGED_EVENT))
}
