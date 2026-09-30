export function calculateAccuracy(totalCharacterCount: number, errorCount: number): number {
  if (totalCharacterCount === 0 || errorCount === 0) return 100

  return Math.max(0, Math.floor(((totalCharacterCount - errorCount) / totalCharacterCount) * 100))
}
