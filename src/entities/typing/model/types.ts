/** 서버가 제공하는 타자 문제 유형. */
export type TypingProblemType = 'DAILY' | 'JAVA' | 'JAVASCRIPT'

export interface TypingResult {
  resultId: number,
  accuracy: number,
  elapsedTime: number,
  averageSpeed: number,
  problemType: TypingProblemType,
  rank: number,
  totalPracticeCount: number
}

export interface TypingProblem {
  problemId: number,
  problemType: string,
  content: string
}

export interface Round {
  roundId: number,
  userId: number,
  problems: TypingProblem[],
  resultId: number,
  problemType: string
}

export interface Ranking {
  rank: number,
  userId: number,
  userName: string,
  averageSpeed: number
}

export interface RankingList {
  problemType: string,
  topRankings: Ranking[],
  myRanking: Ranking | null
}
