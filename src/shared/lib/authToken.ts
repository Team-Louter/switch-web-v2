const ACCESS_TOKEN_STORAGE_KEY = 'accessToken'
const PENDING_ACCESS_TOKEN_STORAGE_KEY = 'pendingAccessToken'
const PENDING_ACCESS_TOKEN_FLOW_STORAGE_KEY = 'pendingAccessTokenFlow'
const ACCESS_TOKEN_EXPIRATION_LEEWAY_SECONDS = 30

export type PendingAccessTokenFlow = 'google-extra-signup' | 'recovery-email'

interface JwtPayload {
  exp: number
}

export const AUTH_STATE_CHANGED_EVENT = 'auth:state-changed'

export function getAccessToken(): string | null {
  return localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY)
}

export function isAccessTokenExpired(accessToken: string): boolean {
  const payload = parseJwtPayload(accessToken)

  if (!payload) {
    return true
  }

  const currentTimeWithLeeway =
    Date.now() / 1000 + ACCESS_TOKEN_EXPIRATION_LEEWAY_SECONDS

  return payload.exp <= currentTimeWithLeeway
}

export function hasAccessToken(): boolean {
  const accessToken = getAccessToken()

  return Boolean(accessToken && !isAccessTokenExpired(accessToken))
}

export function setAccessToken(accessToken: string) {
  localStorage.setItem(ACCESS_TOKEN_STORAGE_KEY, accessToken)
  window.dispatchEvent(new Event(AUTH_STATE_CHANGED_EVENT))
}

export function getPendingAccessToken(): string | null {
  return localStorage.getItem(PENDING_ACCESS_TOKEN_STORAGE_KEY)
}

export function setPendingAccessToken(
  accessToken: string,
  flow: PendingAccessTokenFlow = 'google-extra-signup',
) {
  localStorage.setItem(PENDING_ACCESS_TOKEN_STORAGE_KEY, accessToken)
  localStorage.setItem(PENDING_ACCESS_TOKEN_FLOW_STORAGE_KEY, flow)
}

export function getPendingAccessTokenFlow(): PendingAccessTokenFlow | null {
  const flow = localStorage.getItem(PENDING_ACCESS_TOKEN_FLOW_STORAGE_KEY)

  return flow === 'google-extra-signup' || flow === 'recovery-email'
    ? flow
    : null
}

export function clearPendingAccessToken() {
  localStorage.removeItem(PENDING_ACCESS_TOKEN_STORAGE_KEY)
  localStorage.removeItem(PENDING_ACCESS_TOKEN_FLOW_STORAGE_KEY)
}

export function promotePendingAccessToken(): boolean {
  const pendingAccessToken = getPendingAccessToken()

  if (!pendingAccessToken) {
    return false
  }

  clearPendingAccessToken()
  setAccessToken(pendingAccessToken)

  return true
}

export function clearAccessToken() {
  localStorage.removeItem(ACCESS_TOKEN_STORAGE_KEY)
  window.dispatchEvent(new Event(AUTH_STATE_CHANGED_EVENT))
}

function parseJwtPayload(accessToken: string): JwtPayload | null {
  const encodedPayload = accessToken.split('.')[1]

  if (!encodedPayload) {
    return null
  }

  try {
    const normalizedPayload = encodedPayload
      .replace(/-/g, '+')
      .replace(/_/g, '/')
    const paddedPayload = normalizedPayload.padEnd(
      Math.ceil(normalizedPayload.length / 4) * 4,
      '=',
    )
    const payload: unknown = JSON.parse(atob(paddedPayload))

    if (
      typeof payload !== 'object' ||
      payload === null ||
      !('exp' in payload) ||
      typeof payload.exp !== 'number'
    ) {
      return null
    }

    return { exp: payload.exp }
  } catch {
    return null
  }
}
