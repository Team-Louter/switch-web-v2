import { useEffect, useRef, useState } from 'react'

import {
  POST_CATEGORIES,
  POST_CATEGORY_LABEL,
  type PostCategory,
} from '@/shared/constants/community'
import { CaretDownIcon } from '@/shared/ui/icons'

import {
  CaretBox,
  Option,
  OptionList,
  Trigger,
  Wrap,
} from './CategorySelect.style'

type CategorySelectProps = {
  value?: PostCategory
  onChange: (category: PostCategory) => void
}

export function CategorySelect({ value, onChange }: CategorySelectProps) {
  const [isOpen, setIsOpen] = useState(false)
  const wrapRef = useRef<HTMLDivElement>(null)

  // 바깥을 누르면 목록을 닫는다.
  useEffect(() => {
    if (!isOpen) return

    const handleOutsideClick = (event: MouseEvent) => {
      if (!wrapRef.current?.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('click', handleOutsideClick)
    return () => document.removeEventListener('click', handleOutsideClick)
  }, [isOpen])

  const handleSelect = (category: PostCategory) => {
    onChange(category)
    setIsOpen(false)
  }

  return (
    <Wrap ref={wrapRef}>
      <Trigger
        type="button"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((prev) => !prev)}
      >
        {value ? POST_CATEGORY_LABEL[value] : '카테고리 선택'}
        <CaretBox $open={isOpen}>
          <CaretDownIcon aria-hidden="true" />
        </CaretBox>
      </Trigger>
      {/* 트리거를 눌렀을 때만 카테고리 목록을 띄운다 */}
      {isOpen && (
        <OptionList role="listbox">
          {POST_CATEGORIES.map((category) => (
            <li key={category}>
              <Option
                type="button"
                role="option"
                aria-selected={category === value}
                $selected={category === value}
                onClick={() => handleSelect(category)}
              >
                {POST_CATEGORY_LABEL[category]}
              </Option>
            </li>
          ))}
        </OptionList>
      )}
    </Wrap>
  )
}
