import profileImage from '@/shared/assets/sidebar/profile.png'
import {
  PiArrowLeft,
  PiCaretLeft,
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
  DashboardBackButton,
  DashboardGrid,
  DashboardHeader,
  DashboardHeading,
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
  ToolbarTitle,
} from './MentoringPage.style'
import {
  MentorStatsRow,
  QuestionList,
  SearchInput,
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

  return (
    <MentoringLayout>
      <Content>
        {viewMode === 'dashboard' ? (
          <>
            <DashboardHeader>
              <DashboardBackButton type="button" onClick={handleDashboardBack}>
                <PiCaretLeft aria-hidden="true" />
                목록 보기
              </DashboardBackButton>
              <DashboardHeading>멘토링 관리</DashboardHeading>
            </DashboardHeader>
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
              searchKeyword={mentorSearchKeyword}
              isLoading={isLoading}
              errorMessage={errorMessage}
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
    <Table>
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
