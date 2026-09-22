import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'

import { formatProfileClassInfo, getMyProfile } from '@/entities/profile'
import { dispatchProfileSync } from '@/shared/lib/profileSync'
import { getNameStyleKey } from '@/shared/styles'
import {
  getShopItems,
  getUserPoint,
  purchaseShopItem,
  updateEquippedItem,
} from '@/entities/store'

import type { ProfileMajor, ProfileResponse } from '@/entities/profile'
import type {
  EquippedItemResponse,
  EquippedItemsResponse,
  ProfileItemResponse,
  ShopItemResponse,
  StoreItemType,
  UnlockCondition,
} from '@/entities/store'
import type {
  StoreCategory,
  StoreEffect,
  StoreEffectStatus,
  StoreEffectType,
  StoreModalType,
  StoreProfilePreview,
} from '../types'

type StoreItemImageSource = {
  displayType?: 'COVER' | 'FRAME'
  itemName?: string
  imageUrl?: string
  itemImageUrl?: string
  originalImageUrl?: string
  previewImageUrl?: string
  thumbnailUrl?: string
  styleKey?: string
  valueColor?: string
  value_color?: string
  valueImageUrl?: string
  valueText?: string
}

type StoreItemConditionField = UnlockCondition[] | UnlockCondition | undefined

type StoreItemConditionSource = {
  condition?: StoreItemConditionField
  conditions?: StoreItemConditionField
  unlockCondition?: StoreItemConditionField
  unlockConditionList?: StoreItemConditionField
  unlockConditionResponses?: StoreItemConditionField
  unlockConditions?: StoreItemConditionField
  unlock_conditions?: StoreItemConditionField
}

const STORE_CATEGORIES: StoreCategory[] = [
  '전체',
  '이름 색상',
  '테두리',
  '칭호',
]

const CUSTOMIZE_CATEGORIES: StoreCategory[] = [
  '이름 색상',
  '테두리',
  '칭호',
]

const shouldOpenCustomizeModal = (searchParams: URLSearchParams) =>
  searchParams.get('customize') === '1' ||
  searchParams.get('customize') === 'true'

const getInitialStoreCategory = (
  searchParams: URLSearchParams,
): StoreCategory => {
  const categoryParam = searchParams.get('category')

  return (
    STORE_CATEGORIES.find((category) => category === categoryParam) ?? '전체'
  )
}

const STORE_ITEM_CATEGORY: Record<StoreItemType, StoreCategory> = {
  BORDER: '테두리',
  NAME_COLOR: '이름 색상',
  TITLE: '칭호',
}

export const STORE_CATEGORY_ITEM_TYPE: Record<Exclude<StoreCategory, '전체'>, StoreItemType> = {
  '이름 색상': 'NAME_COLOR',
  '칭호': 'TITLE',
  '테두리': 'BORDER',
}

const STORE_ITEM_EFFECT_TYPE: Record<StoreItemType, StoreEffectType> = {
  BORDER: 'outline',
  NAME_COLOR: 'nameColor',
  TITLE: 'nickname',
}

const MAJOR_LABEL: Record<ProfileMajor, string> = {
  AI: 'AI',
  ANDROID: '안드로이드',
  BACKEND: '백엔드',
  DESIGN: '디자인',
  EMBEDDED: '임베디드',
  FRONTEND: '프론트엔드',
  GAME: '게임',
  IOS: 'iOS',
  SECURITY: '보안',
}

type StoreItemConditionType = UnlockCondition['unlockConditionType'] & string

const UNLOCK_CONDITION_LABEL: Record<StoreItemConditionType, string> = {
  COMMENT_COUNT: '댓글 작성',
  GIVE_HEART: '좋아요 누르기',
  POST_COUNT: '게시글 작성',
  RECEIVED_HEART: '받은 좋아요',
}

const normalizeStoreItemConditions = (
  conditions: StoreItemConditionField,
): UnlockCondition[] => {
  if (!conditions) {
    return []
  }

  return Array.isArray(conditions) ? conditions : [conditions]
}

