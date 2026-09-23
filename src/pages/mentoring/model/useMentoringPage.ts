import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { useUserStore } from '@/entities/profile'

import {
  getAdminMentorDetail,
  getAdminMentoringOverview,
  getAdminMentors,
  getAdminQuestionDetail,
} from './adminMentoringApi'
import type {
  AdminMentoringMentorsResponse,
  AdminMentoringOverviewResponse,
  AdminMentoringQuestion,
  AdminMentoringState,
} from './adminMentoringApi'
import type {
  MentoringMessageResponse,
  MentoringQuestionResponse,
  MentoringQuestionStatus,
} from './mentoringApi'
import type {
  ChatMessageSummary,
  MentorStatus,
  MentorSummary,
  QuestionStatus,
  QuestionSummary,
} from '../ui/types'

type ViewMode = 'dashboard' | 'mentor-detail'
type MentorFilter = '전체' | Exclude<MentorStatus, '-'>
type QuestionFilter = '전체' | QuestionStatus
type SortOrder = 'latest' | 'oldest'

const CHAT_PANEL_ANIMATION_MS = 180
const mentorFilters = ['전체', '원활', '답변 지연', '비활성'] as const
const questionFilters = ['전체', '대기', '진행', '완료'] as const

const questionStatusMap = {
  PAUSED: '대기',
  ACTIVE: '진행',
  DONE: '완료',
} satisfies Record<MentoringQuestionStatus, QuestionStatus>
const mentorStatusMap = {
  ACTIVE: '원활',
  DELAYED: '답변 지연',
  INACTIVE: '비활성',
} satisfies Record<AdminMentoringState, MentorStatus>
const adminMentorStateMap = {
  원활: 'ACTIVE',
  '답변 지연': 'DELAYED',
  비활성: 'INACTIVE',
} satisfies Record<Exclude<MentorStatus, '-'>, AdminMentoringState>
const adminQuestionStatusMap = {
  대기: 'PAUSED',
  진행: 'ACTIVE',
  완료: 'DONE',
} satisfies Record<QuestionStatus, MentoringQuestionStatus>
const majorLabelMap = {
  BACKEND: '백엔드',
  FRONTEND: '프론트엔드',
  DESIGN: '디자인',
  IOS: 'iOS',
  ANDROID: '안드로이드',
  SECURITY: '보안',
  GAME: '게임',
  AI: 'AI',
  EMBEDDED: '임베디드',
}
const initialOverview: AdminMentoringOverviewResponse = {
  attentionMentors: 0,
  completedQuestions: 0,
  progressQuestions: 0,
  waitingQuestions: 0,
}

const getQuestionCountText = (count: number) => `${count}건`

const getDateOrder = (dateText?: string) => {
  if (!dateText) {
    return 0
  }

  const time = new Date(dateText).getTime()

  return Number.isNaN(time) ? 0 : time
}

