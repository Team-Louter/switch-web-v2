import { POST_PAGE_BUTTON_COUNT } from '@/shared/constants/community'

import { Nav, PageButton } from './Pagination.style'

type PaginationProps = {
  /** 0부터 시작하는 현재 페이지 번호 */
  page: number
  totalPages: number
  onPageChange: (page: number) => void
}

/**
 * 현재 페이지를 가운데에 두고 노출할 페이지 번호 목록을 만든다.
 *
 * @param page 0부터 시작하는 현재 페이지 번호
 * @param totalPages 전체 페이지 수
 */
const getPageNumbers = (page: number, totalPages: number): number[] => {
  const start = Math.max(
    0,
    Math.min(
      page - Math.floor(POST_PAGE_BUTTON_COUNT / 2),
      totalPages - POST_PAGE_BUTTON_COUNT,
    ),
  )
  const end = Math.min(totalPages, start + POST_PAGE_BUTTON_COUNT)

  return Array.from({ length: end - start }, (_, index) => start + index)
}

export function Pagination({ page, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null

  return (
    <Nav aria-label="게시글 페이지">
      {getPageNumbers(page, totalPages).map((pageNumber) => (
        <PageButton
          key={pageNumber}
          type="button"
          $active={pageNumber === page}
          aria-current={pageNumber === page ? 'page' : undefined}
          onClick={() => onPageChange(pageNumber)}
        >
          {pageNumber + 1}
        </PageButton>
      ))}
    </Nav>
  )
}
