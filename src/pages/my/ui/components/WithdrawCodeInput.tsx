import * as S from './WithdrawModalInput.style'

import type { ChangeEvent } from 'react'

type WithdrawCodeInputProps = {
  value: string
  onChange: (value: string) => void
}

const codeLength = 6

// 회원 탈퇴 이메일 인증 코드를 숫자 6자리로 제한해 입력받는다.
export function WithdrawCodeInput({
  value,
  onChange,
}: WithdrawCodeInputProps) {
  const handleCodeChange = (event: ChangeEvent<HTMLInputElement>) => {
    const nextValue = event.target.value.replace(/\D/g, '').slice(0, codeLength)

    onChange(nextValue)
  }

  return (
    <S.Input
      value={value}
      inputMode="numeric"
      maxLength={codeLength}
      placeholder="인증 코드를 입력해 주세요"
      aria-label="회원 탈퇴 인증 코드"
      onChange={handleCodeChange}
    />
  )
}
