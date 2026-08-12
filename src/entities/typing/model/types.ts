export type TypingProblemType = 'DAILY' | 'JAVA' | 'JAVASCRIPT'

export interface TypingRanking {
  rank: number
  userId: number
  userName: string
  averageSpeed: number // 평균 타수
}

export interface TypingRankingBoard {
  problemType: TypingProblemType
  topRankings: TypingRanking[]
  myRanking?: TypingRanking
}
