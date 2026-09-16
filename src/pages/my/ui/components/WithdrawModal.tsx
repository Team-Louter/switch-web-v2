import withdrawArrow from '../assets/withdraw-arrow.svg'
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
  isRequestingCode: boolean
  isWithdrawing: boolean
  onCancel: () => void
  onBack: () => void
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
  isRequestingCode,
  isWithdrawing,
  onCancel,
  onBack,
  onNext,
  onResendCode,
  onWithdraw,
}: WithdrawModalProps) {
  const isConfirmTextMatched = confirmText === WITHDRAW_CONFIRM_TEXT
  if (step === 'confirm') {
    return (
      <S.Overlay onClick={onCancel}>
        <S.Modal onClick={(event) => event.stopPropagation()}>
          <S.Title>회원 탈퇴</S.Title>
          <S.Description>
            이메일 인증이 완료되었습니다.
            <br />
            <br />
            정말 탈퇴하시겠습니까?
          </S.Description>
          <S.ButtonRow>
            <S.CancelButton
              type="button"
              disabled={isWithdrawing}
              onClick={onBack}
            >
              이전
            </S.CancelButton>
            <S.ConfirmButton
              type="button"
              $active={!isWithdrawing}
              disabled={isWithdrawing}
              onClick={onWithdraw}
            >
              탈퇴합니다.
            </S.ConfirmButton>
          </S.ButtonRow>
        </S.Modal>
      </S.Overlay>
    )
  }

  if (step === 'verify') {
    return (
      <S.Overlay onClick={onCancel}>
        <S.VerifyModal onClick={(event) => event.stopPropagation()}>
          {isRequestingCode ? (
            <S.Spinner />
          ) : (
            <>
              <S.VerifyTitle>코드를 입력하세요</S.VerifyTitle>
              <S.Subtitle>
                아래에 이메일로 전송된 6자리 코드를 입력하세요.
              </S.Subtitle>
              <S.CodeInputWrap>
                <WithdrawCodeInput
                  value={verificationCode}
                  onChange={onVerificationCodeChange}
                />
              </S.CodeInputWrap>
              <S.ResendButton
                type="button"
                onClick={onResendCode}
              >
                인증 코드 재전송
              </S.ResendButton>
              <S.SubmitButton
                type="button"
                $active={verificationCode.length === 6}
                disabled={verificationCode.length < 6}
                aria-label="회원 탈퇴 인증 계속"
                onClick={onNext}
              >
                <img src={withdrawArrow} width={40} height={40} alt="" />
              </S.SubmitButton>
            </>
          )}
        </S.VerifyModal>
      </S.Overlay>
    )
  }

  return (
    <S.Overlay onClick={onCancel}>
      <S.Modal onClick={(event) => event.stopPropagation()}>
        <S.Title>회원 탈퇴</S.Title>
        <S.Description>
          회원 탈퇴를 위한 이메일 인증을 진행합니다
        </S.Description>
        <WithdrawConfirmInput
          value={confirmText}
          onChange={onConfirmTextChange}
        />
        <S.ButtonRow>
          <S.CancelButton type="button" onClick={onCancel}>
            이전
          </S.CancelButton>
          <S.ConfirmButton
            type="button"
            $active={isConfirmTextMatched}
            disabled={!isConfirmTextMatched}
            onClick={onNext}
          >
            인증하기
          </S.ConfirmButton>
        </S.ButtonRow>
      </S.Modal>
    </S.Overlay>
  )
}
