import { useEffect, useMemo, useState } from 'react'

import { getShopItems, updateEquippedItem } from '@/entities/store'

import {
  STORE_CATEGORY_ITEM_TYPE,
  applyEquippedItems,
  mapShopItemToStoreEffect,
} from './useStorePage'

import type { EquippedItemsResponse, StoreItemType } from '@/entities/store'
import type { StoreCategory, StoreEffect } from '../types'

const CUSTOMIZE_CATEGORIES: Exclude<StoreCategory, '전체'>[] = [
  '이름 색상',
  '테두리',
  '칭호',
]

type UseProfileCustomizeParams = {
  isOpen: boolean
  onEquippedItemsChange: (equippedItems: EquippedItemsResponse) => void
}

// 마이페이지에서 독립적으로 프로필 꾸미기 모달을 여는 로직.
// useStorePage와 매핑 함수를 공유하되, 상점 목록/필터는 포함하지 않는다.
export function useProfileCustomize({
  isOpen,
  onEquippedItemsChange,
}: UseProfileCustomizeParams) {
  const [selectedCategory, setSelectedCategory] =
    useState<Exclude<StoreCategory, '전체'>>('이름 색상')
  const [selectedEffectId, setSelectedEffectId] =
    useState<number | null | undefined>(undefined)
  const [storeEffects, setStoreEffects] = useState<StoreEffect[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isActionPending, setIsActionPending] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    if (!isOpen) {
      return
    }

    let shouldIgnore = false

    const loadItems = async () => {
      setIsLoading(true)
      setErrorMessage('')

      try {
        const response = await getShopItems()
        const effects = response.items.map(mapShopItemToStoreEffect)

        if (!shouldIgnore) {
          setStoreEffects(effects)
        }
      } catch {
        if (!shouldIgnore) {
          setErrorMessage('상점 아이템을 불러오지 못했어요')
        }
      } finally {
        if (!shouldIgnore) {
          setIsLoading(false)
        }
      }
    }

    void loadItems()

    return () => {
      shouldIgnore = true
    }
  }, [isOpen])


  const categoryEffects = useMemo(
    () => storeEffects.filter((effect) => effect.category === selectedCategory),
    [selectedCategory, storeEffects],
  )

  const ownedEffects = useMemo(
    () => categoryEffects.filter((effect) => effect.status !== 'recommended'),
    [categoryEffects],
  )
  const recommendedEffects = useMemo(
    () => categoryEffects.filter((effect) => effect.status === 'recommended'),
    [categoryEffects],
  )
  const selectedEffect =
  selectedEffectId === null || selectedEffectId === undefined
    ? null
    : categoryEffects.find((effect) => effect.id === selectedEffectId) ?? null

  useEffect(() => {
    setSelectedEffectId((currentId) => {
      if (currentId === null) {
        return currentId
      }

      if (
        currentId !== undefined &&
        categoryEffects.some((effect) => effect.id === currentId)
      ) {
        return currentId
      }

      return (
        ownedEffects.find((effect) => effect.status === 'equipped') ??
        ownedEffects[0]
      )?.id
    })
  }, [categoryEffects, ownedEffects])

  const onCategorySelect = (category: StoreCategory) => {
    if (category === '전체') {
      return
    }

    setSelectedCategory(category)
    setSelectedEffectId(undefined)
  }

  const onEffectSelect = (effect: StoreEffect | null) => {
    setSelectedEffectId(effect?.id ?? null)
  }

  const onReset = () => {
    setSelectedEffectId(null)
  }

  const onSave = async () => {
    if (isActionPending) {
      return false
    }

    const itemType = STORE_CATEGORY_ITEM_TYPE[selectedCategory] as StoreItemType

    setIsActionPending(true)
    setErrorMessage('')

    try {
      const equippedItems = await updateEquippedItem(
        selectedEffect
          ? { itemId: selectedEffect.id, itemType }
          : { itemType },
      )

      setStoreEffects((currentEffects) =>
        applyEquippedItems(currentEffects, equippedItems, itemType),
      )
      onEquippedItemsChange(equippedItems)

      return true
    } catch {
      setErrorMessage('효과 설정을 저장하지 못했어요')
      return false
    } finally {
      setIsActionPending(false)
    }
  }

  return {
    categories: CUSTOMIZE_CATEGORIES,
    errorMessage,
    isActionPending,
    isLoading,
    ownedEffects,
    recommendedEffects,
    selectedCategory,
    selectedEffect,
    onCategorySelect,
    onEffectSelect,
    onReset,
    onSave,
  }
}