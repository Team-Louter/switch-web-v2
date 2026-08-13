export interface TypingResult {
  resultId: number,
  accuracy: number,
  elapsedTime: number,
  averageSpeed: number
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
