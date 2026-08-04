import { SearchBox, SearchField, SearchIcon } from '../MentoringPage.style'

type SearchInputProps = {
  value: string
  placeholder: string
  ariaLabel: string
  onChange: (value: string) => void
}

export function SearchInput({
  value,
  placeholder,
  ariaLabel,
  onChange,
}: SearchInputProps) {
  return (
    <SearchBox>
      <SearchField
        aria-label={ariaLabel}
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
      />
      <SearchIcon aria-hidden="true">⌕</SearchIcon>
    </SearchBox>
  )
}
