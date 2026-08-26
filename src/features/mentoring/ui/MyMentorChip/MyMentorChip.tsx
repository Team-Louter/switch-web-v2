import type { Member } from '@/entities/member/model/types'

import { MemberAvatar } from '../MemberAvatar'
import * as S from './MyMentorChip.style'

/** 칩에 노출할 최대 프로필 수 */
const VISIBLE_AVATAR_COUNT = 2

interface MyMentorChipProps {
  mentors: Member[]
}

export function MyMentorChip({ mentors }: MyMentorChipProps) {
  if (mentors.length === 0) return null

  const [firstMentor, ...restMentors] = mentors

  return (
    <S.Chip>
      <S.Label>내 멘토</S.Label>
      <S.Divider aria-hidden="true" />
      <S.MentorGroup>
        <S.AvatarGroup>
          {mentors.slice(0, VISIBLE_AVATAR_COUNT).map((mentor) => (
            <MemberAvatar
              key={mentor.userId}
              userName={mentor.userName}
              profileImageUrl={mentor.profileImageUrl}
              size={36}
              borderWidth={2}
            />
          ))}
        </S.AvatarGroup>
        <S.MentorName>
          {firstMentor.studentId} {firstMentor.userName} 멘토{' '}
          {/* 멘토가 여러 명이면 남은 인원 수를 덧붙인다 */}
          {restMentors.length > 0 && (
            <S.RestCount>외 {restMentors.length}명</S.RestCount>
          )}
        </S.MentorName>
      </S.MentorGroup>
    </S.Chip>
  )
}
