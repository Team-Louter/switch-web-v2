import { ProfileAvatar } from '@/shared/ui'
import { getNameStyleKey } from '@/shared/styles'

import * as S from '../StorePage.style'
import { CloseIcon, PointIcon } from '../icons'

import type { ProfileAvatarDecorationItem } from '@/shared/ui'
import type { StoreEffect, StoreProfilePreview } from '../../types'

type StorePurchaseModalProps = {
  effect: StoreEffect
  isComplete: boolean
  isActionPending: boolean
  point: number
  profile: StoreProfilePreview | null
  onClose: () => void
  onEquip: (effectId: number) => void
  onPurchase: () => void
}

const STORE_EFFECT_EQUIPPED_ITEM_KEY = {
  BORDER: 'border',
  NAME_COLOR: 'nameColor',
  TITLE: 'title',
} as const

const getEffectDecorationItem = (
  effect: StoreEffect,
): ProfileAvatarDecorationItem => ({
  displayType: effect.displayType,
  imageUrl: effect.imageUrl,
  itemImageUrl: effect.imageUrl,
  itemName: effect.title,
  thumbnailUrl: effect.thumbnailUrl,
  styleKey: effect.nameStyleKey,
  valueImageUrl: effect.imageUrl,
})

const getPurchasePreviewEquippedItems = (
  profile: StoreProfilePreview | null,
  effect: StoreEffect,
) => ({
  ...profile?.equippedItems,
  [STORE_EFFECT_EQUIPPED_ITEM_KEY[effect.itemType]]: getEffectDecorationItem(effect),
})

export function StorePurchaseModal({
  effect,
  isComplete,
  isActionPending,
  point,
  profile,
  onClose,
  onEquip,
  onPurchase,
}: StorePurchaseModalProps) {
  const canPurchase = effect.canPurchase !== false
  const conditionLabels = effect.conditionLabels ?? []
  const previewEquippedItems = getPurchasePreviewEquippedItems(profile, effect)
  const equippedNameColor = profile?.equippedItems?.nameColor
  const previewNameStyleKey =
    effect.itemType === 'NAME_COLOR'
      ? effect.nameStyleKey
      : getNameStyleKey(
          equippedNameColor?.styleKey ??
          equippedNameColor?.valueColor ??
          equippedNameColor?.value_color ??
          equippedNameColor?.valueText ??
          equippedNameColor?.itemName,
        )

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
          <ProfileAvatar
            imageUrl={profile?.imageUrl}
            equippedItems={previewEquippedItems}
            size={200}
          />
          <S.PreviewName styleKey={previewNameStyleKey}>
            {profile?.name ?? ''}
          </S.PreviewName>
        </S.PreviewSection>
        <S.PurchaseEffectTitle>{effect.title}</S.PurchaseEffectTitle>
        {conditionLabels.length > 0 && (
          <S.ConditionList>
            <S.ConditionFirstRow>
              <S.ConditionText>조건</S.ConditionText>
              <S.ConditionText>{conditionLabels[0]}</S.ConditionText>
            </S.ConditionFirstRow>
            {conditionLabels.slice(1).map((condition) => (
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
