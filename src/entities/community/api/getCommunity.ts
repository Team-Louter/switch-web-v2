import { apiClient } from '@/shared/api'

import type {
  CommentResponse,
  GetPostsParams,
  PostPageResponse,
  PostResponse,
} from '../model/types'

const DEFAULT_POST_PAGE_SIZE = 8

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
  })

  return response.data
}

export async function getPost(postId: number): Promise<PostResponse> {
  const response = await apiClient.get<PostResponse>(`/posts/${postId}`)

  return response.data
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
