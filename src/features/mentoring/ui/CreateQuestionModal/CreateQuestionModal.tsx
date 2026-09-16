import { useState } from 'react'

import { createQuestion } from '../../api/createQuestion'
import * as S from '../modalBase.style'

interface CreateQuestionModalProps {
  isOpen: boolean
  mentoringId: number
  onClose: () => void
  onCreateSuccess?: () => void | Promise<void>
}

function CreateQuestionModalContent({
  mentoringId,
  onClose,
  onCreateSuccess,
}: CreateQuestionModalProps) {
  const [title, setTitle] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async () => {
    if (!title.trim()) return

    try {
      setIsSubmitting(true)
      // 디자인상 입력이 한 줄뿐이라 제목과 내용을 같은 값으로 보낸다.
      await createQuestion({
        mentoringId,
        title: title.trim(),
        content: title.trim(),
      })
      onClose()
      void onCreateSuccess?.()
    } catch {
      // 실패 시 모달을 유지해 사용자가 다시 시도할 수 있게 한다.
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <S.Backdrop>
      <S.Modal>
        <S.Title>질문 생성하기</S.Title>
        <S.TextInput
          type="text"
          placeholder="한 줄 질문 또는 제목을 입력하세요"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
        />
        <S.ActionRow>
          <S.ActionButton
            type="button"
            size="md"
            variant="neutral"
            onClick={onClose}
          >
            취소
          </S.ActionButton>
          <S.ActionButton
            type="button"
            size="md"
            variant="primary"
            disabled={isSubmitting || !title.trim()}
            onClick={() => void handleSubmit()}
          >
            생성
          </S.ActionButton>
        </S.ActionRow>
      </S.Modal>
    </S.Backdrop>
  )
}

export function CreateQuestionModal(props: CreateQuestionModalProps) {
  if (!props.isOpen) return null

  return <CreateQuestionModalContent {...props} />
}
