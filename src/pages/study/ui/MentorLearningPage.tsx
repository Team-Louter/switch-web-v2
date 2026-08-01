import { useEffect, useMemo, useState } from 'react'
import { PiPencilSimpleLine } from 'react-icons/pi'

import {
  getWeekStatus,
  MentorStudyModal,
  MentorTotalStudyModal,
  MonthlyStudyWeeks,
} from '@/features/study'
import type { StudyStatus } from '@/features/study'
import { CLUB_MEMBER } from '@/shared/constants/clubMember'
import { PercentageBar } from '@/shared/ui'

import decoImg1 from '../../assets/deco1.svg'
import decoImg2 from '../../assets/spring.svg'
import { getWeeksForCurrentYear } from '../lib/getWeeksForCurrentYear'
import * as S from './LearningPage.style'

export function MentorLearningPage() {
  const weeks = useMemo(() => getWeeksForCurrentYear(), [])
  const [statusesByWeek, setStatusesByWeek] = useState<
    Record<string, StudyStatus[]>
  >({})
  const [isStudyModalOpen, setIsStudyModalOpen] = useState(false)
  const [isTotalStudyModalOpen, setIsTotalStudyModalOpen] = useState(false)

  useEffect(() => {
    let isCancelled = false
    const availableWeeks = weeks.filter(({ state }) => state !== 'future')

    Promise.all(
      availableWeeks.map(async ({ id, year, month, weekNumber }) =>
        [id, await getWeekStatus(year, month, weekNumber)] as const,
      ),
    )
      .then((weekStatuses) => {
        if (!isCancelled) setStatusesByWeek(Object.fromEntries(weekStatuses))
      })
      .catch((error) => {
        console.error('주차별 제출 상태를 불러오지 못했습니다.', error)
      })

    return () => {
      isCancelled = true
    }
  }, [weeks])

  return (
    <S.PageContainer>
      <S.ScrollArea>
        {weeks.map(({ id, month, weekNumber, state }) => {
          const weekStatuses = statusesByWeek[id] ?? []
          const submitRate = weekStatuses.length
            ? Math.round(
                (weekStatuses.filter(({ status }) => status === 'SUBMITTED')
                  .length /
                  weekStatuses.length) *
                  100,
              )
            : 0
          const items =
            state === 'future' || weekStatuses.length === 0
              ? CLUB_MEMBER.map((name) => ({
                  id: name,
                  label: name,
                  status: 'locked' as const,
                }))
              : weekStatuses.map(({ userId, userName, status }) => ({
                  id: userId,
                  label: userName,
                  status: {
                    SUBMITTED: 'submitted',
                    PENDING: 'due',
                    OVERDUE: 'overdue',
                  }[status] as 'submitted' | 'due' | 'overdue',
                }))

          return (
            <S.Column key={id} $state={state}>
              <S.MonthRow>
                <S.MonthHeading>
                  <S.Month>
                    {month}월 {weekNumber}주차
                  </S.Month>
                  {state === 'current' && <S.Now>Now</S.Now>}
                </S.MonthHeading>
                {state === 'current' && (
                  <S.TotalStudyButton
                    type="button"
                    onClick={() => setIsTotalStudyModalOpen(true)}
                  >
                    <PiPencilSimpleLine aria-hidden="true" />
                    종합 학습 일지 작성하기
                  </S.TotalStudyButton>
                )}
              </S.MonthRow>
              <S.Card $state={state}>
                <S.ProgressContent>
                  <S.SubmitLabel>제출률</S.SubmitLabel>
                  <S.SubmitRate>{submitRate}%</S.SubmitRate>
                  <PercentageBar value={submitRate} label="멘티 과제 제출률" />
                  <S.Status>진행중</S.Status>
                </S.ProgressContent>
                <S.DiaryContent>
                  <MonthlyStudyWeeks items={items} />
                  <S.DecoImg src={decoImg1} alt="" />
                  <S.ButtonContent style={{ width: 200 }}>
                    <S.Name>Louter</S.Name>
                    <S.Week>{month}월 {weekNumber}주차 학습일지</S.Week>
                    <S.WriteButton
                      type="button"
                      disabled={state === 'future'}
                      onClick={() => setIsStudyModalOpen(true)}
                    >
                      전체 보기
                    </S.WriteButton>
                  </S.ButtonContent>
                </S.DiaryContent>
                <S.DecoImg2 src={decoImg2} alt="" />
              </S.Card>
            </S.Column>
          )
        })}
      </S.ScrollArea>
      <MentorStudyModal
        isOpen={isStudyModalOpen}
        onClose={() => setIsStudyModalOpen(false)}
      />
      <MentorTotalStudyModal
        isOpen={isTotalStudyModalOpen}
        onClose={() => setIsTotalStudyModalOpen(false)}
      />
    </S.PageContainer>
  )
}
