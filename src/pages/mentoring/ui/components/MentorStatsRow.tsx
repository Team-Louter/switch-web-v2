import profileImage from '@/shared/assets/sidebar/profile.png'

import {
  MentorCell,
  MentorInfo,
  MentorMeta,
  MentorName,
  MentorProfile,
  StatusText,
  TableCell,
  TableRow,
} from '../MentoringPage.style'
import type { MentorSummary } from '../types'

type MentorStatsRowProps = {
  mentor: MentorSummary
  onClick?: (mentor: MentorSummary) => void
  active?: boolean
}

export function MentorStatsRow({ mentor, onClick, active = false }: MentorStatsRowProps) {
  return (
    <TableRow
      type="button"
      $columns="mentor"
      $active={active}
      onClick={() => onClick?.(mentor)}
    >
      <MentorCell>
        <MentorProfile>
          <img src={profileImage} alt="" />
        </MentorProfile>
        <MentorInfo>
          <MentorName>{mentor.name}</MentorName>
          <MentorMeta>{mentor.role}</MentorMeta>
        </MentorInfo>
      </MentorCell>
      <TableCell>{mentor.totalQuestions}</TableCell>
      <TableCell>{mentor.pendingQuestions}</TableCell>
      <TableCell>{mentor.averageReply}</TableCell>
      <TableCell>{mentor.recentActivity}</TableCell>
      <StatusText $status={mentor.status}>{mentor.status}</StatusText>
    </TableRow>
  )
}
