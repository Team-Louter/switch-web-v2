import { ProfileAvatar } from '@/shared/ui'
import { getNameStyleKey } from '@/shared/styles'

import * as S from '../StorePage.style'
import { CloseIcon, LockIcon, PointIcon } from '../icons'

import type { ProfileAvatarDecorationItem } from '@/shared/ui'
import type {
  StoreCategory,
  StoreEffect,
  StoreProfilePreview,
} from '../../types'

type StoreProfileCustomizeModalProps = {
  categories: StoreCategory[]
  errorMessage?: string
  hasUnsavedChanges: boolean
  isActionPending: boolean
  isLoading?: boolean
  ownedEffects: StoreEffect[]
  profile: StoreProfilePreview | null
  recommendedEffects: StoreEffect[]
  selectedCategory: StoreCategory
  selectedEffect: StoreEffect | null
  selectedEffectsByCategory?: SelectedEffectsByCategory
  onCategorySelect: (category: StoreCategory) => void
  onClose: () => void
  onEffectSelect: (effect: StoreEffect | null) => void
  onGoToStore: (category: StoreCategory) => void
  onPurchase: () => void
  onReset: () => void
  onSave: () => void
}

type EquippedItemKey = 'border' | 'nameColor' | 'title'

const CATEGORY_EQUIPPED_ITEM_KEY: Record<
  Exclude<StoreCategory, '전체'>,
  EquippedItemKey
> = {
  '이름 색상': 'nameColor',
  '칭호': 'title',
  '테두리': 'border',
}

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

const CUSTOMIZE_SKELETON_OPTION_COUNT = 6

type SelectedEffectsByCategory = Record<
  Exclude<StoreCategory, '전체'>,
  StoreEffect | null
>

const getCustomizePreviewEquippedItems = (
  profile: StoreProfilePreview | null,
  selectedCategory: StoreCategory,
  selectedEffect: StoreEffect | null,
  selectedEffectsByCategory?: SelectedEffectsByCategory,
) => {
  if (!selectedEffectsByCategory) {
    if (selectedCategory === '전체') {
      return profile?.equippedItems
    }

    const equippedItems = { ...profile?.equippedItems }
    const targetKey = CATEGORY_EQUIPPED_ITEM_KEY[selectedCategory]

    if (!selectedEffect) {
      delete equippedItems[targetKey]
      return equippedItems
    }

    equippedItems[targetKey] = getEffectDecorationItem(selectedEffect)
    return equippedItems
  }

  const equippedItems = { ...profile?.equippedItems }

  for (const category of Object.keys(
    CATEGORY_EQUIPPED_ITEM_KEY,
  ) as Exclude<StoreCategory, '전체'>[]) {
    const targetKey = CATEGORY_EQUIPPED_ITEM_KEY[category]
    const effect = selectedEffectsByCategory[category]

    if (!effect) {
      delete equippedItems[targetKey]
      continue
    }

    equippedItems[targetKey] = getEffectDecorationItem(effect)
  }

  return equippedItems
}

type CustomizeEffectOptionProps = {
  disabled?: boolean
  effect?: StoreEffect
  isEquipped: boolean
  isLocked?: boolean
  isNone?: boolean
  isSelected: boolean
  onClick: () => void
}

function CustomizeEffectOption({
  disabled = false,
  effect,
  isEquipped,
  isLocked = false,
  isNone = false,
  isSelected,
  onClick,
}: CustomizeEffectOptionProps) {
  const optionLabel = isNone
    ? '효과 없음'
    : `${effect?.title ?? '프로필 효과'}${isEquipped ? ', 현재 착용 중' : ''}`

  return (
    <S.CustomizeEffectOption
      aria-label={optionLabel}
      aria-pressed={isSelected}
      disabled={disabled}
      $isEquipped={isEquipped}
      $isLocked={isLocked}
      $isSelected={isSelected}
      onClick={onClick}
      type="button"
    >
      {isNone ? (
        <S.CustomizeNonePreview>
          <S.CustomizeNoneIcon>×</S.CustomizeNoneIcon>
          <S.CustomizeNoneLabel>없음</S.CustomizeNoneLabel>
        </S.CustomizeNonePreview>
      ) : effect?.imageUrl || effect?.thumbnailUrl ? (
        <S.CustomizeOptionImage
          src={effect.imageUrl ?? effect.thumbnailUrl ?? ''}
          alt=""
        />
      ) : effect?.type === 'nameColor' ? (
        <S.CustomizeNameSample styleKey={effect.nameStyleKey}>
          Switch
        </S.CustomizeNameSample>
      ) : (
        <S.CustomizeOptionText>{effect?.title}</S.CustomizeOptionText>
      )}

      {isEquipped && (
        <S.CustomizeEquippedBadge aria-hidden="true">착용 중</S.CustomizeEquippedBadge>
      )}

      {isLocked && (
        <S.CustomizeLockOverlay>
          <LockIcon />
        </S.CustomizeLockOverlay>
      )}
    </S.CustomizeEffectOption>
  )
}

