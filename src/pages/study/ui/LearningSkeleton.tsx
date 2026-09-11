import * as S from './LearningPage.style'

type LearningSkeletonVariant = 'mentee' | 'mentor'

interface LearningSkeletonProps {
  count: number
  variant: LearningSkeletonVariant
  showHeaderAction?: boolean
}

const SKELETON_WEEK_COUNT = 6

export function LearningSkeleton({
  count,
  variant,
  showHeaderAction = false,
}: LearningSkeletonProps) {
  const isMentor = variant === 'mentor'

  return (
    <S.SkeletonList
      role="status"
      aria-label="학습관리 내용을 불러오는 중입니다."
    >
      {Array.from({ length: count }, (_, index) => (
        <S.SkeletonColumn key={index} aria-hidden="true">
          <S.SkeletonMonthRow>
            <S.SkeletonMonth $isMentor={isMentor} />
            {index === 0 && <S.SkeletonNow />}
            {isMentor && showHeaderAction && <S.SkeletonHeaderAction />}
          </S.SkeletonMonthRow>
          <S.SkeletonCard>
            <S.SkeletonProgressContent>
              <S.SkeletonProgressLabel />
              <S.SkeletonProgressRate />
              <S.SkeletonProgressBar />
              <S.SkeletonStatus />
            </S.SkeletonProgressContent>
            <S.SkeletonDiaryContent>
              <S.SkeletonWeekGrid>
                {Array.from({ length: SKELETON_WEEK_COUNT }, (_, weekIndex) => (
                  <S.SkeletonWeek key={weekIndex} />
                ))}
              </S.SkeletonWeekGrid>
              <S.SkeletonButtonContent $isMentor={isMentor}>
                <S.SkeletonName />
                <S.SkeletonWeekTitle $isMentor={isMentor} />
                <S.SkeletonWriteButton />
              </S.SkeletonButtonContent>
            </S.SkeletonDiaryContent>
          </S.SkeletonCard>
        </S.SkeletonColumn>
      ))}
    </S.SkeletonList>
  )
}
