/**
 * 담당자 선택용 더미 멤버 데이터
 *
 * 서버 연동(GET /members) 전까지 사용하는 임시 데이터입니다.
 */
import type { Member } from '@/shared/types/member'

export const dummyMembers: Member[] = [
  { userId: 1, userName: '라우터', generation: 8, grade: 2, classRoom: 1, number: 1 },
  { userId: 2, userName: '김스위치', generation: 8, grade: 2, classRoom: 1, number: 2 },
  { userId: 3, userName: '이피그마', generation: 8, grade: 2, classRoom: 2, number: 5 },
  { userId: 4, userName: '박리액트', generation: 7, grade: 3, classRoom: 1, number: 7 },
  { userId: 5, userName: '최타입스', generation: 7, grade: 3, classRoom: 2, number: 3 },
]
