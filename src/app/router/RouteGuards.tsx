import { useSyncExternalStore } from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'

import {
  AUTH_STATE_CHANGED_EVENT,
  hasAccessToken,
} from '@/shared/lib/authToken'

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

function useIsAuthenticated() {
  return useSyncExternalStore(subscribeToAuthState, hasAccessToken, () => false)
}

export function GuestOnlyRoute() {
  const isAuthenticated = useIsAuthenticated()

  return isAuthenticated ? <Navigate to="/home" replace /> : <Outlet />
}

export function ProtectedRoute() {
  const isAuthenticated = useIsAuthenticated()
  const location = useLocation()
  const returnPath = `${location.pathname}${location.search}${location.hash}`

  return isAuthenticated ? (
    <Outlet />
  ) : (
    <Navigate to="/login" replace state={{ from: returnPath }} />
  )
}

export function RootRoute() {
  const isAuthenticated = useIsAuthenticated()

  return <Navigate to={isAuthenticated ? '/home' : '/login'} replace />
}
