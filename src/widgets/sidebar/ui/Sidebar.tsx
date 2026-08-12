import dividerImage from '@/shared/assets/sidebar/divider.svg'
import profileImage from '@/shared/assets/sidebar/profile.png'
import switchLogo from '@/shared/assets/sidebar/switch-logo.svg'
import {
  MY_SIDEBAR_ITEM,
  PRIMARY_SIDEBAR_MENU,
  UTILITY_SIDEBAR_MENU,
} from '@/shared/constants/sidebar'
import type { SidebarItemId } from '@/shared/constants/sidebar'

import {
  Aside,
  Avatar,
  AvatarWrap,
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
} from './Sidebar.style'
import { SidebarIcon } from './SidebarIcon'

interface SidebarProps {
  activeItemId?: SidebarItemId
  notificationCount?: string
  onItemSelect?: (itemId: SidebarItemId) => void
}

export function Sidebar({
  activeItemId = 'home',
  notificationCount,
  onItemSelect,
}: SidebarProps) {
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

      <Divider src={dividerImage} alt="" aria-hidden="true" />

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
            {item.id === 'notification' && notificationCount && (
              <NotificationCount>{notificationCount}</NotificationCount>
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
        <AvatarWrap>
          <Avatar src={profileImage} alt="" />
        </AvatarWrap>
        <ProfileText>
          <ProfileName>라우터</ProfileName>
          <ProfileMeta>2학년 0반 0번</ProfileMeta>
        </ProfileText>
      </ProfileButton>
    </Aside>
  )
}
