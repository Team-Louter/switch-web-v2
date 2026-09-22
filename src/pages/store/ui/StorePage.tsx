import { useStorePage } from '../model/useStorePage'
import * as S from './StorePage.style'
import { PointHistoryModal } from './components/PointHistoryModal'
import { StoreEffectCard } from './components/StoreEffectCard'
import { StoreFilterBar } from './components/StoreFilterBar'
import { StorePurchaseModal } from './components/StorePurchaseModal'
import { StoreProfileCustomizeModal } from './components/StoreProfileCustomizeModal'
import { MoreIcon, PointIcon } from './icons'

import type { StoreCategory, StoreEffect } from '../types'

const STORE_SECTION_CATEGORIES: Exclude<StoreCategory, '전체'>[] = [
  '테두리',
  '이름 색상',
  '칭호',
]

type StoreEffectListProps = {
  effects: StoreEffect[]
  emptyMessage: string
  isActionPending: boolean
  selectedCategory: StoreCategory
  onEquip: (effectId: number) => void
  onPurchaseOpen: (effect: StoreEffect) => void
  onRemove: (effectId: number) => void
}

function StoreEffectList({
  effects,
  emptyMessage,
  isActionPending,
  selectedCategory,
  onEquip,
  onPurchaseOpen,
  onRemove,
}: StoreEffectListProps) {
  if (effects.length === 0) {
    return <S.EmptyGridMessage>{emptyMessage}</S.EmptyGridMessage>
  }

  const renderEffectCard = (effect: StoreEffect) => (
    <StoreEffectCard
      effect={effect}
      isActionPending={isActionPending}
      key={effect.id}
      onEquip={onEquip}
      onPurchaseOpen={onPurchaseOpen}
      onRemove={onRemove}
    />
  )

  if (selectedCategory !== '전체') {
    return <S.CardGrid>{effects.map(renderEffectCard)}</S.CardGrid>
  }

  return (
    <S.CategoryGroups>
      {STORE_SECTION_CATEGORIES.map((category) => {
        const categoryEffects = effects.filter(
          (effect) => effect.category === category,
        )

        if (categoryEffects.length === 0) {
          return null
        }

        return (
          <S.CategoryGroup key={category}>
            <S.CategoryTitle>{category}</S.CategoryTitle>
            <S.CardGrid>{categoryEffects.map(renderEffectCard)}</S.CardGrid>
          </S.CategoryGroup>
        )
      })}
    </S.CategoryGroups>
  )
}

export function StorePage() {
  const {
    activeModal,
    categories,
    customizeCategories,
    customizeOwnedEffects,
    customizeRecommendedEffects,
    errorMessage,
    hasCustomizeChanges,
    isActionPending,
    isLoading,
    ownedEffects,
    point,
    profilePreview,
    recommendedEffects,
    selectedCategory,
    selectedCustomizeCategory,
    selectedCustomizeEffect,
    selectedEffect,
    onCategorySelect,
    onCustomizeCategorySelect,
    onCustomizeEffectSelect,
    onCustomizePurchase,
    onCustomizeReset,
    onCustomizeSave,
    onEffectEquip,
    onEffectRemove,
    onModalClose,
    onPointHistoryOpen,
    onPurchase,
    onPurchaseOpen,
    onRetry,
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
            <span>{errorMessage || '상점 아이템을 불러오는 중이에요'}</span>
            {errorMessage && !isLoading && (
              <S.RetryButton onClick={onRetry} type="button">
                다시 시도
              </S.RetryButton>
            )}
          </S.FeedbackMessage>
        )}

        <S.EffectSections>
          <S.Section>
            <S.SectionTitle>내 효과</S.SectionTitle>
            {!isLoading && (
              <StoreEffectList
                effects={ownedEffects}
                emptyMessage="보유한 효과가 없어요"
                isActionPending={isActionPending}
                selectedCategory={selectedCategory}
                onEquip={onEffectEquip}
                onPurchaseOpen={onPurchaseOpen}
                onRemove={onEffectRemove}
              />
            )}
          </S.Section>

          <S.Section>
            <S.SectionTitle>추천 효과</S.SectionTitle>
            {!isLoading && (
              <StoreEffectList
                effects={recommendedEffects}
                emptyMessage="추천 효과가 없어요"
                isActionPending={isActionPending}
                selectedCategory={selectedCategory}
                onEquip={onEffectEquip}
                onPurchaseOpen={onPurchaseOpen}
                onRemove={onEffectRemove}
              />
            )}
          </S.Section>
        </S.EffectSections>
      </S.Content>

      {activeModal === 'customize' && (
        <StoreProfileCustomizeModal
          categories={customizeCategories}
          errorMessage={errorMessage}
          hasUnsavedChanges={hasCustomizeChanges}
          isActionPending={isActionPending}
          isLoading={isLoading}
          ownedEffects={customizeOwnedEffects}
          profile={profilePreview}
          recommendedEffects={customizeRecommendedEffects}
          selectedCategory={selectedCustomizeCategory}
          selectedEffect={selectedCustomizeEffect}
          onCategorySelect={onCustomizeCategorySelect}
          onClose={onModalClose}
          onEffectSelect={onCustomizeEffectSelect}
          onGoToStore={(category) => {
            onCategorySelect(category)
            onModalClose()
          }}
          onPurchase={onCustomizePurchase}
          onReset={onCustomizeReset}
          onSave={onCustomizeSave}
        />
      )}
      {activeModal === 'pointHistory' && (
        <PointHistoryModal point={point} onClose={onModalClose} />
      )}
      {(activeModal === 'purchase' || activeModal === 'purchaseComplete') &&
        selectedEffect && (
          <StorePurchaseModal
            effect={selectedEffect}
            isComplete={activeModal === 'purchaseComplete'}
            isActionPending={isActionPending}
            point={point}
            profile={profilePreview}
            onClose={onModalClose}
            onEquip={onEffectEquip}
            onPurchase={onPurchase}
          />
        )}
    </S.Page>
  )
}
