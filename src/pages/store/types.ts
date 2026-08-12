export type StoreCategory = '전체' | '이름 색상' | '테두리' | '뱃지' | '칭호'

export type StoreEffectType = 'nameColor' | 'outline' | 'badge' | 'nickname'

export type StoreEffectStatus = 'owned' | 'equipped' | 'recommended'

export type StoreModalType = 'pointHistory' | 'purchase' | 'purchaseComplete'

export type StoreEffect = {
  id: number
  title: string
  category: StoreCategory
  type: StoreEffectType
  status: StoreEffectStatus
  price: number
  hasConditions?: boolean
  canPurchase?: boolean
}

export type PointHistory = {
  id: number
  title: string
  description: string
  amountLabel: string
  isPositive: boolean
}
