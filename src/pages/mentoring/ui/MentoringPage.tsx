import profileImage from '@/shared/assets/sidebar/profile.png'
import backChevronIcon from '../assets/back-chevron.svg'
import { PiArrowLeft } from 'react-icons/pi'

import { useMentoringPage } from '../model/useMentoringPage'
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
  DashboardBackButton,
  DashboardBackIcon,
  DashboardHeader,
  DashboardHeading,
  DashboardOverviewGrid,
  DetailHeader,
  DetailMetric,
  DetailMetricLabel,
  DetailMetrics,
  DetailMetricValue,
  Header,
  HeaderCopy,
  HeaderDescription,
  HeaderEyebrow,
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
  StatusMessage,
  StatusText,
  Table,
  TableHeader,
  Toolbar,
  ToolbarTitle,
} from './MentoringPage.style'
import {
  MentorStatsRow,
  MentoringOverviewCard,
  QuestionList,
  SearchInput,
} from './components'
import {
  MentoringDashboardSkeleton,
  MentoringMentorDetailSkeleton,
  MentoringOverviewCardsSkeleton,
  MentoringTableRowsSkeleton,
} from './MentoringPageSkeleton'
import type { MentoringOverviewItem } from './components'
import type { ChatMessageSummary, MentorSummary, QuestionSummary } from './types'

