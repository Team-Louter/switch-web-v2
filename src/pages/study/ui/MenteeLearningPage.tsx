import { useEffect, useMemo, useState } from 'react'

import {
  MonthlyStudyWeeks,
  WriteModal,
} from '@/features/study'
import type { WeekStatus } from '@/features/study'
import { useUserStore } from '@/entities/profile'
import { getMyStatus, getStudy } from '@/entities/study'
import type { StudyRecord, StudyStatus } from '@/entities/study'
import {
  getCurrentKoreaDate,
  getMonthWeekCount,
  getMonthWeekNumber,
} from '@/shared/lib/studyWeek'
import { tokens } from '@/shared/styles'
import { PercentBar } from '@/features/study'

import decoImg2 from '../assets/spring.svg'
import {
  getCurrentMonth,
  getMonthsFromCurrentMonth,
  getMonthState,
} from '../lib/getMonthsFromCurrentMonth'
import * as S from './LearningPage.style'

export function MenteeLearningPage() {
  const user = useUserStore((state) => state.user)
  const studentNumber = user
    ? `${user.grade}${user.classRoom}${String(user.number).padStart(2, '0')}`
    : ''
  const currentDate = useMemo(() => getCurrentKoreaDate(), [])
  const currentMonth = getCurrentMonth()
  const months = useMemo(() => getMonthsFromCurrentMonth(), [])
  const currentYear = currentDate.year
  const currentWeekNumber = getMonthWeekNumber(
    currentDate.year,
    currentDate.month,
    currentDate.day,
  )
  const [statusesByMonth, setStatusesByMonth] = useState<
    Record<string, StudyStatus[]>
  >({})
  const [isWriteModalOpen, setIsWriteModalOpen] = useState(false)
  const [modalStudy, setModalStudy] = useState<StudyRecord>()
  const [selectedWeeks, setSelectedWeeks] = useState<
    Record<number, { weekNumber: number; status: WeekStatus }>
  >({})
  const [modalWeek, setModalWeek] = useState<{
    month: number
    weekNumber: number
  } | null>(null)

  useEffect(() => {
    let isCancelled = false

    Promise.all(
      months.map(async (month) => {
        const statuses = await getMyStatus(currentYear, month)

        return [`${currentYear}-${month}`, statuses] as const
      }),
    )
      .then((monthStatuses) => {
        if (!isCancelled) {
          setStatusesByMonth(Object.fromEntries(monthStatuses))
        }
      })
      .catch(() => {})

    return () => {
      isCancelled = true
    }
  }, [currentMonth, currentYear, months])

  const refreshMonthStatuses = async (month: number) => {
    try {
      const statuses = await getMyStatus(currentYear, month)

      setStatusesByMonth((previous) => ({
        ...previous,
        [`${currentYear}-${month}`]: statuses,
      }))
      setSelectedWeeks((previous) => {
        const next = { ...previous }
        delete next[month]
        return next
      })
    } catch {
      // 갱신 실패 시 현재 제출 상태를 유지한다.
    }
  }

  return (
    <S.PageContainer>
      <S.ScrollArea>
        {months.map((month) => {
          const monthState = getMonthState(month, currentMonth)
          const weekCount = getMonthWeekCount(currentYear, month)
          const statuses = (
            statusesByMonth[`${currentYear}-${month}`] ?? []
          ).slice(
            0,
            weekCount,
          )
          const submitRate = statuses.length
            ? Math.round(
                (statuses.filter(({ status }) => status === 'SUBMITTED')
                  .length /
                  weekCount) *
                  100,
              )
            : 0
          const items = Array.from({ length: weekCount }, (_, index) => {
            const status = statuses[index]?.status
            const weekNumber = index + 1
            const isFutureWeek =
              monthState === 'future' ||
              (monthState === 'current' && weekNumber > currentWeekNumber)

            return {
              id: `${currentYear}-${month}-${weekNumber}`,
              label: `${weekNumber}주차`,
              status:
                isFutureWeek || status === undefined
                  ? ('locked' as const)
                  : ({
                      SUBMITTED: 'submitted',
                      PENDING: 'due',
                      OVERDUE: 'overdue',
                    }[status] as 'submitted' | 'due' | 'overdue'),
            }
          })
          const defaultWeekNumber =
            monthState === 'current' ? currentWeekNumber : 1
          const selectedWeek =
            selectedWeeks[month] ??
            {
              weekNumber: defaultWeekNumber,
              status: items[defaultWeekNumber - 1].status,
            }

          return (
            <S.Column key={month} $state={monthState}>
              <S.MonthRow style={{ justifyContent: 'flex-start', gap: 10 }}>
                <S.Month>{month}월</S.Month>
                {monthState === 'current' && <S.Now>Now</S.Now>}
              </S.MonthRow>
              <S.Card $state={monthState}>
                <S.ProgressContent>
                  <S.SubmitLabel>제출</S.SubmitLabel>
                  <S.SubmitRate>{submitRate}%</S.SubmitRate>
                  <PercentBar value={submitRate} label="과제 제출률" />
                  <S.Status>
                    {
                      {
                        past: '진행 완료',
                        current: '진행중',
                        future: '잠김',
                      }[monthState]
                    }
                  </S.Status>
                </S.ProgressContent>
                <S.DiaryContent>
                  <MonthlyStudyWeeks
                    items={items}
                    onItemClick={(item) => {
                      setSelectedWeeks((previous) => ({
                        ...previous,
                        [month]: {
                          weekNumber:
                            items.findIndex(({ id }) => id === item.id) + 1,
                          status: item.status,
                        },
                      }))
                    }}
                  />
                  <S.DecoImg
                    aria-hidden="true"
                    color={
                      monthState === 'future'
                        ? tokens.colors.gray.gray50
                        : undefined
                    }
                  />
                  <S.ButtonContent>
                    <S.Name>
                      {[studentNumber, user?.userName]
                        .filter(Boolean)
                        .join(' ')}
                    </S.Name>
                    <S.Week>
                      {selectedWeek
                        ? `${selectedWeek.weekNumber}주차 학습일지`
                        : '주차를 선택해주세요'}
                    </S.Week>
                    <S.WriteButton
                      type="button"
                      disabled={
                        monthState === 'future' ||
                        !selectedWeek ||
                        selectedWeek.status === 'locked'
                      }
                      onClick={async () => {
                        if (!selectedWeek) return

                        setModalWeek({
                          month,
                          weekNumber: selectedWeek.weekNumber,
                        })
                        setModalStudy(undefined)

                        if (selectedWeek.status === 'submitted') {
                          try {
                            const study = await getStudy(
                              currentYear,
                              month,
                              selectedWeek.weekNumber,
                            )
                            setModalStudy(study)
                          } catch {
                            return
                          }
                        }

                        setIsWriteModalOpen(true)
                      }}
                    >
                      {selectedWeek?.status === 'submitted'
                        ? '수정하기'
                        : '작성하기'}
                    </S.WriteButton>
                  </S.ButtonContent>
                </S.DiaryContent>
                <S.DecoImg2 src={decoImg2} alt="" />
              </S.Card>
            </S.Column>
          )
        })}
      </S.ScrollArea>
      <WriteModal
        isOpen={isWriteModalOpen}
        onClose={() => setIsWriteModalOpen(false)}
        onCreateSuccess={() => {
          if (!modalWeek) return
          return refreshMonthStatuses(modalWeek.month)
        }}
        onDeleteSuccess={() => {
          if (!modalWeek) return
          return refreshMonthStatuses(modalWeek.month)
        }}
        month={modalWeek?.month}
        weekNumber={modalWeek?.weekNumber}
        study={modalStudy}
      />
    </S.PageContainer>
  )
}
