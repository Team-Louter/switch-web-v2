import type { PropsWithChildren } from 'react'
import { useEffect } from 'react'

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
      {children}
    </>
  )
}
