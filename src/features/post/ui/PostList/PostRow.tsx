import { HEARTED_COLOR } from '@/shared/constants/community'
import { formatDateTime } from '@/shared/lib/date'
import * as token from '@/shared/styles/values/token'
import { CommentIcon, EyeIcon, HeartIcon, PinIcon } from '@/shared/ui/icons'
import type { Post } from '@/entities/post'

import { CategoryBadge } from '../CategoryBadge'
import {
  Author,
  AuthorName,
  Avatar,
  CreatedAt,
  IconBox,
  PinBox,
  Row,
  Stat,
  Stats,
  Title,
} from './PostList.style'

type PostRowProps = {
  post: Post
  onSelect: (postId: number) => void
}

export function PostRow({ post, onSelect }: PostRowProps) {
  const authorName = post.isAnonymous ? '익명' : post.userName

  return (
    <Row onClick={() => onSelect(post.postId)}>
      <CategoryBadge category={post.category} />
      {/* 고정된 게시글에만 핀 아이콘을 붙인다 */}
      {post.pinned && (
        <PinBox aria-label="고정된 게시글">
          <PinIcon aria-hidden="true" />
        </PinBox>
      )}
      <Title>{post.postTitle}</Title>
      <Author>
        <Avatar>
          {!post.isAnonymous && post.userProfileImageUrl && (
            <img src={post.userProfileImageUrl} alt="" />
          )}
        </Avatar>
        <AuthorName>{authorName}</AuthorName>
      </Author>
      <CreatedAt>{formatDateTime(post.createdAt)}</CreatedAt>
      <Stats>
        <Stat>
          <IconBox
            $color={post.isHearted ? HEARTED_COLOR : token.colors.gray.gray30}
          >
            <HeartIcon aria-hidden="true" />
          </IconBox>
          {post.likeCount}
        </Stat>
        <Stat>
          <IconBox $color={token.colors.gray.gray30}>
            <CommentIcon aria-hidden="true" />
          </IconBox>
          {post.commentCount}
        </Stat>
        <Stat>
          <IconBox $color={token.colors.gray.gray30}>
            <EyeIcon aria-hidden="true" />
          </IconBox>
          {post.viewers}
        </Stat>
      </Stats>
    </Row>
  )
}
