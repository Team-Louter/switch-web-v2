export const storeQueryKeys = {
  all: ['store'] as const,
  items: (userId: number | null) =>
    [...storeQueryKeys.all, 'items', userId] as const,
  points: (userId: number | null) =>
    [...storeQueryKeys.all, 'points', userId] as const,
}
