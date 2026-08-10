import {
  POST_CATEGORY_LABEL,
  type PostCategory,
} from '@/shared/constants/community'

import { Badge } from './CategoryBadge.style'

type CategoryBadgeProps = {
  category: PostCategory
}

export function CategoryBadge({ category }: CategoryBadgeProps) {
  return <Badge>{POST_CATEGORY_LABEL[category]}</Badge>
}
