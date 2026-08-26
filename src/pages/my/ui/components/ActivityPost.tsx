import commentIcon from '@/shared/assets/my/comment-icon.svg'
import eyeIcon from '@/shared/assets/my/eye-icon.svg'
import heartIcon from '@/shared/assets/my/heart-icon.svg'

import type { MyPost } from '../../types'
import * as S from './ActivityPost.style'

type ActivityPostProps = {
  post: MyPost
}

export function ActivityPost({ post }: ActivityPostProps) {
  return (
    <S.Row>
      <S.MainLine>
        <S.CategoryBadge>{post.category}</S.CategoryBadge>
        <S.Title>{post.title}</S.Title>
        <S.Author>
          <S.AuthorName>{post.author}</S.AuthorName>
        </S.Author>
        <S.DateText>{post.createdAt}</S.DateText>
        <S.Metrics>
          <S.Metric>
            <S.MetricIcon src={heartIcon} alt="" aria-hidden="true" />
            {post.likes}
          </S.Metric>
          <S.Metric>
            <S.MetricIcon src={commentIcon} alt="" aria-hidden="true" />
            {post.comments}
          </S.Metric>
          <S.Metric>
            <S.MetricIcon src={eyeIcon} alt="" aria-hidden="true" />
            {post.views}
          </S.Metric>
        </S.Metrics>
      </S.MainLine>

      {post.commentPreview && (
        <S.CommentPreview>
          <S.CommentLabel>내가 작성한 댓글</S.CommentLabel>
          <S.CommentText>{post.commentPreview}</S.CommentText>
        </S.CommentPreview>
      )}
    </S.Row>
  )
}
