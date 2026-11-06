import type { StoreCategory } from '../../types'
import * as S from '../StorePage.style'

interface StoreEffectListSkeletonProps {
  selectedCategory: StoreCategory
  label: string
}

export function StoreEffectListSkeleton({
  selectedCategory,
  label,
}: StoreEffectListSkeletonProps) {
  const groupCount = selectedCategory === '전체' ? 3 : 1

  return (
    <S.CategoryGroups role="status" aria-label={label}>
      {Array.from({ length: groupCount }, (_, groupIndex) => (
        <S.CategoryGroup key={groupIndex} aria-hidden="true">
          {selectedCategory === '전체' && (
            <S.SkeletonBlock $width="64px" $height="18px" />
          )}
          <S.CardGrid>
            {Array.from({ length: 4 }, (_, index) => (
              <S.SkeletonCard key={index}>
                <S.SkeletonBlock $width="100%" $height="130px" />
                <S.EffectTextGroup>
                  <S.SkeletonBlock $width="70%" $height="20px" />
                  <S.SkeletonBlock $width="40%" $height="17px" />
                </S.EffectTextGroup>
              </S.SkeletonCard>
            ))}
          </S.CardGrid>
        </S.CategoryGroup>
      ))}
    </S.CategoryGroups>
  )
}
