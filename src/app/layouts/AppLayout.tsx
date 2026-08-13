import { useCallback, useEffect, useMemo, useState } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import styled from 'styled-components'

import { getUnreadNotificationCount } from '@/entities/notification'
import { SIDEBAR_MENU } from '@/shared/constants/sidebar'
import * as token from '@/shared/styles/values/token'
import { Sidebar } from '@/widgets/sidebar/ui/Sidebar'

import type { SidebarItemId } from '@/shared/constants/sidebar'

const UNREAD_NOTIFICATION_COUNT_STORAGE_KEY = 'switch:unread-notification-count'

function getStoredUnreadNotificationCount(): number {
  if (typeof window === 'undefined') {
    return 0
  }

  const storedCount = Number.parseInt(
    window.localStorage.getItem(UNREAD_NOTIFICATION_COUNT_STORAGE_KEY) ?? '',
    10,
  )

  return Number.isFinite(storedCount) && storedCount > 0 ? storedCount : 0
}

function saveUnreadNotificationCount(count: number) {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.setItem(
    UNREAD_NOTIFICATION_COUNT_STORAGE_KEY,
    String(count),
  )
}

export function AppLayout() {
  const location = useLocation()
  const navigate = useNavigate()
  const [notificationCount, setNotificationCount] = useState(
    getStoredUnreadNotificationCount,
  )
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

  const updateNotificationCount = useCallback((count: number) => {
    const normalizedCount = Number.isFinite(count)
      ? Math.max(0, Math.floor(count))
      : 0

    setNotificationCount(normalizedCount)
    saveUnreadNotificationCount(normalizedCount)
  }, [])

  useEffect(() => {
    let isCancelled = false

    getUnreadNotificationCount()
      .then((unreadCount) => {
        if (!isCancelled) {
          updateNotificationCount(unreadCount)
        }
      })
      .catch(() => {})

    return () => {
      isCancelled = true
    }
  }, [updateNotificationCount])

  return (
    <Layout>
      {shouldShowSidebar && (
        <Side>
          <Sidebar
            activeItemId={activeSidebarItemId}
            notificationCount={notificationCount}
            onItemSelect={handleSidebarItemSelect}
          />
        </Side>
      )}
      <Body>
        <Outlet context={{ setNotificationCount: updateNotificationCount }} />
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
