import { queryOptions } from '@tanstack/react-query'

import { communityActivityQueryKeys } from '@/entities/community'
import { profileQueryKeys } from '@/entities/profile'

import {
  getMyComments,
  getMyLikedPosts,
  getMyPoint,
  getMyPosts,
  getMyReceivedLikeCount,
} from '../api'
import type {
  MyCommentResponse,
  MyPostResponse,
  PageResponse,
  ProfileResponse,
} from '../api'
import type { MyActivityTabId } from '../types'

const PAGE_SIZE = 5
type MyActivityPageResponse =
  | PageResponse<MyPostResponse>
  | PageResponse<MyCommentResponse>

export const myPageQueryKeys = {
  profile: (userId: number | null) => profileQueryKeys.me(userId),
  activityPages: communityActivityQueryKeys.mine,
  activityPage: (
    userId: number | null,
    tabId: MyActivityTabId,
    page: number,
  ) => communityActivityQueryKeys.page(userId, tabId, page, PAGE_SIZE),
  receivedLikes: (userId: number | null) =>
    ['my-page', 'received-likes', userId] as const,
  points: (userId: number | null) => ['my-page', 'points', userId] as const,
}

export function myProfileOptions(
  userId: number | null,
  fetchProfile: () => Promise<ProfileResponse>,
) {
  return queryOptions<ProfileResponse>({
    queryKey: myPageQueryKeys.profile(userId),
    queryFn: fetchProfile,
  })
}

export function myActivityPageOptions(
  userId: number | null,
  tabId: MyActivityTabId,
  page: number,
) {
  return queryOptions<MyActivityPageResponse>({
    queryKey: myPageQueryKeys.activityPage(userId, tabId, page),
    queryFn: ({ signal }) => {
      const pageable = { page, size: PAGE_SIZE }

      if (tabId === 'comments') {
        return getMyComments(pageable, signal)
      }

      if (tabId === 'likes') {
        return getMyLikedPosts(pageable, signal)
      }

      return getMyPosts(pageable, signal)
    },
  })
}

export function myReceivedLikesOptions(userId: number | null) {
  return queryOptions({
    queryKey: myPageQueryKeys.receivedLikes(userId),
    queryFn: () => getMyReceivedLikeCount(),
  })
}

export function myPointsOptions(userId: number | null) {
  return queryOptions({
    queryKey: myPageQueryKeys.points(userId),
    queryFn: () => getMyPoint(),
  })
}
