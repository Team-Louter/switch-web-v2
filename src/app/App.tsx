import { Navigate, Route, Routes } from 'react-router-dom'

import {
  AuthPage,
  CalendarPage,
  CommunityPage,
  GoogleExtraSignupPage,
  GoogleOAuthCallbackPage,
  HomePage,
  LearningPage,
  MentoringEntryPage,
  MentoringPage,
  MyPage,
  NotificationPage,
  ProfileEditPage,
  StorePage,
  CodeTypingPage,
  DailyTypingPage,
  TypingPage,
  WithdrawCompletePage,
} from '@/pages'

import { AppLayout } from './layouts'
import { AppProvider } from './providers'
import { GuestOnlyRoute, ProtectedRoute, RootRoute } from './router'

export function App() {
  return (
    <AppProvider>
      <Routes>
        <Route path="/" element={<RootRoute />} />
        <Route path="/extra-signup" element={<GoogleExtraSignupPage />} />
        <Route path="/oauth/callback" element={<GoogleOAuthCallbackPage />} />
        <Route path="/main" element={<GoogleOAuthCallbackPage />} />
        <Route
          path="/my/withdraw-complete"
          element={<WithdrawCompletePage />}
        />
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
            <Route path="/mentoring" element={<MentoringEntryPage />} />
            <Route path="/mentoring/dashboard" element={<MentoringPage />} />
            <Route path="/typing" element={<TypingPage />} />
            <Route path="/typing/daily" element={<DailyTypingPage />} />
            <Route path="/typing/code/:language" element={<CodeTypingPage />} />
            <Route path="/notification" element={<NotificationPage />} />
            <Route path="/store" element={<StorePage />} />
            <Route path="/my" element={<MyPage />} />
            <Route path="/my/edit" element={<ProfileEditPage />} />
          </Route>
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AppProvider>
  )
}
