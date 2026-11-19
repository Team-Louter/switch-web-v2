import type { SidebarItemId } from '@/shared/constants/sidebar'

const sidebarPageLoaders: Record<SidebarItemId, () => Promise<unknown>> = {
  home: () => import('@/pages/home'),
  community: () => import('@/pages/community/ui/CommunityPage'),
  calendar: () => import('@/pages/calendar'),
  learning: () => import('@/pages/study'),
  mentoring: () => import('@/pages/mentoring'),
  typing: () => import('@/pages/typing'),
  notification: () => import('@/pages/notification'),
  store: () => import('@/pages/store'),
  my: () => import('@/pages/my'),
}

export function preloadSidebarPage(itemId: SidebarItemId) {
  // 모듈만 준비합니다. 실패해도 현재 화면 사용과 이후 라우트 오류 처리를 방해하지 않습니다.
  void sidebarPageLoaders[itemId]().catch(() => {})
}
