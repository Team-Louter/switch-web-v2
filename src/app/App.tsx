import { Navigate, Route, Routes } from 'react-router-dom'

import {
  CalendarPage,
  CommunityPage,
  HomePage,
  LearningPage,
  MentoringPage,
  MyPage,
  NotificationPage,
  ProfileEditPage,
  StorePage,
  TypingPage,
} from '@/pages'

import { AppLayout } from './layouts'
import { AppProvider } from './providers'

export function App() {
  return (
    <AppProvider>
      <AppLayout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/community" element={<CommunityPage />} />
          <Route path="/calendar" element={<CalendarPage />} />
          <Route path="/learning" element={<LearningPage />} />
          <Route path="/mentoring" element={<MentoringPage />} />
          <Route path="/typing" element={<TypingPage />} />
          <Route path="/notification" element={<NotificationPage />} />
          <Route path="/store" element={<StorePage />} />
          <Route path="/my" element={<MyPage />} />
          <Route path="/my/edit" element={<ProfileEditPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AppLayout>
    </AppProvider>
  )
}
