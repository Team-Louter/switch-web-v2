import * as S from './SummaryModal.styled.ts'

interface ModalProps {
  title: string
  author: string
  summary?: string
  onClick?: () => void
}

export function Modal({ title, author, summary, onClick }: ModalProps) {
  return (
    <S.Container
      data-journal-modal-card
      onClick={summary ? onClick : undefined}
      onKeyDown={(event) => {
        if (summary && (event.key === 'Enter' || event.key === ' ')) {
          event.preventDefault()
          onClick?.()
        }
      }}
      role={summary ? 'button' : undefined}
      tabIndex={summary ? 0 : undefined}
    >
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
