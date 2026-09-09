import type { TypingProblemType } from '@/entities/typing'

export interface TypingRankingTab {
  id: TypingProblemType
  label: string
}

/**
 * 타자 랭킹 카드의 카테고리 탭.
 *
 * 서버 문제 유형은 DAILY / JAVA / JAVASCRIPT 3가지지만 디자인의 탭은
 * 2개라서 개발 언어 탭은 JAVA에 연결했다.
 */
export const TYPING_RANKING_TABS: TypingRankingTab[] = [
  { id: 'DAILY', label: '일상 영어' },
  { id: 'JAVA', label: '개발 언어' },
]

export const DEFAULT_TYPING_RANKING_TAB = TYPING_RANKING_TABS[0].id
