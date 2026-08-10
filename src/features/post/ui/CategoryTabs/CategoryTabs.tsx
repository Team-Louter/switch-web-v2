import {
  POST_CATEGORY_TABS,
  type PostCategoryTab,
} from '@/shared/constants/community'

import { Tab, TabList } from './CategoryTabs.style'

type CategoryTabsProps = {
  activeTab: PostCategoryTab
  onTabSelect: (tab: PostCategoryTab) => void
}

export function CategoryTabs({ activeTab, onTabSelect }: CategoryTabsProps) {
  return (
    <TabList role="tablist" aria-label="게시글 카테고리">
      {POST_CATEGORY_TABS.map(({ id, label }) => (
        <Tab
          key={id}
          type="button"
          role="tab"
          aria-selected={id === activeTab}
          $active={id === activeTab}
          onClick={() => onTabSelect(id)}
        >
          {label}
        </Tab>
      ))}
    </TabList>
  )
}
