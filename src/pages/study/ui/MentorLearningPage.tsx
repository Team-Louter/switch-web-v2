import { useEffect, useMemo, useState } from 'react'
import { PiPencilSimpleLine } from 'react-icons/pi'

import {
  MentorStudyModal,
  MentorTotalStudyModal,
  MonthlyStudyWeeks,
} from '@/features/study'
import {
  getAllStudies,
  getAllTotalStudies,
  getWeekStatus,
} from '@/entities/study'
import type { StudyRecord, StudyResponse, StudyStatus } from '@/entities/study'
import { CLUB_MEMBER } from '@/shared/constants/clubMember'
import { PercentageBar } from '@/shared/ui'

import decoImg1 from '../assets/deco1.svg'
import decoImg2 from '../assets/spring.svg'
import { getWeeksForCurrentYear } from '../lib/getWeeksForCurrentYear'
import * as S from './LearningPage.style'

export function MentorLearningPage() {
  const weeks = useMemo(() => getWeeksForCurrentYear(), [])
  const currentMonth = weeks.find(({ state }) => state === 'current')?.month
  const [statusesByWeek, setStatusesByWeek] = useState<
    Record<string, StudyStatus[]>
  >({})
  const [isStudyModalOpen, setIsStudyModalOpen] = useState(false)
  const [isTotalStudyModalOpen, setIsTotalStudyModalOpen] = useState(false)
  const [selectedTotalStudyWeek, setSelectedTotalStudyWeek] = useState<{
    year: number
    month: number
    weekNumber: number
  } | null>(null)
  const [selectedWeek, setSelectedWeek] = useState<{
    month: number
    weekNumber: number
  } | null>(null)
  const [studies, setStudies] = useState<StudyRecord[]>([])
  const [isStudiesLoading, setIsStudiesLoading] = useState(false)
  const [totalStudies, setTotalStudies] = useState<StudyResponse[]>([])

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

  useEffect(() => {
    let isCancelled = false

    getAllTotalStudies()
      .then((reports) => {
        if (!isCancelled) setTotalStudies(reports)
      })
      .catch((error) => {
        console.error('종합 학습일지를 불러오지 못했습니다.', error)
      })

    return () => {
      isCancelled = true
    }
  }, [])

  const isStudyInWeek = (
    study: StudyRecord,
    year: number,
    month: number,
    weekNumber: number,
  ) =>
    study.year === year &&
    study.month === month &&
    study.weekNumber === weekNumber

  const handleOpenStudyModal = async (
    year: number,
    month: number,
    weekNumber: number,
  ) => {
    setSelectedWeek({ month, weekNumber })
    setStudies([])
    setIsStudiesLoading(true)
    setIsStudyModalOpen(true)

    try {
      const allStudies = await getAllStudies()
      setStudies(
        allStudies.filter((study) =>
          isStudyInWeek(study, year, month, weekNumber),
        ),
      )
    } catch (error) {
      console.error('학습일지를 불러오지 못했습니다.', error)
    } finally {
      setIsStudiesLoading(false)
    }
  }

  return (
    <S.PageContainer>
      <S.ScrollArea>
        {weeks.map(({ id, year, month, weekNumber, state }) => {
          const totalStudy = totalStudies.find(
            (report) =>
              report.month === month && report.weekNumber === weekNumber,
          )
          const monthState =
            currentMonth === undefined || month === currentMonth
              ? 'current'
              : month < currentMonth
                ? 'past'
                : 'future'
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
                {state !== 'future' && (
                  <S.TotalStudyButton
                    $hasTotalStudy={totalStudy !== undefined}
                    type="button"
                    onClick={() => {
                      setSelectedTotalStudyWeek({ year, month, weekNumber })
                      setIsTotalStudyModalOpen(true)
                    }}
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
                  <S.Status>
                    {
                      {
                        past: '진행 완료',
                        current: '진행 중',
                        future: '잠김',
                      }[monthState]
                    }
                  </S.Status>
                </S.ProgressContent>
                <S.DiaryContent>
                  <MonthlyStudyWeeks
                    items={items}
                  />
                  <S.DecoImg src={decoImg1} alt="" />
                  <S.ButtonContent style={{ width: 200 }}>
                    <S.Name>Louter</S.Name>
                    <S.Week>{month}월 {weekNumber}주차 학습일지</S.Week>
                    <S.WriteButton
                      type="button"
                      disabled={state === 'future'}
                      onClick={() =>
                        void handleOpenStudyModal(year, month, weekNumber)
                      }
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
        month={selectedWeek?.month}
        weekNumber={selectedWeek?.weekNumber}
        studies={studies}
        isLoading={isStudiesLoading}
      />
      {isTotalStudyModalOpen && selectedTotalStudyWeek !== null && (
        <MentorTotalStudyModal
          isOpen
          onClose={() => setIsTotalStudyModalOpen(false)}
          year={selectedTotalStudyWeek.year}
          month={selectedTotalStudyWeek.month}
          weekNumber={selectedTotalStudyWeek.weekNumber}
          totalStudy={totalStudies.find(
            (report) =>
              report.month === selectedTotalStudyWeek.month &&
              report.weekNumber === selectedTotalStudyWeek.weekNumber,
          )}
          onGenerated={(totalStudy) => {
            setTotalStudies((current) => [
              ...current.filter(
                (report) =>
                  report.clubReportId !== totalStudy.clubReportId &&
                  !(
                    report.month === totalStudy.month &&
                    report.weekNumber === totalStudy.weekNumber
                  ),
              ),
              totalStudy,
            ])
          }}
        />
      )}
    </S.PageContainer>
  )
}
