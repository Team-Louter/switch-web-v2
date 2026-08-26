import {
  AlarmIcon,
  BookIcon,
  CalendarIcon,
  CommunityIcon,
  HomeIcon,
  MentoringIcon,
  StoreIcon,
  TypingIcon,
} from './icons'
import { IconBox, IconSvg } from './Sidebar.style'

import type { ReactElement, SVGProps } from 'react'
import type { SidebarItemId, SidebarMenuItem } from '@/shared/constants/sidebar'

type SidebarIconComponent = (props: SVGProps<SVGSVGElement>) => ReactElement

export type IconFrame = {
  Icon: SidebarIconComponent
  width: number
  height: number
  top: number
  left: number
}

type SidebarIconProps = {
  item: SidebarMenuItem
  active: boolean
}

type SidebarIconItemId = Exclude<SidebarItemId, 'my'>

const sidebarIcons: Record<SidebarIconItemId, IconFrame> = {
  home: { Icon: HomeIcon, width: 16.374, height: 16.931, top: 1.058, left: 1.812 },
  community: { Icon: CommunityIcon, width: 20, height: 20, top: 0, left: 0 },
  calendar: { Icon: CalendarIcon, width: 16.15, height: 17.877, top: 0.216, left: 1.924 },
  learning: { Icon: BookIcon, width: 18.333, height: 14.71, top: 3.062, left: 0.834 },
  mentoring: { Icon: MentoringIcon, width: 14.356, height: 17.557, top: 1.222, left: 2.822 },
  typing: { Icon: TypingIcon, width: 24, height: 20, top: 0, left: -2 },
  notification: { Icon: AlarmIcon, width: 15.978, height: 18.097, top: 1.374, left: 2.502 },
  store: { Icon: StoreIcon, width: 17.255, height: 16.436, top: 1.782, left: 1.373 },
}

export function SidebarIcon({ item, active }: SidebarIconProps) {
  const icon = sidebarIcons[item.id as SidebarIconItemId]
  const { Icon } = icon

  return (
    <IconBox aria-hidden="true" $wide={item.id === 'typing'}>
      <IconSvg $active={active} $frame={icon}>
        <Icon />
      </IconSvg>
    </IconBox>
  )
}
