import { lazy, Suspense } from 'react'

import { AsyncBoundary } from '@/shared/ui'
import { TypingPageSkeleton } from './TypingPage/TypingPageSkeleton'

const LazyTypingPage = lazy(() =>
  import('./TypingPage/TypingPage').then(({ TypingPage }) => ({ default: TypingPage })),
)
const LazyDailyTypingPage = lazy(() =>
  import('./DailyTypingPage/DailyTypingPage').then(({ DailyTypingPage }) => ({ default: DailyTypingPage })),
)
const LazyCodeTypingPage = lazy(() =>
  import('./CodeTypingPage/CodeTypingPage').then(({ CodeTypingPage }) => ({ default: CodeTypingPage })),
)

export function TypingPage() {
  return (
    <AsyncBoundary>
      <Suspense fallback={<TypingPageSkeleton />}>
        <LazyTypingPage />
      </Suspense>
    </AsyncBoundary>
  )
}

export function DailyTypingPage() {
  return <AsyncBoundary><LazyDailyTypingPage /></AsyncBoundary>
}

export function CodeTypingPage() {
  return <AsyncBoundary><LazyCodeTypingPage /></AsyncBoundary>
}
