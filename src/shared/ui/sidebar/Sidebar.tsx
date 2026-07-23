import styled, { css } from 'styled-components'

import alarmIcon from '@/shared/assets/sidebar/alarm.svg'
import bookIcon from '@/shared/assets/sidebar/book.svg'
import calendarIcon from '@/shared/assets/sidebar/calendar.svg'
import communityIconBack from '@/shared/assets/sidebar/community-a.svg'
import communityIconFront from '@/shared/assets/sidebar/community-b.svg'
import dividerImage from '@/shared/assets/sidebar/divider.svg'
import homeIcon from '@/shared/assets/sidebar/home.svg'
import mentoringIcon from '@/shared/assets/sidebar/mentoring.svg'
import profileImage from '@/shared/assets/sidebar/profile.png'
import storeIcon from '@/shared/assets/sidebar/store.svg'
import switchLogo from '@/shared/assets/sidebar/switch-logo.svg'
import typingIcon from '@/shared/assets/sidebar/typing.svg'
import * as token from '@/shared/styles/values/token'

type MenuItem = {
  id: string
  label: string
  icon: string
  active?: boolean
}

const primaryMenu: MenuItem[] = [
  { id: 'home', label: '홈', icon: homeIcon, active: true },
  { id: 'community', label: '커뮤니티', icon: 'community' },
  { id: 'calendar', label: '캘린더', icon: calendarIcon },
  { id: 'learning', label: '학습관리', icon: bookIcon },
  { id: 'mentoring', label: '멘토링', icon: mentoringIcon },
  { id: 'typing', label: '타자연습', icon: typingIcon },
]

const utilityMenu: MenuItem[] = [
  { id: 'notification', label: '알림', icon: alarmIcon },
  { id: 'store', label: '상점', icon: storeIcon },
]

export function Sidebar() {
  return (
    <Aside aria-label="주요 메뉴">
      <LogoArea>
        <Logo src={switchLogo} alt="Switch" />
      </LogoArea>

      <MenuList>
        {primaryMenu.map((item) => (
          <MenuButton key={item.id} type="button" $active={item.active}>
            <SidebarIcon item={item} />
            <MenuLabel $active={item.active}>{item.label}</MenuLabel>
          </MenuButton>
        ))}
      </MenuList>

      <Divider src={dividerImage} alt="" aria-hidden="true" />

      <MenuList>
        {utilityMenu.map((item) => (
          <MenuButton key={item.id} type="button">
            <SidebarIcon item={item} />
            <MenuLabel>{item.label}</MenuLabel>
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

function SidebarIcon({ item }: { item: MenuItem }) {
  if (item.icon === 'community') {
    return (
      <IconBox aria-hidden="true">
        <CommunityIconBack src={communityIconBack} alt="" />
        <CommunityIconFront src={communityIconFront} alt="" />
      </IconBox>
    )
  }

  return (
    <IconBox aria-hidden="true" $wide={item.id === 'typing'}>
      {item.id === 'typing' ? (
        <TypingIconImage src={item.icon} alt="" />
      ) : (
        <IconImage src={item.icon} alt="" />
      )}
    </IconBox>
  )
}

const Aside = styled.aside`
  ${token.flexColumnStart}
  flex: 0 0 249px;
  width: 249px;
  height: 922px;
  transform: scale(var(--sidebar-scale, 1));
  transform-origin: top left;
  gap: 40px;
  overflow: hidden;
  padding: 36px 20px;
  border-radius: ${token.shapes.xlarge};
  background: ${token.colors.gray.gray0};
`

const LogoArea = styled.div`
  ${token.flexLeft}
  width: 100%;
  padding: 0 10px;
`

const Logo = styled.img`
  width: 91.667px;
  height: 25px;
`

const MenuList = styled.div`
  ${token.flexColumnStart}
  width: 100%;
  gap: 15px;
`

const MenuButton = styled.button<{ $active?: boolean }>`
  ${token.flexLeft}
  width: 100%;
  gap: 20px;
  overflow: hidden;
  padding: 13px 10px;
  border-radius: ${token.shapes.medium};
  background: ${({ $active }) => ($active ? token.colors.white : 'transparent')};
`

const IconBox = styled.span<{ $wide?: boolean }>`
  position: relative;
  flex: 0 0 20px;
  width: 20px;
  height: 20px;
  overflow: hidden;

  ${({ $wide }) =>
    $wide &&
    css`
      overflow: visible;
    `}
`

const IconImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;
`

const TypingIconImage = styled(IconImage)`
  width: 24px;
  max-width: none;
  transform: translateX(-2px);
`

const CommunityIconBack = styled.img`
  position: absolute;
  right: 0.88px;
  top: 3.37px;
  width: 13.4px;
  height: 13.19px;
`

const CommunityIconFront = styled.img`
  position: absolute;
  left: 0.88px;
  bottom: 3.37px;
  width: 7.68px;
  height: 9.17px;
`

const MenuLabel = styled.span<{ $active?: boolean }>`
  color: ${({ $active }) =>
    $active ? token.colors.gray.gray90 : token.colors.gray.gray50};
  line-height: 1;
  white-space: nowrap;
  ${token.typography('body', 'md', 'semibold')}
`

const Divider = styled.img`
  width: 100%;
  height: 1px;
`

const Spacer = styled.div`
  flex: 1 1 0;
  min-height: 1px;
`

const Profile = styled.div`
  ${token.flexLeft}
  width: 100%;
  gap: 10px;
  overflow: hidden;
  padding: 13px 10px;
`

const AvatarWrap = styled.div`
  position: relative;
  flex: 0 0 43px;
  width: 43px;
  height: 43px;
  overflow: hidden;
  border-radius: ${token.shapes.circle};
  background: ${token.colors.primary.primary10};
`

const Avatar = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`

const ProfileText = styled.div`
  ${token.flexColumn}
  align-items: flex-start;
  justify-content: center;
  gap: 5px;
  min-width: 0;
  white-space: nowrap;
`

const ProfileName = styled.span`
  color: ${token.colors.gray.gray100};
  line-height: 1;
  ${token.typography('body', 'lg', 'semibold')}
`

const ProfileMeta = styled.span`
  color: ${token.colors.gray.gray70};
  line-height: 1;
  ${token.typography('caption', 'sm', 'regular')}
`
