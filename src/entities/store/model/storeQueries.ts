import { queryOptions } from '@tanstack/react-query'

import { getShopItems, getUserPoint } from '../api/storeApi'
import { storeQueryKeys } from './storeQueryKeys'

export function storeItemsOptions(userId: number | null) {
  return queryOptions({
    queryKey: storeQueryKeys.items(userId),
    queryFn: () => getShopItems(),
  })
}

export function storePointsOptions(userId: number | null) {
  return queryOptions({
    queryKey: storeQueryKeys.points(userId),
    queryFn: getUserPoint,
  })
}
