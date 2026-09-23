import profileImage from '@/shared/assets/sidebar/profile.png'

import {
  FilterBar,
  MentorProfile,
  QuestionAuthor,
  QuestionTitle,
  StatusText,
  Table,
  TableCell,
  TableHeader,
  TableRow,
  TableSearchRow,
  Toolbar,
  ToolbarLeft,
  ToolbarTitle,
} from '../MentoringPage.style'
import type { QuestionSummary } from '../types'
import { MentoringTableRowsSkeleton } from '../MentoringPageSkeleton'
import { RadioFilterGroup } from './RadioFilterGroup'
import { SearchInput } from './SearchInput'
import { SortSelect, type SortOrder } from './SortSelect'

type QuestionListProps<TFilter extends string> = {
  title: string
  searchPlaceholder: string
  questions: QuestionSummary[]
  isLoading: boolean
  sortOrder: SortOrder
  filterOptions: readonly TFilter[]
  selectedFilter: TFilter
  selectedQuestionId: number | null
  searchKeyword: string
  onSortOrderChange: (sortOrder: SortOrder) => void
  onFilterChange: (filter: TFilter) => void
  onSearchKeywordChange: (keyword: string) => void
  onQuestionSelect: (question: QuestionSummary) => void
}

export function QuestionList<TFilter extends string>({
  title,
  searchPlaceholder,
  questions,
  isLoading,
  sortOrder,
  filterOptions,
  selectedFilter,
  selectedQuestionId,
  searchKeyword,
  onSortOrderChange,
  onFilterChange,
  onSearchKeywordChange,
  onQuestionSelect,
}: QuestionListProps<TFilter>) {
  return (
    <Table aria-busy={isLoading}>
      <TableSearchRow>
        <SearchInput
          ariaLabel={`${title} 검색`}
          value={searchKeyword}
          placeholder={searchPlaceholder}
          onChange={onSearchKeywordChange}
        />
      </TableSearchRow>

      <Toolbar>
        <ToolbarLeft>
          <ToolbarTitle>{title}</ToolbarTitle>
          <SortSelect
            ariaLabel={`${title} 정렬`}
            value={sortOrder}
            latestLabel="질문 등록 최신순"
            oldestLabel="질문 등록 오래된 순"
            onChange={onSortOrderChange}
          />
        </ToolbarLeft>
        <FilterBar>상태:</FilterBar>
        <RadioFilterGroup
          name={`${title}-filter`}
          options={filterOptions}
          value={selectedFilter}
          onChange={onFilterChange}
        />
      </Toolbar>

      <TableHeader $columns="question">
        <span>제목</span>
        <span>작성 멘티</span>
        <span>작성일</span>
        <span>마지막 답변일</span>
        <span>상태</span>
      </TableHeader>

      {isLoading ? (
        <MentoringTableRowsSkeleton columns="question" />
      ) : (
        questions.map((question) => (
          <TableRow
            key={question.id}
            type="button"
            $columns="question"
            $active={selectedQuestionId === question.id}
            onClick={() => onQuestionSelect(question)}
          >
            <QuestionTitle>{question.title}</QuestionTitle>
            <QuestionAuthor>
              <MentorProfile $size="xs">
                <img src={question.profileImageUrl || profileImage} alt="" />
              </MentorProfile>
              {question.mentee}
            </QuestionAuthor>
            <TableCell>{question.createdAt}</TableCell>
            <TableCell>{question.lastRepliedAt}</TableCell>
            <StatusText $status={question.status}>{question.status}</StatusText>
          </TableRow>
        ))
      )}
    </Table>
  )
}
