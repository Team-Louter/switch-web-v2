import * as S from '../StorePage.style'
import { PointIcon } from '../icons'

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
        {effect.type === 'nameColor' && (
          <S.EffectPreviewText>이름 Name</S.EffectPreviewText>
        )}
        {effect.type === 'outline' && (
          <S.EffectOutlinePreview>Louter</S.EffectOutlinePreview>
        )}
      </S.EffectPreview>
      <S.EffectTextGroup>
        <S.EffectTitle>{effect.title}</S.EffectTitle>
        <S.CardActionArea>
          {isRecommended ? (
            <S.PriceRow>
              <PointIcon size={17} />
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
            {isRecommended && <PointIcon size={17} />}
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
