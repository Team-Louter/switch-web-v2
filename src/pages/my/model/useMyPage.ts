import { useCallback, useEffect, useMemo, useState } from 'react'

import { getPostCategoryLabel, resolveCommunityAssetUrl } from '@/entities/community'
import { formatProfileClassInfo, useUserStore } from '@/entities/profile'

import {
  getMyComments,
  getMyLikedPosts,
  getMyPoint,
  getMyPosts,
  getMyReceivedLikeCount,
} from '../api'
import type { MyCommentResponse, MyPostResponse, ProfileResponse } from '../api'
import type {
  MyActivityTab,
  MyActivityTabId,
  MyPost,
  MyProfile,
  ProfileMajor,
} from '../types'

const PAGE_SIZE = 5

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
  { id: 'posts', label: '내가 쓴 글', count: 0 },
  { id: 'comments', label: '댓글 단 글', count: 0 },
  { id: 'likes', label: '좋아요한 글', count: 0 },
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

type ActivityTabMeta = {
  fetching: boolean
  hasMore: boolean
  nextPage: number
}

const initialActivityMeta: Record<MyActivityTabId, ActivityTabMeta> = {
  posts: { fetching: false, hasMore: true, nextPage: 0 },
  comments: { fetching: false, hasMore: true, nextPage: 0 },
  likes: { fetching: false, hasMore: true, nextPage: 0 },
}

const getPageItems = <T>(response: { content?: T[] }): T[] =>
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
    githubUrl: profile.githubUrl,
    linkedinUrl: profile.linkedinUrl,
    point: profile.point ?? profile.points,
    badgeCount: profile.badgeCount,
    receivedLikeCount: profile.receivedLikeCount,
    role: profile.role,
  }

  if (profile.equippedItems) {
    nextProfile.equippedItems = profile.equippedItems
  }

  if (profile.profileImageUrl) {
    nextProfile.imageUrl = profile.profileImageUrl
  }

  return nextProfile
}

const formatMyPost = (post: MyPostResponse): MyPost => ({
  id: String(post.postId),
  communityPostId: String(post.postId),
  category: getPostCategoryLabel(post.postCategory),
  title: post.postTitle,
  author: post.userName,
  authorImageUrl: resolveCommunityAssetUrl(post.userProfileImageUrl),
  createdAt: post.createdAt,
  likes: post.likeCount,
  isLiked: post.isHearted,
  comments: post.commentCount,
  views: post.viewers,
})

const formatMyComment = (comment: MyCommentResponse): MyPost => ({
  id: `${comment.postId}:${comment.commentId}`,
  communityPostId: String(comment.postId),
  category: getPostCategoryLabel(comment.postCategory),
  title: comment.postTitle,
  author: comment.userName,
  authorImageUrl: resolveCommunityAssetUrl(comment.userProfileImageUrl),
  createdAt: comment.commentCreatedAt,
  likes: comment.likeCount,
  isLiked: comment.isHearted,
  comments: comment.commentCount,
  views: comment.viewers,
  commentPreview: comment.commentContent,
})

const isAbortError = (error: unknown) => {
  if (!error || typeof error !== 'object') {
    return false
  }

  const candidate = error as { code?: string; name?: string }
  return (
    candidate.code === 'ERR_CANCELED' ||
    candidate.name === 'CanceledError' ||
    candidate.name === 'AbortError'
  )
}

const getHasMore = (
  response: { content?: unknown[]; last?: boolean; totalPages?: number },
  page: number,
) => {
  if (typeof response.last === 'boolean') {
    return !response.last
  }

  if (typeof response.totalPages === 'number') {
    return page + 1 < response.totalPages
  }

  return getPageItems(response).length === PAGE_SIZE
}

const mergePosts = (current: MyPost[], incoming: MyPost[]) => {
  const postsById = new Map(current.map((post) => [post.id, post]))

  incoming.forEach((post) => {
    postsById.set(post.id, post)
  })

  return Array.from(postsById.values())
}

