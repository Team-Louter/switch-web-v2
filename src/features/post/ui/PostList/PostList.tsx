import type { Post } from '@/entities/post'

import { EmptyText, List } from './PostList.style'
import { PostRow } from './PostRow'

type PostListProps = {
  posts: Post[]
  isLoading: boolean
  onPostSelect: (postId: number) => void
}

export function PostList({ posts, isLoading, onPostSelect }: PostListProps) {
  // 로딩 중 / 결과 없음은 목록 자리에 문구로 대체한다.
  if (isLoading) {
    return <EmptyText>게시글을 불러오는 중입니다.</EmptyText>
  }

  if (posts.length === 0) {
    return <EmptyText>아직 등록된 게시글이 없습니다.</EmptyText>
  }

  return (
    <List>
      {posts.map((post) => (
        <PostRow key={post.postId} post={post} onSelect={onPostSelect} />
      ))}
    </List>
  )
}
