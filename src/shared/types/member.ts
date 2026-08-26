/**
 * 멤버(member) 타입
 *
 * 서버 문서(docs/server-docs.json)의 `GET /members` 응답(MemberResponse) 중
 * 담당자 선택에 필요한 필드만 사용합니다.
 */
export type Member = {
  userId: number
  userName: string
  generation?: number
  grade?: number
  classRoom?: number
  number?: number
}
