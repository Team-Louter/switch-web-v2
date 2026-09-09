import { apiClient } from '@/shared/api'

import type {
  CommentReplyCountResponse,
  CommentResponse,
  GetPostsParams,
  PostPageResponse,
  PostResponse,
  PostStatsResponse,
} from '../model/types'

const DEFAULT_POST_PAGE_SIZE = 16
const inFlightPostRequests = new Map<number, Promise<PostResponse>>()

export async function getPosts({
  category,
  page = 0,
  size = DEFAULT_POST_PAGE_SIZE,
}: GetPostsParams = {}): Promise<PostPageResponse> {
  const path = category ? `/posts/category/${category}` : '/posts'
  const response = await apiClient.get<PostPageResponse>(path, {
    params: {
      page,
      size,
      sort: ['pinned,desc', 'createdAt,desc'],
    },
    paramsSerializer: {
      indexes: null,
    },
  })

  return response.data
}

export async function getPost(postId: number): Promise<PostResponse> {
  const inFlightRequest = inFlightPostRequests.get(postId)

  if (inFlightRequest) {
    return inFlightRequest
  }

  const request = apiClient
    .get<PostResponse>(`/posts/${postId}`)
    .then((response) => response.data)
    .finally(() => {
      inFlightPostRequests.delete(postId)
    })

  inFlightPostRequests.set(postId, request)

  return request
}

export async function getComments(
  postId: number,
): Promise<CommentResponse[]> {
  const response = await apiClient.get<CommentResponse[]>(
    `/posts/${postId}/comments`,
  )

  return response.data
}

export async function getCommentReplies(
  postId: number,
  commentId: number,
): Promise<CommentResponse[]> {
  const response = await apiClient.get<CommentResponse[]>(
    `/posts/${postId}/comments/${commentId}/replies`,
  )

  return response.data
}

export async function getCommentTotalReplyCount(
  postId: number,
  commentId: number,
): Promise<CommentReplyCountResponse> {
  const response = await apiClient.get<CommentReplyCountResponse>(
    `/posts/${postId}/comments/${commentId}/total-reply-count`,
  )

  return response.data
}

export async function getPostStats(
  postId: number,
): Promise<PostStatsResponse> {
  const response = await apiClient.get<PostStatsResponse>(
    `/posts/${postId}/stats`,
  )

  return response.data
}
