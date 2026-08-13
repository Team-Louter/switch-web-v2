import { useEffect, useMemo, useState } from 'react'

import {
  getShopItems,
  getUserPoint,
  purchaseShopItem,
  updateEquippedItem,
} from '@/entities/store'

import type {
  EquippedItemResponse,
  EquippedItemsResponse,
  ProfileItemResponse,
  ShopItemResponse,
  StoreItemType,
  UnlockCondition,
} from '@/entities/store'
import type {
  PointHistory,
  StoreCategory,
  StoreEffect,
  StoreEffectStatus,
  StoreEffectType,
  StoreModalType,
} from '../types'

const STORE_CATEGORIES: StoreCategory[] = [
  '전체',
  '이름 색상',
  '테두리',
  '뱃지',
  '칭호',
]

const POINT_HISTORIES: PointHistory[] = [
  {
    id: 1,
    title: '게시물 작성',
    description: '보상 · 26.07.15',
    amountLabel: '+00',
    isPositive: true,
  },
  {
    id: 2,
    title: '무지개',
    description: '효과 구매 · 26.07.15',
    amountLabel: '-00',
    isPositive: false,
  },
  {
    id: 3,
    title: '게시물 작성',
    description: '보상 · 26.07.15',
    amountLabel: '+00',
    isPositive: true,
  },
]

const STORE_ITEM_CATEGORY: Record<StoreItemType, StoreCategory> = {
  BORDER: '테두리',
  NAME_COLOR: '이름 색상',
  TITLE: '칭호',
}

const STORE_ITEM_EFFECT_TYPE: Record<StoreItemType, StoreEffectType> = {
  BORDER: 'outline',
  NAME_COLOR: 'nameColor',
  TITLE: 'nickname',
}

const UNLOCK_CONDITION_LABEL: Record<UnlockCondition['unlockConditionType'], string> = {
  COMMENT_COUNT: '댓글 작성',
  GIVE_HEART: '좋아요 누르기',
  POST_COUNT: '게시글 작성',
  RECEIVED_HEART: '받은 좋아요',
}

const getStoreEffectStatus = (item: ShopItemResponse): StoreEffectStatus => {
  if (item.equipped) {
    return 'equipped'
  }

  if (item.owned) {
    return 'owned'
  }

  return 'recommended'
}

const mapShopItemToStoreEffect = (item: ShopItemResponse): StoreEffect => ({
  id: item.itemId,
  itemType: item.itemType,
  title: item.itemName,
  category: STORE_ITEM_CATEGORY[item.itemType],
  type: STORE_ITEM_EFFECT_TYPE[item.itemType],
  status: getStoreEffectStatus(item),
  price: item.itemPrice,
  thumbnailUrl: item.thumbnailUrl,
  canPurchase: item.purchasable,
})

const mapProfileItemToOwnedEffect = (
  item: ProfileItemResponse,
): StoreEffect => ({
  id: item.itemId,
  itemType: item.itemType,
  title: item.itemName,
  category: STORE_ITEM_CATEGORY[item.itemType],
  type: STORE_ITEM_EFFECT_TYPE[item.itemType],
  status: 'owned',
  price: item.itemPrice,
  thumbnailUrl: item.thumbnailUrl,
  hasConditions: Boolean(item.unlockConditions?.length),
  canPurchase: true,
  conditionLabels: item.unlockConditions?.map(
    (condition) =>
      `${UNLOCK_CONDITION_LABEL[condition.unlockConditionType]} ${condition.requiredCount}회`,
  ),
})

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

const applyEquippedItems = (
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
// 1) 상점 아이템 목록을 조회해 화면 카드 형태로 변환한다
// 2) 선택된 카테고리로 목록을 나눈다
// 3) 구매/장착/제거 API 성공 후 카드 상태를 갱신한다
export function useStorePage() {
  const [selectedCategory, setSelectedCategory] =
    useState<StoreCategory>('전체')
  const [storeEffects, setStoreEffects] = useState<StoreEffect[]>([])
  const [activeModal, setActiveModal] = useState<StoreModalType | null>(null)
  const [selectedEffect, setSelectedEffect] = useState<StoreEffect | null>(null)
  const [point, setPoint] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [isActionPending, setIsActionPending] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    let shouldIgnore = false

    const loadStoreData = async () => {
      const [itemsResult, pointResult] = await Promise.allSettled([
        getShopItems(),
        getUserPoint(),
      ] as const)

      if (itemsResult.status === 'fulfilled') {
        if (!shouldIgnore) {
          setStoreEffects(itemsResult.value.items.map(mapShopItemToStoreEffect))
        }
      } else {
        if (!shouldIgnore) {
          setErrorMessage('상점 아이템을 불러오지 못했어요')
          setStoreEffects([])
        }
      }

      if (pointResult.status === 'fulfilled') {
        if (!shouldIgnore) {
          setPoint(pointResult.value)
        }
      } else if (!shouldIgnore && itemsResult.status === 'fulfilled') {
        setErrorMessage('포인트를 불러오지 못했어요')
      }

      if (!shouldIgnore) {
        setIsLoading(false)
      }
    }

    void loadStoreData()

    return () => {
      shouldIgnore = true
    }
  }, [])

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

  const ownedEffects = filteredEffects.filter(
    (effect) => effect.status !== 'recommended',
  )
  const recommendedEffects = filteredEffects.filter(
    (effect) => effect.status === 'recommended',
  )

  const handlePointHistoryOpen = () => {
    setActiveModal('pointHistory')
  }

  const handleModalClose = () => {
    setActiveModal(null)
    setSelectedEffect(null)
  }

  const handlePurchaseOpen = (effect: StoreEffect) => {
    setSelectedEffect(effect)
    setActiveModal('purchase')
  }

  const handlePurchase = async () => {
    if (
      !selectedEffect ||
      selectedEffect.canPurchase === false ||
      isActionPending
    ) {
      return
    }

    setIsActionPending(true)
    setErrorMessage('')

    try {
      const purchasedItem = await purchaseShopItem(
        selectedEffect.itemType,
        selectedEffect.id,
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
    } catch {
      setErrorMessage('효과 장착을 해제하지 못했어요')
    } finally {
      setIsActionPending(false)
    }
  }

  return {
    activeModal,
    categories: STORE_CATEGORIES,
    errorMessage,
    isActionPending,
    isLoading,
    ownedEffects,
    point,
    pointHistories: POINT_HISTORIES,
    recommendedEffects,
    selectedCategory,
    selectedEffect,
    onCategorySelect: setSelectedCategory,
    onEffectEquip: handleEquip,
    onEffectRemove: handleRemove,
    onModalClose: handleModalClose,
    onPointHistoryOpen: handlePointHistoryOpen,
    onPurchase: handlePurchase,
    onPurchaseOpen: handlePurchaseOpen,
  }
}