const getStoreItemConditions = (item: StoreItemConditionSource) =>
  normalizeStoreItemConditions(
    item.unlockConditions ??
      item.conditions ??
      item.condition ??
      item.unlockCondition ??
      item.unlockConditionList ??
      item.unlockConditionResponses ??
      item.unlock_conditions,
  )

const getUnlockConditionType = (condition: UnlockCondition) =>
  condition.unlockConditionType ??
  condition.conditionType ??
  condition.unlock_condition_type ??
  condition.condition_type

const getUnlockConditionRequiredCount = (condition: UnlockCondition) =>
  condition.requiredCount ??
  condition.required ??
  condition.requiredValue ??
  condition.required_count ??
  condition.value

const formatUnlockConditionLabels = (item: StoreItemConditionSource) =>
  getStoreItemConditions(item).flatMap((condition) => {
    const conditionType = getUnlockConditionType(condition)
    const requiredCount = getUnlockConditionRequiredCount(condition)

    if (!conditionType || requiredCount === undefined) {
      return []
    }

    return `${UNLOCK_CONDITION_LABEL[conditionType] ?? '조건'} ${requiredCount}회`
  })

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? ''

const getStoreEffectStatus = (item: ShopItemResponse): StoreEffectStatus => {
  if (item.equipped) {
    return 'equipped'
  }

  if (item.owned) {
    return 'owned'
  }

  return 'recommended'
}

const normalizeStoreImageUrl = (imageUrl?: string) => {
  const trimmedUrl = imageUrl?.trim()

  if (!trimmedUrl) {
    return undefined
  }

  if (/^(blob:|data:|https?:\/\/)/.test(trimmedUrl)) {
    return trimmedUrl
  }

  const baseUrl = API_BASE_URL.replace(/\/$/, '')
  const pathname = trimmedUrl.startsWith('/') ? trimmedUrl : `/${trimmedUrl}`

  return baseUrl ? `${baseUrl}${pathname}` : pathname
}

const getStoreEffectThumbnailUrl = (item: StoreItemImageSource) =>
  normalizeStoreImageUrl(item.thumbnailUrl)

const getStoreEffectPreviewImageUrl = (item: StoreItemImageSource) =>
  normalizeStoreImageUrl(
    item.valueImageUrl ??
      item.imageUrl ??
      item.itemImageUrl ??
      item.originalImageUrl ??
      item.previewImageUrl ??
      item.thumbnailUrl,
  )

const getStoreEffectNameStyleKey = (item: StoreItemImageSource) =>
  getNameStyleKey(
    item.styleKey ??
      item.valueColor ??
      item.value_color ??
      item.valueText ??
      item.itemName,
  )

const formatMajorText = (majors?: ProfileMajor[]) =>
  majors?.map((major) => MAJOR_LABEL[major]).join(' · ') ?? ''

const formatStoreProfile = (profile: ProfileResponse): StoreProfilePreview => ({
  classInfo: formatProfileClassInfo(profile),
  equippedItems: profile.equippedItems,
  imageUrl: normalizeStoreImageUrl(profile.profileImageUrl),
  majors: formatMajorText(profile.majors),
  name: profile.userName,
})

export const mapShopItemToStoreEffect = (item: ShopItemResponse): StoreEffect => {
  const conditionLabels = formatUnlockConditionLabels(item)

  return {
    id: item.itemId,
    itemType: item.itemType,
    displayType: item.displayType,
    title: item.itemName,
    category: STORE_ITEM_CATEGORY[item.itemType],
    type: STORE_ITEM_EFFECT_TYPE[item.itemType],
    status: getStoreEffectStatus(item),
    price: item.itemPrice,
    imageUrl: getStoreEffectPreviewImageUrl(item),
    nameStyleKey: getStoreEffectNameStyleKey(item),
    thumbnailUrl: getStoreEffectThumbnailUrl(item),
    valueColor: item.valueColor ?? item.value_color,
    valueText: item.valueText,
    hasConditions: conditionLabels.length > 0,
    canPurchase: item.purchasable,
    conditionLabels,
  }
}

