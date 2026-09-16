import * as S from './ActivityFilterBar.style'
import type { MyActivityTab, MyActivityTabId } from '../../types'

type ActivityFilterBarProps = {
  tabs: MyActivityTab[]
  activeTabId: MyActivityTabId
  onChange: (tabId: MyActivityTabId) => void
}

export function ActivityFilterBar({
  tabs,
  activeTabId,
  onChange,
}: ActivityFilterBarProps) {
  return (
    <S.FilterBar role="tablist" aria-label="내 활동 필터">
      {tabs.map((tab) => {
        const isActive = activeTabId === tab.id

        return (
          <S.FilterItem
            key={tab.id}
            type="button"
            role="tab"
            aria-label={`${tab.label} ${tab.count}개`}
            aria-selected={isActive}
            $active={isActive}
            onClick={() => onChange(tab.id)}
          >
            {tab.label}
          </S.FilterItem>
        )
      })}
    </S.FilterBar>
  )
}
