import {
  HiddenRadioInput,
  RadioFilterItem,
  RadioFilterList,
  RadioIndicator,
} from '../MentoringPage.style'

type RadioFilterGroupProps<TValue extends string> = {
  name: string
  options: readonly TValue[]
  value: TValue
  onChange: (value: TValue) => void
}

export function RadioFilterGroup<TValue extends string>({
  name,
  options,
  value,
  onChange,
}: RadioFilterGroupProps<TValue>) {
  return (
    <RadioFilterList role="radiogroup">
      {options.map((option) => (
        <RadioFilterItem key={option}>
          <HiddenRadioInput
            type="radio"
            name={name}
            value={option}
            checked={value === option}
            onChange={() => onChange(option)}
          />
          <RadioIndicator $checked={value === option} />
          {option}
        </RadioFilterItem>
      ))}
    </RadioFilterList>
  )
}
