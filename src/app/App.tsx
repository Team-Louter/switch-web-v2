import { lazy, Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'

import { AppLayout } from './layouts'
import { AppProvider } from './providers'
import {
  GuestOnlyRoute,
  PendingAuthRoute,
  ProtectedRoute,
  RootRoute,
} from './router'

const AuthPage = lazy(() =>
  import('@/pages/auth').then(({ AuthPage: Page }) => ({ default: Page })),
)
const GoogleExtraSignupPage = lazy(() =>
  import('@/pages/auth').then(({ GoogleExtraSignupPage: Page }) => ({
    default: Page,
  })),
)
const GoogleOAuthCallbackPage = lazy(() =>
  import('@/pages/auth').then(({ GoogleOAuthCallbackPage: Page }) => ({
    default: Page,
  })),
)
const RecoveryEmailPage = lazy(() =>
  import('@/pages/auth').then(({ RecoveryEmailPage: Page }) => ({
    default: Page,
  })),
)
const CalendarPage = lazy(() =>
  import('@/pages/calendar').then(({ CalendarPage: Page }) => ({
    default: Page,
  })),
)
const CommunityPage = lazy(() =>
  import('@/pages/community/ui/CommunityPage').then(({ CommunityPage: Page }) => ({
    default: Page,
  })),
)
const CommunityDetailPage = lazy(() =>
  import('@/pages/community/ui/CommunityDetailPage').then(({ CommunityDetailPage: Page }) => ({
    default: Page,
  })),
)
const CommunityWritePage = lazy(() =>
  import('@/pages/community/ui/CommunityWritePage').then(({ CommunityWritePage: Page }) => ({
    default: Page,
  })),
)
const HomePage = lazy(() =>
  import('@/pages/home').then(({ HomePage: Page }) => ({ default: Page })),
)
const LearningPage = lazy(() =>
  import('@/pages/study').then(({ LearningPage: Page }) => ({ default: Page })),
)
const MentoringEntryPage = lazy(() =>
  import('@/pages/mentoring').then(({ MentoringEntryPage: Page }) => ({
    default: Page,
  })),
)
const MentoringPage = lazy(() =>
  import('@/pages/mentoring').then(({ MentoringPage: Page }) => ({
    default: Page,
  })),
)
const MyPage = lazy(() =>
  import('@/pages/my').then(({ MyPage: Page }) => ({ default: Page })),
)
const WithdrawCompletePage = lazy(() =>
  import('@/pages/my').then(({ WithdrawCompletePage: Page }) => ({
    default: Page,
  })),
)
const NotificationPage = lazy(() =>
  import('@/pages/notification').then(({ NotificationPage: Page }) => ({
    default: Page,
  })),
)
const StorePage = lazy(() =>
  import('@/pages/store').then(({ StorePage: Page }) => ({ default: Page })),
)
const TypingPage = lazy(() =>
  import('@/pages/typing').then(({ TypingPage: Page }) => ({ default: Page })),
)
const DailyTypingPage = lazy(() =>
  import('@/pages/typing').then(({ DailyTypingPage: Page }) => ({
    default: Page,
  })),
)
const CodeTypingPage = lazy(() =>
  import('@/pages/typing').then(({ CodeTypingPage: Page }) => ({
    default: Page,
  })),
)

export function App() {
  return (
    <AppProvider>
      <Suspense fallback={null}>
        <Routes>
          <Route element={<PendingAuthRoute />}>
            <Route path="/" element={<RootRoute />} />
            <Route path="/extra-signup" element={<GoogleExtraSignupPage />} />
            <Route path="/recovery-email" element={<RecoveryEmailPage />} />
            <Route
              path="/oauth/callback"
              element={<GoogleOAuthCallbackPage />}
            />
            <Route path="/main" element={<GoogleOAuthCallbackPage />} />
            <Route
              path="/my/withdraw-complete"
              element={<WithdrawCompletePage />}
            />
          </Route>
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
            <Route path="/community/write" element={<CommunityWritePage />} />
            <Route
              path="/community/:postId/edit"
              element={<CommunityWritePage />}
            />
            <Route
              path="/community/:postId"
              element={<CommunityDetailPage />}
            />
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
          </Route>
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </AppProvider>
  )
}
