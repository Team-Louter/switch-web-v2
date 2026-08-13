import { useEffect, useMemo, useState } from 'react'

import { hasApiAccessToken } from '@/shared/api'

import {
  getMyComments,
  getMyLikedPosts,
  getMyPosts,
  getMyProfile,
  getMyReceivedLikeCount,
} from './myApi'
import type {
  MyActivityTab,
  MyActivityTabId,
  MyPost,
  MyProfile,
  MyStat,
} from '../types'
import type {
  MyPostResponse,
  ProfileMajor,
  ProfileResponse,
} from './myApi'

const myProfile: MyProfile = {
  name: '이윤지',
  classInfo: '2학년 2반 2번',
  role: '프론트엔드 · 디자이너',
  email: 'djfnskdjsdhkg@dgsw.hs.kr',
}

const majorLabelMap: Record<ProfileMajor, string> = {
  AI: 'AI',
  ANDROID: '안드로이드',
  BACKEND: '백엔드',
  DESIGN: '디자인',
  EMBEDDED: '임베디드',
  FRONTEND: '프론트엔드',
  GAME: '게임',
  IOS: 'ios',
  SECURITY: '보안',
}

const roleLabelMap: Record<ProfileResponse['role'], string> = {
  LEADER: '부장',
  MENTEE: '멘티',
  MENTOR: '멘토',
  STUDENT: '학생',
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

const fallbackPostsByTab: Record<MyActivityTabId, MyPost[]> = {
  posts: myPosts,
  comments: myCommentPosts,
  likes: myPosts,
}

const getStringValue = (
  record: MyPostResponse,
  keys: string[],
  fallback = '',
) => {
  const value = keys.map((key) => record[key]).find(Boolean)

  return typeof value === 'string' ? value : fallback
}

const getNumberValue = (
  record: MyPostResponse,
  keys: string[],
  fallback = 0,
) => {
  const value = keys.map((key) => record[key]).find(Boolean)

  return typeof value === 'number' ? value : fallback
}

const getPostId = (record: MyPostResponse, fallback: number) => {
  const value = ['postId', 'id', 'commentId']
    .map((key) => record[key])
    .find(Boolean)

  return typeof value === 'number' ? value : fallback
}

const getPageItems = (response: { content?: MyPostResponse[] }) =>
  Array.isArray(response.content) ? response.content : []

const formatProfile = (profile: ProfileResponse): MyProfile => {
  const majorText = profile.majors
    ?.map((major) => majorLabelMap[major])
    .filter(Boolean)
    .join(' · ')

  return {
    name: profile.userName,
    classInfo: `${profile.grade}학년 ${profile.classRoom}반 ${profile.number}번`,
    role: majorText || roleLabelMap[profile.role],
    email: profile.userEmail,
    imageUrl: profile.profileImageUrl,
  }
}

const formatPost = (
  post: MyPostResponse,
  index: number,
  shouldShowComment = false,
): MyPost => ({
  id: getPostId(post, index + 1),
  category: getStringValue(post, ['category', 'categoryName'], '정보 공유'),
  title: getStringValue(post, ['title', 'postTitle'], '게시물 제목 예시입니다.'),
  author: getStringValue(post, ['author', 'writer', 'userName'], '작성자'),
  createdAt: getStringValue(
    post,
    ['createdAt', 'createdDate', 'createdDateTime'],
    '',
  ),
  likes: getNumberValue(post, ['likes', 'likeCount', 'heartCount']),
  comments: getNumberValue(post, ['comments', 'commentCount']),
  views: getNumberValue(post, ['views', 'viewCount']),
  commentPreview: shouldShowComment
    ? getStringValue(post, ['comment', 'commentContent', 'content'])
    : undefined,
})

// 마이 페이지의 프로필과 탭별 활동 데이터를 서버에서 가져온다.
export function useMyPage() {
  const [activeTabId, setActiveTabId] = useState<MyActivityTabId>('posts')
  const [profile, setProfile] = useState<MyProfile>(myProfile)
  const [stats, setStats] = useState<MyStat[]>(myStats)
  const [activityTabs, setActivityTabs] =
    useState<MyActivityTab[]>(myActivityTabs)
  const [postsByTab, setPostsByTab] =
    useState<Record<MyActivityTabId, MyPost[]>>(fallbackPostsByTab)
  const [errorMessage, setErrorMessage] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let shouldIgnore = false

    const fetchMyPage = async () => {
      if (!hasApiAccessToken()) {
        setIsLoading(false)
        return
      }

      try {
        setIsLoading(true)
        const [
          profileResponse,
          postsResponse,
          commentsResponse,
          likedPostsResponse,
          receivedLikeCount,
        ] = await Promise.all([
          getMyProfile(),
          getMyPosts(),
          getMyComments(),
          getMyLikedPosts(),
          getMyReceivedLikeCount().catch(() => 0),
        ])

        if (shouldIgnore) {
          return
        }

        const nextPosts = getPageItems(postsResponse).map((post, index) =>
          formatPost(post, index),
        )
        const nextComments = getPageItems(commentsResponse).map((post, index) =>
          formatPost(post, index, true),
        )
        const nextLikedPosts = getPageItems(likedPostsResponse).map(
          (post, index) => formatPost(post, index),
        )

        setProfile(formatProfile(profileResponse))
        setActivityTabs([
          { id: 'posts', label: '작성한 글', count: profileResponse.postCount },
          { id: 'comments', label: '댓글', count: profileResponse.commentCount },
          {
            id: 'likes',
            label: '좋아요',
            count: profileResponse.likedPostCount,
          },
        ])
        setStats([
          {
            id: 'point',
            label: '작성한 글',
            value: profileResponse.postCount.toLocaleString(),
          },
          {
            id: 'badge',
            label: '댓글',
            value: profileResponse.commentCount.toLocaleString(),
          },
          {
            id: 'view',
            label: '받은 좋아요',
            value: receivedLikeCount.toLocaleString(),
          },
        ])
        setPostsByTab({
          posts: nextPosts,
          comments: nextComments,
          likes: nextLikedPosts,
        })
      } catch {
        if (!shouldIgnore) {
          setErrorMessage('마이 페이지 정보를 불러오지 못했어요')
        }
      } finally {
        if (!shouldIgnore) {
          setIsLoading(false)
        }
      }
    }

    fetchMyPage()

    return () => {
      shouldIgnore = true
    }
  }, [])

  const emptyMessage = useMemo(() => {
    if (isLoading) {
      return '불러오는 중이에요'
    }

    if (errorMessage) {
      return errorMessage
    }

    const activeTabLabel =
      activityTabs.find((tab) => tab.id === activeTabId)?.label ?? '활동'

    return `${activeTabLabel}이 없어요`
  }, [activeTabId, activityTabs, errorMessage, isLoading])

  return {
    activeTabId,
    activityTabs,
    emptyMessage,
    isLoading,
    posts: postsByTab[activeTabId],
    profile,
    setActiveTabId,
    stats,
  }
}
