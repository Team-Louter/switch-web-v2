import * as S from '../StorePage.style'
import { CloseIcon } from '../icons'

type PointHistoryModalProps = {
  point: number
  onClose: () => void
}

export function PointHistoryModal({ point, onClose }: PointHistoryModalProps) {
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
          <S.PointHistoryRow>
            <S.PointHistoryInfo>
              <S.PointHistoryTitle>현재 보유 포인트</S.PointHistoryTitle>
              <S.PointHistoryDescription>
                상점에서 사용할 수 있는 포인트
              </S.PointHistoryDescription>
            </S.PointHistoryInfo>
            <S.PointHistoryAmount $isPositive>
              {point.toLocaleString()}
            </S.PointHistoryAmount>
          </S.PointHistoryRow>
        </S.PointHistoryList>
      </S.Modal>
    </S.Overlay>
  )
}