export const mapProfileItemToOwnedEffect = (
  item: ProfileItemResponse,
): StoreEffect => {
  const conditionLabels = formatUnlockConditionLabels(item)

  return {
    id: item.itemId,
    itemType: item.itemType,
    displayType: item.displayType,
    title: item.itemName,
    category: STORE_ITEM_CATEGORY[item.itemType],
    type: STORE_ITEM_EFFECT_TYPE[item.itemType],
    status: 'owned',
    price: item.itemPrice,
    imageUrl: getStoreEffectPreviewImageUrl(item),
    nameStyleKey: getStoreEffectNameStyleKey(item),
    thumbnailUrl: getStoreEffectThumbnailUrl(item),
    valueColor: item.valueColor ?? item.value_color,
    valueText: item.valueText,
    hasConditions: conditionLabels.length > 0,
    canPurchase: true,
    conditionLabels,
  }
}

const getEquippedItemId = (
  equippedItems: EquippedItemsResponse,
  itemType: StoreItemType,
) => {
  const equippedItemByType: Record<StoreItemType, EquippedItemResponse | undefined> = {
    BORDER: equippedItems.border,
    NAME_COLOR: equippedItems.nameColor,
    TITLE: equippedItems.title,
  }

  return equippedItemByType[itemType]?.itemId
}

export const applyEquippedItems = (
  effects: StoreEffect[],
  equippedItems: EquippedItemsResponse,
  targetItemType: StoreItemType,
) => {
  const equippedItemId = getEquippedItemId(equippedItems, targetItemType)

  return effects.map((effect) => {
    if (effect.itemType !== targetItemType || effect.status === 'recommended') {
      return effect
    }

    const nextStatus: StoreEffectStatus =
      equippedItemId !== undefined && effect.id === equippedItemId
        ? 'equipped'
        : 'owned'

    return {
      ...effect,
      status: nextStatus,
    }
  })
}

