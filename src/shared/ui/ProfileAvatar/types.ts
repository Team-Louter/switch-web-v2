export type ProfileAvatarDecorationItem = {
  displayType?: 'COVER' | 'FRAME'
  imageUrl?: string
  itemImageUrl?: string
  itemName?: string
  originalImageUrl?: string
  previewImageUrl?: string
  thumbnailUrl?: string
  valueColor?: string
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
