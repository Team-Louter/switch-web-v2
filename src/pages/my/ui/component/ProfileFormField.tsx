import type { InputHTMLAttributes, ReactNode } from 'react'

import * as S from './ProfileFormField.style'

type ProfileFormFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string
  iconSlot?: ReactNode
}

export function ProfileFormField({
  disabled,
  iconSlot,
  label,
  ...inputProps
}: ProfileFormFieldProps) {
  return (
    <S.Field>
      <S.Label>{label}</S.Label>
      <S.InputBox $disabled={Boolean(disabled)}>
        {iconSlot}
        <S.Input disabled={disabled} {...inputProps} />
      </S.InputBox>
    </S.Field>
  )
}
