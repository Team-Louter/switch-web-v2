import { apiClient } from '@/shared/api'

import type {
  CustomizePageResponse,
  EquipItemRequest,
  EquippedItemsResponse,
  ProfileItemResponse,
  ShopItemListResponse,
  StoreItemType,
} from '../model/types'

export const getShopItems = async (
  type?: StoreItemType,
): Promise<ShopItemListResponse> => {
  const response = await apiClient.get<ShopItemListResponse>('/shop/items', {
    params: { type },
  })

  return response.data
}

export const getUserPoint = async (): Promise<number> => {
  const response = await apiClient.get<number>('/shop/points')

  return response.data
}

export const purchaseShopItem = async (
  itemType: StoreItemType,
  itemId: number,
): Promise<ProfileItemResponse> => {
  const response = await apiClient.post<ProfileItemResponse>(
    `/shop/${itemType}/${itemId}`,
  )

  return response.data
}

export const updateEquippedItem = async (
  request: EquipItemRequest,
): Promise<EquippedItemsResponse> => {
  const response = await apiClient.patch<EquippedItemsResponse>(
    '/profile/equip',
    request,
  )

  return response.data
}

export const getProfileCustomizationPage =
  async (): Promise<CustomizePageResponse> => {
    const response =
      await apiClient.get<CustomizePageResponse>('/profile/customize')

    return response.data
  }
