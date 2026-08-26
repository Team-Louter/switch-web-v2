import * as S from '../StorePage.style'
import { CloseIcon, PointIcon } from '../icons'

import type { StoreEffect } from '../../types'

type StorePurchaseModalProps = {
  effect: StoreEffect
  isComplete: boolean
  isActionPending: boolean
  point: number
  onClose: () => void
  onEquip: (effectId: number) => void
  onPurchase: () => void
}

export function StorePurchaseModal({
  effect,
  isComplete,
  isActionPending,
  point,
  onClose,
  onEquip,
  onPurchase,
}: StorePurchaseModalProps) {
  const canPurchase = effect.canPurchase !== false
  const previewImageUrl = effect.imageUrl ?? effect.thumbnailUrl

  return (
    <S.Overlay>
      <S.Modal aria-modal="true" role="dialog">
        <S.ModalHeader>
          <S.ModalTitle>{isComplete ? '구매 완료' : '프로필 꾸미기'}</S.ModalTitle>
          <S.CloseButton aria-label="닫기" onClick={onClose} type="button">
            <CloseIcon />
          </S.CloseButton>
        </S.ModalHeader>
        <S.PreviewSection>
          <S.ProfilePreview aria-label={`${effect.title} 효과 프로필 미리보기`}>
            {previewImageUrl && (
              <S.PreviewImage src={previewImageUrl} alt="" />
            )}
          </S.ProfilePreview>
          <S.PreviewName>이윤지</S.PreviewName>
        </S.PreviewSection>
        <S.PurchaseEffectTitle>{effect.title}</S.PurchaseEffectTitle>
        {effect.hasConditions && effect.conditionLabels && (
          <S.ConditionList>
            <S.ConditionFirstRow>
              <S.ConditionText>조건</S.ConditionText>
              <S.ConditionText>{effect.conditionLabels[0]}</S.ConditionText>
            </S.ConditionFirstRow>
            {effect.conditionLabels.slice(1).map((condition) => (
              <S.ConditionRow key={condition}>
                <S.ConditionText>{condition}</S.ConditionText>
              </S.ConditionRow>
            ))}
          </S.ConditionList>
        )}
        <S.ConditionList>
          <S.PointSummary>
            <span>보유 포인트</span>
            <span>{point.toLocaleString()}</span>
          </S.PointSummary>
          {isComplete ? (
            <S.ModalButtonRow>
              <S.ModalButton
                $variant="secondary"
                onClick={onClose}
                type="button"
              >
                닫기
              </S.ModalButton>
              <S.ModalButton
                disabled={isActionPending}
                onClick={() => onEquip(effect.id)}
                type="button"
              >
                장착하기
              </S.ModalButton>
            </S.ModalButtonRow>
          ) : (
            <S.ModalButton
              disabled={!canPurchase || isActionPending}
              onClick={onPurchase}
              type="button"
            >
              {canPurchase ? (
                <>
                  <PointIcon size={17} />
                  {effect.price}에 구매하기
                </>
              ) : (
                '구매할 수 없어요'
              )}
            </S.ModalButton>
          )}
        </S.ConditionList>
      </S.Modal>
    </S.Overlay>
  )
}
