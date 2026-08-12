import { useEffect, useMemo, useState } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import styled from 'styled-components'

import { getNotifications } from '@/entities/notification'
import {
  SIDEBAR_MENU,
  type SidebarItemId,
} from '@/shared/constants/sidebar'
import * as token from '@/shared/styles/values/token'
import { Sidebar } from '@/widgets/sidebar/ui/Sidebar'

export function AppLayout() {
  const location = useLocation()
  const navigate = useNavigate()
  const [notificationCount, setNotificationCount] = useState(0)

  const activeSidebarItemId = useMemo(() => {
    return (
      SIDEBAR_MENU.find((item) => item.path === location.pathname)?.id ?? 'home'
    )
  }, [location.pathname])
  const notificationCountLabel =
    notificationCount > 15
      ? '15+'
      : notificationCount > 0
        ? String(notificationCount)
        : undefined

  const handleSidebarItemSelect = (itemId: SidebarItemId) => {
    const path = SIDEBAR_MENU.find((item) => item.id === itemId)?.path

    if (path) {
      navigate(path)
    }
  }

  useEffect(() => {
    let isCancelled = false

    getNotifications()
      .then((notifications) => {
        if (!isCancelled) {
          setNotificationCount(
            notifications.filter((notification) => !notification.isRead)
              .length,
          )
        }
      })
      .catch(() => {})

    return () => {
      isCancelled = true
    }
  }, [])

  return (
    <Layout>
      <Side>
        <Sidebar
          activeItemId={activeSidebarItemId}
          notificationCount={notificationCountLabel}
          onItemSelect={handleSidebarItemSelect}
        />
      </Side>
      <Body>
        <Outlet context={{ setNotificationCount }} />
      </Body>
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
  position: sticky;
  top: 0;
  align-items: flex-start;
  align-self: flex-start;
  flex: 0 0 clamp(260px, 21.5vw, 309px);
  width: clamp(260px, 21.5vw, 309px);
  box-sizing: border-box;
  height: 100dvh;
  padding: clamp(20px, 2vw, 30px);
`

const Body = styled.section`
  flex: 1 1 0;
  min-width: 0;
  box-sizing: border-box;
  min-height: 100dvh;
  background: ${token.colors.white};
`
