import { FiEdit } from 'react-icons/fi'
import {
  IoAlertCircle,
  IoCheckmarkCircle,
  IoCloseCircle,
} from 'react-icons/io5'
import { RiLock2Fill } from 'react-icons/ri'

import * as S from './MonthlyJournalWeeks.style'

export type WeekStatus = 'submitted' | 'due' | 'overdue' | 'locked'

export interface MonthlyStudyItem {
  id: string | number
  label: string
  status: WeekStatus
}

interface MonthlyStudyWeeksProps {
  items: MonthlyStudyItem[]
}

function StatusIcon({ status }: { status: Exclude<WeekStatus, 'locked'> }) {
  const Icon = {
    submitted: IoCheckmarkCircle,
    due: IoAlertCircle,
    overdue: IoCloseCircle,
  }[status]

  return <Icon aria-hidden="true" />
}

export function MonthlyStudyWeeks({ items }: MonthlyStudyWeeksProps) {
  return (
    <S.Grid>
      {items.map(({ id, label, status }) => {
        return (
          <S.StudyItem key={id} $status={status}>
            <S.LeadingIcon $locked={status === 'locked'}>
              {status === 'locked' ? (
                <RiLock2Fill aria-hidden="true" />
              ) : (
                <FiEdit aria-hidden="true" />
              )}
            </S.LeadingIcon>
            <S.Label>{label}</S.Label>
            {status !== 'locked' && (
              <S.StatusMark $status={status}>
                <StatusIcon status={status} />
              </S.StatusMark>
            )}
          </S.StudyItem>
        )
      })}
    </S.Grid>
  )
}
