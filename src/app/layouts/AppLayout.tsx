import type { PropsWithChildren } from 'react'
import styled from 'styled-components'

import * as token from '@/shared/styles/values/token'

export function AppLayout({ children }: PropsWithChildren) {
  return (
    <Layout>
      <Body>{children}</Body>
    </Layout>
  )
}

const Layout = styled.main`
  ${token.flexRow}
  align-items: flex-start;
  min-height: 100vh;
  width: 100%;
  background: ${token.colors.white};
`

const Body = styled.section`
  flex: 1 1 0;
  min-width: 0;
  min-height: 100vh;
  background: ${token.colors.white};
`
