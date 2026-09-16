import { FilterIcon, SortSelect as Select, SortSelectWrap } from '../MentoringPage.style'

export type SortOrder = 'latest' | 'oldest'

type SortSelectProps = {
  ariaLabel: string
  latestLabel: string
  oldestLabel: string
  value: SortOrder
  onChange: (value: SortOrder) => void
}

export function SortSelect({
  ariaLabel,
  latestLabel,
  oldestLabel,
  value,
  onChange,
}: SortSelectProps) {
  return (
    <SortSelectWrap>
      <FilterIcon aria-hidden="true">▼</FilterIcon>
      <Select
        aria-label={ariaLabel}
        value={value}
        onChange={(event) => onChange(event.target.value as SortOrder)}
      >
        <option value="latest">{latestLabel}</option>
        <option value="oldest">{oldestLabel}</option>
      </Select>
    </SortSelectWrap>
  )
}