export function MentoringPage() {
  const {
    attentionNeededMentorCount,
    completedQuestionCount,
    currentUserId,
    errorMessage,
    filteredMentors,
    filteredQuestions,
    handleBack,
    handleCloseChatPanel,
    handleDashboardBack,
    handleMentorSelect,
    handleQuestionSelect,
    inProgressQuestionCount,
    isInitialDashboardLoading,
    isInitialMentorDetailLoading,
    isChatPanelClosing,
    isLoading,
    mentorStatusCounts,
    mentorSearchKeyword,
    pendingQuestionCount,
    questionFilters,
    questionSearchKeyword,
    questionSortOrder,
    selectedMentor,
    selectedMessages,
    selectedQuestion,
    selectedQuestionFilter,
    selectedQuestionId,
    setMentorSearchKeyword,
    setQuestionSearchKeyword,
    setQuestionSortOrder,
    setSelectedQuestionFilter,
    shouldRenderChatPanel,
    viewMode,
  } = useMentoringPage()

  const totalQuestionCount =
    pendingQuestionCount + inProgressQuestionCount + completedQuestionCount
  const totalMentorCount = Object.values(mentorStatusCounts).reduce(
    (total, count) => total + count,
    0,
  )
  const questionCompletionPercent =
    totalQuestionCount === 0 ? 0 : (completedQuestionCount / totalQuestionCount) * 100
  const questionOverviewItems: MentoringOverviewItem[] = [
    { label: '완료', value: completedQuestionCount, tone: 'success' },
    { label: '답변 대기', value: pendingQuestionCount, tone: 'danger' },
    { label: '진행 중', value: inProgressQuestionCount, tone: 'info' },
  ]
  const mentorOverviewItems: MentoringOverviewItem[] = [
    { label: '원활', value: mentorStatusCounts.active, tone: 'success' },
    { label: '답변 지연', value: mentorStatusCounts.delayed, tone: 'warning' },
    { label: '비활성', value: mentorStatusCounts.inactive, tone: 'danger' },
    { label: '활동 정보 없음', value: mentorStatusCounts.noRecentActivity, tone: 'info' },
  ]

  return (
    <MentoringLayout>
      <Content>
        {viewMode === 'dashboard' ? (
          isInitialDashboardLoading ? (
            <MentoringDashboardSkeleton />
          ) : (
            <>
              <DashboardHeader>
                <DashboardBackButton type="button" onClick={handleDashboardBack}>
                  <DashboardBackIcon src={backChevronIcon} alt="" />
                  목록 보기
                </DashboardBackButton>
                <DashboardHeading>멘토링 관리</DashboardHeading>
              </DashboardHeader>
              {isLoading ? (
                <MentoringOverviewCardsSkeleton aria-busy />
              ) : (
                <DashboardOverviewGrid>
                  <MentoringOverviewCard
                    title="질문 처리 현황"
                    centerLabel="완료율"
                    centerValue={`${questionCompletionPercent.toFixed(1)}%`}
                    itemUnit="건"
                    items={questionOverviewItems}
                  />
                  <MentoringOverviewCard
                    title="멘토 상태 현황"
                    centerLabel="전체 멘토"
                    centerValue={`${totalMentorCount}명`}
                    itemUnit="명"
                    items={mentorOverviewItems}
                    attentionCount={attentionNeededMentorCount}
                  />
                </DashboardOverviewGrid>
              )}
              <MentorTable
                mentors={filteredMentors}
                searchKeyword={mentorSearchKeyword}
                isLoading={isLoading}
                errorMessage={errorMessage}
                onSearchKeywordChange={setMentorSearchKeyword}
                onMentorSelect={handleMentorSelect}
              />
            </>
          )
        ) : (
          isInitialMentorDetailLoading ? (
            <MentoringMentorDetailSkeleton onBack={handleBack} />
          ) : (
            <>
              <Header>
                <BackButton type="button" aria-label="멘토링 목록으로 돌아가기" onClick={handleBack}>
                  <PiArrowLeft aria-hidden="true" />
                </BackButton>
                <PageHeader
                  eyebrow="멘토 상세"
                  title="멘토링 상세 관리"
                  description="선택한 멘토의 질문 현황과 대화 내용을 확인하세요."
                />
              </Header>
              <DetailSummary mentor={selectedMentor} />
              {errorMessage || (filteredQuestions.length === 0 && !isLoading) ? (
                <StatusMessage>
                  {errorMessage || '질문이 아직 없어요'}
                </StatusMessage>
              ) : (
                <QuestionList
                  title="질문"
                  searchPlaceholder="검색어 입력"
                  questions={filteredQuestions}
                  sortOrder={questionSortOrder}
                  filterOptions={questionFilters}
                  selectedFilter={selectedQuestionFilter}
                  selectedQuestionId={selectedQuestionId}
                  searchKeyword={questionSearchKeyword}
                  isLoading={isLoading}
                  onSortOrderChange={setQuestionSortOrder}
                  onFilterChange={setSelectedQuestionFilter}
                  onSearchKeywordChange={setQuestionSearchKeyword}
                  onQuestionSelect={handleQuestionSelect}
                />
              )}
            </>
          )
        )}
      </Content>

      {shouldRenderChatPanel && selectedQuestion && (
        <ChatPanel aria-label="질문 상세" $isClosing={isChatPanelClosing}>
          <ClosePanelButton type="button" aria-label="질문 상세 닫기" onClick={handleCloseChatPanel}>
            »
          </ClosePanelButton>
          <ChatPanelHeader>
            <StatusText $status={selectedQuestion.status}>{selectedQuestion.status}</StatusText>
            <ChatPanelTitle>{selectedQuestion.title}</ChatPanelTitle>
          </ChatPanelHeader>
          <ChatTimestamp>{selectedQuestion.createdAt}</ChatTimestamp>
          <ChatCard>
            <ChatLog>
              <QuestionMessage
                currentUserId={currentUserId}
                question={selectedQuestion}
              />
              {selectedMessages.length === 0 ? (
                <StatusMessage>아직 답변 메시지가 없어요</StatusMessage>
              ) : (
                selectedMessages.map((message) => (
                  <ChatMessage
                    key={message.id}
                    currentUserId={currentUserId}
                    message={message}
                    question={selectedQuestion}
                  />
                ))
              )}
            </ChatLog>
          </ChatCard>
        </ChatPanel>
      )}
    </MentoringLayout>
  )
}

interface PageHeaderProps {
  eyebrow: string
  title: string
  description: string
}

function PageHeader({ eyebrow, title, description }: PageHeaderProps) {
  return (
    <HeaderCopy>
      <HeaderEyebrow>{eyebrow}</HeaderEyebrow>
      <HeaderTitle>{title}</HeaderTitle>
      <HeaderDescription>{description}</HeaderDescription>
    </HeaderCopy>
  )
}

interface MentorTableProps {
  mentors: MentorSummary[]
  searchKeyword: string
  isLoading: boolean
  errorMessage: string
  onSearchKeywordChange: (keyword: string) => void
  onMentorSelect: (mentor: MentorSummary) => void
}

