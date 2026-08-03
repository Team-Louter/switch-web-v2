import { useRef } from 'react'

import dateIcon from '@/shared/assets/calendar/date.svg'

import {
  DateField,
  DateInput,
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
  const handleFieldClick = () => {
    inputRef.current?.showPicker()
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
      <FieldIcon src={dateIcon} alt="" />
    </DateField>
  )
}