const formatDate = (dateText?: string) => {
  if (!dateText) {
    return '-'
  }

  const date = new Date(dateText)

  if (Number.isNaN(date.getTime())) {
    return '-'
  }

  const year = String(date.getFullYear()).slice(2)
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${year}.${month}.${day}`
}

const formatDateTime = (dateText?: string) => {
  if (!dateText) {
    return '-'
  }

  const date = new Date(dateText)

  if (Number.isNaN(date.getTime())) {
    return '-'
  }

  return new Intl.DateTimeFormat('ko-KR', {
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    month: 'numeric',
    year: 'numeric',
  }).format(date)
}

const formatRecentActivity = (dateText?: string) => {
  const dateOrder = getDateOrder(dateText)

  if (!dateOrder) {
    return '-'
  }

  const elapsedDay = Math.floor((Date.now() - dateOrder) / 86_400_000)

  if (elapsedDay <= 0) {
    return '오늘'
  }

  return `${elapsedDay}일 전`
}

const getMentorRoleText = (majors: AdminMentoringMentorsResponse['majors']) =>
  majors.map((major) => majorLabelMap[major]).join(' · ') || '멘토'

const mapAdminMentor = (
  mentor: AdminMentoringMentorsResponse,
): MentorSummary => {
  const recentActivityOrder = getDateOrder(mentor.recentActivity)

  return {
    id: mentor.mentorId,
    mentorId: mentor.mentorId,
    name: mentor.mentorName,
    pendingQuestions: getQuestionCountText(mentor.waitingAnswers),
    profileImageUrl: mentor.profileImageUrl,
    recentActivity: formatRecentActivity(mentor.recentActivity),
    recentActivityOrder,
    role: getMentorRoleText(mentor.majors),
    status: recentActivityOrder ? mentorStatusMap[mentor.state] : '-',
    totalQuestions: getQuestionCountText(mentor.allQuestions),
  }
}

const mapAdminQuestion = (
  question: AdminMentoringQuestion,
  mentorId: number,
  content = '',
): QuestionSummary => ({
  id: question.questionId,
  mentorId,
  userId: question.writerId,
  title: question.title,
  content,
  mentee: question.writerName || `멘티 ${question.writerId}`,
  profileImageUrl: question.writerProfileImageUrl,
  createdAtOrder: getDateOrder(question.createdAt),
  createdAt: formatDate(question.createdAt),
  lastRepliedAt: formatDate(question.lastAnsweredAt),
  status: questionStatusMap[question.status],
})

const mapDetailQuestion = (
  question: MentoringQuestionResponse,
  mentorId: number,
): QuestionSummary => ({
  id: question.questionId,
  mentorId,
  userId: question.userId,
  title: question.title,
  content: question.content,
  mentee: question.userName || `멘티 ${question.userId}`,
  profileImageUrl: question.profileImageUrl,
  createdAtOrder: getDateOrder(question.createdAt),
  createdAt: formatDate(question.createdAt),
  lastRepliedAt: '-',
  status: questionStatusMap[question.status],
})

const mapMessage = (message: MentoringMessageResponse): ChatMessageSummary => ({
  id: message.messageId,
  questionId: message.questionId,
  userId: message.userId,
  authorName: message.userName,
  content: message.content,
  createdAt: formatDateTime(message.createdAt),
  profileImageUrl: message.profileImageUrl,
})

// 멘토링 관리 화면의 서버 데이터와 파생 UI 상태를 관리한다.
// 1) 멘토링/질문/메시지 목록을 불러온다
// 2) 서버 enum과 날짜를 화면 표시값으로 변환한다
// 3) 필터, 검색, 정렬, 사이드시트 상태를 함께 반환한다
export function useMentoringPage() {
  const navigate = useNavigate()
  const currentUserId = useUserStore((state) => state.user?.userId ?? null)
  const closeChatPanelTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  )
  const [viewMode, setViewMode] = useState<ViewMode>('dashboard')
  const [selectedMentorId, setSelectedMentorId] = useState<number | null>(null)
  const [selectedQuestionId, setSelectedQuestionId] = useState<number | null>(null)
  const [isChatPanelClosing, setIsChatPanelClosing] = useState(false)
  const [selectedMentorFilter, setSelectedMentorFilter] = useState<MentorFilter>('전체')
  const [selectedQuestionFilter, setSelectedQuestionFilter] =
    useState<QuestionFilter>('전체')
  const [mentorSearchKeyword, setMentorSearchKeyword] = useState('')
  const [questionSearchKeyword, setQuestionSearchKeyword] = useState('')
  const [mentorSortOrder, setMentorSortOrder] = useState<SortOrder>('latest')
  const [questionSortOrder, setQuestionSortOrder] = useState<SortOrder>('latest')
  const [overview, setOverview] =
    useState<AdminMentoringOverviewResponse>(initialOverview)
  const [mentors, setMentors] = useState<MentorSummary[]>([])
  const [questions, setQuestions] = useState<QuestionSummary[]>([])
  const [messages, setMessages] = useState<ChatMessageSummary[]>([])
  const [hasLoadedDashboard, setHasLoadedDashboard] = useState(false)
  const [loadedMentorDetailId, setLoadedMentorDetailId] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    return () => {
      if (closeChatPanelTimeoutRef.current) {
        clearTimeout(closeChatPanelTimeoutRef.current)
      }
    }
  }, [])

  useEffect(() => {
    let ignore = false

    const loadMentoringDashboard = async () => {
      setIsLoading(true)
      setErrorMessage('')

      try {
        const mentorName = mentorSearchKeyword.trim() || undefined
        const state =
          selectedMentorFilter === '전체'
            ? undefined
            : adminMentorStateMap[selectedMentorFilter]
        const [overviewResponse, mentorResponses] = await Promise.all([
          getAdminMentoringOverview(),
          getAdminMentors({
            mentorName,
            state,
          }),
        ])

        if (ignore) {
          return
        }

        setOverview(overviewResponse)
        setMentors(mentorResponses.map(mapAdminMentor))
      } catch (error) {
        if (ignore) {
          return
        }

        setErrorMessage(
          error instanceof Error
            ? error.message
            : '멘토링 데이터를 불러오지 못했어요',
        )
      } finally {
        if (!ignore) {
          setHasLoadedDashboard(true)
          setIsLoading(false)
        }
      }
    }

    void loadMentoringDashboard()

    return () => {
      ignore = true
    }
  }, [mentorSearchKeyword, selectedMentorFilter])

  useEffect(() => {
    if (viewMode !== 'mentor-detail' || selectedMentorId === null) {
      return
    }

    let ignore = false

    const loadMentorDetail = async () => {
      setIsLoading(true)
      setErrorMessage('')

      try {
        const questionTitle = questionSearchKeyword.trim() || undefined
        const status =
          selectedQuestionFilter === '전체'
            ? undefined
            : adminQuestionStatusMap[selectedQuestionFilter]
        const mentorDetail = await getAdminMentorDetail(selectedMentorId, {
          questionTitle,
          status,
        })

        if (ignore) {
          return
        }

        const nextMentor = mapAdminMentor(mentorDetail)
        const nextQuestions = mentorDetail.questions.map((question) =>
          mapAdminQuestion(question, mentorDetail.mentorId),
        )

        setMentors((currentMentors) => {
          const hasMentor = currentMentors.some(
            (mentor) => mentor.id === nextMentor.id,
          )

          if (!hasMentor) {
            return [...currentMentors, nextMentor]
          }

          return currentMentors.map((mentor) =>
            mentor.id === nextMentor.id ? nextMentor : mentor,
          )
        })
        setQuestions(nextQuestions)
        setMessages([])
        setLoadedMentorDetailId(mentorDetail.mentorId)
        setSelectedQuestionId((currentQuestionId) =>
          nextQuestions.some((question) => question.id === currentQuestionId)
            ? currentQuestionId
            : null,
        )
      } catch (error) {
        if (ignore) {
          return
        }

        setErrorMessage(
          error instanceof Error
            ? error.message
            : '멘토 상세 데이터를 불러오지 못했어요',
        )
      } finally {
        if (!ignore) {
          setIsLoading(false)
        }
      }
    }

    void loadMentorDetail()

    return () => {
      ignore = true
    }
  }, [questionSearchKeyword, selectedMentorId, selectedQuestionFilter, viewMode])

  useEffect(() => {
    if (selectedQuestionId === null) {
      return
    }

    let ignore = false

    const loadQuestionDetail = async () => {
      try {
        const questionDetail = await getAdminQuestionDetail(selectedQuestionId)

        if (ignore) {
          return
        }

        const nextQuestion = mapDetailQuestion(
          questionDetail.question,
          selectedMentorId ?? 0,
        )

        setQuestions((currentQuestions) =>
          currentQuestions.map((question) =>
            question.id === nextQuestion.id
              ? {
                  ...question,
                  content: nextQuestion.content,
                  mentee: nextQuestion.mentee,
                  profileImageUrl: nextQuestion.profileImageUrl,
                }
              : question,
          ),
        )
        setMessages(questionDetail.messages.map(mapMessage))
      } catch (error) {
        if (!ignore) {
          setErrorMessage(
            error instanceof Error
              ? error.message
              : '질문 상세 데이터를 불러오지 못했어요',
          )
        }
      }
    }

    void loadQuestionDetail()

    return () => {
      ignore = true
    }
  }, [selectedMentorId, selectedQuestionId])

  const clearCloseChatPanelTimer = () => {
    if (!closeChatPanelTimeoutRef.current) {
      return
    }

    clearTimeout(closeChatPanelTimeoutRef.current)
    closeChatPanelTimeoutRef.current = null
  }

  const completedQuestionCount = overview.completedQuestions
  const pendingQuestionCount = overview.waitingQuestions
  const inProgressQuestionCount = overview.progressQuestions
  const attentionNeededMentorCount = overview.attentionMentors
  const mentorStatusCounts = {
    active: mentors.filter((mentor) => mentor.status === '원활').length,
    delayed: mentors.filter((mentor) => mentor.status === '답변 지연').length,
    inactive: mentors.filter((mentor) => mentor.status === '비활성').length,
    noRecentActivity: mentors.filter((mentor) => mentor.status === '-').length,
  }
  const mentorKeyword = mentorSearchKeyword.trim().toLowerCase()
  const questionKeyword = questionSearchKeyword.trim().toLowerCase()

  const filteredMentors = mentors
    .filter((mentor) => {
      const matchesStatus =
        selectedMentorFilter === '전체' || mentor.status === selectedMentorFilter
      const matchesKeyword =
        mentorKeyword.length === 0 ||
        [
          mentor.name,
          mentor.role,
          mentor.totalQuestions,
          mentor.pendingQuestions,
          mentor.recentActivity,
          mentor.status,
        ].some((value) => value.toLowerCase().includes(mentorKeyword))

      return matchesStatus && matchesKeyword
    })
    .sort((a, b) =>
      mentorSortOrder === 'latest'
        ? b.recentActivityOrder - a.recentActivityOrder
        : a.recentActivityOrder - b.recentActivityOrder,
    )

  const selectedMentor =
    mentors.find((mentor) => mentor.mentorId === selectedMentorId) ??
    filteredMentors[0] ??
    mentors[0]
  const visibleQuestions = selectedMentor
    ? questions.filter((question) => question.mentorId === selectedMentor.mentorId)
    : questions
  const filteredQuestions = visibleQuestions
    .filter((question) => {
      const matchesStatus =
        selectedQuestionFilter === '전체' || question.status === selectedQuestionFilter
      const matchesKeyword =
        questionKeyword.length === 0 ||
        [
          question.title,
          question.mentee,
          question.createdAt,
          question.lastRepliedAt,
          question.status,
        ].some((value) => value.toLowerCase().includes(questionKeyword))

      return matchesStatus && matchesKeyword
    })
    .sort((a, b) =>
      questionSortOrder === 'latest'
        ? b.createdAtOrder - a.createdAtOrder
        : a.createdAtOrder - b.createdAtOrder,
    )

  const selectedQuestion =
    questions.find((question) => question.id === selectedQuestionId) ??
    filteredQuestions[0]
  const selectedMessages = useMemo(() => {
    if (!selectedQuestion) {
      return []
    }

    return messages.filter((message) => message.questionId === selectedQuestion.id)
  }, [messages, selectedQuestion])
  const shouldRenderChatPanel =
    viewMode === 'mentor-detail' &&
    (selectedQuestionId !== null || isChatPanelClosing)
  const isInitialDashboardLoading =
    viewMode === 'dashboard' && isLoading && !hasLoadedDashboard
  const isInitialMentorDetailLoading =
    viewMode === 'mentor-detail' &&
    selectedMentorId !== null &&
    isLoading &&
    loadedMentorDetailId !== selectedMentorId

  const handleMentorSelect = (mentor: MentorSummary) => {
    clearCloseChatPanelTimer()
    setIsChatPanelClosing(false)
    setViewMode('mentor-detail')
    setIsLoading(true)
    setSelectedMentorId(mentor.mentorId)
    setLoadedMentorDetailId(null)
    setSelectedQuestionId(null)
    setMessages([])
  }

  const handleBack = () => {
    clearCloseChatPanelTimer()
    setIsChatPanelClosing(false)
    setIsLoading(false)
    setViewMode('dashboard')
    setSelectedMentorId(null)
    setSelectedQuestionId(null)
    setMessages([])
  }

  const handleDashboardBack = () => {
    navigate('/mentoring')
  }

  const handleQuestionSelect = (question: QuestionSummary) => {
    clearCloseChatPanelTimer()
    setIsChatPanelClosing(false)
    setSelectedQuestionId(question.id)
  }

  const handleCloseChatPanel = () => {
    if (selectedQuestionId === null || isChatPanelClosing) {
      return
    }

    setIsChatPanelClosing(true)
    clearCloseChatPanelTimer()
    closeChatPanelTimeoutRef.current = setTimeout(() => {
      setSelectedQuestionId(null)
      setIsChatPanelClosing(false)
      setMessages([])
      closeChatPanelTimeoutRef.current = null
    }, CHAT_PANEL_ANIMATION_MS)
  }

  return {
    attentionNeededMentorCount,
    completedQuestionCount,
    currentUserId,
    errorMessage,
    filteredMentors,
    filteredQuestions,
    isInitialDashboardLoading,
    isInitialMentorDetailLoading,
    handleBack,
    handleCloseChatPanel,
    handleDashboardBack,
    handleMentorSelect,
    handleQuestionSelect,
    inProgressQuestionCount,
    isChatPanelClosing,
    isLoading,
    mentorStatusCounts,
    mentorFilters,
    mentorSearchKeyword,
    mentorSortOrder,
    pendingQuestionCount,
    questionFilters,
    questionSearchKeyword,
    questionSortOrder,
    selectedMentor,
    selectedMentorFilter,
    selectedMessages,
    selectedQuestion,
    selectedQuestionFilter,
    selectedQuestionId,
    setMentorSearchKeyword,
    setMentorSortOrder,
    setQuestionSearchKeyword,
    setQuestionSortOrder,
    setSelectedMentorFilter,
    setSelectedQuestionFilter,
    shouldRenderChatPanel,
    viewMode,
  }
}
