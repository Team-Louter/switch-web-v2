import { useRef } from 'react'

import dateIcon from '@/shared/assets/calendar/date.svg'

import {
  DateField,
  DateInput,
  DatePickerButton,
  DateSuffix,
  DateValue,
  FieldIcon,
} from './ScheduleModal.style'

type ScheduleDateFieldProps = {
  label: string // 스크린리더용 이름 (예: 시작일)
  suffix: string // 값 뒤에 붙는 문구 ("부터" | "까지")
  value: string
  onChange: (value: string) => void
}

export function ScheduleDateField({
  label,
  suffix,
  value,
  onChange,
}: ScheduleDateFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const hasValue = value.length > 0

  // 아이콘뿐 아니라 칸 어디를 눌러도 날짜 선택기가 열리도록 합니다.
  // showPicker를 지원하지 않는 브라우저에서는 입력칸 포커스로 대체합니다.
  const handleFieldClick = () => {
    const input = inputRef.current

    if (!input) return

    if (typeof input.showPicker === 'function') {
      input.showPicker()
      return
    }

    input.focus()
  }

  return (
    <DateField onClick={handleFieldClick}>
      <DateValue>
        <DateInput
          ref={inputRef}
          type="date"
          aria-label={label}
          value={value}
          $hasValue={hasValue}
          onChange={(event) => onChange(event.target.value)}
        />
        <DateSuffix $hasValue={hasValue}>{suffix}</DateSuffix>
      </DateValue>
      <DatePickerButton
        type="button"
        aria-label={`${label} 선택기 열기`}
        onClick={handleFieldClick}
      >
        <FieldIcon src={dateIcon} alt="" />
      </DatePickerButton>
    </DateField>
  )
}
