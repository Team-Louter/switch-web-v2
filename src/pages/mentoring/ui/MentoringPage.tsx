import { useState } from 'react'

import profileImage from '@/shared/assets/sidebar/profile.png'

import {
  BackButton,
  ChatCard,
  ChatLog,
  ChatMeta,
  ChatPanel,
  ChatPanelHeader,
  ChatPanelTitle,
  ChatTimestamp,
  ClosePanelButton,
  Content,
  DashboardGrid,
  DetailHeader,
  DetailMetric,
  DetailMetricLabel,
  DetailMetrics,
  DetailMetricValue,
  Header,
  HeaderCopy,
  HeaderDescription,
  HeaderTitle,
  MentorCell,
  MentorInfo,
  MentorMeta,
  MentorName,
  MentorProfile,
  MentoringLayout,
  MessageAuthor,
  MessageBubble,
  MessageGroup,
  MessageStack,
  StatCard,
  StatLabel,
  StatUnit,
  StatValue,
  StatusText,
  Table,
  TableHeader,
  Toolbar,
  ToolbarLeft,
  ToolbarTitle,
} from './MentoringPage.style'
import {
  MentorStatsRow,
  QuestionList,
  RadioFilterGroup,
  SearchInput,
  SortSelect,
  type SortOrder,
} from './components'
import type { MentorStatus, MentorSummary, QuestionStatus, QuestionSummary } from './types'

type ViewMode = 'dashboard' | 'mentor-detail'

type MentorFilter = '전체' | MentorStatus
type QuestionFilter = '전체' | QuestionStatus
const mentors: MentorSummary[] = [
  {
    id: 1,
    name: '이윤지',
    role: '프론트엔드 · 디자이너',
    recentActivityOrder: 0,
    totalQuestions: '18건',
    pendingQuestions: '4건',
    averageReply: '12시간',
    recentActivity: '오늘',
    status: '원활',
  },
  {
    id: 2,
    name: '이윤지',
    role: '프론트엔드 · 디자이너',
    recentActivityOrder: 0,
    totalQuestions: '18건',
    pendingQuestions: '4건',
    averageReply: '12시간',
    recentActivity: '오늘',
    status: '원활',
  },
  {
    id: 3,
    name: '이윤지',
    role: '프론트엔드 · 디자이너',
    recentActivityOrder: 0,
    totalQuestions: '18건',
    pendingQuestions: '4건',
    averageReply: '12시간',
    recentActivity: '오늘',
    status: '원활',
  },
  {
    id: 4,
    name: '이윤지',
    role: '프론트엔드 · 디자이너',
    recentActivityOrder: 0,
    totalQuestions: '18건',
    pendingQuestions: '4건',
    averageReply: '12시간',
    recentActivity: '오늘',
    status: '원활',
  },
  {
    id: 5,
    name: '이윤지',
    role: '프론트엔드 · 디자이너',
    recentActivityOrder: 3,
    totalQuestions: '18건',
    pendingQuestions: '5건',
    averageReply: '2일',
    recentActivity: '3일 전',
    status: '답변 지연',
  },
  {
    id: 6,
    name: '이윤지',
    role: '프론트엔드 · 디자이너',
    recentActivityOrder: 8,
    totalQuestions: '18건',
    pendingQuestions: '4건',
    averageReply: '18시간',
    recentActivity: '8일 전',
    status: '비활성',
  },
]

const questions: QuestionSummary[] = [
  {
    id: 1,
    title: '어떻게 하면 대회 수상을 많이 할 수 있을까요...',
    mentee: '멘티',
    createdAtOrder: 20260715,
    createdAt: '26.07.15',
    lastRepliedAt: '-',
    status: '대기',
  },
  {
    id: 2,
    title: '어떻게 하면 대회 수상을 많이 할 수 있을까요...',
    mentee: '멘티',
    createdAtOrder: 20260715,
    createdAt: '26.07.15',
    lastRepliedAt: '26.07.16',
    status: '진행',
  },
  {
    id: 3,
    title: '어떻게 하면 대회 수상을 많이 할 수 있을까요...',
    mentee: '멘티',
    createdAtOrder: 20260715,
    createdAt: '26.07.15',
    lastRepliedAt: '26.07.16',
    status: '완료',
  },
]

const mentorFilters = ['전체', '원활', '답변 지연', '비활성'] as const
const questionFilters = ['전체', '대기', '진행', '완료'] as const

// "18건"처럼 단위가 붙은 표시값에서 숫자만 추출해 합산용 값으로 변환한다.
const getQuestionCount = (questionCountText: string) => {
  return Number(questionCountText.replace(/[^0-9]/g, '')) || 0
}

