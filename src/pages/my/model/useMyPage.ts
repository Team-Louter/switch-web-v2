import { useCallback, useEffect, useMemo, useState } from 'react'

import { formatProfileClassInfo, useUserStore } from '@/entities/profile'

import {
  getMyComments,
  getMyLikedPosts,
  getMyPoint,
  getMyPosts,
  getMyReceivedLikeCount,
} from '../api'
import type {
  MyActivityTab,
  MyActivityTabId,
  MyPost,
  MyProfile,
  MyStat,
  ProfileMajor,
} from '../types'
import type {
  MyPostResponse,
  ProfileResponse,
} from '../api'

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

const initialProfile: MyProfile = {
  name: '',
  classInfo: '',
  majors: '',
  email: '',
}

const initialActivityTabs: MyActivityTab[] = [
  { id: 'posts', label: '작성한 글', count: 0 },
  { id: 'comments', label: '댓글', count: 0 },
  { id: 'likes', label: '좋아요', count: 0 },
]

const initialStats: MyStat[] = [
  { id: 'point', label: '포인트', value: '-' },
  { id: 'badge', label: '뱃지', value: '0' },
  { id: 'view', label: '총 조회수', value: '-' },
]

const initialPostsByTab: Record<MyActivityTabId, MyPost[]> = {
  posts: [],
  comments: [],
  likes: [],
}

const initialLoadedTabs: Record<MyActivityTabId, boolean> = {
  posts: false,
  comments: false,
  likes: false,
}

const getStringValue = (
  record: MyPostResponse,
  keys: string[],
) => {
  const value = keys.map((key) => record[key]).find(Boolean)

  return typeof value === 'string' ? value : ''
}

const getNumberValue = (
  record: MyPostResponse | ProfileResponse,
  keys: string[],
) => {
  const value = keys.map((key) => record[key as keyof typeof record]).find(
    (item) => item !== undefined && item !== null,
  )

  return typeof value === 'number' ? value : undefined
}

const getPostId = (record: MyPostResponse, fallback: number) => {
  const value = ['postId', 'id', 'commentId']
    .map((key) => record[key])
    .find((item) => item !== undefined && item !== null)

  return typeof value === 'number' || typeof value === 'string'
    ? String(value)
    : `post-${fallback}`
}

const getPageItems = (response: { content?: MyPostResponse[] }) =>
  Array.isArray(response.content) ? response.content : []

const formatMajorText = (majors?: ProfileMajor[]) =>
  majors
    ?.map((major) => majorLabelMap[major])
    .filter(Boolean)
    .join(' · ') ?? ''

const formatProfile = (profile: ProfileResponse): MyProfile => {
  const nextProfile: MyProfile = {
    name: profile.userName,
    classInfo: formatProfileClassInfo(profile),
    majors: formatMajorText(profile.majors),
    email: profile.userEmail,
    role: profile.role,
  }

  if (profile.profileImageUrl) {
    nextProfile.imageUrl = profile.profileImageUrl
  }

  return nextProfile
}

const formatPost = (
  post: MyPostResponse,
  index: number,
  shouldShowComment = false,
): MyPost => ({
  id: getPostId(post, index + 1),
  category: getStringValue(post, ['category', 'categoryName']),
  title: getStringValue(post, ['title', 'postTitle']),
  author: getStringValue(post, ['author', 'writer', 'userName']),
  createdAt: getStringValue(post, [
    'createdAt',
    'createdDate',
    'createdDateTime',
  ]),
  likes: getNumberValue(post, ['likes', 'likeCount', 'heartCount']) ?? 0,
  comments: getNumberValue(post, ['comments', 'commentCount']) ?? 0,
  views: getNumberValue(post, ['views', 'viewCount']) ?? 0,
  commentPreview: shouldShowComment
    ? getStringValue(post, ['comment', 'commentContent', 'content'])
    : undefined,
})

const formatOptionalStatValue = (value?: number) =>
  typeof value === 'number' ? value.toLocaleString() : '-'

const formatActivityPosts = (
  tabId: MyActivityTabId,
  response: { content?: MyPostResponse[] },
) =>
  getPageItems(response).map((post, index) =>
    formatPost(post, index, tabId === 'comments'),
  )

const getActivityTabPosts = (tabId: MyActivityTabId) => {
  if (tabId === 'comments') {
    return getMyComments()
  }

  if (tabId === 'likes') {
    return getMyLikedPosts()
  }

  return getMyPosts()
}

// 마이 페이지의 프로필과 활동 데이터를 서버 응답 기준으로 구성한다.
export function useMyPage() {
  const fetchUser = useUserStore((state) => state.fetchUser)
  const [activeTabId, setActiveTabId] = useState<MyActivityTabId>('posts')
  const [profile, setProfile] = useState<MyProfile>(initialProfile)
  const [stats, setStats] = useState<MyStat[]>(initialStats)
  const [activityTabs, setActivityTabs] =
    useState<MyActivityTab[]>(initialActivityTabs)
  const [postsByTab, setPostsByTab] =
    useState<Record<MyActivityTabId, MyPost[]>>(initialPostsByTab)
  const [loadedTabs, setLoadedTabs] =
    useState<Record<MyActivityTabId, boolean>>(initialLoadedTabs)
  const [errorMessage, setErrorMessage] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  const loadActivityTab = useCallback(async (tabId: MyActivityTabId) => {
    setIsLoading(true)

    try {
      const response = await getActivityTabPosts(tabId)

      setPostsByTab((currentPostsByTab) => ({
        ...currentPostsByTab,
        [tabId]: formatActivityPosts(tabId, response),
      }))
      setLoadedTabs((currentLoadedTabs) => ({
        ...currentLoadedTabs,
        [tabId]: true,
      }))
      setErrorMessage('')
    } catch {
      setErrorMessage('마이 페이지 정보를 불러오지 못했어요')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    let shouldIgnore = false

    const fetchMyPage = async () => {
      try {
        setIsLoading(true)
        const [
          profileResponse,
          postsResponse,
          point,
          receivedLikeCount,
        ] = await Promise.all([
          fetchUser(),
          getMyPosts(),
          getMyPoint(),
          getMyReceivedLikeCount(),
        ])

        if (shouldIgnore) {
          return
        }

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
            label: '포인트',
            value: formatOptionalStatValue(point),
          },
          {
            id: 'badge',
            label: '뱃지',
            value: formatOptionalStatValue(
              getNumberValue(profileResponse, ['badgeCount']) ?? 0,
            ),
          },
          {
            id: 'view',
            label: '총 조회수',
            value: formatOptionalStatValue(
              getNumberValue(profileResponse, ['totalViewCount', 'viewCount']),
            ),
          },
        ])
        setPostsByTab({
          ...initialPostsByTab,
          posts: formatActivityPosts('posts', postsResponse),
        })
        setLoadedTabs({
          ...initialLoadedTabs,
          posts: true,
        })
        setErrorMessage('')

        if (typeof receivedLikeCount === 'number') {
          setStats((currentStats) =>
            currentStats.map((stat) =>
              stat.id === 'view' &&
              stat.value === '-' &&
              profileResponse.totalViewCount === undefined &&
              profileResponse.viewCount === undefined
                ? {
                    ...stat,
                    label: '받은 좋아요',
                    value: receivedLikeCount.toLocaleString(),
                  }
                : stat,
            ),
          )
        }
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
  }, [fetchUser])

  useEffect(() => {
    if (isLoading || loadedTabs[activeTabId]) {
      return
    }

    void loadActivityTab(activeTabId)
  }, [activeTabId, isLoading, loadedTabs, loadActivityTab])

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
