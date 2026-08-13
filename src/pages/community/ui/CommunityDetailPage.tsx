import {
  type KeyboardEvent,
  type SyntheticEvent,
  useEffect,
  useState,
} from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import {
  formatCommunityDate,
  getCommentReplies,
  getComments,
  getPost,
  getPostCategoryLabel,
  resolveCommunityAssetUrl,
  type CommentResponse,
  type PostResponse,
} from '@/entities/community'
import { createComment, togglePostHeart } from '@/features/community'
import commentIcon from '@/shared/assets/my/comment-icon.svg'
import eyeIcon from '@/shared/assets/my/eye-icon.svg'
import heartIcon from '@/shared/assets/my/heart-icon.svg'
import fallbackProfileImage from '@/shared/assets/sidebar/profile.png'
import { Button } from '@/shared/ui'

import attachmentChevronIcon from '../assets/svg/attachment-chevron.svg'
import backChevronIcon from '../assets/svg/back-chevron.svg'
import heartColoredIcon from '../assets/svg/heart-colored.svg'
import kebabIcon from '../assets/svg/kebab.svg'
import paperclipIcon from '../assets/svg/paperclip.svg'
import sendIcon from '../assets/svg/send.svg'
import * as S from './CommunityDetailPage.style'

export function CommunityDetailPage() {
  const navigate = useNavigate()
  const { postId: postIdParam } = useParams()
  const postId = Number(postIdParam)
  const [post, setPost] = useState<PostResponse | null>(null)
  const [comments, setComments] = useState<CommentResponse[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [reloadKey, setReloadKey] = useState(0)
  const [commentContent, setCommentContent] = useState('')
  const [isAnonymous, setIsAnonymous] = useState(false)
  const [isCommentSubmitting, setIsCommentSubmitting] = useState(false)
  const [isHeartMutating, setIsHeartMutating] = useState(false)
  const [actionError, setActionError] = useState<string | null>(null)

  const firstAttachment = post?.files?.[0]
  const attachmentCount = post?.files?.length ?? 0

  const handleBackToList = () => {
    navigate('/community')
  }

  const handleRetry = () => {
    setReloadKey((currentKey) => currentKey + 1)
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

  const handleCommentKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault()
      void handleCommentSubmit()
    }
  }

  const handleAttachmentOpen = () => {
    const attachmentUrl = resolveCommunityAssetUrl(firstAttachment?.fileUrl)

    if (attachmentUrl) {
      window.open(attachmentUrl, '_blank', 'noopener,noreferrer')
    }
  }

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
        const [postResponse, rootComments] = await Promise.all([
          getPost(postId),
          getComments(postId),
        ])
        const replies = await Promise.all(
          rootComments.map((comment) =>
            comment.replyCount > 0
              ? getCommentReplies(postId, comment.commentId)
              : Promise.resolve([]),
          ),
        )
        const allComments = rootComments.flatMap((comment, index) => [
          comment,
          ...replies[index],
        ])

        if (!isCancelled) {
          setPost(postResponse)
          setComments(allComments)
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

  return (
    <S.Page>
      <S.Content>
        <S.BackButton type="button" onClick={handleBackToList}>
          <S.BackIcon src={backChevronIcon} alt="" />
          목록 보기
        </S.BackButton>

        {isLoading && (
          <S.PageStatus role="status">
            <S.StatusMessage>게시글을 불러오는 중입니다.</S.StatusMessage>
          </S.PageStatus>
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
                    </S.PostMeta>
                  </S.TitleRow>
                </S.TitleBlock>
                <S.Divider />
              </S.ArticleHeading>

              <S.BodyText>{post.postContent}</S.BodyText>
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
                  <S.AttachmentButton
                    type="button"
                    onClick={handleAttachmentOpen}
                  >
                    <S.AttachmentLabel>
                      <S.AttachmentIcon src={paperclipIcon} alt="" />
                      첨부 파일 “{firstAttachment.fileName}”
                      {attachmentCount > 1 && `외 ${attachmentCount - 1}개`}
                    </S.AttachmentLabel>
                    <S.AttachmentDivider aria-hidden="true" />
                    <S.AttachmentChevron
                      src={attachmentChevronIcon}
                      alt=""
                    />
                  </S.AttachmentButton>
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
                {comments.length === 0 && (
                  <S.CommentStatus>첫 댓글을 남겨보세요.</S.CommentStatus>
                )}
                {comments.map((comment) => (
                  <S.CommentRow key={comment.commentId}>
                    {comment.depth > 0 && <S.ReplyGuide aria-hidden="true" />}
                    <S.CommentItem>
                      <S.CommentAuthorImage
                        src={
                          resolveCommunityAssetUrl(
                            comment.userProfileImageUrl,
                          ) ?? fallbackProfileImage
                        }
                        alt={`${comment.userName} 프로필`}
                        onError={handleProfileImageError}
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
                          <S.CommentMenuButton
                            type="button"
                            aria-label={`${comment.userName} 댓글 메뉴`}
                          >
                            <S.CommentMenuIcon src={kebabIcon} alt="" />
                          </S.CommentMenuButton>
                        </S.CommentHeader>
                        <S.CommentText>{comment.content}</S.CommentText>
                      </S.CommentContent>
                    </S.CommentItem>
                  </S.CommentRow>
                ))}
              </S.CommentList>
            </S.Comments>
          </>
        )}
      </S.Content>
    </S.Page>
  )
}
