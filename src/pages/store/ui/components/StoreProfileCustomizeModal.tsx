import { ProfileAvatar } from '@/shared/ui'
import { getNameStyleKey } from '@/shared/styles'

import * as S from '../StorePage.style'
import { CloseIcon, LockIcon } from '../icons'

import type { ProfileAvatarDecorationItem } from '@/shared/ui'
import type {
  StoreCategory,
  StoreEffect,
  StoreProfilePreview,
} from '../../types'

type StoreProfileCustomizeModalProps = {
  categories: StoreCategory[]
  isActionPending: boolean
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
  onPurchaseOpen: (effect: StoreEffect) => void
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
  effect?: StoreEffect
  isLocked?: boolean
  isNone?: boolean
  isSelected: boolean
  onClick: () => void
}

function CustomizeEffectOption({
  effect,
  isLocked = false,
  isNone = false,
  isSelected,
  onClick,
}: CustomizeEffectOptionProps) {
  return (
    <S.CustomizeEffectOption
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

      {isLocked && (
        <S.CustomizeLockOverlay>
          <LockIcon />
        </S.CustomizeLockOverlay>
      )}
    </S.CustomizeEffectOption>
  )
}

// 프로필 꾸미기 모달의 탭, 효과 선택, 미리보기, 저장 액션을 렌더링한다.
// 1) 좌측 탭으로 효과 종류를 바꾼다
// 2) 가운데에서 내 효과/추천 효과를 선택한다
// 3) 오른쪽 미리보기와 하단 액션으로 저장 흐름을 제공한다
export function StoreProfileCustomizeModal({
  categories,
  isActionPending,
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
  onPurchaseOpen,
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
  const isAnySelectionLocked = selectedEffectsByCategory
    ? Object.values(selectedEffectsByCategory).some(
        (effect) => effect?.status === 'recommended',
      )
    : Boolean(
        selectedEffect &&
          recommendedEffects.some((effect) => effect.id === selectedEffect.id),
      )

  return (
    <S.Overlay>
      <S.CustomizeModal aria-modal="true" role="dialog">
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
              <S.CustomizeSectionTitle>내 효과</S.CustomizeSectionTitle>
              <S.CustomizeOptionGrid>
                <CustomizeEffectOption
                  isNone
                  isSelected={selectedEffect === null}
                  onClick={() => onEffectSelect(null)}
                />
                {ownedEffects.map((effect) => (
                  <CustomizeEffectOption
                    effect={effect}
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
                      effect={effect}
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
            </S.CustomizeEffectScrollArea>

            <S.CustomizeStoreButton onClick={() => onGoToStore(selectedCategory)} type="button">
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
                disabled={isActionPending}
                onClick={onReset}
                type="button"
              >
                전체 초기화
              </S.ModalButton>
              <S.ModalButtonRow>
                <S.ModalButton
                  $variant="secondary"
                  disabled={isActionPending}
                  onClick={onClose}
                  type="button"
                >
                  취소
                </S.ModalButton>
                <S.ModalButton
                disabled={isActionPending || isAnySelectionLocked}
                onClick={onSave}
                type="button"
                >
                저장
                </S.ModalButton>
              </S.ModalButtonRow>
            </S.CustomizeActionGroup>
          </S.CustomizePreviewPanel>
        </S.CustomizeBody>
      </S.CustomizeModal>
    </S.Overlay>
  )
}
