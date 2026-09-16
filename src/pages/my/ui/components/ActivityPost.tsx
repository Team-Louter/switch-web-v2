import {
  formatCommunityCount,
  formatCommunityListRecentDate,
} from '@/entities/community'
import commentIcon from '@/shared/assets/my/comment-icon.svg'
import fallbackProfileImage from '@/shared/assets/sidebar/profile.png'
import eyeIcon from '@/shared/assets/my/eye-icon.svg'
import heartIcon from '@/shared/assets/my/heart-icon.svg'

import activeHeartIcon from '../assets/activity-heart-active.svg'

import * as S from './ActivityPost.style'

import type { KeyboardEvent, SyntheticEvent } from 'react'
import type { MyPost } from '../../types'

type ActivityPostProps = {
  post: MyPost
  isLiked?: boolean
  onClick?: () => void
}

export function ActivityPost({
  isLiked = false,
  onClick,
  post,
}: ActivityPostProps) {
  const authorName = post.author

  const handleProfileImageError = (event: SyntheticEvent<HTMLImageElement>) => {
    event.currentTarget.onerror = null
    event.currentTarget.src = fallbackProfileImage
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (!onClick || (event.key !== 'Enter' && event.key !== ' ')) {
      return
    }

    event.preventDefault()
    onClick()
  }

  return (
    <S.Row
      role={onClick ? 'link' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onClick={onClick}
      onKeyDown={handleKeyDown}
    >
      <S.MainLine $hasComment={Boolean(post.commentPreview)}>
        <S.CategoryBadge>{post.category}</S.CategoryBadge>
        <S.Title>{post.title}</S.Title>
        {authorName && (
          <S.Author>
            <S.AuthorAvatar
              src={post.authorImageUrl ?? fallbackProfileImage}
              alt={`${authorName} 프로필`}
              loading="lazy"
              decoding="async"
              onError={handleProfileImageError}
            />
            <S.AuthorName>{authorName}</S.AuthorName>
          </S.Author>
        )}
        <S.DateText>{formatCommunityListRecentDate(post.createdAt)}</S.DateText>
        <S.Metrics>
          <S.Metric>
            <S.MetricIcon
              src={isLiked ? activeHeartIcon : heartIcon}
              alt=""
              aria-hidden="true"
            />
            {formatCommunityCount(post.likes)}
          </S.Metric>
          <S.Metric>
            <S.MetricIcon src={commentIcon} alt="" aria-hidden="true" />
            {formatCommunityCount(post.comments)}
          </S.Metric>
          <S.Metric>
            <S.MetricIcon src={eyeIcon} alt="" aria-hidden="true" />
            {formatCommunityCount(post.views)}
          </S.Metric>
        </S.Metrics>
      </S.MainLine>

      {post.commentPreview && (
        <S.CommentPreview>
          <S.CommentText>{post.commentPreview}</S.CommentText>
        </S.CommentPreview>
      )}
    </S.Row>
  )
}
