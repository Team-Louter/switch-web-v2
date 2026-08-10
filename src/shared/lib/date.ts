/**
 * 서버가 내려주는 ISO 날짜 문자열을 화면 표기용 문자열로 바꾼다.
 *
 * @param value ISO 8601 문자열 (Ex. "2026-01-01T23:59:00")
 * @returns "2026.01.01 23:59" 형식의 문자열, 값이 없거나 잘못되면 빈 문자열
 */
export const formatDateTime = (value?: string): string => {
  if (!value) return ''

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) return ''

  const pad = (num: number) => String(num).padStart(2, '0')

  return `${date.getFullYear()}.${pad(date.getMonth() + 1)}.${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`
}
