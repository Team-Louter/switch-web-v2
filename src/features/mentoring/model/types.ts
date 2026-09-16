import type { Member } from '@/entities/member/model/types'
import type { MentoringRoom } from '@/entities/mentoring'

/** 멤버 프로필까지 채워둔 화면 표시용 멘토링 방 */
export interface MentoringRoomView extends MentoringRoom {
  members: Member[]
  mentors: Member[]
}
