export type StoreItemType = 'BADGE' | 'BORDER' | 'NAME_COLOR' | 'TITLE'

export type UnlockConditionType =
  | 'COMMENT_COUNT'
  | 'GIVE_HEART'
  | 'POST_COUNT'
  | 'RECEIVED_HEART'

export interface UnlockCondition {
  unlockConditionType: UnlockConditionType
  requiredCount: number
}

export interface ShopItemResponse {
  itemId: number
  itemType: StoreItemType
  itemName: string
  imageUrl?: string
  itemImageUrl?: string
  originalImageUrl?: string
  previewImageUrl?: string
  thumbnailUrl?: string
  valueImageUrl?: string
  itemPrice: number
  equipped: boolean
  owned: boolean
  purchasable: boolean
}

export interface ShopItemListResponse {
  items: ShopItemResponse[]
}

export interface ProfileItemResponse {
  itemId: number
  itemType: StoreItemType
  itemName: string
  imageUrl?: string
  itemImageUrl?: string
  originalImageUrl?: string
  previewImageUrl?: string
  thumbnailUrl?: string
  valueColor?: string
  valueImageUrl?: string
  valueText?: string
  itemPrice: number
  unlockConditions?: UnlockCondition[]
}

export interface EquippedItemResponse {
  itemId: number
  itemType: StoreItemType
  itemName: string
  imageUrl?: string
  itemImageUrl?: string
  originalImageUrl?: string
  previewImageUrl?: string
  thumbnailUrl?: string
  valueColor?: string
  valueImageUrl?: string
  valueText?: string
}

export interface EquippedItemsResponse {
  badge?: EquippedItemResponse
  nameColor?: EquippedItemResponse
  border?: EquippedItemResponse
  title?: EquippedItemResponse
}

export interface EquipItemRequest {
  itemType: StoreItemType
  itemId?: number
}

export interface ProfileItemCardResponse {
  itemId: number
  itemType: StoreItemType
  itemName: string
  imageUrl?: string
  itemImageUrl?: string
  originalImageUrl?: string
  previewImageUrl?: string
  thumbnailUrl?: string
  valueImageUrl?: string
  itemPrice: number
}

export interface CustomizePageResponse {
  equippedItems: EquippedItemsResponse
  ownedItems: ProfileItemCardResponse[]
  purchasableItems: ProfileItemCardResponse[]
}
