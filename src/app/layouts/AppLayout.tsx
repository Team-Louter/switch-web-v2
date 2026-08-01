import type { PropsWithChildren } from 'react'
import { useMemo } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import {
  SIDEBAR_MENU,
  type SidebarItemId,
} from '@/shared/constants/sidebar'
import * as token from '@/shared/styles/values/token'
import { Sidebar } from '@/widgets/sidebar/ui/Sidebar'

type AppLayoutProps = PropsWithChildren

export function AppLayout({ children }: AppLayoutProps) {
  const location = useLocation()
  const navigate = useNavigate()
  const shouldShowSidebar =
    !location.pathname.startsWith('/my/edit') &&
    !location.pathname.startsWith('/my/withdraw-complete')

  const activeSidebarItemId = useMemo(() => {
    return (
      SIDEBAR_MENU.find((item) => item.path === location.pathname)?.id ?? 'home'
    )
  }, [location.pathname])

  const handleSidebarItemSelect = (itemId: SidebarItemId) => {
    const path = SIDEBAR_MENU.find((item) => item.id === itemId)?.path

    if (path) {
      navigate(path)
    }
  }

  return (
    <Layout>
      {shouldShowSidebar && (
        <Side>
          <Sidebar
            activeItemId={activeSidebarItemId}
            onItemSelect={handleSidebarItemSelect}
          />
        </Side>
      )}
      <Body>{children}</Body>
    </Layout>
  )
}

const Layout = styled.main`
  ${token.flexRow}
  align-items: flex-start;
  min-height: 100dvh;
  width: 100%;
  background: ${token.colors.white};
`

const Side = styled.div`
  ${token.flexLeft}
  align-items: flex-start;
  flex: 0 0 clamp(260px, 21.5vw, 309px);
  width: clamp(260px, 21.5vw, 309px);
  box-sizing: border-box;
  min-height: 100dvh;
  padding: clamp(20px, 2vw, 30px);
`

const Body = styled.section`
  flex: 1 1 0;
  min-width: 0;
  box-sizing: border-box;
  min-height: 100dvh;
  background: ${token.colors.white};
`
