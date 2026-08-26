import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { getHotPosts } from '@/entities/post'
import type { Post } from '@/entities/post'
import { getAllSchedules } from '@/entities/schedule'
import type { Schedule } from '@/entities/schedule'
import { getRankingList } from '@/entities/typing'
import type { Ranking, TypingProblemType } from '@/entities/typing'
import {
  DEFAULT_TYPING_RANKING_TAB,
  getUpcomingSchedules,
  groupSchedulesByDate,
  HotPostCard,
  MonthlyCalendar,
  TypingRankingCard,
  UpcomingScheduleCard,
} from '@/features/home'
import { getShiftedMonth, toDateKey } from '@/shared/lib/calendar'
import { useCurrentKoreaDate } from '@/shared/lib/useCurrentKoreaDate'

import * as S from './HomePage.style'

const UPCOMING_SCHEDULE_COUNT = 3
const HOT_POST_COUNT = 5
const TYPING_RANKING_COUNT = 3

export function HomePage() {
  const navigate = useNavigate()
  const today = useCurrentKoreaDate()
  const todayDateKey = toDateKey(today.year, today.month, today.day)
  const [viewMonth, setViewMonth] = useState({
    year: today.year,
    month: today.month,
  })
  const [schedules, setSchedules] = useState<Schedule[]>([])
  const [hotPosts, setHotPosts] = useState<Post[]>([])
  const [typingRankings, setTypingRankings] = useState<Ranking[]>([])
  const [problemType, setProblemType] = useState<TypingProblemType>(
    DEFAULT_TYPING_RANKING_TAB,
  )

  useEffect(() => {
    let isCancelled = false

    getAllSchedules()
      .then((response) => {
        if (!isCancelled) {
          setSchedules(response)
        }
      })
      .catch(() => {})

    getHotPosts()
      .then((response) => {
        if (!isCancelled) {
          setHotPosts(response)
        }
      })
      .catch(() => {})

    return () => {
      isCancelled = true
    }
  }, [])

  useEffect(() => {
    let isCancelled = false

    getRankingList(problemType)
      .then((board) => {
        if (!isCancelled) {
          setTypingRankings(board.topRankings ?? [])
        }
      })
      .catch(() => {
        if (!isCancelled) {
          setTypingRankings([])
        }
      })

    return () => {
      isCancelled = true
    }
  }, [problemType])

  const eventsByDate = useMemo(
    () => groupSchedulesByDate(schedules),
    [schedules],
  )
  const upcomingSchedules = useMemo(
    () =>
      getUpcomingSchedules(schedules, todayDateKey, UPCOMING_SCHEDULE_COUNT),
    [schedules, todayDateKey],
  )

  const handleMonthShift = (amount: number) => {
    setViewMonth(({ year, month }) => getShiftedMonth(year, month, amount))
  }

  return (
    <S.PageContainer>
      <S.CalendarArea>
        <MonthlyCalendar
          year={viewMonth.year}
          month={viewMonth.month}
          todayDateKey={todayDateKey}
          eventsByDate={eventsByDate}
          onPrevMonthClick={() => handleMonthShift(-1)}
          onNextMonthClick={() => handleMonthShift(1)}
          onMoreEventsClick={() => navigate('/calendar')}
        />
      </S.CalendarArea>
      <S.SideArea>
        <S.SideTop>
          <UpcomingScheduleCard
            schedules={upcomingSchedules}
            onMoreClick={() => navigate('/calendar')}
          />
        </S.SideTop>
        <S.SideItem>
          <HotPostCard
            posts={hotPosts.slice(0, HOT_POST_COUNT)}
            onMoreClick={() => navigate('/community')}
          />
        </S.SideItem>
        <S.SideItem>
          <TypingRankingCard
            rankings={typingRankings.slice(0, TYPING_RANKING_COUNT)}
            selectedType={problemType}
            onTypeChange={setProblemType}
          />
        </S.SideItem>
      </S.SideArea>
    </S.PageContainer>
  )
}
