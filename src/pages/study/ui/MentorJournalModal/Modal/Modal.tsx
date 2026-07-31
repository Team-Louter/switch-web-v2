import * as S from './Modal.style'

interface ModalProps {
  title: string
  author: string
  summary?: string
}

export function Modal({ title, author, summary }: ModalProps) {
  return (
    <S.Container data-journal-modal-card>
      <S.Header>
        <S.StudyTitle>{title}</S.StudyTitle>
        <S.Author>{author}</S.Author>
      </S.Header>
      <S.Line />
      <S.Summary $isEmpty={!summary}>
        {summary || '학습일지를 아직 작성하지 않았어요'}
      </S.Summary>
    </S.Container>
  )
}
