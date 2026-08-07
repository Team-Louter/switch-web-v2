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
      <SearchIcon aria-hidden="true">
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <path
            d="M7.79186 13.3366C10.855 13.3366 13.3381 10.8535 13.3381 7.79039C13.3381 4.72728 10.855 2.24414 7.79186 2.24414C4.72875 2.24414 2.24561 4.72728 2.24561 7.79039C2.24561 10.8535 4.72875 13.3366 7.79186 13.3366Z"
            stroke="currentColor"
            strokeWidth="2.032"
            strokeMiterlimit="10"
          />
          <path
            d="M11.7302 11.7285L15.868 15.8663"
            stroke="currentColor"
            strokeWidth="2.001"
            strokeMiterlimit="10"
            strokeLinecap="round"
          />
        </svg>
      </SearchIcon>
    </SearchBox>
  )
}
