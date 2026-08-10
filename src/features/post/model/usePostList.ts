import { useEffect, useState } from 'react'

import {
  ALL_POST_CATEGORY_TAB,
  POST_PAGE_SIZE,
  type PostCategory,
  type PostCategoryTab,
} from '@/shared/constants/community'
import type { Post } from '@/entities/post'
import { getPosts, getPostsByCategory } from '@/entities/post'

/**
 * 선택한 탭과 페이지에 맞는 게시글 목록을 불러온다.
 *
 * @param tab 선택된 카테고리 탭 (ALL이면 전체 글)
 * @param page 0부터 시작하는 페이지 번호
 */
export const usePostList = (tab: PostCategoryTab, page: number) => {
  const [posts, setPosts] = useState<Post[]>([])
  const [totalPages, setTotalPages] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let isCurrent = true

    const loadPosts = async () => {
      const params = { page, size: POST_PAGE_SIZE }

      try {
        setIsLoading(true)
        const postPage =
          tab === ALL_POST_CATEGORY_TAB
            ? await getPosts(params)
            : await getPostsByCategory(tab as PostCategory, params)

        if (!isCurrent) return

        setPosts(postPage.content ?? [])
        setTotalPages(postPage.totalPages ?? 0)
      } catch {
        if (!isCurrent) return

        setPosts([])
        setTotalPages(0)
      } finally {
        if (isCurrent) setIsLoading(false)
      }
    }

    void loadPosts()

    // 탭을 빠르게 바꿨을 때 이전 요청 결과가 덮어쓰지 않도록 막는다.
    return () => {
      isCurrent = false
    }
  }, [tab, page])

  return { posts, totalPages, isLoading }
}
