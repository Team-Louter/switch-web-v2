import { apiClient } from '@/shared/api'
import type { PostCategory } from '@/shared/constants/community'

import type { Post, PostPage, PostPageParams } from '../model/types'

/**
 * 전체 게시글을 페이지 단위로 가져온다.
 *
 * @param params 0부터 시작하는 페이지 번호와 페이지 크기
 */
export const getPosts = async (params: PostPageParams): Promise<PostPage> => {
  const response = await apiClient.get<PostPage>('/posts', { params })
  return response.data
}

/**
 * 특정 카테고리의 게시글을 페이지 단위로 가져온다.
 *
 * @param category 조회할 카테고리
 * @param params 0부터 시작하는 페이지 번호와 페이지 크기
 */
export const getPostsByCategory = async (
  category: PostCategory,
  params: PostPageParams,
): Promise<PostPage> => {
  const response = await apiClient.get<PostPage>(`/posts/category/${category}`, {
    params,
  })
  return response.data
}

/**
 * 게시글 하나를 조회한다. (호출 시 서버에서 조회수가 증가한다)
 *
 * @param postId 게시글 id
 */
export const getPost = async (postId: number): Promise<Post> => {
  const response = await apiClient.get<Post>(`/posts/${postId}`)
  return response.data
}
