export type SidebarItemId =
  | 'home'
  | 'community'
  | 'calendar'
  | 'learning'
  | 'mentoring'
  | 'typing'
  | 'notification'
  | 'store'

export type SidebarMenuItem = {
  id: SidebarItemId
  label: string
}

export type IconFrame = {
  svg: string
  width: number
  height: number
  top: number
  left: number
}

export type SidebarProps = {
  activeItemId?: SidebarItemId
  onItemSelect?: (itemId: SidebarItemId) => void
}

export const primaryMenu: SidebarMenuItem[] = [
  { id: 'home', label: '홈' },
  { id: 'community', label: '커뮤니티' },
  { id: 'calendar', label: '캘린더' },
  { id: 'learning', label: '학습관리' },
  { id: 'mentoring', label: '멘토링' },
  { id: 'typing', label: '타자연습' },
]

export const utilityMenu: SidebarMenuItem[] = [
  { id: 'notification', label: '알림' },
  { id: 'store', label: '상점' },
]
