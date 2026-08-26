import dateIcon from '@/shared/assets/calendar/date.svg'
import type { Schedule } from '@/shared/types/schedule'
import { Button, Modal } from '@/shared/ui'
import { formatSchedulePeriod } from '@/shared/utils/schedule'

import {
  DetailBody,
  DetailContent,
  DetailFooter,
  DetailFooterGroup,
  DetailHeading,
  DetailPeriod,
  DetailPeriodText,
  FieldIcon,
  ModalTitle,
} from './ScheduleModal.style'

const DETAIL_MODAL_WIDTH = 430
const DETAIL_MODAL_MIN_HEIGHT = 298

type ScheduleDetailModalProps = {
  schedule: Schedule
  onEdit: () => void
  onClose: () => void
}

export function ScheduleDetailModal({
  schedule,
  onEdit,
  onClose,
}: ScheduleDetailModalProps) {
  return (
    <Modal
      label="일정 세부 조회"
      width={DETAIL_MODAL_WIDTH}
      minHeight={DETAIL_MODAL_MIN_HEIGHT}
      onClose={onClose}
    >
      <DetailBody>
        <DetailHeading>
          <ModalTitle>{schedule.title}</ModalTitle>
          {schedule.content && <DetailContent>{schedule.content}</DetailContent>}
        </DetailHeading>

        <DetailPeriod>
          <FieldIcon src={dateIcon} alt="" />
          <DetailPeriodText>{formatSchedulePeriod(schedule)}</DetailPeriodText>
        </DetailPeriod>
      </DetailBody>

      <DetailFooter>
        <DetailFooterGroup>
          <Button size="md" variant="neutral" fullWidth onClick={onEdit}>
            수정
          </Button>
          <Button size="md" fullWidth onClick={onClose}>
            닫기
          </Button>
        </DetailFooterGroup>
      </DetailFooter>
    </Modal>
  )
}
