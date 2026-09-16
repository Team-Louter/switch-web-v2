import * as S from './WithdrawModalInput.style'

import type { ChangeEvent } from 'react'

type WithdrawConfirmInputProps = {
  value: string
  onChange: (value: string) => void
}

export const WITHDRAW_CONFIRM_TEXT = '확인했습니다'

// 회원 탈퇴 이메일 인증 전 사용자의 명시적인 확인 문구를 입력받는다.
export function WithdrawConfirmInput({
  value,
  onChange,
}: WithdrawConfirmInputProps) {
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.value)
  }

  return (
    <S.Input
      value={value}
      placeholder={WITHDRAW_CONFIRM_TEXT}
      aria-label="회원 탈퇴 확인 문구"
      onChange={handleChange}
    />
  )
}
