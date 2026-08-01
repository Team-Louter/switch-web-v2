import { useEffect, useRef, useState } from 'react'
import { PiCaretDown, PiCaretRight } from 'react-icons/pi'

import * as S from './ScheduleDropdown.style'

export interface ScheduleOption {
  id: number
  title: string
  date: string
}

interface ScheduleDropdownProps {
  options: ScheduleOption[]
  selectedIds: number[]
  onChange: (selectedIds: number[]) => void
}

export function ScheduleDropdown({
  options,
  selectedIds,
  onChange,
}: ScheduleDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const selectedOptions = options.filter((option) =>
    selectedIds.includes(option.id),
  )
  const selectionLabel =
    selectedOptions.length > 1
      ? `${selectedOptions[0].title} 외 ${selectedOptions.length - 1}개`
      : (selectedOptions[0]?.title ?? '일정을 선택해주세요.')

  useEffect(() => {
    const handleMouseDown = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleMouseDown)
    return () => document.removeEventListener('mousedown', handleMouseDown)
  }, [])

  const toggleOption = (id: number) => {
    onChange(
      selectedIds.includes(id)
        ? selectedIds.filter((selectedId) => selectedId !== id)
        : [...selectedIds, id],
    )
  }

  return (
    <S.Container ref={containerRef}>
      <S.Trigger
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span>{selectionLabel}</span>
        {isOpen ? <PiCaretDown /> : <PiCaretRight />}
      </S.Trigger>
      {isOpen && (
        <S.OptionList role="listbox" aria-multiselectable="true">
          {options.map((option) => {
            const isSelected = selectedIds.includes(option.id)

            return (
              <S.Option
                key={option.id}
                type="button"
                role="option"
                aria-selected={isSelected}
                $isSelected={isSelected}
                onClick={() => toggleOption(option.id)}
              >
                <S.OptionTitle $isSelected={isSelected}>{option.title}</S.OptionTitle>
                <S.OptionDate $isSelected={isSelected}>{option.date}</S.OptionDate>
              </S.Option>
            )
          })}
        </S.OptionList>
      )}
    </S.Container>
  )
}
