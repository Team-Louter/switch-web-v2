import {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { flushSync } from 'react-dom'
import { PiPencilSimpleLine } from 'react-icons/pi'

import {
  MentorStudyModal,
  MentorTotalStudyModal,
  MonthlyStudyWeeks,
  PercentBar,
  WriteModal,
} from '@/features/study'
import {
  getAllStudies,
  getAllTotalStudies,
  getWeekStatus,
} from '@/entities/study'
import type { StudyRecord, StudyResponse, StudyStatus } from '@/entities/study'
import { getMember } from '@/entities/member/api/getMember'
import type { Member } from '@/entities/member/model/types'
import { useUserStore } from '@/entities/profile'
import { tokens } from '@/shared/styles'

import decoImg2 from '../assets/spring.svg'
import { getWeeksForCurrentYear } from '../lib/getWeeksForCurrentYear'
import type { StudyWeek } from '../lib/getWeeksForCurrentYear'
import { loadWithConcurrency } from '../lib/loadWithConcurrency'
import { LearningSkeleton } from './LearningSkeleton'
import * as S from './LearningPage.style'

const STATUS_REQUEST_CONCURRENCY = 4
const HISTORY_BATCH_SIZE = 4
const HISTORY_SCROLL_THRESHOLD = 240

export function MentorLearningPage() {
  const isLeader = useUserStore((state) => state.user?.role === 'LEADER')
  const weeks = useMemo(() => getWeeksForCurrentYear(), [])
  const [statusesByWeek, setStatusesByWeek] = useState<
    Record<string, StudyStatus[]>
  >({})
  const [loadedWeekIds, setLoadedWeekIds] = useState<Record<string, true>>({})
  const [isInitialStatusLoading, setIsInitialStatusLoading] = useState(true)
  const [loadedHistoryCount, setLoadedHistoryCount] = useState(0)
  const [isStudyModalOpen, setIsStudyModalOpen] = useState(false)
  const [selectedMenteeStudy, setSelectedMenteeStudy] = useState<{
    month: number
    weekNumber: number
    authorName: string
    study?: StudyRecord
  }>()
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
  const [mentees, setMentees] = useState<Member[]>([])
  const [isMenteesLoading, setIsMenteesLoading] = useState(true)
  const [isMenteeStudyLoading, setIsMenteeStudyLoading] = useState(false)
  const studiesCacheRef = useRef<StudyRecord[] | null>(null)
  const studiesRequestRef = useRef<Promise<StudyRecord[]> | null>(null)
  const menteeStudyRequestIdRef = useRef(0)
  const currentPeriodRef = useRef<HTMLDivElement>(null)
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const currentPeriodTopBeforeLoadRef = useRef<number | null>(null)
  const historyBatchLoadingRef = useRef(false)
  const requestedHistoryIdsRef = useRef(new Set<string>())
  const isMountedRef = useRef(true)
  const historyWeeks = useMemo(
    () => weeks.filter(({ state }) => state === 'past'),
    [weeks],
  )
  const loadedHistoryWeeks = useMemo(
    () =>
      loadedHistoryCount > 0
        ? historyWeeks.slice(-loadedHistoryCount)
        : [],
    [historyWeeks, loadedHistoryCount],
  )
  const remainingHistoryCount = historyWeeks.length - loadedHistoryCount
  const visibleWeeks = useMemo(
    () => [
      ...loadedHistoryWeeks,
      ...weeks.filter(({ state }) => state !== 'past'),
    ],
    [loadedHistoryWeeks, weeks],
  )
  const sortedMentees = useMemo(
    () => [...mentees].sort((a, b) => a.userId - b.userId),
    [mentees],
  )
  const totalStudiesByWeek = useMemo(
    () =>
      new Map(
        totalStudies.map((report) => [
          `${report.month}-${report.weekNumber}`,
          report,
        ]),
      ),
    [totalStudies],
  )
  const isLoading = isInitialStatusLoading

  useLayoutEffect(() => {
    if (isLoading) return

    const scrollArea = scrollAreaRef.current
    const currentPeriod = currentPeriodRef.current

    if (!scrollArea || !currentPeriod) return

    scrollArea.scrollTop +=
      currentPeriod.getBoundingClientRect().top -
      scrollArea.getBoundingClientRect().top
  }, [isLoading])

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
    let isCancelled = false

    getMember()
      .then((members) => {
        if (!isCancelled) {
          setMentees(
            members.filter(({ role }) => role === 'MENTEE'),
          )
        }
      })
      .catch(() => {})
      .finally(() => {
        if (!isCancelled) setIsMenteesLoading(false)
      })

    return () => {
      isCancelled = true
    }
  }, [])

  useEffect(() => {
    let isCancelled = false
    const currentWeek = weeks.find(({ state }) => state === 'current')

    if (!currentWeek) {
      return () => {
        isCancelled = true
      }
    }

    const loadCurrentStatus = async () => {
      try {
        const statuses = await getWeekStatus(
          currentWeek.year,
          currentWeek.month,
          currentWeek.weekNumber,
        )

        if (!isCancelled) {
          setStatusesByWeek((previous) => ({
            ...previous,
            [currentWeek.id]: statuses,
          }))
        }
      } catch {
        // 현재 주차 조회 실패가 화면 전체 표시를 막지 않게 한다.
      } finally {
        if (!isCancelled) {
          setLoadedWeekIds((previous) => ({
            ...previous,
            [currentWeek.id]: true,
          }))
          setIsInitialStatusLoading(false)
        }
      }
    }

    void loadCurrentStatus()

    return () => {
      isCancelled = true
    }
  }, [weeks])

  useEffect(() => {
    const weeksToLoad = loadedHistoryWeeks.filter(
      ({ id }) => !requestedHistoryIdsRef.current.has(id),
    )

    if (weeksToLoad.length === 0) return

    weeksToLoad.forEach(({ id }) => {
      requestedHistoryIdsRef.current.add(id)
    })

    const loadHistoryStatus = async ({
      id,
      year,
      month,
      weekNumber,
    }: StudyWeek) => {
      try {
        const statuses = await getWeekStatus(year, month, weekNumber)

        if (isMountedRef.current) {
          setStatusesByWeek((previous) => ({
            ...previous,
            [id]: statuses,
          }))
        }
      } catch {
        // 개별 주차 조회 실패가 다른 주차의 표시를 막지 않게 한다.
      } finally {
        if (isMountedRef.current) {
          setLoadedWeekIds((previous) => ({ ...previous, [id]: true }))
        }
      }
    }

    void loadWithConcurrency(
      weeksToLoad,
      loadHistoryStatus,
      STATUS_REQUEST_CONCURRENCY,
    )
  }, [loadedHistoryWeeks])

  useEffect(() => {
    if (!isLeader) return

    let isCancelled = false

    getAllTotalStudies()
      .then((reports) => {
        if (!isCancelled) setTotalStudies(reports)
      })
      .catch(() => {})

    return () => {
      isCancelled = true
    }
  }, [isLeader])

  const isStudyInWeek = (
    study: StudyRecord,
    year: number,
    month: number,
    weekNumber: number,
  ) =>
    study.year === year &&
    study.month === month &&
    study.weekNumber === weekNumber

  const loadAllStudies = () => {
    if (studiesCacheRef.current !== null) {
      return Promise.resolve(studiesCacheRef.current)
    }

    if (studiesRequestRef.current === null) {
      const request = getAllStudies()
        .then((allStudies) => {
          studiesCacheRef.current = allStudies
          return allStudies
        })
        .finally(() => {
          studiesRequestRef.current = null
        })

      studiesRequestRef.current = request
    }

    return studiesRequestRef.current
  }

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
      const allStudies = await loadAllStudies()
      setStudies(
        allStudies.filter((study) =>
          isStudyInWeek(study, year, month, weekNumber),
        ),
      )
    } catch {
      // 조회 실패 시 빈 목록을 표시한다.
    } finally {
      setIsStudiesLoading(false)
    }
  }

  const handleOpenMenteeStudy = async (
    studyStatus: StudyStatus,
    year: number,
    month: number,
    weekNumber: number,
  ) => {
    const requestId = menteeStudyRequestIdRef.current + 1
    menteeStudyRequestIdRef.current = requestId

    setSelectedMenteeStudy({
      month,
      weekNumber,
      authorName: studyStatus.userName,
    })

    if (studyStatus.status !== 'SUBMITTED') {
      setIsMenteeStudyLoading(false)
      return
    }

    setIsMenteeStudyLoading(true)

    try {
      const allStudies = await loadAllStudies()
      const study = allStudies.find(
        (item) =>
          item.studyId === studyStatus.studyId &&
          isStudyInWeek(item, year, month, weekNumber),
      )

      if (requestId !== menteeStudyRequestIdRef.current) {
        return
      }

      setSelectedMenteeStudy((previous) =>
        previous ? { ...previous, study } : previous,
      )
    } catch {
      // 조회 실패 시 현재 화면을 유지한다.
    }

    if (requestId === menteeStudyRequestIdRef.current) {
      setIsMenteeStudyLoading(false)
    }
  }

  const loadPreviousHistory = () => {
    if (
      isLoading ||
      remainingHistoryCount === 0 ||
      historyBatchLoadingRef.current
    ) {
      return
    }

    currentPeriodTopBeforeLoadRef.current =
      currentPeriodRef.current?.getBoundingClientRect().top ?? null
    historyBatchLoadingRef.current = true
    setLoadedHistoryCount((currentCount) =>
      Math.min(currentCount + HISTORY_BATCH_SIZE, historyWeeks.length),
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
      isLoading ||
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

  return (
    <S.PageContainer>
      <S.ScrollArea
        $loaded={!isLoading}
        ref={scrollAreaRef}
        aria-busy={isLoading}
        onScroll={handleHistoryScroll}
      >
        {isLoading && (
          <LearningSkeleton
            count={weeks.length}
            variant="mentor"
            showHeaderAction={isLeader}
          />
        )}
        {!isLoading && visibleWeeks.map(({ id, year, month, weekNumber, state }) => {
          const weekStatuses = statusesByWeek[id] ?? []
          const isWeekStatusLoaded =
            state === 'future'
              ? !isMenteesLoading
              : loadedWeekIds[id] === true &&
                (weekStatuses.length > 0 || !isMenteesLoading)

          if (!isWeekStatusLoaded) {
            return (
              <LearningSkeleton
                key={id}
                count={1}
                variant="mentor"
                showNow={false}
                showHeaderAction={isLeader}
              />
            )
          }

          const totalStudy = totalStudiesByWeek.get(`${month}-${weekNumber}`)
          const submitRate = isWeekStatusLoaded && weekStatuses.length
            ? Math.round(
                (weekStatuses.filter(({ status }) => status === 'SUBMITTED')
                  .length /
                  weekStatuses.length) *
                100,
              )
            : 0
          const statusLabel =
            state === 'future'
              ? '잠김'
              : !isWeekStatusLoaded
                ? '불러오는 중'
                : submitRate === 100
                  ? '진행 완료'
                  : state === 'current'
                    ? '진행중'
                    : '실패'
          const items = !isWeekStatusLoaded
            ? []
            : (
                state === 'future' || weekStatuses.length === 0
                  ? sortedMentees.map(({ userId, userName }) => ({
                      id: userId,
                      label: userName,
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
              ).sort((a, b) => a.id - b.id)

          return (
            <S.Column
              ref={state === 'current' ? currentPeriodRef : undefined}
              key={id}
              $state={state}
            >
              <S.MonthRow>
                <S.MonthHeading>
                  <S.Month>
                    {month}월 {weekNumber}주차
                  </S.Month>
                  {state === 'current' && <S.Now>Now</S.Now>}
                </S.MonthHeading>
                {isLeader && (
                  <S.TotalStudyButton
                    $hasTotalStudy={totalStudy !== undefined}
                    $isFuture={state === 'future'}
                    type="button"
                    onClick={() => {
                      setSelectedTotalStudyWeek({ year, month, weekNumber })
                      setIsTotalStudyModalOpen(true)
                    }}
                  >
                    <PiPencilSimpleLine aria-hidden="true" />
                    종합학습일지 작성하기
                  </S.TotalStudyButton>
                )}
              </S.MonthRow>
              <S.Card $state={state}>
                <S.ProgressContent>
                  <S.SubmitLabel>제출률</S.SubmitLabel>
                  <S.SubmitRate>
                    {isWeekStatusLoaded ? `${submitRate}%` : '—'}
                  </S.SubmitRate>
                  <PercentBar value={submitRate} label="멘티 과제 제출률" />
                  <S.Status>{statusLabel}</S.Status>
                </S.ProgressContent>
                <S.DiaryContent>
                  <MonthlyStudyWeeks
                    items={items}
                    onItemClick={(item) => {
                      const studyStatus = weekStatuses.find(
                        ({ userId }) => userId === item.id,
                      )

                      if (!studyStatus) return

                      void handleOpenMenteeStudy(
                        studyStatus,
                        year,
                        month,
                        weekNumber,
                      )
                    }}
                  />
                  <S.DecoImg
                    aria-hidden="true"
                    color={
                      state === 'future'
                        ? tokens.colors.gray.gray50
                        : tokens.colors.primary.primary50
                    }
                    style={{ right: -38 }}
                  />
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
      <WriteModal
        isOpen={selectedMenteeStudy !== undefined}
        isLoading={isMenteeStudyLoading}
        onClose={() => {
          menteeStudyRequestIdRef.current += 1
          setIsMenteeStudyLoading(false)
          setSelectedMenteeStudy(undefined)
        }}
        month={selectedMenteeStudy?.month}
        weekNumber={selectedMenteeStudy?.weekNumber}
        study={selectedMenteeStudy?.study}
        authorName={selectedMenteeStudy?.authorName}
        readOnly
      />
      {isTotalStudyModalOpen && selectedTotalStudyWeek !== null && (
        <MentorTotalStudyModal
          isOpen
          onClose={() => setIsTotalStudyModalOpen(false)}
          year={selectedTotalStudyWeek.year}
          month={selectedTotalStudyWeek.month}
          weekNumber={selectedTotalStudyWeek.weekNumber}
          totalStudy={totalStudiesByWeek.get(
            `${selectedTotalStudyWeek.month}-${selectedTotalStudyWeek.weekNumber}`,
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
