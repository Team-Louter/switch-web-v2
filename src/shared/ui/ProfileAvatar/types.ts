export type ProfileAvatarDecorationItem = {
  displayType?: 'COVER' | 'FRAME'
  imageUrl?: string
  itemId?: number
  itemImageUrl?: string
  itemName?: string
  itemType?: string
  originalImageUrl?: string
  previewImageUrl?: string
  styleKey?: string
  thumbnailUrl?: string
  valueColor?: string
  value_color?: string
  valueText?: string
  valueImageUrl?: string
}

export type ProfileAvatarEquippedItems = {
  badge?: ProfileAvatarDecorationItem
  border?: ProfileAvatarDecorationItem
  nameColor?: ProfileAvatarDecorationItem
  title?: ProfileAvatarDecorationItem
}

export type ProfileAvatarProps = {
  alt?: string
  className?: string
  equippedItems?: ProfileAvatarEquippedItems
  imageScale?: number
  imageUrl?: string
  size: number
}