export function MentoringPage() {
  const [viewMode, setViewMode] = useState<ViewMode>('dashboard')
  const [selectedQuestionId, setSelectedQuestionId] = useState<number | null>(null)
  const [selectedMentorFilter, setSelectedMentorFilter] = useState<MentorFilter>('전체')
  const [selectedQuestionFilter, setSelectedQuestionFilter] =
    useState<QuestionFilter>('전체')
  const [mentorSearchKeyword, setMentorSearchKeyword] = useState('')
  const [questionSearchKeyword, setQuestionSearchKeyword] = useState('')
  const [mentorSortOrder, setMentorSortOrder] = useState<SortOrder>('latest')
  const [questionSortOrder, setQuestionSortOrder] = useState<SortOrder>('latest')

  const selectedQuestion =
    questions.find((question) => question.id === selectedQuestionId) ?? questions[1]
  const shouldShowChatPanel =
    viewMode === 'mentor-detail' && selectedQuestionId !== null
  const completedQuestionCount = mentors.reduce(
    (total, mentor) => total + getQuestionCount(mentor.totalQuestions),
    0,
  )
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
          mentor.averageReply,
          mentor.recentActivity,
          mentor.status,
        ].some((value) => value.toLowerCase().includes(mentorKeyword))

      return matchesStatus && matchesKeyword
    })
    .sort((a, b) =>
      mentorSortOrder === 'latest'
        ? a.recentActivityOrder - b.recentActivityOrder
        : b.recentActivityOrder - a.recentActivityOrder,
    )
  const filteredQuestions = questions
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

  const handleMentorSelect = () => {
    setViewMode('mentor-detail')
    setSelectedQuestionId(null)
  }

  const handleBack = () => {
    setViewMode('dashboard')
    setSelectedQuestionId(null)
  }

  return (
    <MentoringLayout>
      <Content $withPanel={shouldShowChatPanel}>
        {viewMode === 'dashboard' ? (
          <>
            <PageHeader title="멘토링 관리" />
            <DashboardGrid>
              <StatCard $tone="danger">
                <StatLabel>주의 필요 멘토</StatLabel>
                <StatValue>
                  {attentionNeededMentorCount}
                  <StatUnit>명</StatUnit>
                </StatValue>
              </StatCard>
              <StatCard>
                <StatLabel>답변 대기 질문</StatLabel>
                <StatValue>
                  24<StatUnit>건</StatUnit>
                </StatValue>
              </StatCard>
              <StatCard>
                <StatLabel>진행중인 질문</StatLabel>
                <StatValue>
                  5<StatUnit>건</StatUnit>
                </StatValue>
              </StatCard>
              <StatCard>
                <StatLabel>완료된 질문</StatLabel>
                <StatValue>
                  {completedQuestionCount}
                  <StatUnit>건</StatUnit>
                </StatValue>
              </StatCard>
            </DashboardGrid>
            <MentorTable
              mentors={filteredMentors}
              sortOrder={mentorSortOrder}
              selectedFilter={selectedMentorFilter}
              searchKeyword={mentorSearchKeyword}
              onSortOrderChange={setMentorSortOrder}
              onFilterChange={setSelectedMentorFilter}
              onSearchKeywordChange={setMentorSearchKeyword}
              onMentorSelect={handleMentorSelect}
            />
          </>
        ) : (
          <>
            <Header>
              <BackButton type="button" aria-label="멘토링 목록으로 돌아가기" onClick={handleBack}>
                ‹
              </BackButton>
              <PageHeader title="멘토링 상세 관리" />
            </Header>
            <DetailSummary />
            <QuestionList
              title="질문"
              searchPlaceholder="검색어 입력"
              questions={filteredQuestions}
              sortOrder={questionSortOrder}
              filterOptions={questionFilters}
              selectedFilter={selectedQuestionFilter}
              selectedQuestionId={selectedQuestionId}
              searchKeyword={questionSearchKeyword}
              onSortOrderChange={setQuestionSortOrder}
              onFilterChange={setSelectedQuestionFilter}
              onSearchKeywordChange={setQuestionSearchKeyword}
              onQuestionSelect={(question) => setSelectedQuestionId(question.id)}
            />
          </>
        )}
      </Content>

      {shouldShowChatPanel && (
        <ChatPanel aria-label="질문 상세">
          <ClosePanelButton type="button" aria-label="질문 상세 닫기" onClick={() => setSelectedQuestionId(null)}>
            »
          </ClosePanelButton>
          <ChatPanelHeader>
            <StatusText $status={selectedQuestion.status}>{selectedQuestion.status}</StatusText>
            <ChatPanelTitle>어떻게 하면 대회 수상을 많이할 수 있을까요?</ChatPanelTitle>
          </ChatPanelHeader>
          <ChatTimestamp>2026. 7. 15. 12:02</ChatTimestamp>
          <ChatCard>
            <ChatLog>
              <MessageGroup>
                <MentorProfile $size="sm">
                  <img src={profileImage} alt="" />
                </MentorProfile>
                <MessageStack>
                  <MessageAuthor>멘티</MessageAuthor>
                  <MessageBubble $fromMentee>수상을 많이 하고 싶어요.</MessageBubble>
                  <ChatMeta>2026. 7. 15. 12:02</ChatMeta>
                </MessageStack>
              </MessageGroup>
              <MessageGroup $align="right">
                <MessageStack>
                  <MessageBubble>대회에 많이 나가시면 됩니다</MessageBubble>
                  <ChatMeta $align="right">2026. 7. 16. 12:02</ChatMeta>
                </MessageStack>
              </MessageGroup>
              <MessageGroup>
                <MentorProfile $size="sm">
                  <img src={profileImage} alt="" />
                </MentorProfile>
                <MessageStack>
                  <MessageAuthor>멘티</MessageAuthor>
                  <MessageBubble $fromMentee>네?</MessageBubble>
                  <MessageBubble $fromMentee>그게 맞나요</MessageBubble>
                  <ChatMeta>2026. 7. 15. 12:02</ChatMeta>
                </MessageStack>
              </MessageGroup>
              <MessageGroup $align="right">
                <MessageStack>
                  <MessageBubble>ㄹㅇ 맞긴 함</MessageBubble>
                  <ChatMeta $align="right">2026. 7. 16. 12:02</ChatMeta>
                </MessageStack>
              </MessageGroup>
            </ChatLog>
          </ChatCard>
        </ChatPanel>
      )}
    </MentoringLayout>
  )
}

