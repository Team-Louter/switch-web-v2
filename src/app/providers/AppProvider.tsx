import type { PropsWithChildren } from 'react'

import { GlobalStyle } from '@/shared/styles'

export function AppProvider({ children }: PropsWithChildren) {
  return (
    <>
      <GlobalStyle />
      {children}
    </>
  )
}
