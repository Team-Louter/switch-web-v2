import profileImage from '@/shared/assets/sidebar/profile.png'
import {
  PiArrowLeft,
  PiCheckCircle,
  PiChatCircleDots,
  PiChatsCircle,
  PiWarningCircle,
} from 'react-icons/pi'

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
  DashboardGrid,
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
  StatCard,
  StatHeader,
  StatHint,
  StatIcon,
  StatLabel,
  StatUnit,
  StatValue,
  StatusMessage,
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
  } = useMentoringPage()

  return (
    <MentoringLayout>
      <Content>
        {viewMode === 'dashboard' ? (
          <>
            <Header>
              <BackButton type="button" aria-label="멘토링으로 돌아가기" onClick={handleDashboardBack}>
                <PiArrowLeft aria-hidden="true" />
              </BackButton>
              <PageHeader
                eyebrow="운영 대시보드"
                title="멘토링 관리"
                description="전체 멘토와 질문의 흐름을 한곳에서 살펴보세요."
              />
            </Header>
            <DashboardGrid>
              <StatCard $tone="danger">
                <StatHeader>
                  <StatLabel>주의 필요 멘토</StatLabel>
                  <StatIcon $tone="danger">
                    <PiWarningCircle aria-hidden="true" />
                  </StatIcon>
                </StatHeader>
                <StatValue>
                  {attentionNeededMentorCount}
                  <StatUnit>명</StatUnit>
                </StatValue>
                <StatHint>답변 흐름을 확인해 주세요</StatHint>
              </StatCard>
              <StatCard $tone="warning">
                <StatHeader>
                  <StatLabel>답변 대기 질문</StatLabel>
                  <StatIcon $tone="warning">
                    <PiChatCircleDots aria-hidden="true" />
                  </StatIcon>
                </StatHeader>
                <StatValue>
                  {pendingQuestionCount}
                  <StatUnit>건</StatUnit>
                </StatValue>
                <StatHint>멘토의 답변을 기다리고 있어요</StatHint>
              </StatCard>
              <StatCard $tone="info">
                <StatHeader>
                  <StatLabel>진행 중인 질문</StatLabel>
                  <StatIcon $tone="info">
                    <PiChatsCircle aria-hidden="true" />
                  </StatIcon>
                </StatHeader>
                <StatValue>
                  {inProgressQuestionCount}
                  <StatUnit>건</StatUnit>
                </StatValue>
                <StatHint>대화가 이어지고 있어요</StatHint>
              </StatCard>
              <StatCard $tone="success">
                <StatHeader>
                  <StatLabel>완료된 질문</StatLabel>
                  <StatIcon $tone="success">
                    <PiCheckCircle aria-hidden="true" />
                  </StatIcon>
                </StatHeader>
                <StatValue>
                  {completedQuestionCount}
                  <StatUnit>건</StatUnit>
                </StatValue>
                <StatHint>멘토링을 마무리했어요</StatHint>
              </StatCard>
            </DashboardGrid>
            <MentorTable
              mentors={filteredMentors}
              sortOrder={mentorSortOrder}
              selectedFilter={selectedMentorFilter}
              searchKeyword={mentorSearchKeyword}
              filterOptions={mentorFilters}
              isLoading={isLoading}
              errorMessage={errorMessage}
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
                <PiArrowLeft aria-hidden="true" />
              </BackButton>
              <PageHeader
                eyebrow="멘토 상세"
                title="멘토링 상세 관리"
                description="선택한 멘토의 질문 현황과 대화 내용을 확인하세요."
              />
            </Header>
            <DetailSummary mentor={selectedMentor} />
            {isLoading || errorMessage || filteredQuestions.length === 0 ? (
              <StatusMessage>
                {isLoading && '질문 데이터를 불러오는 중이에요'}
                {!isLoading && errorMessage && errorMessage}
                {!isLoading && !errorMessage && '질문이 아직 없어요'}
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
                onSortOrderChange={setQuestionSortOrder}
                onFilterChange={setSelectedQuestionFilter}
                onSearchKeywordChange={setQuestionSearchKeyword}
                onQuestionSelect={handleQuestionSelect}
              />
            )}
          </>
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

type MentorTableProps = {
  mentors: MentorSummary[]
  sortOrder: SortOrder
  selectedFilter: MentorTableFilter
  searchKeyword: string
  filterOptions: readonly MentorTableFilter[]
  isLoading: boolean
  errorMessage: string
  onSortOrderChange: (sortOrder: SortOrder) => void
  onFilterChange: (filter: MentorTableFilter) => void
  onSearchKeywordChange: (keyword: string) => void
  onMentorSelect: (mentor: MentorSummary) => void
}

type MentorTableFilter = '전체' | Exclude<MentorSummary['status'], '-'>

function MentorTable({
  mentors,
  sortOrder,
  selectedFilter,
  searchKeyword,
  filterOptions,
  isLoading,
  errorMessage,
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
          options={filterOptions}
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
        <span>최근 활동</span>
        <span>상태</span>
      </TableHeader>

      {isLoading || errorMessage || mentors.length === 0 ? (
        <StatusMessage>
          {isLoading && '멘토링 데이터를 불러오는 중이에요'}
          {!isLoading && errorMessage && errorMessage}
          {!isLoading && !errorMessage && '멘토링 데이터가 아직 없어요'}
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
