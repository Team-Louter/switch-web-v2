import type { ComponentType } from 'react'
import { useState } from 'react'

import {
  CalendarPage,
  CommunityPage,
  HomePage,
  LearningPage,
  MentoringPage,
  NotificationPage,
  StorePage,
  TypingPage,
} from '@/pages'
import type { SidebarItemId } from '@/shared/constants/sidebar'

import { AppLayout } from './layouts'
import { AppProvider } from './providers'

const pageBySidebarItem = {
  home: HomePage,
  community: CommunityPage,
  calendar: CalendarPage,
  learning: LearningPage,
  mentoring: MentoringPage,
  typing: TypingPage,
  notification: NotificationPage,
  store: StorePage,
} satisfies Record<SidebarItemId, ComponentType>

export function App() {
  const [activeSidebarItemId, setActiveSidebarItemId] =
    useState<SidebarItemId>('home')
  const ActivePage = pageBySidebarItem[activeSidebarItemId]

  return (
    <AppProvider>
      <AppLayout
        activeSidebarItemId={activeSidebarItemId}
        onSidebarItemSelect={setActiveSidebarItemId}
      >
        <ActivePage />
      </AppLayout>
    </AppProvider>
  )
}
