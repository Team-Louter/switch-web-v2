import type { FormEvent } from 'react'
import { useState } from 'react'

import { SendIcon } from '@/shared/ui/icons'

import { useComments } from '../../model/useComments'
import { CommentItem } from '../CommentItem'
import {
  AnonymousLabel,
  Checkbox,
  CommentInput,
  CommentListArea,
  Heading,
  InputRow,
  SendButton,
  Section,
  StatusText,
  WriteArea,
} from './CommentSection.style'

type CommentSectionProps = {
  postId: number
  /** 댓글 수가 바뀌었을 때 게시글 정보를 다시 맞추기 위한 콜백 */
  onCommentCountChange?: () => void
}

export function CommentSection({
  postId,
  onCommentCountChange,
}: CommentSectionProps) {
  const {
    rootComments,
    repliesByCommentId,
    isLoading,
    submitComment,
    removeComment,
  } = useComments(postId)
  const [content, setContent] = useState('')
  const [isAnonymous, setIsAnonymous] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()

    if (!content.trim() || isSubmitting) return

    try {
      setIsSubmitting(true)
      await submitComment(content.trim(), isAnonymous)
      setContent('')
      onCommentCountChange?.()
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleReplySubmit = async (parentId: number, replyContent: string) => {
    await submitComment(replyContent, isAnonymous, parentId)
    onCommentCountChange?.()
  }

  const handleDelete = async (commentId: number) => {
    await removeComment(commentId)
    onCommentCountChange?.()
  }

  return (
    <Section>
      <WriteArea as="form" onSubmit={handleSubmit}>
        <Heading>댓글</Heading>
        <InputRow>
          <CommentInput
            placeholder="어떤 댓글을 남겨볼까요?"
            value={content}
            onChange={(event) => setContent(event.target.value)}
          />
          <SendButton
            type="submit"
            aria-label="댓글 등록"
            disabled={!content.trim() || isSubmitting}
          >
            <SendIcon aria-hidden="true" />
          </SendButton>
        </InputRow>
        <AnonymousLabel>
          <Checkbox
            type="checkbox"
            checked={isAnonymous}
            onChange={(event) => setIsAnonymous(event.target.checked)}
          />
          익명으로 게시
        </AnonymousLabel>
      </WriteArea>
      {/* 로딩 중 / 댓글 없음은 목록 자리에 문구로 대체한다 */}
      {isLoading && <StatusText>댓글을 불러오는 중입니다.</StatusText>}
      {!isLoading && rootComments.length === 0 && (
        <StatusText>아직 댓글이 없습니다. 첫 댓글을 남겨보세요!</StatusText>
      )}
      {!isLoading && rootComments.length > 0 && (
        <CommentListArea as="ul">
          {rootComments.map((comment) => (
            <CommentItem
              key={comment.commentId}
              comment={comment}
              replies={repliesByCommentId[comment.commentId]}
              onReplySubmit={handleReplySubmit}
              onDelete={handleDelete}
            />
          ))}
        </CommentListArea>
      )}
    </Section>
  )
}
