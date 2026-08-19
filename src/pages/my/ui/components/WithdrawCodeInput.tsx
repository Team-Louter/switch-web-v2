import { useEffect, useRef } from 'react'

import * as S from './WithdrawModalInput.style'

import type { ChangeEvent, KeyboardEvent, ClipboardEvent } from 'react'

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
  const inputRefs = useRef<Array<HTMLInputElement | null>>([])

  useEffect(() => {
    inputRefs.current[0]?.focus()
  }, [])

  const codeDigits = Array.from({ length: codeLength }, (_, index) =>
    value[index] ?? '',
  )

  const updateCodeDigit = (index: number, digit: string) => {
    const nextDigits = codeDigits.map((currentDigit, digitIndex) =>
      digitIndex === index ? digit : currentDigit,
    )

    onChange(nextDigits.join('').slice(0, codeLength))
  }

  const handleCodeChange = (
    index: number,
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    const nextValue = event.target.value.replace(/\D/g, '')

    if (!nextValue) {
      updateCodeDigit(index, '')
      return
    }

    const nextDigit = nextValue.at(-1) ?? ''

    updateCodeDigit(index, nextDigit)
    inputRefs.current[index + 1]?.focus()
  }

  const handleCodeKeyDown = (
    index: number,
    event: KeyboardEvent<HTMLInputElement>,
  ) => {
    if (event.key !== 'Backspace' || codeDigits[index]) {
      return
    }

    inputRefs.current[index - 1]?.focus()
  }

  const handleCodePaste = (event: ClipboardEvent<HTMLInputElement>) => {
    const pastedCode = event.clipboardData
      .getData('text')
      .replace(/\D/g, '')
      .slice(0, codeLength)

    if (!pastedCode) {
      return
    }

    event.preventDefault()
    onChange(pastedCode)
    inputRefs.current[Math.min(pastedCode.length, codeLength) - 1]?.focus()
  }

  return (
    <S.CodeInputGroup>
      {codeDigits.map((digit, index) => (
        <S.CodeInput
          key={`withdraw-code-${index + 1}`}
          ref={(element) => {
            inputRefs.current[index] = element
          }}
          value={digit}
          inputMode="numeric"
          maxLength={1}
          aria-label={`회원 탈퇴 인증 코드 ${index + 1}번째 숫자`}
          onChange={(event) => handleCodeChange(index, event)}
          onKeyDown={(event) => handleCodeKeyDown(index, event)}
          onPaste={handleCodePaste}
        />
      ))}
    </S.CodeInputGroup>
  )
}
