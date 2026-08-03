import {
  SCHEDULE_COLOR_OPTIONS,
  SCHEDULE_SWATCH_COLORS,
} from '@/shared/constants/calendar'
import type { ScheduleColor } from '@/shared/types/schedule'

import { ColorSwatch, ColorSwatchList } from './ScheduleModal.style'

type ScheduleColorPickerProps = {
  value: ScheduleColor
  onChange: (color: ScheduleColor) => void
}

export function ScheduleColorPicker({
  value,
  onChange,
}: ScheduleColorPickerProps) {
  return (
    <ColorSwatchList role="radiogroup" aria-label="일정 색상 선택">
      {SCHEDULE_COLOR_OPTIONS.map((color) => (
        <ColorSwatch
          key={color}
          type="button"
          role="radio"
          aria-label={color}
          aria-checked={value === color}
          $color={SCHEDULE_SWATCH_COLORS[color]}
          $selected={value === color}
          onClick={() => onChange(color)}
        />
      ))}
    </ColorSwatchList>
  )
}
