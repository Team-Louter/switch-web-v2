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

type CategorySelections = Record<Exclude<StoreCategory, '전체'>, number | null>

const getInitialSelections = (effects: StoreEffect[]): CategorySelections => {
  const initial = {} as CategorySelections

  for (const category of CUSTOMIZE_CATEGORIES) {
    const equippedEffect = effects.find(
      (effect) => effect.category === category && effect.status === 'equipped',
    )
    initial[category] = equippedEffect?.id ?? null
  }

  return initial
}

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
  const [selections, setSelections] = useState<CategorySelections>(
    getInitialSelections([]),
  )
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
          setSelections(getInitialSelections(effects))
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
  const selectedEffectId = selections[selectedCategory]
  const selectedEffect =
    selectedEffectId === null
      ? null
      : categoryEffects.find((effect) => effect.id === selectedEffectId) ?? null
  
  const getEffectById = (id: number | null) =>
    id === null ? null : storeEffects.find((effect) => effect.id === id) ?? null
  
  const selectedEffectsByCategory = useMemo(
    () => ({
      '이름 색상': getEffectById(selections['이름 색상']),
      '테두리': getEffectById(selections['테두리']),
      '칭호': getEffectById(selections['칭호']),
    }),
    [selections, storeEffects],
  )
  
  const onCategorySelect = (category: StoreCategory) => {
    if (category === '전체') {
      return
    }
  
    setSelectedCategory(category)
  }
  
  const onEffectSelect = (effect: StoreEffect | null) => {
    setSelections((current) => ({
      ...current,
      [selectedCategory]: effect?.id ?? null,
    }))
  }
  
  const onReset = () => {
    setSelections({
      '이름 색상': null,
      '테두리': null,
      '칭호': null,
    })
  }

  const onSave = async () => {
    if (isActionPending) {
      return false
    }
  
    setIsActionPending(true)
    setErrorMessage('')
  
    try {
      let latestEquippedItems: EquippedItemsResponse | null = null
  
      for (const category of CUSTOMIZE_CATEGORIES) {
        const itemType = STORE_CATEGORY_ITEM_TYPE[category] as StoreItemType
        const effect = selectedEffectsByCategory[category]
  
        latestEquippedItems = await updateEquippedItem(
          effect ? { itemId: effect.id, itemType } : { itemType },
        )
      }
  
      if (latestEquippedItems) {
        setStoreEffects((currentEffects) =>
          CUSTOMIZE_CATEGORIES.reduce(
            (effects, category) =>
              applyEquippedItems(
                effects,
                latestEquippedItems!,
                STORE_CATEGORY_ITEM_TYPE[category] as StoreItemType,
              ),
            currentEffects,
          ),
        )
        onEquippedItemsChange(latestEquippedItems)
      }
  
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
    selectedEffectsByCategory, 
    onCategorySelect,
    onEffectSelect,
    onReset,
    onSave,
  }
}