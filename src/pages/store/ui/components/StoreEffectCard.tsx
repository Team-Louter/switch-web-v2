import * as token from '@/shared/styles/values/token'

import * as S from '../StorePage.style'
import { StoreCardPointIcon } from '../icons'

import type { StoreEffect } from '../../types'

type StoreEffectCardProps = {
  effect: StoreEffect
  isActionPending: boolean
  onEquip: (effectId: number) => void
  onPurchaseOpen: (effect: StoreEffect) => void
  onRemove: (effectId: number) => void
}

export function StoreEffectCard({
  effect,
  isActionPending,
  onEquip,
  onPurchaseOpen,
  onRemove,
}: StoreEffectCardProps) {
  const isRecommended = effect.status === 'recommended'
  const isEquipped = effect.status === 'equipped'
  const defaultImageUrl = effect.thumbnailUrl ?? effect.imageUrl
  const hoverImageUrl = effect.imageUrl ?? defaultImageUrl
  const hasHoverImage =
    Boolean(defaultImageUrl && hoverImageUrl) && defaultImageUrl !== hoverImageUrl
  const conditionText = effect.conditionLabels?.join(' · ')

  const handleActionClick = () => {
    if (isRecommended) {
      onPurchaseOpen(effect)
      return
    }

    if (isEquipped) {
      onRemove(effect.id)
      return
    }

    onEquip(effect.id)
  }

  return (
    <S.EffectCard>
      <S.EffectPreview
        $type={effect.type}
        aria-label={`${effect.title} 효과 미리보기`}
      >
        {effect.type === 'nameColor' ? (
          <S.EffectPreviewText styleKey={effect.nameStyleKey}>
            Switch
          </S.EffectPreviewText>
        ) : defaultImageUrl ? (
          <>
            <S.EffectImage
              $hasHoverImage={hasHoverImage}
              src={defaultImageUrl}
              alt=""
            />
            {hasHoverImage && hoverImageUrl && (
              <S.EffectImage
                $hasHoverImage={hasHoverImage}
                $isHoverImage
                src={hoverImageUrl}
                alt=""
              />
            )}
          </>
        ) : effect.type === 'outline' ? (
          <S.EffectOutlinePreview>Louter</S.EffectOutlinePreview>
        ) : (
          <S.EffectPreviewPlaceholder>{effect.title}</S.EffectPreviewPlaceholder>
        )}
      </S.EffectPreview>
      <S.EffectTextGroup>
        <S.EffectTitleGroup>
          <S.EffectTitle>{effect.title}</S.EffectTitle>
          {isRecommended && conditionText && (
            <S.EffectConditionText>{conditionText}</S.EffectConditionText>
          )}
        </S.EffectTitleGroup>
        <S.CardActionArea>
          {isRecommended ? (
            <S.PriceRow>
              <StoreCardPointIcon />
              {effect.price}
            </S.PriceRow>
          ) : (
            <S.StatusText $status={effect.status}>
              {isEquipped ? '장착 중' : '보유 중'}
            </S.StatusText>
          )}
          <S.CardButton
            $isDanger={isEquipped}
            disabled={isActionPending}
            onClick={handleActionClick}
            type="button"
          >
            {isRecommended && (
              <StoreCardPointIcon color={token.colors.point.strong} />
            )}
            {isRecommended
              ? `${effect.price}에 구매하기`
              : isEquipped
                ? '제거하기'
                : '장착하기'}
          </S.CardButton>
        </S.CardActionArea>
      </S.EffectTextGroup>
    </S.EffectCard>
  )
}
