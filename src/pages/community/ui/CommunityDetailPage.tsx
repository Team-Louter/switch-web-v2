import {
  type KeyboardEvent,
  type SyntheticEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import ReactMarkdown from 'react-markdown'
import { useNavigate, useParams } from 'react-router-dom'
import rehypeRaw from 'rehype-raw'
import rehypeSanitize, { defaultSchema } from 'rehype-sanitize'
import remarkGfm from 'remark-gfm'

import {
  formatCommunityDate,
  getCommunityFileDownloadUrl,
  getCommentReplies,
  getComments,
  getPost,
  getPostCategoryLabel,
  resolveCommunityAssetUrl,
  type CommentResponse,
  type PostResponse,
} from '@/entities/community'
import { getCurrentMember } from '@/entities/member'
import {
  createComment,
  deleteComment,
  deletePost,
  setPostPinned,
  togglePostHeart,
  updateComment,
} from '@/features/community'
import commentIcon from '@/shared/assets/my/comment-icon.svg'
import eyeIcon from '@/shared/assets/my/eye-icon.svg'
import heartIcon from '@/shared/assets/my/heart-icon.svg'
import fallbackProfileImage from '@/shared/assets/sidebar/profile.png'
import { parseBlockNotePostContent } from '@/shared/lib/blockNotePostContent'
import { renderCustomUnderlineMarkdown } from '@/shared/lib/markdown'
import { Button } from '@/shared/ui'

import attachmentChevronIcon from '../assets/svg/attachment-chevron.svg'
import backChevronIcon from '../assets/svg/back-chevron.svg'
import heartColoredIcon from '../assets/svg/heart-colored.svg'
import kebabIcon from '../assets/svg/kebab.svg'
import paperclipIcon from '../assets/svg/paperclip.svg'
import sendIcon from '../assets/svg/send.svg'
import { CommunityPostBlockContent } from './CommunityPostBlockContent'
import * as S from './CommunityDetailPage.style'

const markdownSanitizeSchema = {
  ...defaultSchema,
  tagNames: [...(defaultSchema.tagNames ?? []), 'u'],
  attributes: {
    ...defaultSchema.attributes,
    img: [...(defaultSchema.attributes?.img ?? []), 'alt', 'width'],
  },
}

const VISIBLE_REPLY_COUNT = 3

interface CommentTreeNode {
  comment: CommentResponse
  children: CommentTreeNode[]
}

type ReplySubmitHandler = (
  parentCommentId: number,
  content: string,
  isAnonymous: boolean,
) => Promise<string | null>

type CommentUpdateHandler = (
  commentId: number,
  content: string,
) => Promise<string | null>

type CommentDeleteHandler = (commentId: number) => Promise<string | null>

interface CommunityCommentBranchProps {
  node: CommentTreeNode
  onProfileImageError: (event: SyntheticEvent<HTMLImageElement>) => void
  onReplySubmit: ReplySubmitHandler
  onCommentUpdate: CommentUpdateHandler
  onCommentDelete: CommentDeleteHandler
  currentMemberId: number | null
  replyAuthorProfileImageUrl?: string
  isExpandedByAncestor?: boolean
  hasNextSibling?: boolean
}

function buildCommentTree(comments: CommentResponse[]): CommentTreeNode[] {
  const roots: CommentTreeNode[] = []
  const ancestors: CommentTreeNode[] = []

  for (const comment of comments) {
    const node: CommentTreeNode = { comment, children: [] }
    const parent =
      comment.depth > 0 ? ancestors[comment.depth - 1] : undefined

    if (parent) {
      parent.children.push(node)
    } else {
      roots.push(node)
    }

    ancestors[comment.depth] = node
    ancestors.length = comment.depth + 1
  }

  return roots
}

function getDescendantCommentCount(node: CommentTreeNode): number {
  return node.children.reduce(
    (count, child) => count + 1 + getDescendantCommentCount(child),
    0,
  )
}

function appendReplyComment(
  comments: CommentResponse[],
  parentCommentId: number,
  reply: CommentResponse,
): CommentResponse[] {
  const parentIndex = comments.findIndex(
    (comment) => comment.commentId === parentCommentId,
  )

  if (parentIndex === -1) {
    return comments
  }

  const parentComment = comments[parentIndex]
  const commentsWithReplyCount = comments.map((comment) =>
    comment.commentId === parentCommentId
      ? { ...comment, replyCount: comment.replyCount + 1 }
      : comment,
  )
  let insertIndex = parentIndex + 1

  while (
    insertIndex < commentsWithReplyCount.length &&
    commentsWithReplyCount[insertIndex].depth > parentComment.depth
  ) {
    insertIndex += 1
  }

  const replyWithDepth = { ...reply, depth: parentComment.depth + 1 }

  return [
    ...commentsWithReplyCount.slice(0, insertIndex),
    replyWithDepth,
    ...commentsWithReplyCount.slice(insertIndex),
  ]
}

function CommunityCommentBranch({
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
  const [commentActionError, setCommentActionError] = useState<string | null>(
    null,
  )
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
    setCommentActionError(null)
    setIsCommentEditing(true)
    setIsCommentMenuOpen(false)
  }

  const handleCommentEditCancel = () => {
    setEditedCommentContent('')
    setCommentActionError(null)
    setIsCommentEditing(false)
  }

  const handleCommentEditSubmit = async () => {
    const trimmedContent = editedCommentContent.trim()

    if (!trimmedContent || isCommentMutating) {
      return
    }

    setIsCommentMutating(true)
    setCommentActionError(null)

    const actionError = await onCommentUpdate(comment.commentId, trimmedContent)

    if (actionError) {
      setCommentActionError(actionError)
    } else {
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

  const handleCommentDelete = async () => {
    if (isCommentMutating) {
      return
    }

    const shouldDelete = window.confirm(
      '댓글을 삭제할까요? 삭제한 댓글은 복구할 수 없습니다.',
    )

    if (!shouldDelete) {
      return
    }

    setIsCommentMutating(true)
    setIsCommentMenuOpen(false)
    setCommentActionError(null)

    const actionError = await onCommentDelete(comment.commentId)

    if (actionError) {
      setCommentActionError(actionError)
    }

    setIsCommentMutating(false)
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
                <S.MetaDot aria-hidden="true" />
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
                        onClick={() => void handleCommentDelete()}
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
                    setCommentActionError(null)
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
                <S.CommentText>{comment.content}</S.CommentText>
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
                            <S.AnonymousCheckbox
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
                        <S.ActionError role="alert">
                          {replySubmitError}
                        </S.ActionError>
                      )}
                    </S.ReplyComposerBody>
                  </S.ReplyComposer>
                )}
              </>
            )}
            {commentActionError && (
              <S.ActionError role="alert">{commentActionError}</S.ActionError>
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
                  hasHiddenReplies

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
                <S.RepliesToggleRow $hasConnector={false} $isWithinReplies>
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
                <S.RepliesCaret
                  $isOpen={isRepliesOpen}
                  aria-hidden="true"
                />
              </S.RepliesToggle>
            </S.RepliesToggleRow>
          )}
        </>
      )}
    </S.CommentTreeNode>
  )
}

