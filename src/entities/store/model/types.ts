export type StoreItemType = 'BORDER' | 'NAME_COLOR' | 'TITLE'

export type UnlockConditionType =
  | 'COMMENT_COUNT'
  | 'GIVE_HEART'
  | 'POST_COUNT'
  | 'RECEIVED_HEART'

export interface UnlockCondition {
  conditionType?: UnlockConditionType
  condition_type?: UnlockConditionType
  required?: number
  requiredCount?: number
  required_count?: number
  requiredValue?: number
  unlockConditionType?: UnlockConditionType
  unlock_condition_type?: UnlockConditionType
  value?: number
}

export interface ShopItemResponse {
  displayType?: 'COVER' | 'FRAME'
  itemId: number
  itemType: StoreItemType
  itemName: string
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
  itemPrice: number
  equipped: boolean
  owned: boolean
  purchasable: boolean
  unlockConditions?: UnlockCondition[] | UnlockCondition
}

export interface ShopItemListResponse {
  items: ShopItemResponse[]
}

export interface ProfileItemResponse {
  displayType?: 'COVER' | 'FRAME'
  itemId: number
  itemType: StoreItemType
  itemName: string
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
  itemPrice: number
  unlockConditions?: UnlockCondition[] | UnlockCondition
}

export interface EquippedItemResponse {
  displayType?: 'COVER' | 'FRAME'
  itemId: number
  itemType: StoreItemType
  itemName: string
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

export interface EquippedItemsResponse {
  nameColor?: EquippedItemResponse
  border?: EquippedItemResponse
  title?: EquippedItemResponse
}

export interface EquipItemRequest {
  itemType: StoreItemType
  itemId?: number
}

export interface ProfileItemCardResponse {
  displayType?: 'COVER' | 'FRAME'
  itemId: number
  itemType: StoreItemType
  itemName: string
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
  itemPrice: number
  unlockConditions?: UnlockCondition[] | UnlockCondition
}

export interface CustomizePageResponse {
  equippedItems: EquippedItemsResponse
  ownedItems: ProfileItemCardResponse[]
  purchasableItems: ProfileItemCardResponse[]
}
