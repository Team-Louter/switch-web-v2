import type { FormEvent } from 'react'
import { useEffect, useRef, useState } from 'react'

import { formatDateTime } from '@/shared/lib/date'
import { KebabIcon, SendIcon } from '@/shared/ui/icons'
import type { Comment } from '@/entities/comment'

import {
  AuthorName,
  Avatar,
  Body,
  Content,
  CreatedAt,
  Dot,
  Item,
  Menu,
  MenuButton,
  MenuItem,
  MenuWrap,
  Meta,
  MetaRow,
  ReplyForm,
  ReplyInput,
  ReplyList,
  ReplySubmit,
  Text,
} from './CommentItem.style'

type CommentItemProps = {
  comment: Comment
  replies?: Comment[]
  /** 답글을 달 수 있는지 여부 (답글에는 다시 답글을 달지 않는다) */
  canReply?: boolean
  onReplySubmit: (parentId: number, content: string) => Promise<void>
  onDelete: (commentId: number) => Promise<void>
}

export function CommentItem({
  comment,
  replies = [],
  canReply = true,
  onReplySubmit,
  onDelete,
}: CommentItemProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isReplyOpen, setIsReplyOpen] = useState(false)
  const [replyContent, setReplyContent] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  // 바깥을 누르면 더보기 메뉴를 닫는다.
  useEffect(() => {
    if (!isMenuOpen) return

    const handleOutsideClick = (event: MouseEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) {
        setIsMenuOpen(false)
      }
    }

    document.addEventListener('click', handleOutsideClick)
    return () => document.removeEventListener('click', handleOutsideClick)
  }, [isMenuOpen])

  const handleReplySubmit = async (event: FormEvent) => {
    event.preventDefault()

    if (!replyContent.trim() || isSubmitting) return

    try {
      setIsSubmitting(true)
      await onReplySubmit(comment.commentId, replyContent.trim())
      setReplyContent('')
      setIsReplyOpen(false)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteClick = async () => {
    setIsMenuOpen(false)
    await onDelete(comment.commentId)
  }

  const authorName = comment.isAnonymous ? '익명' : comment.userName

  return (
    <Item>
      <Body>
        <Avatar>
          {!comment.isAnonymous && comment.userProfileImageUrl && (
            <img src={comment.userProfileImageUrl} alt="" />
          )}
        </Avatar>
        <Content>
          <MetaRow>
            <Meta>
              <AuthorName>{authorName}</AuthorName>
              <Dot aria-hidden="true" />
              <CreatedAt>{formatDateTime(comment.createdAt)}</CreatedAt>
            </Meta>
            {/* 삭제된 댓글에는 더보기 메뉴를 두지 않는다 */}
            {!comment.deleted && (
              <MenuWrap ref={menuRef}>
                <MenuButton
                  type="button"
                  aria-haspopup="menu"
                  aria-expanded={isMenuOpen}
                  aria-label="댓글 더보기"
                  onClick={() => setIsMenuOpen((prev) => !prev)}
                >
                  <KebabIcon aria-hidden="true" />
                </MenuButton>
                {isMenuOpen && (
                  <Menu role="menu">
                    {canReply && (
                      <MenuItem
                        type="button"
                        role="menuitem"
                        onClick={() => {
                          setIsReplyOpen(true)
                          setIsMenuOpen(false)
                        }}
                      >
                        답글 달기
                      </MenuItem>
                    )}
                    <MenuItem type="button" role="menuitem" onClick={handleDeleteClick}>
                      삭제
                    </MenuItem>
                  </Menu>
                )}
              </MenuWrap>
            )}
          </MetaRow>
          <Text $deleted={comment.deleted}>
            {comment.deleted ? '삭제된 댓글입니다.' : comment.content}
          </Text>
        </Content>
      </Body>
      {(isReplyOpen || replies.length > 0) && (
        <ReplyList>
          {/* 답글 달기를 눌렀을 때만 입력창을 연다 */}
          {isReplyOpen && (
            <ReplyForm onSubmit={handleReplySubmit}>
              <ReplyInput
                autoFocus
                placeholder="답글을 입력해주세요."
                value={replyContent}
                onChange={(event) => setReplyContent(event.target.value)}
              />
              <ReplySubmit
                type="submit"
                aria-label="답글 등록"
                disabled={!replyContent.trim() || isSubmitting}
              >
                <SendIcon width={24} height={24} aria-hidden="true" />
              </ReplySubmit>
            </ReplyForm>
          )}
          {replies.map((reply) => (
            <CommentItem
              key={reply.commentId}
              comment={reply}
              canReply={false}
              onReplySubmit={onReplySubmit}
              onDelete={onDelete}
            />
          ))}
        </ReplyList>
      )}
    </Item>
  )
}
