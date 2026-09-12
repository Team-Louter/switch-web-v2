import type { PropsWithChildren } from 'react'
import { useEffect } from 'react'
import { Bounce, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import { GlobalStyle } from '@/shared/styles'

export function AppProvider({ children }: PropsWithChildren) {
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
    <>
      <GlobalStyle />
      <ToastContainer
        position="top-right"
        autoClose={5000}
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
    </>
  )
}
