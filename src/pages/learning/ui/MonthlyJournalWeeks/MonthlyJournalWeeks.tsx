import { FiEdit } from 'react-icons/fi'
import {
  IoAlertCircle,
  IoCheckmarkCircle,
  IoCloseCircle,
} from 'react-icons/io5'
import { RiLock2Fill } from 'react-icons/ri'

import * as S from './MonthlyJournalWeeks.style'

export type WeekStatus = 'submitted' | 'due' | 'overdue' | 'locked'

export interface JournalWeek {
  week: number
  status: WeekStatus
}

interface MonthlyJournalWeeksProps {
  weeks: JournalWeek[]
}

function StatusIcon({ status }: { status: Exclude<WeekStatus, 'locked'> }) {
  const Icon = {
    submitted: IoCheckmarkCircle,
    due: IoAlertCircle,
    overdue: IoCloseCircle,
  }[status]

  return <Icon aria-hidden="true" />
}

export function MonthlyJournalWeeks({ weeks }: MonthlyJournalWeeksProps) {
  return (
    <S.Grid>
      {weeks.map(({ week, status }) => {
        return (
          <S.WeekItem key={week} $status={status}>
            <S.LeadingIcon $locked={status === 'locked'}>
              {status === 'locked' ? (
                <RiLock2Fill aria-hidden="true" />
              ) : (
                <FiEdit aria-hidden="true" />
              )}
            </S.LeadingIcon>
            <S.Label>{week}주차</S.Label>
            {status !== 'locked' && (
              <S.StatusMark $status={status}>
                <StatusIcon status={status} />
              </S.StatusMark>
            )}
          </S.WeekItem>
        )
      })}
    </S.Grid>
  )
}
