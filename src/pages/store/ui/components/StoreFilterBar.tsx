import * as S from '../StorePage.style'

import type { StoreCategory } from '../../types'

type StoreFilterBarProps = {
  categories: StoreCategory[]
  selectedCategory: StoreCategory
  onCategorySelect: (category: StoreCategory) => void
}

export function StoreFilterBar({
  categories,
  selectedCategory,
  onCategorySelect,
}: StoreFilterBarProps) {
  return (
    <S.FilterBar>
      {categories.map((category) => (
        <S.FilterButton
          $isActive={selectedCategory === category}
          key={category}
          onClick={() => onCategorySelect(category)}
          type="button"
        >
          {category}
        </S.FilterButton>
      ))}
    </S.FilterBar>
  )
}
