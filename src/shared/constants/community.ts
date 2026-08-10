export type PostCategory =
  | 'NOTICE'
  | 'FREE'
  | 'ASSIGNMENT'
  | 'INFORMATION'
  | 'ROADMAP'
  | 'CONTEST'
  | 'QNA'

export type PostTag =
  | 'INFO_BACKEND'
  | 'INFO_FRONTEND'
  | 'INFO_DESIGN'
  | 'INFO_AI'
  | 'INFO_ETC'
  | 'INFO_SCHOOL'
  | 'ROADMAP_BACKEND'
  | 'ROADMAP_FRONTEND'
  | 'ROADMAP_ETC'
  | 'HACKATHON'
  | 'IDEA_CONTEST'
  | 'ALGORITHM'
  | 'AI_DATA'
  | 'YOUTH_CONTEST'
  | 'CONTEST_ETC'
  | 'RECRUITMENT'
  | 'Q_BACKEND'
  | 'Q_FRONTEND'
  | 'Q_DESIGN'
  | 'Q_PLANNING'
  | 'Q_ETC'

/** 카테고리 탭 / 뱃지에 표기할 이름 */
export const POST_CATEGORY_LABEL: Record<PostCategory, string> = {
  NOTICE: '공지사항',
  FREE: '자유게시판',
  INFORMATION: '정보 공유',
  ASSIGNMENT: '과제',
  ROADMAP: '로드맵',
  CONTEST: '대회',
  QNA: 'Q&A',
}

/** 디자인의 탭 순서 (전체 글은 category 값이 없는 탭) */
export const POST_CATEGORIES: PostCategory[] = [
  'NOTICE',
  'FREE',
  'INFORMATION',
  'ASSIGNMENT',
  'ROADMAP',
  'CONTEST',
  'QNA',
]

export type PostCategoryTab = PostCategory | 'ALL'

export const ALL_POST_CATEGORY_TAB: PostCategoryTab = 'ALL'

export const POST_CATEGORY_TABS: { id: PostCategoryTab; label: string }[] = [
  { id: ALL_POST_CATEGORY_TAB, label: '전체 글' },
  ...POST_CATEGORIES.map((category) => ({
    id: category as PostCategoryTab,
    label: POST_CATEGORY_LABEL[category],
  })),
]

/** 목록 한 페이지에 담을 게시글 수 */
export const POST_PAGE_SIZE = 10

/** 페이지네이션에 한 번에 노출할 페이지 번호 수 (디자인 기준 5개) */
export const POST_PAGE_BUTTON_COUNT = 5

/** 좋아요를 누른 상태의 하트 색 (대응하는 색상 토큰이 없어 디자인 값을 그대로 사용) */
export const HEARTED_COLOR = '#F65433'
