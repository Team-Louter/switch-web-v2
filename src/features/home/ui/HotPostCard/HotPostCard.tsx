import type { Post } from '@/entities/post'

import commentIcon from '../../assets/comment.svg'
import heartIcon from '../../assets/heart.svg'
import { HomeCard } from '../HomeCard'
import { MoreButton } from '../MoreButton'
import * as S from './HotPostCard.style'

interface HotPostCardProps {
  posts: Post[]
  onMoreClick: () => void
}

export function HotPostCard({ posts, onMoreClick }: HotPostCardProps) {
  return (
    <HomeCard
      title="인기글"
      actions={<MoreButton onClick={onMoreClick} />}
      isEmpty={posts.length === 0}
      emptyText="인기글이 없어요"
    >
      <S.List>
        {posts.map(({ postId, postTitle, likeCount, commentCount }) => (
          <S.Item key={postId}>
            <S.Title>{postTitle}</S.Title>
            <S.Counts>
              <S.Count>
                <S.CountIcon src={heartIcon} alt="좋아요" />
                {likeCount}
              </S.Count>
              <S.Count>
                <S.CountIcon src={commentIcon} alt="댓글" />
                {commentCount}
              </S.Count>
            </S.Counts>
          </S.Item>
        ))}
      </S.List>
    </HomeCard>
  )
}
