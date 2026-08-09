import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import {
  getMentoringMembers,
  getMentorings,
  getMessages,
  getQuestions,
  type MentoringMessageResponse,
  type MentoringQuestionResponse,
  type MentoringQuestionStatus,
  type MentoringResponse,
} from './mentoringApi'
import type {
  ChatMessageSummary,
  MentorStatus,
  MentorSummary,
  QuestionStatus,
  QuestionSummary,
} from '../ui/types'

type ViewMode = 'dashboard' | 'mentor-detail'
type MentorFilter = '전체' | MentorStatus
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

const getMentorStatus = (
  pendingQuestionCount: number,
  recentActivityOrder: number,
): MentorStatus => {
  if (!recentActivityOrder) {
    return '비활성'
  }

  const inactiveDay = Math.floor((Date.now() - recentActivityOrder) / 86_400_000)

  if (inactiveDay >= 7) {
    return '비활성'
  }

  return pendingQuestionCount > 0 ? '답변 지연' : '원활'
}

const getLatestMessageDate = (
  messages: MentoringMessageResponse[],
  questionId: number,
) =>
  messages
    .filter((message) => message.questionId === questionId)
    .sort((a, b) => getDateOrder(b.createdAt) - getDateOrder(a.createdAt))[0]
    ?.createdAt

const mapQuestion = (
  question: MentoringQuestionResponse,
  messages: MentoringMessageResponse[],
): QuestionSummary => ({
  id: question.questionId,
  mentoringId: question.mentoringId,
  userId: question.userId,
  title: question.title,
  content: question.content,
  mentee: `멘티 ${question.userId}`,
  createdAtOrder: getDateOrder(question.createdAt),
  createdAt: formatDate(question.createdAt),
  lastRepliedAt: formatDate(getLatestMessageDate(messages, question.questionId)),
  status: questionStatusMap[question.status],
})

const createFallbackMentor = (
  mentoring: MentoringResponse,
  questions: QuestionSummary[],
): MentorSummary => {
  const mentoringQuestions = questions.filter(
    (question) => question.mentoringId === mentoring.mentoringId,
  )
  const pendingQuestionCount = mentoringQuestions.filter(
    (question) => question.status === '대기',
  ).length
  const recentActivityOrder = Math.max(
    getDateOrder(mentoring.createdAt),
    ...mentoringQuestions.map((question) => question.createdAtOrder),
  )

  return {
    id: mentoring.mentoringId,
    mentoringId: mentoring.mentoringId,
    name: mentoring.mentoringName,
    role: '멘토링',
    recentActivityOrder,
    totalQuestions: getQuestionCountText(mentoringQuestions.length),
    pendingQuestions: getQuestionCountText(pendingQuestionCount),
    recentActivity: formatRecentActivity(
      recentActivityOrder ? new Date(recentActivityOrder).toISOString() : undefined,
    ),
    status: getMentorStatus(pendingQuestionCount, recentActivityOrder),
  }
}

// 멘토링 관리 화면의 서버 데이터와 파생 UI 상태를 관리한다.
// 1) 멘토링/질문/메시지 목록을 불러온다
// 2) 서버 enum과 날짜를 화면 표시값으로 변환한다
// 3) 필터, 검색, 정렬, 사이드시트 상태를 함께 반환한다
export function useMentoringPage() {
  const navigate = useNavigate()
  const closeChatPanelTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  )
  const [viewMode, setViewMode] = useState<ViewMode>('dashboard')
  const [selectedMentoringId, setSelectedMentoringId] = useState<number | null>(null)
  const [selectedQuestionId, setSelectedQuestionId] = useState<number | null>(null)
  const [isChatPanelClosing, setIsChatPanelClosing] = useState(false)
  const [selectedMentorFilter, setSelectedMentorFilter] = useState<MentorFilter>('전체')
  const [selectedQuestionFilter, setSelectedQuestionFilter] =
    useState<QuestionFilter>('전체')
  const [mentorSearchKeyword, setMentorSearchKeyword] = useState('')
  const [questionSearchKeyword, setQuestionSearchKeyword] = useState('')
  const [mentorSortOrder, setMentorSortOrder] = useState<SortOrder>('latest')
  const [questionSortOrder, setQuestionSortOrder] = useState<SortOrder>('latest')
  const [mentors, setMentors] = useState<MentorSummary[]>([])
  const [questions, setQuestions] = useState<QuestionSummary[]>([])
  const [messages, setMessages] = useState<ChatMessageSummary[]>([])
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
        const [mentoringResponses, questionResponses, messageResponses] =
          await Promise.all([getMentorings(), getQuestions(), getMessages()])

        if (ignore) {
          return
        }

        const nextQuestions = questionResponses.map((question) =>
          mapQuestion(question, messageResponses),
        )
        const nextMentors = await Promise.all(
          mentoringResponses.map(async (mentoring) => {
            const mentor = createFallbackMentor(mentoring, nextQuestions)

            try {
              const mentorMembers = await getMentoringMembers(
                mentoring.mentoringId,
                'MENTOR',
              )

              return {
                ...mentor,
                role: `${mentorMembers.length}명 멘토`,
              }
            } catch {
              return mentor
            }
          }),
        )

        if (ignore) {
          return
        }

        setMentors(nextMentors)
        setQuestions(nextQuestions)
        setMessages(
          messageResponses.map((message) => ({
            id: message.messageId,
            questionId: message.questionId,
            userId: message.userId,
            content: message.content,
            createdAt: formatDateTime(message.createdAt),
          })),
        )
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
          setIsLoading(false)
        }
      }
    }

    void loadMentoringDashboard()

    return () => {
      ignore = true
    }
  }, [])

  const clearCloseChatPanelTimer = () => {
    if (!closeChatPanelTimeoutRef.current) {
      return
    }

    clearTimeout(closeChatPanelTimeoutRef.current)
    closeChatPanelTimeoutRef.current = null
  }

  const completedQuestionCount = questions.filter(
    (question) => question.status === '완료',
  ).length
  const pendingQuestionCount = questions.filter(
    (question) => question.status === '대기',
  ).length
  const inProgressQuestionCount = questions.filter(
    (question) => question.status === '진행',
  ).length
  const attentionNeededMentorCount = mentors.filter(
    (mentor) => mentor.status !== '원활',
  ).length
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
    mentors.find((mentor) => mentor.mentoringId === selectedMentoringId) ??
    filteredMentors[0] ??
    mentors[0]
  const visibleQuestions = selectedMentor
    ? questions.filter((question) => question.mentoringId === selectedMentor.mentoringId)
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

  const handleMentorSelect = (mentor: MentorSummary) => {
    clearCloseChatPanelTimer()
    setIsChatPanelClosing(false)
    setViewMode('mentor-detail')
    setSelectedMentoringId(mentor.mentoringId)
    setSelectedQuestionId(null)
  }

  const handleBack = () => {
    clearCloseChatPanelTimer()
    setIsChatPanelClosing(false)
    setViewMode('dashboard')
    setSelectedQuestionId(null)
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
      closeChatPanelTimeoutRef.current = null
    }, CHAT_PANEL_ANIMATION_MS)
  }

  return {
    attentionNeededMentorCount,
    completedQuestionCount,
    errorMessage,
    filteredMentors,
    filteredQuestions,
    handleBack,
    handleCloseChatPanel,
    handleDashboardBack,
    handleMentorSelect,
    handleQuestionSelect,
    inProgressQuestionCount,
    isChatPanelClosing,
    isLoading,
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
