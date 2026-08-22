import {
  type KeyboardEvent,
  type SyntheticEvent,
  useEffect,
  useRef,
  useState,
} from 'react'

import {
  formatCommunityDate,
  resolveCommunityAssetUrl,
} from '@/entities/community'
import fallbackProfileImage from '@/shared/assets/sidebar/profile.png'
import { ConfirmModal } from '@/shared/ui'

import kebabIcon from '../assets/svg/kebab.svg'
import {
  getDescendantCommentCount,
  type CommentTreeNode,
  type CommunityCommentDeleteHandler,
  type CommunityCommentUpdateHandler,
  type CommunityReplySubmitHandler,
} from './communityCommentTree'
import * as S from './CommunityCommentBranch.style'

const VISIBLE_REPLY_COUNT = 3

interface CommunityCommentBranchProps {
  node: CommentTreeNode
  onProfileImageError: (event: SyntheticEvent<HTMLImageElement>) => void
  onReplySubmit: CommunityReplySubmitHandler
  onCommentUpdate: CommunityCommentUpdateHandler
  onCommentDelete: CommunityCommentDeleteHandler
  currentMemberId: number | null
  replyAuthorProfileImageUrl?: string
  isExpandedByAncestor?: boolean
  hasNextSibling?: boolean
}

export function CommunityCommentBranch({
  node,
  onProfileImageError,
  onReplySubmit,
  onCommentUpdate,
  onCommentDelete,
  currentMemberId,
  replyAuthorProfileImageUrl,
  isExpandedByAncestor = false,
  hasNextSibling = false,
}: CommunityCommentBranchProps) {
  const { comment } = node
  const [isRepliesOpen, setIsRepliesOpen] = useState(false)
  const [isReplyComposerOpen, setIsReplyComposerOpen] = useState(false)
  const [replyContent, setReplyContent] = useState('')
  const [isReplyAnonymous, setIsReplyAnonymous] = useState(false)
  const [isReplySubmitting, setIsReplySubmitting] = useState(false)
  const [replySubmitError, setReplySubmitError] = useState<string | null>(null)
  const [isCommentMenuOpen, setIsCommentMenuOpen] = useState(false)
  const [isCommentEditing, setIsCommentEditing] = useState(false)
  const [editedCommentContent, setEditedCommentContent] = useState('')
  const [isCommentMutating, setIsCommentMutating] = useState(false)
  const [isCommentDeleteConfirmOpen, setIsCommentDeleteConfirmOpen] =
    useState(false)
  const [visibleReplyCount, setVisibleReplyCount] = useState(
    VISIBLE_REPLY_COUNT,
  )
  const commentMenuRef = useRef<HTMLDivElement>(null)

  const hasReplies = node.children.length > 0
  const canManageComment = currentMemberId === comment.userId
  const descendantCommentCount = getDescendantCommentCount(node)
  const shouldShowReplies = isExpandedByAncestor || isRepliesOpen
  const visibleReplies = node.children.slice(0, visibleReplyCount)
  const hasHiddenReplies = node.children.length > visibleReplies.length
  const hasCollapseControl = !isExpandedByAncestor
  const repliesToggleLabel = isRepliesOpen
    ? '답글 숨기기'
    : `답글 ${descendantCommentCount}개`

  const handleReplyComposerOpen = () => {
    setIsReplyComposerOpen(true)
    setReplySubmitError(null)
  }

  const handleReplyComposerCancel = () => {
    setIsReplyComposerOpen(false)
    setReplyContent('')
    setIsReplyAnonymous(false)
    setReplySubmitError(null)
  }

  const handleReplyFormSubmit = async () => {
    const trimmedContent = replyContent.trim()

    if (!trimmedContent || isReplySubmitting) {
      return
    }

    setIsReplySubmitting(true)
    setReplySubmitError(null)

    const submitError = await onReplySubmit(
      comment.commentId,
      trimmedContent,
      isReplyAnonymous,
    )

    if (submitError) {
      setReplySubmitError(submitError)
    } else {
      setIsRepliesOpen(true)
      setVisibleReplyCount(node.children.length + 1)
      handleReplyComposerCancel()
    }

    setIsReplySubmitting(false)
  }

  const handleReplyKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault()
      void handleReplyFormSubmit()
    }
  }

  const handleCommentEditStart = () => {
    setEditedCommentContent(comment.content)
    setIsCommentEditing(true)
    setIsCommentMenuOpen(false)
  }

  const handleCommentEditCancel = () => {
    setEditedCommentContent('')
    setIsCommentEditing(false)
  }

  const handleCommentEditSubmit = async () => {
    const trimmedContent = editedCommentContent.trim()

    if (!trimmedContent || isCommentMutating) {
      return
    }

    setIsCommentMutating(true)

    const actionError = await onCommentUpdate(comment.commentId, trimmedContent)

    if (!actionError) {
      setIsCommentEditing(false)
      setEditedCommentContent('')
    }

    setIsCommentMutating(false)
  }

  const handleCommentEditKeyDown = (
    event: KeyboardEvent<HTMLInputElement>,
  ) => {
    if (event.key === 'Enter') {
      event.preventDefault()
      void handleCommentEditSubmit()
    }
  }

  const handleCommentDeleteRequest = () => {
    if (isCommentMutating) {
      return
    }

    setIsCommentMenuOpen(false)
    setIsCommentDeleteConfirmOpen(true)
  }

  const handleCommentDelete = async () => {
    if (isCommentMutating) {
      return
    }

    setIsCommentMutating(true)
    await onCommentDelete(comment.commentId)
    setIsCommentMutating(false)
    setIsCommentDeleteConfirmOpen(false)
  }

  const handleCommentMenuKeyDown = (
    event: KeyboardEvent<HTMLDivElement>,
  ) => {
    if (event.key === 'Escape') {
      setIsCommentMenuOpen(false)
      event.currentTarget.querySelector<HTMLButtonElement>('button')?.focus()
    }
  }

  useEffect(() => {
    if (!isCommentMenuOpen) {
      return
    }

    function handleOutsidePointerDown(event: PointerEvent) {
      if (
        event.target instanceof Node &&
        !commentMenuRef.current?.contains(event.target)
      ) {
        setIsCommentMenuOpen(false)
      }
    }

    document.addEventListener('pointerdown', handleOutsidePointerDown)

    return () => {
      document.removeEventListener('pointerdown', handleOutsidePointerDown)
    }
  }, [isCommentMenuOpen])

  return (
    <S.CommentTreeNode $hasNextSibling={hasNextSibling}>
      <S.CommentRow $isReply={comment.depth > 0}>
        <S.CommentItem>
          <S.CommentAuthorImage
            src={
              resolveCommunityAssetUrl(comment.userProfileImageUrl) ??
              fallbackProfileImage
            }
            alt={`${comment.userName} 프로필`}
            onError={onProfileImageError}
          />
          <S.CommentContent>
            <S.CommentHeader>
              <S.CommentMeta>
                <S.CommentAuthor>{comment.userName}</S.CommentAuthor>
                <S.CommentMetaDot aria-hidden="true" />
                <S.CommentDate dateTime={comment.createdAt}>
                  {formatCommunityDate(comment.createdAt)}
                </S.CommentDate>
              </S.CommentMeta>
              {canManageComment && (
                <S.CommentMenu
                  ref={commentMenuRef}
                  onKeyDown={handleCommentMenuKeyDown}
                >
                  <S.CommentMenuButton
                    type="button"
                    aria-label="댓글 관리 메뉴"
                    aria-expanded={isCommentMenuOpen}
                    aria-haspopup="menu"
                    disabled={isCommentMutating}
                    onClick={() => setIsCommentMenuOpen((isOpen) => !isOpen)}
                  >
                    <S.CommentMenuIcon src={kebabIcon} alt="" />
                  </S.CommentMenuButton>
                  {isCommentMenuOpen && (
                    <S.CommentMenuPanel role="menu" aria-label="댓글 관리">
                      <S.CommentMenuItem
                        type="button"
                        role="menuitem"
                        disabled={isCommentMutating}
                        onClick={handleCommentEditStart}
                      >
                        수정하기
                      </S.CommentMenuItem>
                      <S.CommentMenuDivider aria-hidden="true" />
                      <S.CommentMenuItem
                        type="button"
                        role="menuitem"
                        $danger
                        disabled={isCommentMutating}
                        onClick={handleCommentDeleteRequest}
                      >
                        {isCommentMutating ? '삭제 중' : '삭제하기'}
                      </S.CommentMenuItem>
                    </S.CommentMenuPanel>
                  )}
                </S.CommentMenu>
              )}
            </S.CommentHeader>
            {isCommentEditing ? (
              <S.CommentEditForm>
                <S.CommentEditInput
                  type="text"
                  aria-label="댓글 수정"
                  value={editedCommentContent}
                  disabled={isCommentMutating}
                  onChange={(event) => {
                    setEditedCommentContent(event.target.value)
                  }}
                  onKeyDown={handleCommentEditKeyDown}
                />
                <S.CommentEditActions>
                  <S.CommentEditButton
                    type="button"
                    disabled={isCommentMutating}
                    onClick={handleCommentEditCancel}
                  >
                    취소
                  </S.CommentEditButton>
                  <S.CommentEditSaveButton
                    type="button"
                    disabled={!editedCommentContent.trim() || isCommentMutating}
                    onClick={() => void handleCommentEditSubmit()}
                  >
                    저장
                  </S.CommentEditSaveButton>
                </S.CommentEditActions>
              </S.CommentEditForm>
            ) : (
              <>
                <S.CommentText $isDeleted={comment.deleted}>
                  {comment.content}
                </S.CommentText>
                <S.ReplyActionButton
                  type="button"
                  aria-expanded={isReplyComposerOpen}
                  onClick={handleReplyComposerOpen}
                >
                  답글 작성
                </S.ReplyActionButton>
                {isReplyComposerOpen && (
                  <S.ReplyComposer>
                    <S.ReplyComposerAvatar
                      src={replyAuthorProfileImageUrl ?? fallbackProfileImage}
                      alt=""
                      onError={onProfileImageError}
                    />
                    <S.ReplyComposerBody>
                      <S.ReplyComposerInput
                        type="text"
                        aria-label={`${comment.userName} 댓글에 답글 작성`}
                        placeholder="답글을 남겨보세요"
                        value={replyContent}
                        disabled={isReplySubmitting}
                        onChange={(event) => {
                          setReplyContent(event.target.value)
                          setReplySubmitError(null)
                        }}
                        onKeyDown={handleReplyKeyDown}
                      />
                      <S.ReplyComposerFooter>
                        <S.ReplyComposerTools>
                          <S.ReplyAnonymousLabel>
                            <S.ReplyAnonymousCheckbox
                              type="checkbox"
                              checked={isReplyAnonymous}
                              disabled={isReplySubmitting}
                              onChange={(event) =>
                                setIsReplyAnonymous(event.target.checked)
                              }
                            />
                            익명
                          </S.ReplyAnonymousLabel>
                        </S.ReplyComposerTools>
                        <S.ReplyComposerActions>
                          <S.ReplyCancelButton
                            type="button"
                            disabled={isReplySubmitting}
                            onClick={handleReplyComposerCancel}
                          >
                            취소
                          </S.ReplyCancelButton>
                          <S.ReplySubmitButton
                            type="button"
                            disabled={
                              !replyContent.trim() || isReplySubmitting
                            }
                            onClick={() => void handleReplyFormSubmit()}
                          >
                            답글
                          </S.ReplySubmitButton>
                        </S.ReplyComposerActions>
                      </S.ReplyComposerFooter>
                      {replySubmitError && (
                        <S.ReplyActionError role="alert">
                          {replySubmitError}
                        </S.ReplyActionError>
                      )}
                    </S.ReplyComposerBody>
                  </S.ReplyComposer>
                )}
              </>
            )}
          </S.CommentContent>
        </S.CommentItem>
      </S.CommentRow>
      {hasReplies && (
        <>
          {shouldShowReplies && (
            <S.CommentChildren>
              {visibleReplies.map((child, index) => {
                const hasFollowingItem =
                  index < visibleReplies.length - 1 ||
                  hasHiddenReplies ||
                  hasCollapseControl

                return (
                  <CommunityCommentBranch
                    key={child.comment.commentId}
                    node={child}
                    onProfileImageError={onProfileImageError}
                    onReplySubmit={onReplySubmit}
                    onCommentUpdate={onCommentUpdate}
                    onCommentDelete={onCommentDelete}
                    currentMemberId={currentMemberId}
                    replyAuthorProfileImageUrl={replyAuthorProfileImageUrl}
                    isExpandedByAncestor={shouldShowReplies}
                    hasNextSibling={hasFollowingItem}
                  />
                )
              })}
              {hasHiddenReplies && (
                <S.RepliesToggleRow $isWithinReplies>
                  <S.RepliesToggle
                    type="button"
                    aria-label="남은 답글 더보기"
                    onClick={() => setVisibleReplyCount(node.children.length)}
                  >
                    답글 더보기
                    <S.RepliesCaret $isOpen={false} aria-hidden="true" />
                  </S.RepliesToggle>
                </S.RepliesToggleRow>
              )}
              {hasCollapseControl && (
                <S.RepliesToggleRow $isWithinReplies>
                  <S.RepliesToggle
                    type="button"
                    aria-expanded={isRepliesOpen}
                    onClick={() => setIsRepliesOpen((isOpen) => !isOpen)}
                  >
                    {repliesToggleLabel}
                    <S.RepliesCaret
                      $isOpen={isRepliesOpen}
                      aria-hidden="true"
                    />
                  </S.RepliesToggle>
                </S.RepliesToggleRow>
              )}
            </S.CommentChildren>
          )}
          {hasCollapseControl && !isRepliesOpen && (
            <S.RepliesToggleRow>
              <S.RepliesToggle
                type="button"
                aria-expanded={isRepliesOpen}
                onClick={() => setIsRepliesOpen((isOpen) => !isOpen)}
              >
                {repliesToggleLabel}
                <S.RepliesCaret $isOpen={isRepliesOpen} aria-hidden="true" />
              </S.RepliesToggle>
            </S.RepliesToggleRow>
          )}
        </>
      )}
      {isCommentDeleteConfirmOpen && (
        <ConfirmModal
          title="댓글을 삭제할까요?"
          description="삭제한 댓글은 복구할 수 없습니다."
          confirmLabel="삭제"
          isConfirming={isCommentMutating}
          onCancel={() => setIsCommentDeleteConfirmOpen(false)}
          onConfirm={() => void handleCommentDelete()}
        />
      )}
    </S.CommentTreeNode>
  )
}
