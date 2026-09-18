import { useEffect, useState, useSyncExternalStore } from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'

import { refreshAccessToken } from '@/shared/api'
import {
  AUTH_STATE_CHANGED_EVENT,
  clearAccessToken,
  clearPendingAccessToken,
  getAccessToken,
  getPendingAccessToken,
  getPendingAccessTokenFlow,
  hasAccessToken,
} from '@/shared/lib/authToken'

interface AuthenticationState {
  isAuthenticated: boolean
  isChecking: boolean
}

function subscribeToAuthState(onStoreChange: () => void) {
  function handleAuthStateChange() {
    onStoreChange()
  }

  window.addEventListener('storage', handleAuthStateChange)
  window.addEventListener(AUTH_STATE_CHANGED_EVENT, handleAuthStateChange)

  return () => {
    window.removeEventListener('storage', handleAuthStateChange)
    window.removeEventListener(AUTH_STATE_CHANGED_EVENT, handleAuthStateChange)
  }
}

function useAuthenticationState(): AuthenticationState {
  const isAuthenticated = useSyncExternalStore(
    subscribeToAuthState,
    hasAccessToken,
    () => false,
  )
  const accessToken = getAccessToken()
  const [checkedAccessToken, setCheckedAccessToken] = useState<string | null>(
    null,
  )
  const shouldRefresh = Boolean(
    accessToken && !isAuthenticated && checkedAccessToken !== accessToken,
  )

  useEffect(() => {
    if (!shouldRefresh || !accessToken) {
      return
    }

    refreshAccessToken()
      .catch(() => {
        clearAccessToken()
        clearPendingAccessToken()
      })
      .finally(() => {
        setCheckedAccessToken(accessToken)
      })
  }, [accessToken, shouldRefresh])

  return {
    isAuthenticated,
    isChecking: shouldRefresh,
  }
}

function getSafeReturnPath(locationState: unknown): string {
  if (
    typeof locationState !== 'object' ||
    locationState === null ||
    !('from' in locationState) ||
    typeof locationState.from !== 'string'
  ) {
    return '/home'
  }

  const returnPath = locationState.from

  return returnPath.startsWith('/') &&
    !returnPath.startsWith('//') &&
    !/^\/(?:login|signup)(?:[/?#]|$)/.test(returnPath)
    ? returnPath
    : '/home'
}

export function GuestOnlyRoute() {
  const { isAuthenticated, isChecking } = useAuthenticationState()
  const location = useLocation()
  const returnPath = getSafeReturnPath(location.state)
  const pendingRoute = getPendingAuthRoute()

  if (isChecking) {
    return null
  }

  if (pendingRoute) {
    return <Navigate to={pendingRoute} replace state={{ from: returnPath }} />
  }

  return isAuthenticated ? <Navigate to={returnPath} replace /> : <Outlet />
}

export function ProtectedRoute() {
  const { isAuthenticated, isChecking } = useAuthenticationState()
  const location = useLocation()
  const returnPath = `${location.pathname}${location.search}${location.hash}`
  const pendingRoute = getPendingAuthRoute()

  if (isChecking) {
    return null
  }

  if (pendingRoute) {
    if (location.pathname !== pendingRoute) {
      return <Navigate to={pendingRoute} replace state={{ from: returnPath }} />
    }

    return <Outlet />
  }

  return isAuthenticated ? (
    <Outlet />
  ) : (
    <Navigate to="/login" replace state={{ from: returnPath }} />
  )
}

export function PendingAuthRoute() {
  const location = useLocation()
  const pendingRoute = getPendingAuthRoute()

  if (!pendingRoute || location.pathname === pendingRoute) {
    return <Outlet />
  }

  const returnPath = `${location.pathname}${location.search}${location.hash}`

  return <Navigate to={pendingRoute} replace state={{ from: returnPath }} />
}

function getPendingAuthRoute(): '/extra-signup' | '/home' | null {
  if (!getPendingAccessToken()) {
    return null
  }

  const flow = getPendingAccessTokenFlow()

  if (flow === 'google-extra-signup') {
    return '/extra-signup'
  }

  if (flow === 'recovery-email') {
    return '/home'
  }

  return null
}

export function RootRoute() {
  const { isAuthenticated, isChecking } = useAuthenticationState()

  if (isChecking) {
    return null
  }

  return <Navigate to={isAuthenticated ? '/home' : '/login'} replace />
}