export function CommunityDetailPage() {
  const navigate = useNavigate()
  const { postId: postIdParam } = useParams()
  const postId = Number(postIdParam)
  const [post, setPost] = useState<PostResponse | null>(null)
  const [comments, setComments] = useState<CommentResponse[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [reloadKey, setReloadKey] = useState(0)
  const [isCommentsLoading, setIsCommentsLoading] = useState(true)
  const [commentLoadError, setCommentLoadError] = useState<string | null>(null)
  const [commentReloadKey, setCommentReloadKey] = useState(0)
  const [commentContent, setCommentContent] = useState('')
  const [isAnonymous, setIsAnonymous] = useState(false)
  const [isCommentSubmitting, setIsCommentSubmitting] = useState(false)
  const [isHeartMutating, setIsHeartMutating] = useState(false)
  const [currentMemberId, setCurrentMemberId] = useState<number | null>(null)
  const [currentMemberProfileImageUrl, setCurrentMemberProfileImageUrl] =
    useState<string | undefined>(undefined)
  const [canManagePostPin, setCanManagePostPin] = useState(false)
  const [isPinMutating, setIsPinMutating] = useState(false)
  const [isPostDeleting, setIsPostDeleting] = useState(false)
  const [isPostMenuOpen, setIsPostMenuOpen] = useState(false)
  const [isAttachmentListOpen, setIsAttachmentListOpen] = useState(false)
  const [actionError, setActionError] = useState<string | null>(null)
  const [postActionError, setPostActionError] = useState<string | null>(null)
  const postMenuRef = useRef<HTMLDivElement>(null)

  const canManagePost = currentMemberId === post?.userId
  const canOpenPostMenu = canManagePostPin || canManagePost
  const isPostActionMutating = isPinMutating || isPostDeleting
  const replyAuthorProfileImageUrl = resolveCommunityAssetUrl(
    currentMemberProfileImageUrl,
  )
  const attachmentFiles =
    post?.files?.filter((file) => !file.fileType.startsWith('image/')) ?? []
  const firstAttachment = attachmentFiles[0]
  const serializedPostContent = post?.postContent
  const postBlocks = useMemo(
    () =>
      serializedPostContent
        ? parseBlockNotePostContent(serializedPostContent)
        : null,
    [serializedPostContent],
  )
  const commentTree = useMemo(() => buildCommentTree(comments), [comments])

  const handleBackToList = () => {
    navigate('/community')
  }

  const handleRetry = () => {
    setReloadKey((currentKey) => currentKey + 1)
  }

  const handleCommentsRetry = () => {
    setCommentReloadKey((currentKey) => currentKey + 1)
  }

  const handleProfileImageError = (
    event: SyntheticEvent<HTMLImageElement>,
  ) => {
    event.currentTarget.onerror = null
    event.currentTarget.src = fallbackProfileImage
  }

  const handleHeartToggle = async () => {
    if (!post || isHeartMutating) {
      return
    }

    setIsHeartMutating(true)
    setActionError(null)

    try {
      await togglePostHeart(post.postId)
      setPost((currentPost) => {
        if (!currentPost) {
          return currentPost
        }

        const nextIsHearted = !currentPost.isHearted

        return {
          ...currentPost,
          isHearted: nextIsHearted,
          likeCount: Math.max(
            0,
            currentPost.likeCount + (nextIsHearted ? 1 : -1),
          ),
        }
      })
    } catch {
      setActionError('좋아요 상태를 변경하지 못했습니다.')
    } finally {
      setIsHeartMutating(false)
    }
  }

  const handlePinToggle = async () => {
    if (!post || !canManagePostPin || isPinMutating) {
      return
    }

    const nextPinned = !post.pinned

    setIsPinMutating(true)
    setIsPostMenuOpen(false)
    setPostActionError(null)

    try {
      await setPostPinned(post.postId, nextPinned)
      setPost((currentPost) =>
        currentPost ? { ...currentPost, pinned: nextPinned } : currentPost,
      )
    } catch {
      setPostActionError(
        nextPinned
          ? '게시글을 고정하지 못했습니다. 잠시 후 다시 시도해주세요.'
          : '게시글 고정을 해제하지 못했습니다. 잠시 후 다시 시도해주세요.',
      )
    } finally {
      setIsPinMutating(false)
    }
  }

  const handleCommentSubmit = async () => {
    const trimmedContent = commentContent.trim()

    if (!post || !trimmedContent || isCommentSubmitting) {
      return
    }

    setIsCommentSubmitting(true)
    setActionError(null)

    try {
      const comment = await createComment(post.postId, {
        content: trimmedContent,
        isAnonymous,
      })

      setComments((currentComments) => [...currentComments, comment])
      setPost((currentPost) =>
        currentPost
          ? { ...currentPost, commentCount: currentPost.commentCount + 1 }
          : currentPost,
      )
      setCommentContent('')
      setIsAnonymous(false)
    } catch {
      setActionError('댓글을 등록하지 못했습니다.')
    } finally {
      setIsCommentSubmitting(false)
    }
  }

  const handleReplySubmit: ReplySubmitHandler = async (
    parentCommentId,
    content,
    replyIsAnonymous,
  ) => {
    const trimmedContent = content.trim()

    if (!post || !trimmedContent) {
      return '답글 내용을 입력해주세요.'
    }

    try {
      const replyComment = await createComment(post.postId, {
        content: trimmedContent,
        isAnonymous: replyIsAnonymous,
        parentId: parentCommentId,
      })
      setComments((currentComments) =>
        appendReplyComment(currentComments, parentCommentId, replyComment),
      )
      setPost((currentPost) =>
        currentPost
          ? { ...currentPost, commentCount: currentPost.commentCount + 1 }
          : currentPost,
      )

      return null
    } catch {
      return '답글을 등록하지 못했습니다.'
    }
  }

  const handleCommentUpdate: CommentUpdateHandler = async (
    commentId,
    content,
  ) => {
    if (!post) {
      return '댓글을 수정하지 못했습니다.'
    }

    try {
      const updatedComment = await updateComment(post.postId, commentId, {
        content,
      })

      setComments((currentComments) =>
        currentComments.map((currentComment) =>
          currentComment.commentId === commentId
            ? { ...currentComment, ...updatedComment }
            : currentComment,
        ),
      )

      return null
    } catch {
      return '댓글을 수정하지 못했습니다. 잠시 후 다시 시도해주세요.'
    }
  }

  const handleCommentDelete: CommentDeleteHandler = async (commentId) => {
    if (!post) {
      return '댓글을 삭제하지 못했습니다.'
    }

    try {
      await deleteComment(post.postId, commentId)
      setCommentReloadKey((currentKey) => currentKey + 1)
      setReloadKey((currentKey) => currentKey + 1)

      return null
    } catch {
      return '댓글을 삭제하지 못했습니다. 잠시 후 다시 시도해주세요.'
    }
  }

  const handleCommentKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault()
      void handleCommentSubmit()
    }
  }

  const handlePostMenuKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Escape') {
      setIsPostMenuOpen(false)
      event.currentTarget.querySelector<HTMLButtonElement>('button')?.focus()
    }
  }

  const handlePostEdit = () => {
    if (!post || !canManagePost) {
      return
    }

    setIsPostMenuOpen(false)
    navigate(`/community/${post.postId}/edit`)
  }

  const handlePostDelete = async () => {
    if (!post || !canManagePost || isPostDeleting) {
      return
    }

    const shouldDelete = window.confirm(
      '게시글을 삭제할까요? 삭제한 게시글은 복구할 수 없습니다.',
    )

    if (!shouldDelete) {
      return
    }

    setIsPostDeleting(true)
    setIsPostMenuOpen(false)
    setPostActionError(null)

    try {
      await deletePost(post.postId)
      navigate('/community', { replace: true })
    } catch {
      setPostActionError('게시글을 삭제하지 못했습니다. 잠시 후 다시 시도해주세요.')
    } finally {
      setIsPostDeleting(false)
    }
  }

  const handleAttachmentOpen = (fileKeyOrUrl: string) => {
    const attachmentUrl = getCommunityFileDownloadUrl(fileKeyOrUrl)

    if (attachmentUrl) {
      window.open(attachmentUrl, '_blank', 'noopener,noreferrer')
    }
  }

  useEffect(() => {
    let isCancelled = false

    async function loadCurrentMember() {
      try {
        const currentMember = await getCurrentMember()
        const canManagePin =
          currentMember.role === 'LEADER' || currentMember.role === 'MENTOR'

        if (!isCancelled) {
          setCurrentMemberId(currentMember.userId)
          setCurrentMemberProfileImageUrl(currentMember.profileImageUrl)
          setCanManagePostPin(canManagePin)
        }
      } catch {
        if (!isCancelled) {
          setCurrentMemberId(null)
          setCurrentMemberProfileImageUrl(undefined)
          setCanManagePostPin(false)
        }
      }
    }

    void loadCurrentMember()

    return () => {
      isCancelled = true
    }
  }, [])

  useEffect(() => {
    if (!isPostMenuOpen) {
      return
    }

    function handleOutsidePointerDown(event: PointerEvent) {
      if (
        event.target instanceof Node &&
        !postMenuRef.current?.contains(event.target)
      ) {
        setIsPostMenuOpen(false)
      }
    }

    document.addEventListener('pointerdown', handleOutsidePointerDown)

    return () => {
      document.removeEventListener('pointerdown', handleOutsidePointerDown)
    }
  }, [isPostMenuOpen])

  useEffect(() => {
    let isCancelled = false

    async function loadPost() {
      if (!Number.isSafeInteger(postId) || postId <= 0) {
        setLoadError('올바르지 않은 게시글 주소입니다.')
        setIsLoading(false)
        return
      }

      setIsLoading(true)
      setLoadError(null)

      try {
        const postResponse = await getPost(postId)

        if (!isCancelled) {
          setPost(postResponse)
        }
      } catch {
        if (!isCancelled) {
          setLoadError('게시글을 불러오지 못했습니다.')
          setPost(null)
          setComments([])
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false)
        }
      }
    }

    void loadPost()

    return () => {
      isCancelled = true
    }
  }, [postId, reloadKey])

  useEffect(() => {
    let isCancelled = false

    async function loadComments() {
      if (!Number.isSafeInteger(postId) || postId <= 0) {
        setComments([])
        setCommentLoadError(null)
        setIsCommentsLoading(false)
        return
      }

      setIsCommentsLoading(true)
      setCommentLoadError(null)
      setComments([])

      try {
        const rootComments = await getComments(postId)
        const loadedCommentIds = new Set<number>()

        async function loadCommentBranch(
          comment: CommentResponse,
          depth: number,
        ): Promise<CommentResponse[]> {
          if (loadedCommentIds.has(comment.commentId)) {
            return []
          }

          loadedCommentIds.add(comment.commentId)

          const currentComment = { ...comment, depth }

          if (comment.replyCount === 0) {
            return [currentComment]
          }

          const replies = await getCommentReplies(postId, comment.commentId)
          const replyBranches = await Promise.all(
            replies.map((reply) => loadCommentBranch(reply, depth + 1)),
          )

          return [currentComment, ...replyBranches.flat()]
        }

        const commentBranches = await Promise.all(
          rootComments.map((comment) => loadCommentBranch(comment, 0)),
        )
        const allComments = commentBranches.flat()

        if (!isCancelled) {
          setComments(allComments)
        }
      } catch {
        if (!isCancelled) {
          setComments([])
          setCommentLoadError('댓글을 불러오지 못했습니다.')
        }
      } finally {
        if (!isCancelled) {
          setIsCommentsLoading(false)
        }
      }
    }

    void loadComments()

    return () => {
      isCancelled = true
    }
  }, [postId, reloadKey, commentReloadKey])

  return (
    <S.Page>
      <S.Content>
        <S.BackButton type="button" onClick={handleBackToList}>
          <S.BackIcon src={backChevronIcon} alt="" />
          목록 보기
        </S.BackButton>

        {isLoading && (
          <S.DetailSkeleton
            role="status"
            aria-label="게시글을 불러오는 중입니다."
          >
            <S.SkeletonGroup aria-hidden="true">
              <S.SkeletonBlock $width="80px" $height={29} />
              <S.SkeletonMetaRow>
                <S.SkeletonBlock $width="56%" $height={33} />
                <S.SkeletonBlock $width="240px" $height={22} />
              </S.SkeletonMetaRow>
              <S.Divider />
            </S.SkeletonGroup>

            <S.SkeletonGroup aria-hidden="true">
              <S.SkeletonBlock $width="92%" $height={21} />
              <S.SkeletonBlock $width="78%" $height={21} />
              <S.SkeletonBlock $width="64%" $height={21} />
            </S.SkeletonGroup>

            <S.SkeletonGroup aria-hidden="true">
              <S.SkeletonBlock $width="310px" $height={36} />
              <S.Divider />
            </S.SkeletonGroup>

            <S.SkeletonGroup aria-hidden="true">
              <S.SkeletonBlock $width="48px" $height={24} />
              <S.SkeletonBlock $height={52} />
              <S.SkeletonBlock $width="52%" $height={54} />
              <S.SkeletonBlock $width="46%" $height={54} />
            </S.SkeletonGroup>
          </S.DetailSkeleton>
        )}

        {!isLoading && loadError && (
          <S.PageStatus role="alert">
            <S.StatusMessage>{loadError}</S.StatusMessage>
            <Button size="sm" variant="neutral" onClick={handleRetry}>
              다시 시도
            </Button>
          </S.PageStatus>
        )}

        {!isLoading && !loadError && post && (
          <>
            <S.Article>
              <S.ArticleHeading>
                <S.TitleBlock>
                  <S.CategoryBadge>
                    {getPostCategoryLabel(post.category)}
                  </S.CategoryBadge>
                  <S.TitleRow>
                    <S.Title>{post.postTitle}</S.Title>
                    <S.PostActions>
                      <S.PostMeta>
                        <S.PostAuthor>
                          <S.PostAuthorImage
                            src={
                              resolveCommunityAssetUrl(
                                post.userProfileImageUrl,
                              ) ?? fallbackProfileImage
                            }
                            alt={`${post.userName} 프로필`}
                            onError={handleProfileImageError}
                          />
                          <S.PostAuthorName>{post.userName}</S.PostAuthorName>
                        </S.PostAuthor>
                        <S.MetaDot aria-hidden="true" />
                        <S.PostDate dateTime={post.createdAt}>
                          {formatCommunityDate(post.createdAt)}
                        </S.PostDate>
                        {canOpenPostMenu && (
                          <S.PostMenu
                            ref={postMenuRef}
                            onKeyDown={handlePostMenuKeyDown}
                          >
                            <S.PostMenuButton
                              type="button"
                              aria-label="게시글 관리 메뉴"
                              aria-expanded={isPostMenuOpen}
                              aria-haspopup="menu"
                              disabled={isPostActionMutating}
                              onClick={() =>
                                setIsPostMenuOpen((isOpen) => !isOpen)
                              }
                            >
                              <S.PostMenuIcon src={kebabIcon} alt="" />
                            </S.PostMenuButton>
                            {isPostMenuOpen && (
                              <S.PostMenuPanel
                                role="menu"
                                aria-label="게시글 관리"
                              >
                                {canManagePostPin && (
                                  <S.PostMenuItem
                                    type="button"
                                    role="menuitem"
                                    disabled={isPostActionMutating}
                                    onClick={handlePinToggle}
                                  >
                                    {post.pinned ? '고정 해제' : '고정하기'}
                                  </S.PostMenuItem>
                                )}
                                {canManagePostPin && canManagePost && (
                                  <S.PostMenuDivider aria-hidden="true" />
                                )}
                                {canManagePost && (
                                  <>
                                    <S.PostMenuItem
                                      type="button"
                                      role="menuitem"
                                      disabled={isPostActionMutating}
                                      onClick={handlePostEdit}
                                    >
                                      수정하기
                                    </S.PostMenuItem>
                                    <S.PostMenuDivider aria-hidden="true" />
                                    <S.PostMenuItem
                                      type="button"
                                      role="menuitem"
                                      $danger
                                      disabled={isPostActionMutating}
                                      onClick={handlePostDelete}
                                    >
                                      {isPostDeleting ? '삭제 중' : '삭제하기'}
                                    </S.PostMenuItem>
                                  </>
                                )}
                              </S.PostMenuPanel>
                            )}
                          </S.PostMenu>
                        )}
                      </S.PostMeta>
                      {postActionError && (
                        <S.PinActionError role="alert">
                          {postActionError}
                        </S.PinActionError>
                      )}
                    </S.PostActions>
                  </S.TitleRow>
                </S.TitleBlock>
                <S.Divider />
              </S.ArticleHeading>

              <S.BodyText>
                {postBlocks ? (
                  <CommunityPostBlockContent
                    key={post.postId}
                    blocks={postBlocks}
                  />
                ) : (
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    rehypePlugins={[
                      rehypeRaw,
                      [rehypeSanitize, markdownSanitizeSchema],
                    ]}
                  >
                    {renderCustomUnderlineMarkdown(post.postContent)}
                  </ReactMarkdown>
                )}
              </S.BodyText>
            </S.Article>

            <S.Engagement aria-label="게시글 반응과 첨부파일">
              <S.EngagementRow>
                <S.StatGroup aria-label="게시글 반응">
                  <S.HeartButton
                    type="button"
                    aria-pressed={post.isHearted}
                    disabled={isHeartMutating}
                    onClick={handleHeartToggle}
                  >
                    <S.StatIcon
                      src={post.isHearted ? heartColoredIcon : heartIcon}
                      alt="좋아요"
                    />
                    {post.likeCount}
                  </S.HeartButton>
                  <S.Stat>
                    <S.StatIcon src={commentIcon} alt="댓글" />
                    {post.commentCount}
                  </S.Stat>
                  <S.Stat>
                    <S.StatIcon src={eyeIcon} alt="조회" />
                    {post.viewers}
                  </S.Stat>
                  </S.StatGroup>

                {firstAttachment && (
                  <S.AttachmentArea>
                    <S.AttachmentToggle
                      type="button"
                      aria-controls={`post-${post.postId}-attachments`}
                      aria-expanded={isAttachmentListOpen}
                      onClick={() =>
                        setIsAttachmentListOpen((isOpen) => !isOpen)
                      }
                    >
                      <S.AttachmentLabel>
                        <S.AttachmentIcon src={paperclipIcon} alt="" />
                        <S.AttachmentText>첨부 파일 “</S.AttachmentText>
                        <S.AttachmentSummaryFileName
                          title={firstAttachment.fileName}
                        >
                          {firstAttachment.fileName}
                        </S.AttachmentSummaryFileName>
                        <S.AttachmentText>
                          ”
                          {attachmentFiles.length > 1 &&
                            ` 외 ${attachmentFiles.length - 1}개`}
                        </S.AttachmentText>
                      </S.AttachmentLabel>
                      <S.AttachmentDivider aria-hidden="true" />
                      <S.AttachmentChevron
                        $isOpen={isAttachmentListOpen}
                        src={attachmentChevronIcon}
                        alt=""
                      />
                    </S.AttachmentToggle>
                    <S.AttachmentPanel
                      id={`post-${post.postId}-attachments`}
                      $isOpen={isAttachmentListOpen}
                      aria-hidden={!isAttachmentListOpen}
                    >
                      <S.AttachmentFileList>
                        {attachmentFiles.map((file) => (
                          <S.AttachmentFileButton
                            key={file.fileId}
                            type="button"
                            tabIndex={isAttachmentListOpen ? 0 : -1}
                            onClick={() => handleAttachmentOpen(file.fileUrl)}
                          >
                            <S.AttachmentFileIcon
                              src={paperclipIcon}
                              alt=""
                            />
                            <S.AttachmentFileName>
                              {file.fileName}
                            </S.AttachmentFileName>
                          </S.AttachmentFileButton>
                        ))}
                      </S.AttachmentFileList>
                    </S.AttachmentPanel>
                  </S.AttachmentArea>
                )}

              </S.EngagementRow>
              <S.Divider />
            </S.Engagement>

            <S.Comments>
              <S.CommentComposer>
                <S.CommentForm>
                  <S.CommentHeading>댓글</S.CommentHeading>
                  <S.CommentInputRow>
                    <S.CommentInput
                      type="text"
                      aria-label="댓글 내용"
                      placeholder="어떤 댓글을 남겨볼까요?"
                      value={commentContent}
                      disabled={isCommentSubmitting}
                      onChange={(event) =>
                        setCommentContent(event.target.value)
                      }
                      onKeyDown={handleCommentKeyDown}
                    />
                    <S.SendButton
                      type="button"
                      aria-label="댓글 등록"
                      disabled={!commentContent.trim() || isCommentSubmitting}
                      onClick={handleCommentSubmit}
                    >
                      <S.SendIcon src={sendIcon} alt="" />
                    </S.SendButton>
                  </S.CommentInputRow>
                </S.CommentForm>
                <S.AnonymousLabel>
                  <S.AnonymousCheckbox
                    type="checkbox"
                    checked={isAnonymous}
                    disabled={isCommentSubmitting}
                    onChange={(event) =>
                      setIsAnonymous(event.target.checked)
                    }
                  />
                  익명으로 게시
                </S.AnonymousLabel>
                {actionError && (
                  <S.ActionError role="alert">{actionError}</S.ActionError>
                )}
              </S.CommentComposer>

              <S.CommentList aria-label="댓글 목록">
                {isCommentsLoading && (
                  <S.CommentStatus role="status">
                    댓글을 불러오는 중입니다.
                  </S.CommentStatus>
                )}
                {!isCommentsLoading && commentLoadError && (
                  <S.CommentStatus role="alert">
                    {commentLoadError}
                    <Button
                      size="sm"
                      variant="neutral"
                      onClick={handleCommentsRetry}
                    >
                      다시 시도
                    </Button>
                  </S.CommentStatus>
                )}
                {!isCommentsLoading && !commentLoadError && comments.length === 0 && (
                  <S.CommentStatus>첫 댓글을 남겨보세요.</S.CommentStatus>
                )}
                {commentTree.map((node) => (
                  <CommunityCommentBranch
                    key={node.comment.commentId}
                    node={node}
                    onProfileImageError={handleProfileImageError}
                    onReplySubmit={handleReplySubmit}
                    onCommentUpdate={handleCommentUpdate}
                    onCommentDelete={handleCommentDelete}
                    currentMemberId={currentMemberId}
                    replyAuthorProfileImageUrl={replyAuthorProfileImageUrl}
                  />
                ))}
              </S.CommentList>
            </S.Comments>
          </>
        )}
      </S.Content>
    </S.Page>
  )
}
