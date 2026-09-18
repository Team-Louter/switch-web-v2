import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type SetStateAction,
} from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import styled from 'styled-components'

import { getUnreadNotificationCount } from '@/entities/notification'
import { formatProfileClassInfo, useUserStore } from '@/entities/profile'
import { SIDEBAR_MENU } from '@/shared/constants/sidebar'
import switchLogo from '@/shared/assets/sidebar/switch-logo.svg'
import {
  getProfileSyncPayload,
  PROFILE_SYNC_EVENT_NAME,
} from '@/shared/lib/profileSync'
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
  const fetchUser = useUserStore((state) => state.fetchUser)
  const [notificationCount, setNotificationCount] = useState(
    getStoredUnreadNotificationCount,
  )
  const [isSidebarProfileLoading, setIsSidebarProfileLoading] = useState(true)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [sidebarProfile, setSidebarProfile] = useState<SidebarProfile | null>(
    null,
  )
  const shouldShowSidebar =
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
      setIsMobileMenuOpen(false)
      navigate(path)
    }
  }

  const updateNotificationCount = useCallback(
    (nextCount: SetStateAction<number>) => {
      setNotificationCount((currentCount) => {
        const resolvedCount =
          typeof nextCount === 'function'
            ? nextCount(currentCount)
            : nextCount

        return Number.isFinite(resolvedCount)
          ? Math.max(0, Math.floor(resolvedCount))
          : 0
      })
    },
    [],
  )

  useEffect(() => {
    saveUnreadNotificationCount(notificationCount)
  }, [notificationCount])

  useEffect(() => {
    let isCancelled = false

    const synchronizeProfile = async () => {
      try {
        const profile = await fetchUser()
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
          setIsSidebarProfileLoading(false)
        }
      } catch {
        if (!isCancelled) {
          setSidebarProfile(null)
          setIsSidebarProfileLoading(false)
        }
      }
    }

    const handleProfileSync = (event: Event) => {
      const payload = getProfileSyncPayload(event)

      if (payload?.equippedItems) {
        setSidebarProfile((currentProfile) =>
          currentProfile
            ? { ...currentProfile, equippedItems: payload.equippedItems }
            : currentProfile,
        )
        return
      }

      void synchronizeProfile()
    }

    void synchronizeProfile()
    window.addEventListener(PROFILE_SYNC_EVENT_NAME, handleProfileSync)

    return () => {
      isCancelled = true
      window.removeEventListener(PROFILE_SYNC_EVENT_NAME, handleProfileSync)
    }
  }, [fetchUser, location.pathname])

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
        <>
          <MobileHeader>
            <MobileMenuButton
              type="button"
              aria-label="메뉴 열기"
              aria-expanded={isMobileMenuOpen}
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <span />
              <span />
              <span />
            </MobileMenuButton>
            <MobileLogo src={switchLogo} alt="Switch" />
          </MobileHeader>
          <MobileBackdrop
            type="button"
            aria-label="메뉴 닫기"
            $open={isMobileMenuOpen}
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <Side $open={isMobileMenuOpen}>
            <SidebarContainer>
            <Sidebar
              activeItemId={activeSidebarItemId}
              notificationCount={notificationCount}
              isProfileLoading={isSidebarProfileLoading}
              profile={sidebarProfile}
              onItemSelect={handleSidebarItemSelect}
            />
            </SidebarContainer>
          </Side>
        </>
      )}
      <Body $withMobileNav={shouldShowSidebar}>
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

const Side = styled.div<{ $open: boolean }>`
  ${token.flexLeft}
  align-items: flex-start;
  flex: 0 0 clamp(260px, 21.5vw, 309px);
  width: clamp(260px, 21.5vw, 309px);
  box-sizing: border-box;
  min-height: 100dvh;

  @media (max-width: 768px) {
    position: fixed;
    z-index: 110;
    inset: 0 auto 0 0;
    width: min(309px, calc(100vw - 48px));
    transform: translateX(${({ $open }) => ($open ? '0' : '-100%')});
    transition: transform 200ms ease;
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`

const SidebarContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: clamp(260px, 21.5vw, 309px);
  height: 100dvh;
  box-sizing: border-box;
  padding: clamp(20px, 2vw, 30px);

  @media (max-width: 768px) {
    width: min(309px, calc(100vw - 48px));
    padding: 12px;
    background: ${token.colors.white};
  }
`

const Body = styled.section<{ $withMobileNav: boolean }>`
  flex: 1 1 0;
  min-width: 0;
  box-sizing: border-box;
  min-height: 100dvh;
  background: ${token.colors.white};

  @media (max-width: 768px) {
    width: 100%;
    padding-top: ${({ $withMobileNav }) => ($withMobileNav ? '60px' : '0')};
  }
`

const MobileHeader = styled.header`
  display: none;

  @media (max-width: 768px) {
    position: fixed;
    z-index: 100;
    inset: 0 0 auto;
    display: flex;
    align-items: center;
    gap: 12px;
    height: 60px;
    padding: 0 16px;
    border-bottom: 1px solid ${token.colors.gray.gray10};
    background: rgb(255 255 255 / 94%);
    backdrop-filter: blur(10px);
  }
`

const MobileMenuButton = styled.button`
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 4px;
  width: 40px;
  height: 40px;
  padding: 9px;
  border-radius: ${token.shapes.medium};

  span {
    width: 22px;
    height: 2px;
    border-radius: 999px;
    background: ${token.colors.gray.gray80};
  }
`

const MobileLogo = styled.img`
  display: block;
  width: 112px;
  height: auto;
`
const MobileBackdrop = styled.button<{ $open: boolean }>`
  display: none;

  @media (max-width: 768px) {
    position: fixed;
    z-index: 105;
    inset: 0;
    display: block;
    border: 0;
    background: rgb(14 13 12 / 45%);
    opacity: ${({ $open }) => ($open ? 1 : 0)};
    pointer-events: ${({ $open }) => ($open ? 'auto' : 'none')};
    transition: opacity 200ms ease;
  }
`
