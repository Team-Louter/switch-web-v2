import type { StoreItemType } from '@/entities/store'
import type { ProfileAvatarEquippedItems } from '@/shared/ui'

export type StoreCategory = '전체' | '이름 색상' | '테두리' | '뱃지' | '칭호'

export type StoreEffectType = 'nameColor' | 'outline' | 'badge' | 'nickname'

export type StoreEffectStatus = 'owned' | 'equipped' | 'recommended'

export type StoreModalType =
  | 'customize'
  | 'pointHistory'
  | 'purchase'
  | 'purchaseComplete'

export type StoreEffect = {
  id: number
  itemType: StoreItemType
  displayType?: 'COVER' | 'FRAME'
  title: string
  category: StoreCategory
  type: StoreEffectType
  status: StoreEffectStatus
  price: number
  imageUrl?: string
  thumbnailUrl?: string
  valueColor?: string
  valueText?: string
  hasConditions?: boolean
  canPurchase?: boolean
  conditionLabels?: string[]
}

export type StoreProfilePreview = {
  classInfo: string
  equippedItems?: ProfileAvatarEquippedItems
  imageUrl?: string
  majors: string
  name: string
}

export type PointHistory = {
  id: number
  title: string
  description: string
  amountLabel: string
  isPositive: boolean
}
