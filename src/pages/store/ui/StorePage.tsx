import { useStorePage } from '../model/useStorePage'
import * as S from './StorePage.style'
import { PointHistoryModal } from './components/PointHistoryModal'
import { StoreEffectCard } from './components/StoreEffectCard'
import { StoreFilterBar } from './components/StoreFilterBar'
import { StorePurchaseModal } from './components/StorePurchaseModal'
import { MoreIcon, PointIcon } from './icons'

export function StorePage() {
  const {
    activeModal,
    categories,
    errorMessage,
    isActionPending,
    isLoading,
    ownedEffects,
    point,
    pointHistories,
    recommendedEffects,
    selectedCategory,
    selectedEffect,
    onCategorySelect,
    onEffectEquip,
    onEffectRemove,
    onModalClose,
    onPointHistoryOpen,
    onPurchase,
    onPurchaseOpen,
  } = useStorePage()

  return (
    <S.Page>
      <S.Content>
        <S.Toolbar>
          <StoreFilterBar
            categories={categories}
            selectedCategory={selectedCategory}
            onCategorySelect={onCategorySelect}
          />
          <S.PointButton onClick={onPointHistoryOpen} type="button">
            <S.PointTextGroup>
              <PointIcon size={22} />
              <span>포인트</span>
              <S.PointValue>{point.toLocaleString()}</S.PointValue>
            </S.PointTextGroup>
            <S.IconButton>
              <MoreIcon size={20} />
            </S.IconButton>
          </S.PointButton>
        </S.Toolbar>

        {(isLoading || errorMessage) && (
          <S.FeedbackMessage role={errorMessage ? 'alert' : 'status'}>
            {errorMessage || '상점 아이템을 불러오는 중이에요'}
          </S.FeedbackMessage>
        )}

        <S.EffectSections>
          <S.Section>
            <S.SectionTitle>내 효과</S.SectionTitle>
            <S.CardGrid>
              {!isLoading && ownedEffects.length > 0 ? (
                ownedEffects.map((effect) => (
                  <StoreEffectCard
                    effect={effect}
                    isActionPending={isActionPending}
                    key={effect.id}
                    onEquip={onEffectEquip}
                    onPurchaseOpen={onPurchaseOpen}
                    onRemove={onEffectRemove}
                  />
                ))
              ) : !isLoading ? (
                <S.EmptyGridMessage>보유한 효과가 없어요</S.EmptyGridMessage>
              ) : null}
            </S.CardGrid>
          </S.Section>

          <S.Section>
            <S.SectionTitle>추천 효과</S.SectionTitle>
            <S.CardGrid>
              {!isLoading && recommendedEffects.length > 0 ? (
                recommendedEffects.map((effect) => (
                  <StoreEffectCard
                    effect={effect}
                    isActionPending={isActionPending}
                    key={effect.id}
                    onEquip={onEffectEquip}
                    onPurchaseOpen={onPurchaseOpen}
                    onRemove={onEffectRemove}
                  />
                ))
              ) : !isLoading ? (
                <S.EmptyGridMessage>추천 효과가 없어요</S.EmptyGridMessage>
              ) : null}
            </S.CardGrid>
          </S.Section>
        </S.EffectSections>
      </S.Content>

      {activeModal === 'pointHistory' && (
        <PointHistoryModal histories={pointHistories} onClose={onModalClose} />
      )}
      {(activeModal === 'purchase' || activeModal === 'purchaseComplete') &&
        selectedEffect && (
          <StorePurchaseModal
            effect={selectedEffect}
            isComplete={activeModal === 'purchaseComplete'}
            isActionPending={isActionPending}
            point={point}
            onClose={onModalClose}
            onEquip={onEffectEquip}
            onPurchase={onPurchase}
          />
        )}
    </S.Page>
  )
}
