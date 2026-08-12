import { useMemo, useState } from 'react'

import type {
  PointHistory,
  StoreCategory,
  StoreEffect,
  StoreModalType,
} from '../types'

const STORE_CATEGORIES: StoreCategory[] = [
  '전체',
  '이름 색상',
  '테두리',
  '뱃지',
  '칭호',
]

const INITIAL_POINT = 3500

const STORE_EFFECTS: StoreEffect[] = [
  {
    id: 1,
    title: '무지개',
    category: '이름 색상',
    type: 'nameColor',
    status: 'owned',
    price: 300,
  },
  {
    id: 2,
    title: '무지개',
    category: '이름 색상',
    type: 'nameColor',
    status: 'owned',
    price: 300,
  },
  {
    id: 3,
    title: '무지개',
    category: '이름 색상',
    type: 'nameColor',
    status: 'equipped',
    price: 300,
  },
  {
    id: 4,
    title: '무지개',
    category: '이름 색상',
    type: 'nameColor',
    status: 'equipped',
    price: 300,
  },
  {
    id: 5,
    title: '노란색 테두리',
    category: '테두리',
    type: 'outline',
    status: 'owned',
    price: 300,
  },
  {
    id: 6,
    title: '노란색 테두리',
    category: '테두리',
    type: 'outline',
    status: 'owned',
    price: 300,
  },
  {
    id: 7,
    title: '노란색 테두리',
    category: '테두리',
    type: 'outline',
    status: 'equipped',
    price: 300,
  },
  {
    id: 8,
    title: '노란색 테두리',
    category: '테두리',
    type: 'outline',
    status: 'equipped',
    price: 300,
  },
  {
    id: 9,
    title: '무지개',
    category: '이름 색상',
    type: 'nameColor',
    status: 'recommended',
    price: 300,
  },
  {
    id: 10,
    title: '무지개',
    category: '이름 색상',
    type: 'nameColor',
    status: 'recommended',
    price: 300,
  },
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

// 상점 페이지의 필터, 카드 액션, 모달 흐름을 관리한다.
// 1) 선택된 카테고리로 목록을 나눈다
// 2) 카드/포인트 버튼 클릭에 따라 모달을 연다
// 3) 구매 완료 시 보유 포인트와 장착 상태를 갱신한다
export function useStorePage() {
  const [selectedCategory, setSelectedCategory] =
    useState<StoreCategory>('전체')
  const [storeEffects, setStoreEffects] = useState(STORE_EFFECTS)
  const [activeModal, setActiveModal] = useState<StoreModalType | null>(null)
  const [selectedEffect, setSelectedEffect] = useState<StoreEffect | null>(null)
  const [point, setPoint] = useState(INITIAL_POINT)

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

  const handlePurchase = () => {
    if (!selectedEffect || selectedEffect.canPurchase === false) {
      return
    }

    setPoint((currentPoint) => currentPoint - selectedEffect.price)
    setStoreEffects((currentEffects) =>
      currentEffects.map((effect) =>
        effect.id === selectedEffect.id
          ? { ...effect, status: 'owned' }
          : effect,
      ),
    )
    setActiveModal('purchaseComplete')
  }

  const handleEquip = (effectId: number) => {
    const target = storeEffects.find((effect) => effect.id === effectId)

    if (!target) {
      return
    }

    setStoreEffects((currentEffects) =>
      currentEffects.map((effect) => {
        if (effect.type === target.type && effect.status === 'equipped') {
          return { ...effect, status: 'owned' }
        }

        if (effect.id === effectId) {
          return { ...effect, status: 'equipped' }
        }

        return effect
      }),
    )
    handleModalClose()
  }

  const handleRemove = (effectId: number) => {
    setStoreEffects((currentEffects) =>
      currentEffects.map((effect) =>
        effect.id === effectId ? { ...effect, status: 'owned' } : effect,
      ),
    )
  }

  return {
    activeModal,
    categories: STORE_CATEGORIES,
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
