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
