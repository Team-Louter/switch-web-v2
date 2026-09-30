import { queryOptions } from '@tanstack/react-query'

import { queryClient } from '@/shared/lib/queryClient'

import {
  getCommentReplies,
  getCommentTotalReplyCount,
  getComments,
  getPost,
  getPostStats,
  getPosts,
} from '../api/getCommunity'
import type {
  CommentResponse,
  GetPostsParams,
  PostResponse,
  PostStatsResponse,
} from './types'

const POST_LIST_QUERY_KEY = ['community', 'posts'] as const
const POST_DETAIL_QUERY_KEY = ['community', 'post'] as const

export const communityPostQueryKeys = {
  forPost: (postId: number) => [...POST_DETAIL_QUERY_KEY, postId] as const,
  detail: (postId: number, userId: number | null) =>
    [...POST_DETAIL_QUERY_KEY, postId, 'detail', userId] as const,
  comments: (postId: number, userId: number | null) =>
    [...POST_DETAIL_QUERY_KEY, postId, 'comments', userId] as const,
  replies: (postId: number, commentId: number, userId: number | null) =>
    [...POST_DETAIL_QUERY_KEY, postId, 'replies', commentId, userId] as const,
  replyCount: (postId: number, commentId: number, userId: number | null) =>
    [...POST_DETAIL_QUERY_KEY, postId, 'reply-count', commentId, userId] as const,
  stats: (postId: number, userId: number | null) =>
    [...POST_DETAIL_QUERY_KEY, postId, 'stats', userId] as const,
}

export const communityActivityQueryKeys = {
  mine: ['community', 'my-activity'] as const,
  page: (
    userId: number | null,
    tabId: 'posts' | 'comments' | 'likes',
    page: number,
    size: number,
  ) =>
    [...communityActivityQueryKeys.mine, userId, tabId, page, size] as const,
}

export function communityPostListOptions({
  category,
  page = 0,
  size = 32,
  userId = null,
}: GetPostsParams = {}) {
  return queryOptions({
    queryKey: [
      ...POST_LIST_QUERY_KEY,
      { userId, category: category ?? null, page, size },
    ],
    queryFn: () => getPosts({ category, page, size }),
    staleTime: 30_000,
    gcTime: 5 * 60_000,
    retry: false,
    enabled: userId !== null,
  })
}

export function communityPostDetailOptions(
  postId: number,
  userId: number | null,
) {
  return queryOptions<PostResponse>({
    queryKey: communityPostQueryKeys.detail(postId, userId),
    queryFn: () => getPost(postId),
  })
}

export function communityCommentReplyCountOptions(
  postId: number,
  commentId: number,
  userId: number | null,
) {
  return queryOptions({
    queryKey: communityPostQueryKeys.replyCount(postId, commentId, userId),
    queryFn: () => getCommentTotalReplyCount(postId, commentId),
  })
}

export function communityCommentRepliesOptions(
  postId: number,
  commentId: number,
  userId: number | null,
) {
  return queryOptions<CommentResponse[]>({
    queryKey: communityPostQueryKeys.replies(postId, commentId, userId),
    queryFn: () => getCommentReplies(postId, commentId),
  })
}

export function communityCommentsOptions(
  postId: number,
  userId: number | null,
) {
  return queryOptions<CommentResponse[]>({
    queryKey: communityPostQueryKeys.comments(postId, userId),
    queryFn: async () => {
      const comments = await getComments(postId)

      return Promise.all(
        comments.map(async (comment) => {
          try {
            const { count } = await queryClient.fetchQuery(
              communityCommentReplyCountOptions(
                postId,
                comment.commentId,
                userId,
              ),
            )

            return {
              ...comment,
              replyCount: Number.isSafeInteger(count)
                ? Math.max(0, count)
                : comment.replyCount,
            }
          } catch {
            return comment
          }
        }),
      )
    },
  })
}

export function communityPostStatsOptions(
  postId: number,
  userId: number | null,
) {
  return queryOptions<PostStatsResponse>({
    queryKey: communityPostQueryKeys.stats(postId, userId),
    queryFn: () => getPostStats(postId),
    staleTime: 0,
  })
}

export async function invalidateCommunityPostData(postId: number) {
  const queryKey = communityPostQueryKeys.forPost(postId)
  await queryClient.cancelQueries({ queryKey })
  await queryClient.invalidateQueries({ queryKey })
}

export async function invalidateCommunityPostLists() {
  // 변경 전 시작된 응답이 성공한 변경 이후의 캐시를 덮어쓰지 않도록 취소한다.
  await queryClient.cancelQueries({ queryKey: POST_LIST_QUERY_KEY })
  await queryClient.invalidateQueries({ queryKey: POST_LIST_QUERY_KEY })
}