type PageHeaderProps = {
  title: string
}

function PageHeader({ title }: PageHeaderProps) {
  return (
    <HeaderCopy>
      <HeaderTitle>{title}</HeaderTitle>
      <HeaderDescription>전체 멘토링 진행 현황과 멘토별 상태를 확인하세요</HeaderDescription>
    </HeaderCopy>
  )
}

type MentorTableProps = {
  mentors: MentorSummary[]
  sortOrder: SortOrder
  selectedFilter: MentorFilter
  searchKeyword: string
  onSortOrderChange: (sortOrder: SortOrder) => void
  onFilterChange: (filter: MentorFilter) => void
  onSearchKeywordChange: (keyword: string) => void
  onMentorSelect: (mentor: MentorSummary) => void
}

function MentorTable({
  mentors,
  sortOrder,
  selectedFilter,
  searchKeyword,
  onSortOrderChange,
  onFilterChange,
  onSearchKeywordChange,
  onMentorSelect,
}: MentorTableProps) {
  return (
    <Table>
      <Toolbar>
        <ToolbarLeft>
          <ToolbarTitle>멘토</ToolbarTitle>
          <SortSelect
            ariaLabel="멘토 정렬"
            value={sortOrder}
            latestLabel="최근 활동 최신순"
            oldestLabel="최근 활동 오래된 순"
            onChange={onSortOrderChange}
          />
        </ToolbarLeft>
        <RadioFilterGroup
          name="mentor-status-filter"
          options={mentorFilters}
          value={selectedFilter}
          onChange={onFilterChange}
        />
        <SearchInput
          ariaLabel="멘토 검색"
          value={searchKeyword}
          placeholder="검색어 입력"
          onChange={onSearchKeywordChange}
        />
      </Toolbar>

      <TableHeader $columns="mentor">
        <span>멘토 정보</span>
        <span>전체 질문</span>
        <span>답변 대기</span>
        <span>평균 답변</span>
        <span>최근 활동</span>
        <span>상태</span>
      </TableHeader>

      {mentors.map((mentor) => (
        <MentorStatsRow key={mentor.id} mentor={mentor} onClick={onMentorSelect} />
      ))}
    </Table>
  )
}

function DetailSummary() {
  return (
    <DetailHeader>
      <MentorCell>
        <MentorProfile $size="lg">
          <img src={profileImage} alt="" />
        </MentorProfile>
        <MentorInfo>
          <MentorName>이윤지</MentorName>
          <MentorMeta>프론트엔드 · 디자이너</MentorMeta>
        </MentorInfo>
      </MentorCell>
      <DetailMetrics>
        <DetailMetric>
          <DetailMetricLabel>전체 질문</DetailMetricLabel>
          <DetailMetricValue>18건</DetailMetricValue>
        </DetailMetric>
        <DetailMetric>
          <DetailMetricLabel>답변 대기</DetailMetricLabel>
          <DetailMetricValue>4건</DetailMetricValue>
        </DetailMetric>
        <DetailMetric>
          <DetailMetricLabel>평균 답변</DetailMetricLabel>
          <DetailMetricValue>12시간</DetailMetricValue>
        </DetailMetric>
        <DetailMetric>
          <DetailMetricLabel>최근 활동</DetailMetricLabel>
          <DetailMetricValue>오늘</DetailMetricValue>
        </DetailMetric>
        <DetailMetric>
          <DetailMetricLabel>상태</DetailMetricLabel>
          <StatusText $status="원활">원활</StatusText>
        </DetailMetric>
      </DetailMetrics>
    </DetailHeader>
  )
}
