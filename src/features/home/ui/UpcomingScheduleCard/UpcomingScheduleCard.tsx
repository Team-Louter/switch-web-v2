import type { Schedule } from '@/entities/schedule'
import { formatMonthDay } from '@/shared/lib/calendar'
import { toScheduleDateKey } from '@/shared/utils/schedule'

import { getScheduleColor } from '../../lib/scheduleColor'
import { HomeCard } from '../HomeCard'
import { MoreButton } from '../MoreButton'
import * as S from './UpcomingScheduleCard.style'

interface UpcomingScheduleCardProps {
  schedules: Schedule[]
  onMoreClick: () => void
}

export function UpcomingScheduleCard({
  schedules,
  onMoreClick,
}: UpcomingScheduleCardProps) {
  return (
    <HomeCard
      title="다가오는 일정"
      actions={<MoreButton onClick={onMoreClick} />}
      isEmpty={schedules.length === 0}
      emptyText="다가오는 일정이 없어요"
    >
      <S.List>
        {schedules.map(({ scheduleId, title, startDate, color }) => (
          <S.Item key={scheduleId}>
            <S.Label>
              <S.ColorDot $color={getScheduleColor(color)} />
              <S.Title>{title}</S.Title>
            </S.Label>
            <S.DateText>{formatMonthDay(toScheduleDateKey(startDate))}</S.DateText>
          </S.Item>
        ))}
      </S.List>
    </HomeCard>
  )
}
