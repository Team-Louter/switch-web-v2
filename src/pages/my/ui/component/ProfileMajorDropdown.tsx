import { ProfileInputIcon } from '../icons/ProfileInputIcon'
import * as S from './ProfileMajorDropdown.style'

export type MajorOption = {
  id: string
  label: string
}

type ProfileMajorDropdownProps = {
  options: MajorOption[]
  selectedIds: string[]
  isOpen: boolean
  onToggleOpen: () => void
  onToggleOption: (optionId: string) => void
}

export function ProfileMajorDropdown({
  options,
  selectedIds,
  isOpen,
  onToggleOpen,
  onToggleOption,
}: ProfileMajorDropdownProps) {
  const selectedLabels = options
    .filter((option) => selectedIds.includes(option.id))
    .map((option) => option.label)
    .join(' · ')

  return (
    <S.Field>
      <S.Label>전공</S.Label>
      <S.DropdownWrap>
        <S.DropdownButton
          type="button"
          aria-expanded={isOpen}
          onClick={onToggleOpen}
        >
          <S.SelectedText>{selectedLabels}</S.SelectedText>
          <S.ArrowIcon aria-hidden="true">
            <ProfileInputIcon type="arrowDown" />
          </S.ArrowIcon>
        </S.DropdownButton>
        {isOpen && (
          <S.OptionList>
            {options.map((option) => (
              <S.OptionItem key={option.id}>
                <S.Checkbox
                  type="checkbox"
                  checked={selectedIds.includes(option.id)}
                  onChange={() => onToggleOption(option.id)}
                />
                {option.label}
              </S.OptionItem>
            ))}
          </S.OptionList>
        )}
      </S.DropdownWrap>
    </S.Field>
  )
}
