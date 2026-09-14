import {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { flushSync } from 'react-dom'
import { toast } from 'react-toastify'

import {
  MonthlyStudyWeeks,
  PercentBar,
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

import decoImg2 from '../assets/spring.svg'
import {
  getMonthsFromCurrentMonth,
  getMonthState,
} from '../lib/getMonthsFromCurrentMonth'
import { loadWithConcurrency } from '../lib/loadWithConcurrency'
import { LearningSkeleton } from './LearningSkeleton'
import * as S from './LearningPage.style'

const STATUS_REQUEST_CONCURRENCY = 3
const HISTORY_BATCH_SIZE = 4
const HISTORY_SCROLL_THRESHOLD = 240

export function MenteeLearningPage() {
  const user = useUserStore((state) => state.user)
  const studentNumber = user
    ? `${user.grade}${user.classRoom}${String(user.number).padStart(2, '0')}`
    : ''
  const currentDate = useMemo(() => getCurrentKoreaDate(), [])
  const currentMonth = currentDate.month
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
  const [loadedMonths, setLoadedMonths] = useState<Record<string, true>>({})
  const [isInitialStatusLoading, setIsInitialStatusLoading] = useState(true)
  const [loadedHistoryCount, setLoadedHistoryCount] = useState(0)
  const [isWriteModalOpen, setIsWriteModalOpen] = useState(false)
  const [modalStudy, setModalStudy] = useState<StudyRecord>()
  const [selectedWeeks, setSelectedWeeks] = useState<
    Record<number, { weekNumber: number; status: WeekStatus }>
  >({})
  const [modalWeek, setModalWeek] = useState<{
    month: number
    weekNumber: number
  } | null>(null)
  const currentPeriodRef = useRef<HTMLDivElement>(null)
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const currentPeriodTopBeforeLoadRef = useRef<number | null>(null)
  const historyBatchLoadingRef = useRef(false)
  const requestedHistoryMonthsRef = useRef(new Set<number>())
  const modalStudyRequestIdRef = useRef(0)
  const isMountedRef = useRef(true)
  const historyMonths = useMemo(
    () => months.filter((month) => month < currentMonth),
    [months, currentMonth],
  )
  const loadedHistoryMonths = useMemo(
    () =>
      loadedHistoryCount > 0
        ? historyMonths.slice(-loadedHistoryCount)
        : [],
    [historyMonths, loadedHistoryCount],
  )
  const remainingHistoryCount = historyMonths.length - loadedHistoryCount
  const visibleMonths = useMemo(
    () => [
      ...loadedHistoryMonths,
      ...months.filter((month) => month >= currentMonth),
    ],
    [loadedHistoryMonths, months, currentMonth],
  )

  useEffect(() => {
    let isCancelled = false

    const loadCurrentStatus = async () => {
      const key = `${currentYear}-${currentMonth}`

      try {
        const statuses = await getMyStatus(currentYear, currentMonth)

        if (!isCancelled) {
          setStatusesByMonth((previous) => ({
            ...previous,
            [key]: statuses,
          }))
        }
      } catch {
        // 현재 월 조회 실패가 화면 전체 표시를 막지 않게 한다.
      } finally {
        if (!isCancelled) {
          setLoadedMonths((previous) => ({ ...previous, [key]: true }))
          setIsInitialStatusLoading(false)
        }
      }
    }

    void loadCurrentStatus()

    return () => {
      isCancelled = true
    }
  }, [currentMonth, currentYear, months])

  useEffect(() => {
    isMountedRef.current = true

    return () => {
      isMountedRef.current = false
    }
  }, [])

  useLayoutEffect(() => {
    const scrollArea = scrollAreaRef.current
    const currentPeriod = currentPeriodRef.current
    const currentPeriodTopBeforeLoad = currentPeriodTopBeforeLoadRef.current

    if (
      scrollArea &&
      currentPeriod &&
      currentPeriodTopBeforeLoad !== null
    ) {
      scrollArea.scrollTop +=
        currentPeriod.getBoundingClientRect().top -
        currentPeriodTopBeforeLoad
    }

    currentPeriodTopBeforeLoadRef.current = null
    historyBatchLoadingRef.current = false
  }, [loadedHistoryCount])

  useEffect(() => {
    const monthsToLoad = loadedHistoryMonths.filter(
      (month) => !requestedHistoryMonthsRef.current.has(month),
    )

    if (monthsToLoad.length === 0) return

    monthsToLoad.forEach((month) => {
      requestedHistoryMonthsRef.current.add(month)
    })

    const loadHistoryStatus = async (month: number) => {
      const key = `${currentYear}-${month}`

      try {
        const statuses = await getMyStatus(currentYear, month)

        if (isMountedRef.current) {
          setStatusesByMonth((previous) => ({
            ...previous,
            [key]: statuses,
          }))
          setLoadedMonths((previous) => ({ ...previous, [key]: true }))
        }
      } catch {
        requestedHistoryMonthsRef.current.delete(month)
        // 개별 월 조회 실패가 다른 월의 표시를 막지 않게 한다.
      }
    }

    void loadWithConcurrency(
      monthsToLoad,
      loadHistoryStatus,
      STATUS_REQUEST_CONCURRENCY,
    )
  }, [currentYear, loadedHistoryMonths])

  useLayoutEffect(() => {
    if (isInitialStatusLoading) return

    const scrollArea = scrollAreaRef.current
    const currentPeriod = currentPeriodRef.current

    if (!scrollArea || !currentPeriod) return

    scrollArea.scrollTop +=
      currentPeriod.getBoundingClientRect().top -
      scrollArea.getBoundingClientRect().top
  }, [isInitialStatusLoading])

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

  const loadPreviousHistory = () => {
    if (
      isInitialStatusLoading ||
      remainingHistoryCount === 0 ||
      historyBatchLoadingRef.current
    ) {
      return
    }

    currentPeriodTopBeforeLoadRef.current =
      currentPeriodRef.current?.getBoundingClientRect().top ?? null
    historyBatchLoadingRef.current = true
    setLoadedHistoryCount((currentCount) =>
      Math.min(currentCount + HISTORY_BATCH_SIZE, historyMonths.length),
    )
  }

  const handleHistoryScroll = () => {
    const scrollArea = scrollAreaRef.current

    if (
      loadedHistoryCount === 0 ||
      !scrollArea ||
      scrollArea.scrollTop > HISTORY_SCROLL_THRESHOLD
    ) {
      return
    }

    loadPreviousHistory()
  }

  const handleHistoryWheel = (event: WheelEvent) => {
    const scrollArea = scrollAreaRef.current

    if (
      event.deltaY >= 0 ||
      isInitialStatusLoading ||
      remainingHistoryCount === 0 ||
      historyBatchLoadingRef.current ||
      !scrollArea ||
      scrollArea.scrollTop > HISTORY_SCROLL_THRESHOLD
    ) {
      return
    }

    // 최상단에서 소실되는 휠 이동량을 배치 추가와 위치 보정 이후에 적용한다.
    event.preventDefault()
    const delta = event.deltaY * (
      event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? scrollArea.clientHeight : 1
    )
    flushSync(() => {
      loadPreviousHistory()
    })
    // 큰 휠 입력은 완만하게 연결하고, 트랙패드의 작은 연속 입력은 즉시 따라간다.
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches
    scrollArea.scrollBy({
      top: delta,
      behavior: !prefersReducedMotion && Math.abs(delta) >= 40 ? 'smooth' : 'instant',
    })
  }

  useEffect(() => {
    const scrollArea = scrollAreaRef.current
    if (!scrollArea) return

    scrollArea.addEventListener('wheel', handleHistoryWheel, { passive: false })
    return () => scrollArea.removeEventListener('wheel', handleHistoryWheel)
  })

  const handleWriteModalClose = () => {
    modalStudyRequestIdRef.current += 1
    setIsWriteModalOpen(false)
  }

  return (
    <S.PageContainer>
      <S.ScrollArea
        $loaded={!isInitialStatusLoading}
        ref={scrollAreaRef}
        aria-busy={isInitialStatusLoading}
        onScroll={handleHistoryScroll}
      >
        {isInitialStatusLoading && (
          <LearningSkeleton count={months.length} variant="mentee" />
        )}
        {!isInitialStatusLoading && visibleMonths.map((month) => {
          const monthState = getMonthState(month, currentMonth)
          const weekCount = getMonthWeekCount(currentYear, month)
          const monthKey = `${currentYear}-${month}`
          const isMonthStatusLoaded =
            monthState === 'future' || loadedMonths[monthKey] === true

          if (!isMonthStatusLoaded) {
            return (
              <LearningSkeleton
                key={month}
                count={1}
                variant="mentee"
                showNow={false}
              />
            )
          }

          const statuses = isMonthStatusLoaded
            ? (statusesByMonth[monthKey] ?? []).slice(0, weekCount)
            : []
          const submitRate = isMonthStatusLoaded && statuses.length
            ? Math.round(
                (statuses.filter(({ status }) => status === 'SUBMITTED')
                  .length /
                  weekCount) *
                100,
              )
            : 0
          const statusLabel =
            monthState === 'future'
              ? '잠김'
              : !isMonthStatusLoaded
                ? '불러오는 중'
                : submitRate === 100
                  ? '진행 완료'
                  : monthState === 'current'
                    ? '진행중'
                    : '실패'
          const items = isMonthStatusLoaded
            ? Array.from({ length: weekCount }, (_, index) => {
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
            : []
          const defaultWeekNumber =
            monthState === 'current' ? currentWeekNumber : 1
          const selectedWeek =
            selectedWeeks[month] ??
            (items[defaultWeekNumber - 1]
              ? {
                  weekNumber: defaultWeekNumber,
                  status: items[defaultWeekNumber - 1].status,
                }
              : undefined)

          return (
            <S.Column
              ref={month === currentMonth ? currentPeriodRef : undefined}
              key={month}
              $state={monthState}
            >
              <S.MonthRow style={{ justifyContent: 'flex-start', gap: 10 }}>
                <S.Month>{month}월</S.Month>
                {monthState === 'current' && <S.Now>Now</S.Now>}
              </S.MonthRow>
              <S.Card $state={monthState}>
                <S.ProgressContent>
                  <S.SubmitLabel>제출</S.SubmitLabel>
                  <S.SubmitRate>
                    {isMonthStatusLoaded ? `${submitRate}%` : '—'}
                  </S.SubmitRate>
                  <PercentBar value={submitRate} label="과제 제출률" />
                  <S.Status>{statusLabel}</S.Status>
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

                        const requestId = modalStudyRequestIdRef.current + 1
                        modalStudyRequestIdRef.current = requestId
                        setModalWeek({
                          month,
                          weekNumber: selectedWeek.weekNumber,
                        })
                        setModalStudy(undefined)
                        const isEditMode = selectedWeek.status === 'submitted'

                        if (!isEditMode) {
                          setIsWriteModalOpen(true)
                          return
                        }

                        try {
                          const study = await getStudy(
                            currentYear,
                            month,
                            selectedWeek.weekNumber,
                          )

                          if (
                            !isMountedRef.current ||
                            requestId !== modalStudyRequestIdRef.current
                          ) {
                            return
                          }

                          setModalStudy(study)
                          setIsWriteModalOpen(true)
                        } catch {
                          if (
                            !isMountedRef.current ||
                            requestId !== modalStudyRequestIdRef.current
                          ) {
                            return
                          }

                          setIsWriteModalOpen(false)
                          toast.error('학습일지를 불러오지 못했습니다.')
                        }
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
        onClose={handleWriteModalClose}
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
