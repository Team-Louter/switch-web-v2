import * as S from '../StorePage.style'
import { CloseIcon } from '../icons'

import type { PointHistory } from '../../types'

type PointHistoryModalProps = {
  histories: PointHistory[]
  onClose: () => void
}

export function PointHistoryModal({
  histories,
  onClose,
}: PointHistoryModalProps) {
  return (
    <S.Overlay>
      <S.Modal aria-modal="true" role="dialog">
        <S.ModalHeader>
          <S.ModalTitle>누적 포인트 조회</S.ModalTitle>
          <S.CloseButton aria-label="닫기" onClick={onClose} type="button">
            <CloseIcon />
          </S.CloseButton>
        </S.ModalHeader>
        <S.PointHistoryList>
          {histories.map((history) => (
            <S.PointHistoryRow key={history.id}>
              <S.PointHistoryInfo>
                <S.PointHistoryTitle>{history.title}</S.PointHistoryTitle>
                <S.PointHistoryDescription>
                  {history.description}
                </S.PointHistoryDescription>
              </S.PointHistoryInfo>
              <S.PointHistoryAmount $isPositive={history.isPositive}>
                {history.amountLabel}
              </S.PointHistoryAmount>
            </S.PointHistoryRow>
          ))}
        </S.PointHistoryList>
      </S.Modal>
    </S.Overlay>
  )
}
