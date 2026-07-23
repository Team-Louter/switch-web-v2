import type { PropsWithChildren } from 'react'
import styled from 'styled-components'
import type { SidebarItemId } from '@/shared/constants/sidebar'
import * as token from '@/shared/styles/values/token'
import { Sidebar } from '@/widgets/sidebar/ui/Sidebar'

type AppLayoutProps = PropsWithChildren<{
  activeSidebarItemId: SidebarItemId
  onSidebarItemSelect: (itemId: SidebarItemId) => void
}>

export function AppLayout({
  activeSidebarItemId,
  children,
  onSidebarItemSelect,
}: AppLayoutProps) {
  return (
    <Layout>
      <Side>
        <Sidebar
          activeItemId={activeSidebarItemId}
          onItemSelect={onSidebarItemSelect}
        />
      </Side>
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

const Side = styled.div`
  ${token.flexLeft}
  align-items: flex-start;
  flex: 0 0 clamp(260px, 21.5vw, 309px);
  width: clamp(260px, 21.5vw, 309px);
  min-height: 100vh;
  padding: clamp(20px, 2vw, 30px);
`

const Body = styled.section`
  flex: 1 1 0;
  min-width: 0;
  min-height: 100vh;
  background: ${token.colors.white};
`
