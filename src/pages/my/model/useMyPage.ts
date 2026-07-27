import { useState } from 'react'

import type {
  MyActivityTab,
  MyActivityTabId,
  MyPost,
  MyProfile,
  MyStat,
} from '../types'

const myProfile: MyProfile = {
  name: '이윤지',
  classInfo: '2학년 2반 2번',
  role: '프론트엔드 · 디자이너',
  email: 'djfnskdjsdhkg@dgsw.hs.kr',
}

const myStats: MyStat[] = [
  { id: 'point', label: '포인트', value: '3,500' },
  { id: 'badge', label: '뱃지', value: '3' },
  { id: 'view', label: '총 조회수', value: '400' },
]

const myActivityTabs: MyActivityTab[] = [
  { id: 'posts', label: '작성한 글', count: 12 },
  { id: 'comments', label: '댓글', count: 12 },
  { id: 'likes', label: '좋아요', count: 12 },
]

const myPosts: MyPost[] = Array.from({ length: 4 }, (_, index) => ({
  id: index + 1,
  category: '정보 공유',
  title: '게시물 제목 예시입니다.',
  author: '작성자',
  createdAt: '2026.01.01 23:59',
  likes: 99,
  comments: 99,
  views: 99,
}))

const myCommentPosts: MyPost[] = myPosts.map((post) => ({
  ...post,
  commentPreview: '댓글내용댓글내용댓글내용댓글내용댓글내용댓글내용댓글내용',
}))

const postsByTab: Record<MyActivityTabId, MyPost[]> = {
  posts: myPosts,
  comments: myCommentPosts,
  likes: myPosts,
}

// 마이 페이지의 임시 프로필 데이터와 활동 탭 상태를 관리한다.
export function useMyPage() {
  const [activeTabId, setActiveTabId] = useState<MyActivityTabId>('posts')

  return {
    activeTabId,
    activityTabs: myActivityTabs,
    emptyMessage: '작성한 글이 없어요',
    posts: postsByTab[activeTabId],
    profile: myProfile,
    setActiveTabId,
    stats: myStats,
  }
}