// 상점 페이지의 서버 데이터, 필터, 카드 액션, 모달 흐름을 관리한다.
// 1) 상점 아이템과 내 프로필을 조회한다
// 2) 페이지 필터/프로필 꾸미기 모달 필터를 각각 관리한다
// 3) 구매/장착/초기화 API 성공 후 카드 상태를 갱신한다
export function useStorePage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [selectedCategory, setSelectedCategory] =
    useState<StoreCategory>(() => getInitialStoreCategory(searchParams))
  const [selectedCustomizeCategory, setSelectedCustomizeCategory] =
    useState<Exclude<StoreCategory, '전체'>>('이름 색상')
  const [selectedCustomizeEffectId, setSelectedCustomizeEffectId] =
    useState<number | null | undefined>(undefined)
  const [storeEffects, setStoreEffects] = useState<StoreEffect[]>([])
  const [profilePreview, setProfilePreview] =
    useState<StoreProfilePreview | null>(null)
  const [activeModal, setActiveModal] = useState<StoreModalType | null>(() =>
    shouldOpenCustomizeModal(searchParams) ? 'customize' : null,
  )
  const [selectedEffect, setSelectedEffect] = useState<StoreEffect | null>(null)
  const [point, setPoint] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [isActionPending, setIsActionPending] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [loadAttempt, setLoadAttempt] = useState(0)

  useEffect(() => {
    let shouldIgnore = false

    const loadStoreData = async () => {
      const [itemsResult, pointResult, profileResult] =
        await Promise.allSettled([
          getShopItems(),
          getUserPoint(),
          getMyProfile(),
        ] as const)

      if (itemsResult.status === 'fulfilled') {
        if (!shouldIgnore) {
          setStoreEffects(itemsResult.value.items.map(mapShopItemToStoreEffect))
        }
      } else if (!shouldIgnore) {
        setErrorMessage('상점 아이템을 불러오지 못했어요')
        setStoreEffects([])
      }

      if (pointResult.status === 'fulfilled') {
        if (!shouldIgnore) {
          setPoint(pointResult.value)
        }
      } else if (!shouldIgnore && itemsResult.status === 'fulfilled') {
        setErrorMessage('포인트를 불러오지 못했어요')
      }

      if (profileResult.status === 'fulfilled' && !shouldIgnore) {
        setProfilePreview(formatStoreProfile(profileResult.value))
      }

      if (!shouldIgnore) {
        setIsLoading(false)
      }
    }

    void loadStoreData()

    return () => {
      shouldIgnore = true
    }
  }, [loadAttempt])

  useEffect(() => {
    if (activeModal !== 'purchaseComplete') {
      return
    }

    let shouldIgnore = false

    const refreshPoint = async () => {
      try {
        const currentPoint = await getUserPoint()

        if (!shouldIgnore) {
          setPoint(currentPoint)
        }
      } catch {
        // 구매 직후 포인트 재조회 실패 시 낙관적으로 반영한 값을 유지한다.
      }
    }

    void refreshPoint()

    return () => {
      shouldIgnore = true
    }
  }, [activeModal])



  const filteredEffects = useMemo(() => {
    if (selectedCategory === '전체') {
      return storeEffects
    }

    return storeEffects.filter((effect) => effect.category === selectedCategory)
  }, [selectedCategory, storeEffects])

  const customizeCategoryEffects = useMemo(
    () =>
      storeEffects.filter(
        (effect) => effect.category === selectedCustomizeCategory,
      ),
    [selectedCustomizeCategory, storeEffects],
  )

  const ownedEffects = filteredEffects.filter(
    (effect) => effect.status !== 'recommended',
  )
  const recommendedEffects = filteredEffects.filter(
    (effect) => effect.status === 'recommended',
  )
  const customizeOwnedEffects = useMemo(
    () =>
      customizeCategoryEffects.filter(
        (effect) => effect.status !== 'recommended',
      ),
    [customizeCategoryEffects],
  )
  const customizeRecommendedEffects = useMemo(
    () =>
      customizeCategoryEffects.filter(
        (effect) => effect.status === 'recommended',
      ),
    [customizeCategoryEffects],
  )
  const selectedCustomizeEffect =
    selectedCustomizeEffectId === null || selectedCustomizeEffectId === undefined
      ? null
      : customizeCategoryEffects.find(
          (effect) => effect.id === selectedCustomizeEffectId,
        ) ?? null
  const equippedCustomizeEffectId =
    customizeOwnedEffects.find((effect) => effect.status === 'equipped')?.id ?? null
  const hasCustomizeChanges =
    selectedCustomizeEffectId !== undefined &&
    (selectedCustomizeEffectId ?? null) !== equippedCustomizeEffectId

  useEffect(() => {
    setSelectedCustomizeEffectId((currentEffectId) => {
      if (currentEffectId === null) {
        return currentEffectId
      }

      if (
        currentEffectId !== undefined &&
        customizeOwnedEffects.some((effect) => effect.id === currentEffectId)
      ) {
        return currentEffectId
      }

      return customizeOwnedEffects.find((effect) => effect.status === 'equipped')?.id
    })
  }, [customizeOwnedEffects])

  const clearCustomizeQuery = () => {
    if (!searchParams.has('customize') && !searchParams.has('category')) {
      return
    }
  
    const nextSearchParams = new URLSearchParams(searchParams)
    nextSearchParams.delete('customize')
    nextSearchParams.delete('category')
    setSearchParams(nextSearchParams, { replace: true })
  }

  const handlePointHistoryOpen = () => {
    setActiveModal('pointHistory')
  }

  const handleStoreRetry = () => {
    setErrorMessage('')
    setIsLoading(true)
    setLoadAttempt((attempt) => attempt + 1)
  }

  const handleCustomizeOpen = () => {
    setActiveModal('customize')
  }

  const handleModalClose = () => {
    clearCustomizeQuery()
    setActiveModal(null)
    setSelectedEffect(null)
  }

  const handlePurchaseOpen = (effect: StoreEffect) => {
    setSelectedEffect(effect)
    setActiveModal('purchase')
  }

  const synchronizeEquippedItems = (
    equippedItems: StoreProfilePreview['equippedItems'],
  ) => {
    setProfilePreview((currentProfile) =>
      currentProfile ? { ...currentProfile, equippedItems } : currentProfile,
    )
    dispatchProfileSync({ equippedItems })
  }

  const handleCustomizeCategorySelect = (category: StoreCategory) => {
    if (category === '전체') {
      return
    }

    setSelectedCustomizeCategory(category)
    setSelectedCustomizeEffectId(undefined)
  }

  const handleCustomizeEffectSelect = (effect: StoreEffect | null) => {
    setSelectedCustomizeEffectId(effect?.id ?? null)
  }

  const handleCustomizeReset = () => {
    setSelectedCustomizeEffectId(null)
  }

  const handlePurchase = async (effectToPurchase = selectedEffect) => {
    if (
      !effectToPurchase ||
      effectToPurchase.canPurchase === false ||
      isActionPending
    ) {
      return
    }

    setIsActionPending(true)
    setErrorMessage('')

    try {
      const purchasedItem = await purchaseShopItem(
        effectToPurchase.itemType,
        effectToPurchase.id,
      )
      const ownedEffect = mapProfileItemToOwnedEffect(purchasedItem)

      setPoint((currentPoint) => currentPoint - ownedEffect.price)
      setStoreEffects((currentEffects) =>
        currentEffects.map((effect) =>
          effect.id === ownedEffect.id ? ownedEffect : effect,
        ),
      )
      setSelectedEffect(ownedEffect)
      setActiveModal('purchaseComplete')
    } catch {
      setErrorMessage('효과를 구매하지 못했어요')
    } finally {
      setIsActionPending(false)
    }
  }

  const handleCustomizePurchase = () => handlePurchase(selectedCustomizeEffect)

  const handleEquip = async (effectId: number) => {
    const target = storeEffects.find((effect) => effect.id === effectId)

    if (!target || isActionPending) {
      return
    }

    setIsActionPending(true)
    setErrorMessage('')

    try {
      const equippedItems = await updateEquippedItem({
        itemId: target.id,
        itemType: target.itemType,
      })

      setStoreEffects((currentEffects) =>
        applyEquippedItems(currentEffects, equippedItems, target.itemType),
      )
      synchronizeEquippedItems(equippedItems)
      handleModalClose()
    } catch {
      setErrorMessage('효과를 장착하지 못했어요')
    } finally {
      setIsActionPending(false)
    }
  }

  const handleRemove = async (effectId: number) => {
    const target = storeEffects.find((effect) => effect.id === effectId)

    if (!target || isActionPending) {
      return
    }

    setIsActionPending(true)
    setErrorMessage('')

    try {
      const equippedItems = await updateEquippedItem({
        itemType: target.itemType,
      })

      setStoreEffects((currentEffects) =>
        applyEquippedItems(currentEffects, equippedItems, target.itemType),
      )
      synchronizeEquippedItems(equippedItems)
    } catch {
      setErrorMessage('효과 장착을 해제하지 못했어요')
    } finally {
      setIsActionPending(false)
    }
  }

  const handleCustomizeSave = async () => {
    if (isActionPending || !hasCustomizeChanges) {
      return
    }

    const itemType = STORE_CATEGORY_ITEM_TYPE[selectedCustomizeCategory]

    setIsActionPending(true)
    setErrorMessage('')

    try {
      const equippedItems = await updateEquippedItem(
        selectedCustomizeEffect
          ? { itemId: selectedCustomizeEffect.id, itemType }
          : { itemType },
      )

      setStoreEffects((currentEffects) =>
        applyEquippedItems(currentEffects, equippedItems, itemType),
      )
      synchronizeEquippedItems(equippedItems)
      handleModalClose()
    } catch {
      setErrorMessage('효과 설정을 저장하지 못했어요')
    } finally {
      setIsActionPending(false)
    }
  }

  return {
    activeModal,
    categories: STORE_CATEGORIES,
    customizeCategories: CUSTOMIZE_CATEGORIES,
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
    onCategorySelect: setSelectedCategory,
    onCustomizeCategorySelect: handleCustomizeCategorySelect,
    onCustomizeEffectSelect: handleCustomizeEffectSelect,
    onCustomizeOpen: handleCustomizeOpen,
    onCustomizePurchase: handleCustomizePurchase,
    onCustomizeReset: handleCustomizeReset,
    onCustomizeSave: handleCustomizeSave,
    onEffectEquip: handleEquip,
    onEffectRemove: handleRemove,
    onModalClose: handleModalClose,
    onPointHistoryOpen: handlePointHistoryOpen,
    onPurchase: handlePurchase,
    onPurchaseOpen: handlePurchaseOpen,
    onRetry: handleStoreRetry,
  }
}
