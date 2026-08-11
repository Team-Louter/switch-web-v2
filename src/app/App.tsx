import { Navigate, Route, Routes } from 'react-router-dom'

import {
  AuthPage,
  CalendarPage,
  CommunityPage,
  HomePage,
  LearningPage,
  MentoringPage,
  MyPage,
  NotificationPage,
  StorePage,
  TypingPage,
} from '@/pages'

import { AppLayout } from './layouts'
import { AppProvider } from './providers'
import { GuestOnlyRoute, ProtectedRoute, RootRoute } from './router'

export function App() {
  return (
    <AppProvider>
      <Routes>
        <Route path="/" element={<RootRoute />} />
        <Route element={<GuestOnlyRoute />}>
          <Route path="/login" element={<AuthPage />} />
          <Route
            path="/signup"
            element={<Navigate to="/login" replace />}
          />
        </Route>
        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route path="/home" element={<HomePage />} />
            <Route path="/community" element={<CommunityPage />} />
            <Route path="/calendar" element={<CalendarPage />} />
            <Route path="/learning" element={<LearningPage />} />
            <Route path="/mentoring" element={<MentoringPage />} />
            <Route path="/typing" element={<TypingPage />} />
            <Route path="/notification" element={<NotificationPage />} />
            <Route path="/store" element={<StorePage />} />
            <Route path="/my" element={<MyPage />} />
          </Route>
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AppProvider>
  )
}
