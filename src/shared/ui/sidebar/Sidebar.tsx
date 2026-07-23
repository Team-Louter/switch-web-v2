import dividerImage from '@/shared/assets/sidebar/divider.svg'
import profileImage from '@/shared/assets/sidebar/profile.png'
import switchLogo from '@/shared/assets/sidebar/switch-logo.svg'

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
  Profile,
  ProfileMeta,
  ProfileName,
  ProfileText,
  Spacer,
} from './Sidebar.style'
import { SidebarIcon } from './SidebarIcon'
import { primaryMenu, utilityMenu } from './Sidebar.model'
import type { SidebarProps } from './Sidebar.model'

export function Sidebar({ activeItemId = 'home', onItemSelect }: SidebarProps) {
  return (
    <Aside aria-label="주요 메뉴">
      <LogoArea>
        <Logo src={switchLogo} alt="Switch" />
      </LogoArea>

      <MenuList>
        {primaryMenu.map((item) => (
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
        {utilityMenu.map((item) => (
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

      <Spacer />

      <Profile>
        <AvatarWrap>
          <Avatar src={profileImage} alt="" />
        </AvatarWrap>
        <ProfileText>
          <ProfileName>라우터</ProfileName>
          <ProfileMeta>2학년 0반 0번</ProfileMeta>
        </ProfileText>
      </Profile>
    </Aside>
  )
}