const formatPageItems = (
  tabId: MyActivityTabId,
  response: { content?: MyPostResponse[] | MyCommentResponse[] },
) => {
  if (tabId === 'comments') {
    return getPageItems(response as { content?: MyCommentResponse[] }).map(
      formatMyComment,
    )
  }

  return getPageItems(response as { content?: MyPostResponse[] }).map(
    formatMyPost,
  )
}

const getActivityTabLabel = (tabId: MyActivityTabId) =>
  initialActivityTabs.find((tab) => tab.id === tabId)?.label ?? '활동'

// v1 프로필 화면의 탭별 캐시와 무한 스크롤 동작을 v2 API에 맞춰 유지한다.
export function useMyPage() {
  const fetchUser = useUserStore((state) => state.fetchUser)
  const [activeTabId, setActiveTabId] = useState<MyActivityTabId>('posts')
  const [profile, setProfile] = useState<MyProfile>(initialProfile)
  const [activityTabs, setActivityTabs] = useState<MyActivityTab[]>(
    initialActivityTabs,
  )
  const [postsByTab, setPostsByTab] =
    useState<Record<MyActivityTabId, MyPost[]>>(initialPostsByTab)
  const [loadedTabs, setLoadedTabs] =
    useState<Record<MyActivityTabId, boolean>>(initialLoadedTabs)
  const [activityMeta, setActivityMeta] =
    useState<Record<MyActivityTabId, ActivityTabMeta>>(initialActivityMeta)
  const [errorMessage, setErrorMessage] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  const applyProfileUpdate = useCallback((profileResponse: ProfileResponse) => {
    const nextProfile = formatProfile(profileResponse)

    setProfile((currentProfile) => ({
      ...nextProfile,
      badgeCount: nextProfile.badgeCount ?? currentProfile.badgeCount,
      point: nextProfile.point ?? currentProfile.point,
      receivedLikeCount:
        nextProfile.receivedLikeCount ?? currentProfile.receivedLikeCount,
    }))
    setActivityTabs([
      { id: 'posts', label: '내가 쓴 글', count: profileResponse.postCount },
      {
        id: 'comments',
        label: '댓글 단 글',
        count: profileResponse.commentCount,
      },
      {
        id: 'likes',
        label: '좋아요한 글',
        count: profileResponse.likedPostCount,
      },
    ])
  }, [])

  const loadActivityPage = useCallback(
    async (tabId: MyActivityTabId, page: number, signal?: AbortSignal) => {
      setActivityMeta((currentMeta) => ({
        ...currentMeta,
        [tabId]: {
          ...(currentMeta[tabId] ?? initialActivityMeta[tabId]),
          fetching: true,
        },
      }))

      try {
        const response =
          tabId === 'comments'
            ? await getMyComments({ page, size: PAGE_SIZE }, signal)
            : tabId === 'likes'
              ? await getMyLikedPosts({ page, size: PAGE_SIZE }, signal)
              : await getMyPosts({ page, size: PAGE_SIZE }, signal)

        if (signal?.aborted) {
          return
        }

        const incomingPosts = formatPageItems(tabId, response)

        setPostsByTab((currentPostsByTab) => ({
          ...currentPostsByTab,
          [tabId]: mergePosts(currentPostsByTab[tabId], incomingPosts),
        }))
        setLoadedTabs((currentLoadedTabs) => ({
          ...currentLoadedTabs,
          [tabId]: true,
        }))
        setActivityMeta((currentMeta) => ({
          ...currentMeta,
          [tabId]: {
            fetching: false,
            hasMore: getHasMore(response, page),
            nextPage: page + 1,
          },
        }))
        setErrorMessage('')
      } catch (error: unknown) {
        if (signal?.aborted || isAbortError(error)) {
          setActivityMeta((currentMeta) => ({
            ...currentMeta,
            [tabId]: {
              ...(currentMeta[tabId] ?? initialActivityMeta[tabId]),
              fetching: false,
            },
          }))
          return
        }

        setErrorMessage('마이 페이지 정보를 불러오지 못했어요')
        setActivityMeta((currentMeta) => ({
          ...currentMeta,
          [tabId]: {
            ...(currentMeta[tabId] ?? initialActivityMeta[tabId]),
            fetching: false,
            hasMore: false,
          },
        }))
      }
    },
    [],
  )

  useEffect(() => {
    const controller = new AbortController()

    const fetchMyPage = async () => {
      setIsLoading(true)

      try {
        const [profileResponse, postsResponse, receivedLikeCount, point] =
          await Promise.all([
            fetchUser(),
            getMyPosts({ page: 0, size: PAGE_SIZE }, controller.signal),
            getMyReceivedLikeCount(controller.signal),
            getMyPoint(controller.signal).catch(() => undefined),
          ])

        if (controller.signal.aborted) {
          return
        }

        const nextProfile = formatProfile(profileResponse)

        if (typeof nextProfile.point !== 'number' && typeof point === 'number') {
          nextProfile.point = point
        }

        if (
          typeof nextProfile.receivedLikeCount !== 'number' &&
          typeof receivedLikeCount === 'number'
        ) {
          nextProfile.receivedLikeCount = receivedLikeCount
        }

        setProfile(nextProfile)
        setActivityTabs([
          { id: 'posts', label: '내가 쓴 글', count: profileResponse.postCount },
          {
            id: 'comments',
            label: '댓글 단 글',
            count: profileResponse.commentCount,
          },
          {
            id: 'likes',
            label: '좋아요한 글',
            count: profileResponse.likedPostCount,
          },
        ])
        setPostsByTab((currentPostsByTab) => ({
          ...currentPostsByTab,
          posts: getPageItems(postsResponse).map(formatMyPost),
        }))
        setLoadedTabs((currentLoadedTabs) => ({
          ...currentLoadedTabs,
          posts: true,
        }))
        setActivityMeta((currentMeta) => ({
          ...currentMeta,
          posts: {
            fetching: false,
            hasMore: getHasMore(postsResponse, 0),
            nextPage: 1,
          },
        }))
        setErrorMessage('')
      } catch (error: unknown) {
        if (!controller.signal.aborted && !isAbortError(error)) {
          setErrorMessage('마이 페이지 정보를 불러오지 못했어요')
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false)
        }
      }
    }

    void fetchMyPage()

    return () => controller.abort()
  }, [fetchUser])

  useEffect(() => {
    if (activeTabId === 'posts' || loadedTabs[activeTabId]) {
      return
    }

    const controller = new AbortController()
    void Promise.resolve().then(() => {
      if (!controller.signal.aborted) {
        void loadActivityPage(activeTabId, 0, controller.signal)
      }
    })

    return () => controller.abort()
  }, [activeTabId, loadedTabs, loadActivityPage])

  const loadMore = useCallback(() => {
    const meta = activityMeta[activeTabId]

    if (!meta || meta.fetching || !meta.hasMore) {
      return
    }

    void loadActivityPage(activeTabId, meta.nextPage)
  }, [activeTabId, activityMeta, loadActivityPage])

  const posts = postsByTab[activeTabId]
  const activeTabMeta = activityMeta[activeTabId]
  const isActiveTabLoading =
    isLoading || (activeTabMeta.fetching && posts.length === 0)
  const emptyMessage = useMemo(() => {
    if (isActiveTabLoading) {
      return '불러오는 중이에요'
    }

    if (errorMessage) {
      return errorMessage
    }

    return `${getActivityTabLabel(activeTabId)}이 없어요`
  }, [activeTabId, errorMessage, isActiveTabLoading])

  return {
    activeTabId,
    activityTabs,
    applyProfileUpdate,
    emptyMessage,
    hasMore: activeTabMeta.hasMore,
    isFetchingMore: activeTabMeta.fetching && posts.length > 0,
    isLoading: isActiveTabLoading,
    isProfileLoading: isLoading,
    loadMore,
    posts,
    profile,
    setActiveTabId,
  }
}
