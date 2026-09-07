import { useCallback, useEffect, useMemo, useState } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import styled from 'styled-components'

import { getUnreadNotificationCount } from '@/entities/notification'
import { formatProfileClassInfo, getMyProfile } from '@/entities/profile'
import { SIDEBAR_MENU } from '@/shared/constants/sidebar'
import * as token from '@/shared/styles/values/token'
import { Sidebar } from '@/widgets/sidebar/ui/Sidebar'

import type { ProfileEquippedItems } from '@/entities/profile'
import type { SidebarItemId } from '@/shared/constants/sidebar'

const UNREAD_NOTIFICATION_COUNT_STORAGE_KEY = 'switch:unread-notification-count'
const UNREAD_NOTIFICATION_POLLING_INTERVAL = 15_000

interface SidebarProfile {
  classInfo: string
  equippedItems?: ProfileEquippedItems
  imageUrl?: string
  name: string
}

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
  const [sidebarProfile, setSidebarProfile] = useState<SidebarProfile | null>(
    null,
  )
  const shouldShowSidebar =
    !location.pathname.startsWith('/my/edit') &&
    !location.pathname.startsWith('/my/withdraw-complete') &&
    location.pathname !== '/typing/daily' &&
    !location.pathname.startsWith('/typing/code/')

  const activeSidebarItemId = useMemo(() => {
    return (
      SIDEBAR_MENU.find((item) =>
        item.path === '/'
          ? location.pathname === '/'
          : location.pathname === item.path ||
            location.pathname.startsWith(`${item.path}/`),
      )?.id ?? 'home'
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

    const synchronizeProfile = async () => {
      try {
        const profile = await getMyProfile()
        const nextProfile: SidebarProfile = {
          classInfo: formatProfileClassInfo(profile),
          name: profile.userName,
        }

        if (profile.profileImageUrl) {
          nextProfile.imageUrl = profile.profileImageUrl
        }

        if (profile.equippedItems) {
          nextProfile.equippedItems = profile.equippedItems
        }

        if (!isCancelled) {
          setSidebarProfile(nextProfile)
        }
      } catch {
        if (!isCancelled) {
          setSidebarProfile(null)
        }
      }
    }

    void synchronizeProfile()

    return () => {
      isCancelled = true
    }
  }, [location.pathname])

  useEffect(() => {
    let isCancelled = false

    const synchronizeNotificationCount = async () => {
      try {
        const unreadCount = await getUnreadNotificationCount()

        if (!isCancelled) {
          updateNotificationCount(unreadCount)
        }
      } catch {
        // Keep the latest verified count until the next synchronization.
      }
    }

    const handleVisibilityChange = () => {
      if (!document.hidden) {
        void synchronizeNotificationCount()
      }
    }

    void synchronizeNotificationCount()

    const pollingTimer = window.setInterval(() => {
      if (!document.hidden) {
        void synchronizeNotificationCount()
      }
    }, UNREAD_NOTIFICATION_POLLING_INTERVAL)

    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      isCancelled = true
      window.clearInterval(pollingTimer)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [updateNotificationCount])

  return (
    <Layout>
      {shouldShowSidebar && (
        <Side>
          <SidebarContainer>
            <Sidebar
              activeItemId={activeSidebarItemId}
              notificationCount={notificationCount}
              profile={sidebarProfile}
              onItemSelect={handleSidebarItemSelect}
            />
          </SidebarContainer>
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
  align-items: flex-start;
  flex: 0 0 clamp(260px, 21.5vw, 309px);
  width: clamp(260px, 21.5vw, 309px);
  box-sizing: border-box;
  min-height: 100dvh;
`

const SidebarContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: clamp(260px, 21.5vw, 309px);
  height: 100dvh;
  box-sizing: border-box;
  padding: clamp(20px, 2vw, 30px);
`

const Body = styled.section`
  flex: 1 1 0;
  min-width: 0;
  box-sizing: border-box;
  min-height: 100dvh;
  background: ${token.colors.white};
`
