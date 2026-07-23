import alarmIconSvg from '@/shared/assets/sidebar/alarm.svg?raw'
import bookIconSvg from '@/shared/assets/sidebar/book.svg?raw'
import calendarIconSvg from '@/shared/assets/sidebar/calendar.svg?raw'
import communityIconBackSvg from '@/shared/assets/sidebar/community-a.svg?raw'
import communityIconFrontSvg from '@/shared/assets/sidebar/community-b.svg?raw'
import homeIconSvg from '@/shared/assets/sidebar/home.svg?raw'
import mentoringIconSvg from '@/shared/assets/sidebar/mentoring.svg?raw'
import storeIconSvg from '@/shared/assets/sidebar/store.svg?raw'
import typingIconSvg from '@/shared/assets/sidebar/typing.svg?raw'

import {
  CommunityIconBack,
  CommunityIconFront,
  IconBox,
  IconSvg,
} from './Sidebar.style'
import type { IconFrame, SidebarItemId, SidebarMenuItem } from './Sidebar.model'

type SidebarIconProps = {
  item: SidebarMenuItem
  active: boolean
}

export function SidebarIcon({ item, active }: SidebarIconProps) {
  if (item.id === 'community') {
    return (
      <IconBox aria-hidden="true">
        <CommunityIconBack
          $active={active}
          dangerouslySetInnerHTML={{ __html: colorizeSvg(communityIconBackSvg) }}
        />
        <CommunityIconFront
          $active={active}
          dangerouslySetInnerHTML={{ __html: colorizeSvg(communityIconFrontSvg) }}
        />
      </IconBox>
    )
  }

  const icon = getIconFrame(item.id)

  return (
    <IconBox aria-hidden="true" $wide={item.id === 'typing'}>
      <IconSvg
        $active={active}
        $frame={icon}
        dangerouslySetInnerHTML={{ __html: colorizeSvg(icon.svg) }}
      />
    </IconBox>
  )
}

function getIconFrame(itemId: Exclude<SidebarItemId, 'community'>) {
  const iconMap: Record<Exclude<SidebarItemId, 'community'>, IconFrame> = {
    home: { svg: homeIconSvg, width: 16.374, height: 16.931, top: 1.058, left: 1.812 },
    calendar: { svg: calendarIconSvg, width: 16.15, height: 17.877, top: 0.216, left: 1.924 },
    learning: { svg: bookIconSvg, width: 18.333, height: 14.71, top: 3.062, left: 0.834 },
    mentoring: { svg: mentoringIconSvg, width: 14.356, height: 17.557, top: 1.222, left: 2.822 },
    typing: { svg: typingIconSvg, width: 24, height: 20, top: 0, left: -2 },
    notification: { svg: alarmIconSvg, width: 15.978, height: 18.097, top: 1.374, left: 2.502 },
    store: { svg: storeIconSvg, width: 17.255, height: 16.436, top: 1.782, left: 1.373 },
  }

  return iconMap[itemId]
}

function colorizeSvg(svg: string) {
  return svg.replace(/fill="#(?:535046|B9B6AC)"/g, 'fill="currentColor"')
}