function MentorTable({
  mentors,
  searchKeyword,
  isLoading,
  errorMessage,
  onSearchKeywordChange,
  onMentorSelect,
}: MentorTableProps) {
  return (
    <Table aria-busy={isLoading}>
      <Toolbar>
        <ToolbarTitle>멘토</ToolbarTitle>
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
        <span>최근 활동</span>
        <span>상태</span>
      </TableHeader>

      {isLoading ? (
        <MentoringTableRowsSkeleton columns="mentor" />
      ) : errorMessage || mentors.length === 0 ? (
        <StatusMessage>
          {errorMessage || '멘토링 데이터가 아직 없어요'}
        </StatusMessage>
      ) : (
        mentors.map((mentor) => (
          <MentorStatsRow key={mentor.id} mentor={mentor} onClick={onMentorSelect} />
        ))
      )}
    </Table>
  )
}

type DetailSummaryProps = {
  mentor?: MentorSummary
}

function DetailSummary({ mentor }: DetailSummaryProps) {
  return (
      <DetailHeader>
        <MentorCell>
          <MentorProfile $size="lg">
            <img src={mentor?.profileImageUrl || profileImage} alt="" />
          </MentorProfile>
        <MentorInfo>
          <MentorName>{mentor?.name ?? '-'}</MentorName>
          <MentorMeta>{mentor?.role ?? '-'}</MentorMeta>
        </MentorInfo>
      </MentorCell>
      <DetailMetrics>
        <DetailMetric>
          <DetailMetricLabel>전체 질문</DetailMetricLabel>
          <DetailMetricValue>{mentor?.totalQuestions ?? '0건'}</DetailMetricValue>
        </DetailMetric>
        <DetailMetric>
          <DetailMetricLabel>답변 대기</DetailMetricLabel>
          <DetailMetricValue>{mentor?.pendingQuestions ?? '0건'}</DetailMetricValue>
        </DetailMetric>
        <DetailMetric>
          <DetailMetricLabel>최근 활동</DetailMetricLabel>
          <DetailMetricValue>{mentor?.recentActivity ?? '-'}</DetailMetricValue>
        </DetailMetric>
        <DetailMetric>
          <DetailMetricLabel>상태</DetailMetricLabel>
          <StatusText $status={mentor?.status ?? '비활성'}>
            {mentor?.status ?? '비활성'}
          </StatusText>
        </DetailMetric>
      </DetailMetrics>
    </DetailHeader>
  )
}

type QuestionMessageProps = {
  currentUserId: number | null
  question: QuestionSummary
}

function QuestionMessage({ currentUserId, question }: QuestionMessageProps) {
  const isOwnMessage = currentUserId !== null && question.userId === currentUserId

  return (
    <MessageGroup $align={isOwnMessage ? 'right' : undefined}>
      {!isOwnMessage && (
        <MentorProfile $size="sm">
          <img src={question.profileImageUrl || profileImage} alt="" />
        </MentorProfile>
      )}
      <MessageStack $align={isOwnMessage ? 'right' : undefined}>
        {!isOwnMessage && <MessageAuthor>{question.mentee}</MessageAuthor>}
        <MessageBubble $fromMentee>{question.content}</MessageBubble>
        <ChatMeta $align={isOwnMessage ? 'right' : undefined}>
          {question.createdAt}
        </ChatMeta>
      </MessageStack>
    </MessageGroup>
  )
}

type ChatMessageProps = {
  currentUserId: number | null
  message: ChatMessageSummary
  question: QuestionSummary
}

function ChatMessage({ currentUserId, message, question }: ChatMessageProps) {
  const isOwnMessage = currentUserId !== null && message.userId === currentUserId
  const isQuestionAuthorMessage = message.userId === question.userId

  return (
    <MessageGroup $align={isOwnMessage ? 'right' : undefined}>
      {!isOwnMessage && (
        <MentorProfile $size="sm">
          <img src={message.profileImageUrl || question.profileImageUrl || profileImage} alt="" />
        </MentorProfile>
      )}
      <MessageStack $align={isOwnMessage ? 'right' : undefined}>
        {!isOwnMessage && (
          <MessageAuthor>{message.authorName || question.mentee}</MessageAuthor>
        )}
        <MessageBubble $fromMentee={isQuestionAuthorMessage}>{message.content}</MessageBubble>
        <ChatMeta $align={isOwnMessage ? 'right' : undefined}>
          {message.createdAt}
        </ChatMeta>
      </MessageStack>
    </MessageGroup>
  )
}
