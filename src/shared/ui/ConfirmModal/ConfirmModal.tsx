import { Button } from '../Button'
import { Modal } from '../Modal'

import * as S from './ConfirmModal.style'

interface ConfirmModalProps {
  title: string
  description: string
  confirmLabel?: string
  isConfirming?: boolean
  placement?: 'center' | 'bottom-right'
  isClosing?: boolean
  onCancel: () => void
  onConfirm: () => void
}

export function ConfirmModal({
  title,
  description,
  confirmLabel = '확인',
  isConfirming = false,
  placement = 'center',
  isClosing = false,
  onCancel,
  onConfirm,
}: ConfirmModalProps) {
  const handleClose = () => {
    if (!isConfirming) {
      onCancel()
    }
  }

  return (
    <Modal
      label={title}
      onClose={handleClose}
      width={placement === 'bottom-right' ? 300 : 420}
      placement={placement}
      isClosing={isClosing}
    >
      <S.Content $compact={placement === 'bottom-right'}>
        <S.Title>{title}</S.Title>
        <S.Description>{description}</S.Description>
        <S.Actions>
          <Button
            size="md"
            variant="neutral"
            disabled={isConfirming || isClosing}
            onClick={onCancel}
          >
            취소
          </Button>
          <Button
            size="md"
            variant="danger"
            disabled={isConfirming || isClosing}
            onClick={onConfirm}
          >
            {isConfirming ? '처리 중' : confirmLabel}
          </Button>
        </S.Actions>
      </S.Content>
    </Modal>
  )
}
