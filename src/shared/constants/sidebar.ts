export type SidebarItemId =
  | 'home'
  | 'community'
  | 'calendar'
  | 'learning'
  | 'mentoring'
  | 'typing'
  | 'notification'
  | 'store'
  | 'my'

export type SidebarMenuItem = {
  id: SidebarItemId
  label: string
  path: string
}

export const PRIMARY_SIDEBAR_MENU: SidebarMenuItem[] = [
  { id: 'home', label: '홈', path: '/' },
  { id: 'community', label: '커뮤니티', path: '/community' },
  { id: 'calendar', label: '캘린더', path: '/calendar' },
  { id: 'learning', label: '학습관리', path: '/learning' },
  { id: 'mentoring', label: '멘토링', path: '/mentoring' },
  { id: 'typing', label: '타자연습', path: '/typing' },
]

export const UTILITY_SIDEBAR_MENU: SidebarMenuItem[] = [
  { id: 'notification', label: '알림', path: '/notification' },
  { id: 'store', label: '상점', path: '/store' },
]

export const MY_SIDEBAR_ITEM: SidebarMenuItem = {
  id: 'my',
  label: '마이',
  path: '/my',
}

export const SIDEBAR_MENU = [
  ...PRIMARY_SIDEBAR_MENU,
  ...UTILITY_SIDEBAR_MENU,
  MY_SIDEBAR_ITEM,
] as const