function CustomizeEffectSkeleton() {
  return (
    <S.CustomizeSkeletonContent
      aria-label="프로필 꾸미기 효과를 불러오는 중이에요"
      role="status"
    >
      <S.CustomizeSkeletonHeading aria-hidden="true" />
      <S.CustomizeSkeletonGrid aria-hidden="true">
        {Array.from(
          { length: CUSTOMIZE_SKELETON_OPTION_COUNT },
          (_, index) => <S.CustomizeSkeletonOption key={index} />,
        )}
      </S.CustomizeSkeletonGrid>
      <S.CustomizeSkeletonHeading aria-hidden="true" />
      <S.CustomizeSkeletonGrid aria-hidden="true">
        {Array.from(
          { length: CUSTOMIZE_SKELETON_OPTION_COUNT },
          (_, index) => <S.CustomizeSkeletonOption key={index} />,
        )}
      </S.CustomizeSkeletonGrid>
    </S.CustomizeSkeletonContent>
  )
}

// 프로필 꾸미기 모달의 탭, 효과 선택, 미리보기, 저장 액션을 렌더링한다.
// 1) 좌측 탭으로 효과 종류를 바꾼다
// 2) 가운데에서 내 효과/추천 효과를 선택한다
// 3) 오른쪽 미리보기와 하단 액션으로 저장 흐름을 제공한다
export function StoreProfileCustomizeModal({
  categories,
  errorMessage = '',
  hasUnsavedChanges,
  isActionPending,
  isLoading = false,
  ownedEffects,
  profile,
  recommendedEffects,
  selectedCategory,
  selectedEffect,
  selectedEffectsByCategory,
  onCategorySelect,
  onClose,
  onEffectSelect,
  onGoToStore,
  onPurchase,
  onReset,
  onSave,
}: StoreProfileCustomizeModalProps) {
  const previewEquippedItems = getCustomizePreviewEquippedItems(
    profile,
    selectedCategory,
    selectedEffect,
    selectedEffectsByCategory,
  )
  const selectedNameColorEffect = selectedEffectsByCategory?.['이름 색상']
  const equippedNameColor = profile?.equippedItems?.nameColor
  const previewNameStyleKey = selectedEffectsByCategory
    ? selectedNameColorEffect?.nameStyleKey
    : selectedCategory === '이름 색상'
      ? selectedEffect?.nameStyleKey
      : getNameStyleKey(
          equippedNameColor?.styleKey ??
            equippedNameColor?.valueColor ??
            equippedNameColor?.value_color ??
            equippedNameColor?.valueText ??
            equippedNameColor?.itemName,
        )
  const previewTitle = previewEquippedItems?.title
  const previewTitleText = previewTitle?.valueText ?? previewTitle?.itemName
  const selectedPurchaseEffect = selectedEffectsByCategory
    ? Object.values(selectedEffectsByCategory).find(
        (effect) => effect?.status === 'recommended',
      ) ?? null
    : selectedEffect?.status === 'recommended'
      ? selectedEffect
      : null
  const isModalBusy = isActionPending || isLoading
  const isPrimaryActionDisabled =
    isModalBusy ||
    Boolean(selectedPurchaseEffect?.canPurchase === false) ||
    (!selectedPurchaseEffect && !hasUnsavedChanges)
  const handlePrimaryAction = () => {
    if (selectedPurchaseEffect) {
      onPurchase()
      return
    }

    onSave()
  }

  return (
    <S.Overlay>
      <S.CustomizeModal
        aria-busy={isModalBusy}
        aria-modal="true"
        role="dialog"
      >
        <S.ModalHeader>
          <S.ModalTitle>프로필 꾸미기</S.ModalTitle>
          <S.CloseButton aria-label="닫기" onClick={onClose} type="button">
            <CloseIcon />
          </S.CloseButton>
        </S.ModalHeader>

        <S.CustomizeBody>
          <S.CustomizeTabList>
            {categories.map((category) => (
              <S.CustomizeTabButton
                $isActive={selectedCategory === category}
                disabled={isModalBusy}
                key={category}
                onClick={() => onCategorySelect(category)}
                type="button"
              >
                {category}
              </S.CustomizeTabButton>
            ))}
          </S.CustomizeTabList>

          <S.CustomizeEffectPanel>
            <S.CustomizeEffectScrollArea>
              {isLoading ? (
                <CustomizeEffectSkeleton />
              ) : (
                <>
                  <S.CustomizeSectionTitle>내 효과</S.CustomizeSectionTitle>
                  <S.CustomizeOptionGrid>
                    <CustomizeEffectOption
                      isNone
                      isEquipped={false}
                      isSelected={selectedEffect === null}
                      disabled={isModalBusy}
                      onClick={() => onEffectSelect(null)}
                    />
                    {ownedEffects.map((effect) => (
                      <CustomizeEffectOption
                        disabled={isModalBusy}
                        effect={effect}
                        isEquipped={effect.status === 'equipped'}
                        isSelected={selectedEffect?.id === effect.id}
                        key={effect.id}
                        onClick={() => onEffectSelect(effect)}
                      />
                    ))}
                  </S.CustomizeOptionGrid>
                  <S.CustomizeSectionTitle>추천 효과</S.CustomizeSectionTitle>
                  <S.CustomizeOptionGrid>
                    {recommendedEffects.length > 0 ? (
                      recommendedEffects.map((effect) => (
                        <CustomizeEffectOption
                          disabled={isModalBusy}
                          effect={effect}
                          isEquipped={false}
                          isLocked
                          isSelected={selectedEffect?.id === effect.id}
                          key={effect.id}
                          onClick={() => onEffectSelect(effect)}
                        />
                      ))
                    ) : (
                      <S.CustomizeEmptyText>추천 효과가 없어요</S.CustomizeEmptyText>
                    )}
                  </S.CustomizeOptionGrid>
                </>
              )}
              {errorMessage && (
                <S.CustomizeFeedbackMessage role="alert">
                  {errorMessage}
                </S.CustomizeFeedbackMessage>
              )}
            </S.CustomizeEffectScrollArea>

            <S.CustomizeStoreButton
              disabled={isModalBusy}
              onClick={() => onGoToStore(selectedCategory)}
              type="button"
            >
              상점으로 이동
            </S.CustomizeStoreButton>
          </S.CustomizeEffectPanel>

          <S.CustomizePreviewPanel>
            <S.CustomizePreviewTop>
              <ProfileAvatar
                imageUrl={profile?.imageUrl}
                equippedItems={previewEquippedItems}
                size={200}
              />
              <S.CustomizePreviewTextGroup>
                {previewTitleText && (
                  <S.CustomizePreviewTitle>{previewTitleText}</S.CustomizePreviewTitle>
                )}
                <S.CustomizePreviewName styleKey={previewNameStyleKey}>
                  {profile?.name ?? ''}
                </S.CustomizePreviewName>
                <S.CustomizePreviewDescription>
                  {profile?.classInfo ?? ''}
                </S.CustomizePreviewDescription>
                <S.CustomizePreviewDescription>
                  {profile?.majors ?? ''}
                </S.CustomizePreviewDescription>
              </S.CustomizePreviewTextGroup>
            </S.CustomizePreviewTop>

            <S.CustomizeActionGroup>
              <S.ModalButton
                $variant="secondary"
                disabled={isModalBusy}
                onClick={onReset}
                type="button"
              >
                전체 초기화
              </S.ModalButton>
              <S.ModalButtonRow>
                <S.ModalButton
                  $variant="secondary"
                  disabled={isModalBusy}
                  onClick={onClose}
                  type="button"
                >
                  취소
                </S.ModalButton>
                <S.ModalButton
                  disabled={isPrimaryActionDisabled}
                  onClick={handlePrimaryAction}
                  type="button"
                >
                  {selectedPurchaseEffect ? (
                    selectedPurchaseEffect.canPurchase === false ? (
                      '구매할 수 없어요'
                    ) : (
                      <>
                        <PointIcon size={17} />
                        {selectedPurchaseEffect.price}에 구매하기
                      </>
                    )
                  ) : (
                    '저장'
                  )}
                </S.ModalButton>
              </S.ModalButtonRow>
            </S.CustomizeActionGroup>
          </S.CustomizePreviewPanel>
        </S.CustomizeBody>
      </S.CustomizeModal>
    </S.Overlay>
  )
}
