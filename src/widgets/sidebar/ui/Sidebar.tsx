import { useEffect, useRef, useState } from 'react'

import switchLogo from '@/shared/assets/sidebar/switch-logo.svg'
import {
  MY_SIDEBAR_ITEM,
  PRIMARY_SIDEBAR_MENU,
  UTILITY_SIDEBAR_MENU,
} from '@/shared/constants/sidebar'
import { ProfileAvatar } from '@/shared/ui'

import type { ProfileAvatarEquippedItems } from '@/shared/ui'
import type { SidebarItemId } from '@/shared/constants/sidebar'

import {
  Aside,
  Divider,
  Logo,
  LogoArea,
  MenuButton,
  MenuLabel,
  MenuList,
  NotificationCount,
  ProfileButton,
  ProfileMeta,
  ProfileName,
  ProfileText,
  Spacer,
  type NotificationCountAnimationDirection,
} from './Sidebar.style'
import { SidebarIcon } from './SidebarIcon'

interface SidebarProps {
  activeItemId?: SidebarItemId
  notificationCount?: number
  onItemSelect?: (itemId: SidebarItemId) => void
  profile?: {
    classInfo: string
    equippedItems?: ProfileAvatarEquippedItems
    imageUrl?: string
    name: string
  } | null
}

export function Sidebar({
  activeItemId = 'home',
  notificationCount = 0,
  onItemSelect,
  profile,
}: SidebarProps) {
  const previousNotificationCountRef = useRef(notificationCount)
  const [notificationCountDirection, setNotificationCountDirection] =
    useState<NotificationCountAnimationDirection>()
  const notificationCountLabel =
    notificationCount >= 15 ? '15+' : String(notificationCount)

  useEffect(() => {
    const previousNotificationCount = previousNotificationCountRef.current

    if (notificationCount === previousNotificationCount) {
      return
    }

    previousNotificationCountRef.current = notificationCount
    setNotificationCountDirection(
      notificationCount > previousNotificationCount ? 'increase' : 'decrease',
    )

    const animationTimer = window.setTimeout(() => {
      setNotificationCountDirection(undefined)
    }, 220)

    return () => {
      window.clearTimeout(animationTimer)
    }
  }, [notificationCount])

  return (
    <Aside aria-label="주요 메뉴">
      <LogoArea>
        <Logo src={switchLogo} alt="Switch" />
      </LogoArea>

      <MenuList>
        {PRIMARY_SIDEBAR_MENU.map((item) => (
          <MenuButton
            key={item.id}
            type="button"
            aria-current={activeItemId === item.id ? 'page' : undefined}
            $active={activeItemId === item.id}
            onClick={() => onItemSelect?.(item.id)}
          >
            <SidebarIcon item={item} active={activeItemId === item.id} />
            <MenuLabel $active={activeItemId === item.id}>{item.label}</MenuLabel>
          </MenuButton>
        ))}
      </MenuList>

      <Divider aria-hidden="true" />

      <MenuList>
        {UTILITY_SIDEBAR_MENU.map((item) => (
          <MenuButton
            key={item.id}
            type="button"
            aria-current={activeItemId === item.id ? 'page' : undefined}
            $active={activeItemId === item.id}
            onClick={() => onItemSelect?.(item.id)}
          >
            <SidebarIcon item={item} active={activeItemId === item.id} />
            <MenuLabel $active={activeItemId === item.id}>{item.label}</MenuLabel>
            {item.id === 'notification' && notificationCount > 0 && (
              <NotificationCount
                key={notificationCount}
                $direction={notificationCountDirection}
              >
                {notificationCountLabel}
              </NotificationCount>
            )}
          </MenuButton>
        ))}
      </MenuList>

      <Spacer />

      <ProfileButton
        type="button"
        aria-current={activeItemId === MY_SIDEBAR_ITEM.id ? 'page' : undefined}
        onClick={() => onItemSelect?.(MY_SIDEBAR_ITEM.id)}
      >
        <ProfileAvatar
          imageUrl={profile?.imageUrl}
          equippedItems={profile?.equippedItems}
          size={43}
        />
        <ProfileText>
          <ProfileName>{profile?.name ?? ''}</ProfileName>
          <ProfileMeta>{profile?.classInfo ?? ''}</ProfileMeta>
        </ProfileText>
      </ProfileButton>
    </Aside>
  )
}
