import { lazy, Suspense } from 'react'

import { useUserStore } from '@/entities/profile'

import { LearningSkeleton } from './LearningSkeleton'
import * as S from './LearningPage.style'

const MenteeLearningPage = lazy(() =>
  import('./MenteeLearningPage').then(({ MenteeLearningPage: Page }) => ({
    default: Page,
  })),
)
const MentorLearningPage = lazy(() =>
  import('./MentorLearningPage').then(({ MentorLearningPage: Page }) => ({
    default: Page,
  })),
)

interface LearningRouteSkeletonProps {
  isMentor: boolean
  isLeader: boolean
}

function LearningRouteSkeleton({
  isMentor,
  isLeader,
}: LearningRouteSkeletonProps) {
  return (
    <S.PageContainer>
      <S.ScrollArea aria-busy="true">
        <LearningSkeleton
          count={4}
          variant={isMentor ? 'mentor' : 'mentee'}
          showHeaderAction={isLeader}
        />
      </S.ScrollArea>
    </S.PageContainer>
  )
}

export function LearningPage() {
  const role = useUserStore((state) => state.user?.role)
  const isMentor = role === 'MENTOR' || role === 'LEADER'

  if (role && !isMentor && role !== 'MENTEE') return null

  return (
    <S.PageEntrance>
      {!role ? (
        <LearningRouteSkeleton isMentor={false} isLeader={false} />
      ) : (
        <Suspense
          fallback={
            <LearningRouteSkeleton
              isMentor={isMentor}
              isLeader={role === 'LEADER'}
            />
          }
        >
          {isMentor ? <MentorLearningPage /> : <MenteeLearningPage />}
        </Suspense>
      )}
    </S.PageEntrance>
  )
}
