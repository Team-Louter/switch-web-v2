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
  onCancel: () => void
  onNext: () => void
  onWithdraw: () => void
}

export function WithdrawModal({
  step,
  confirmText,
  onConfirmTextChange,
  verificationCode,
  onVerificationCodeChange,
  onCancel,
  onNext,
  onWithdraw,
}: WithdrawModalProps) {
  const isConfirmTextMatched = confirmText.trim() === WITHDRAW_CONFIRM_TEXT

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
        title="회원 탈퇴"
        descriptions={['이메일로 전송된 인증 코드를 입력해 주세요']}
        actions={
          <>
            <S.SecondaryButton type="button" onClick={onCancel}>
              취소
            </S.SecondaryButton>
            <S.PrimaryButton
              type="button"
              disabled={verificationCode.length < 6}
              onClick={onNext}
            >
              다음
            </S.PrimaryButton>
          </>
        }
      >
        <WithdrawCodeInput
          value={verificationCode}
          onChange={onVerificationCodeChange}
        />
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
