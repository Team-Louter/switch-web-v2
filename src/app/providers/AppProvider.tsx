import type { PropsWithChildren } from 'react'
import { useEffect } from 'react'
import { QueryClientProvider } from '@tanstack/react-query'
import { Bounce, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import { GlobalStyle } from '@/shared/styles'
import { AUTH_STATE_CHANGED_EVENT, getAccessToken } from '@/shared/lib/authToken'
import { queryClient } from '@/shared/lib/queryClient'

export function AppProvider({ children }: PropsWithChildren) {
  useEffect(() => {
    function clearSignedOutCache() {
      if (!getAccessToken()) {
        queryClient.clear()
      }
    }

    function handleStorageChange(event: StorageEvent) {
      if (event.key === 'accessToken' || event.key === null) {
        queryClient.clear()
      }
    }

    window.addEventListener(AUTH_STATE_CHANGED_EVENT, clearSignedOutCache)
    window.addEventListener('storage', handleStorageChange)

    return () => {
      window.removeEventListener(AUTH_STATE_CHANGED_EVENT, clearSignedOutCache)
      window.removeEventListener('storage', handleStorageChange)
    }
  }, [])

  useEffect(() => {
    function preventMediaDrag(event: DragEvent) {
      const target = event.target

      if (target instanceof Element && target.closest('img, svg')) {
        event.preventDefault()
      }
    }

    document.addEventListener('dragstart', preventMediaDrag)

    return () => document.removeEventListener('dragstart', preventMediaDrag)
  }, [])

  return (
    <QueryClientProvider client={queryClient}>
      <GlobalStyle />
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition={Bounce}
      />
      {children}
    </QueryClientProvider>
  )
}
