import { formatCommunityDate } from '@/entities/community'

import commentIcon from '../assets/v1-chat.svg'
import eyeIcon from '../assets/v1-view.svg'
import heartIcon from '../assets/v1-heart-empty.svg'
import activeHeartIcon from '../assets/v1-heart.svg'

import * as S from './ActivityPost.style'

import type { KeyboardEvent } from 'react'
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
  const formattedDate = formatCommunityDate(post.createdAt)
  const dateText =
    formattedDate === post.createdAt
      ? formattedDate
      : `${formattedDate.slice(2, 10)}. ${formattedDate.slice(11)}`

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
        <S.Metrics>
          <S.Metric>
            <S.MetricIcon src={eyeIcon} alt="" aria-hidden="true" />
            {post.views.toLocaleString()}
          </S.Metric>
          <S.Metric $tone="red">
            <S.MetricIcon
              src={isLiked ? activeHeartIcon : heartIcon}
              alt=""
              aria-hidden="true"
            />
            {post.likes.toLocaleString()}
          </S.Metric>
          <S.Metric $tone="yellow">
            <S.MetricIcon src={commentIcon} alt="" aria-hidden="true" />
            {post.comments.toLocaleString()}
          </S.Metric>
        </S.Metrics>
        <S.DateText>{dateText}</S.DateText>
      </S.MainLine>

      {post.commentPreview && (
        <S.CommentPreview>
          <S.CommentText>{post.commentPreview}</S.CommentText>
        </S.CommentPreview>
      )}
    </S.Row>
  )
}
