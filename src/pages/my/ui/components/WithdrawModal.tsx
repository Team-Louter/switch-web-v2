import { MyDialog } from './MyDialog'
import { WithdrawCodeInput } from './WithdrawCodeInput'
import {
  WITHDRAW_CONFIRM_TEXT,
  WithdrawConfirmInput,
} from './WithdrawConfirmInput'
import * as S from './WithdrawModal.style'

export type WithdrawModalStep = 'acknowledge' | 'verify' | 'confirm'

type WithdrawModalProps = {
  step: WithdrawModalStep
  confirmText: string
  onConfirmTextChange: (value: string) => void
  verificationCode: string
  onVerificationCodeChange: (value: string) => void
  remainingSeconds: number
  canResendCode: boolean
  onCancel: () => void
  onNext: () => void
  onResendCode: () => void
  onWithdraw: () => void
}

export function WithdrawModal({
  step,
  confirmText,
  onConfirmTextChange,
  verificationCode,
  onVerificationCodeChange,
  remainingSeconds,
  canResendCode,
  onCancel,
  onNext,
  onResendCode,
  onWithdraw,
}: WithdrawModalProps) {
  const isConfirmTextMatched = confirmText.trim() === WITHDRAW_CONFIRM_TEXT
  const formattedRemainingSeconds = `${Math.floor(
    remainingSeconds / 60,
  )}:${String(remainingSeconds % 60).padStart(2, '0')}`

  if (step === 'confirm') {
    return (
      <MyDialog
        title="회원 탈퇴"
        descriptions={[
          '이메일 인증이 완료되었습니다.',
          '정말 탈퇴하시겠습니까?',
        ]}
        size="sm"
        actions={
          <>
            <S.SecondaryButton type="button" onClick={onCancel}>
              취소
            </S.SecondaryButton>
            <S.DangerButton type="button" onClick={onWithdraw}>
              탈퇴
            </S.DangerButton>
          </>
        }
      />
    )
  }

  if (step === 'verify') {
    return (
      <MyDialog
        title="코드 입력"
        descriptions={['가입된 이메일로 전송된 6자리 코드를 입력해 주세요']}
        size="hug"
        actions={
          <>
            <S.SecondaryButton type="button" onClick={onCancel}>
              취소
            </S.SecondaryButton>
            <S.PrimaryButton
              type="button"
              disabled={verificationCode.length < 6 || remainingSeconds === 0}
              onClick={onNext}
            >
              다음
            </S.PrimaryButton>
          </>
        }
      >
        <S.VerificationBody>
          <WithdrawCodeInput
            value={verificationCode}
            onChange={onVerificationCodeChange}
          />
          <S.VerificationMeta>
            <S.ResendButton
              type="button"
              disabled={!canResendCode}
              onClick={onResendCode}
            >
              인증 코드 재전송
            </S.ResendButton>
            <S.TimerText>{formattedRemainingSeconds}</S.TimerText>
          </S.VerificationMeta>
        </S.VerificationBody>
      </MyDialog>
    )
  }

  return (
    <MyDialog
      title="회원 탈퇴"
      descriptions={['회원 탈퇴를 위한 이메일인증을 진행합니다']}
      actions={
        <>
          <S.SecondaryButton type="button" onClick={onCancel}>
            취소
          </S.SecondaryButton>
          <S.PrimaryButton
            type="button"
            disabled={!isConfirmTextMatched}
            onClick={onNext}
          >
            다음
          </S.PrimaryButton>
        </>
      }
    >
      <WithdrawConfirmInput
        value={confirmText}
        onChange={onConfirmTextChange}
      />
    </MyDialog>
  )
}
