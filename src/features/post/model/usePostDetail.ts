import { useEffect, useState } from 'react'

import type { Post } from '@/entities/post'
import { getPost } from '@/entities/post'

import { toggleHeart } from '../api/heartPost'

/**
 * 게시글 상세 정보를 불러오고 좋아요 토글을 처리한다.
 *
 * @param postId 게시글 id (숫자가 아니면 조회하지 않는다)
 */
export const usePostDetail = (postId: number) => {
  const [post, setPost] = useState<Post | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isHeartPending, setIsHeartPending] = useState(false)
  const [reloadCount, setReloadCount] = useState(0)

  useEffect(() => {
    let isCurrent = true

    const loadPost = async () => {
      try {
        setIsLoading(true)

        if (Number.isNaN(postId)) {
          throw new Error('올바르지 않은 게시글 id')
        }

        const loaded = await getPost(postId)

        if (isCurrent) setPost(loaded)
      } catch {
        if (isCurrent) setPost(null)
      } finally {
        if (isCurrent) setIsLoading(false)
      }
    }

    void loadPost()

    return () => {
      isCurrent = false
    }
  }, [postId, reloadCount])

  const reloadPost = () => setReloadCount((count) => count + 1)

  /** 좋아요를 토글한다. 응답 전에 화면을 먼저 바꾸고 실패하면 되돌린다. */
  const toggleHeartOfPost = async () => {
    if (!post || isHeartPending) return

    const previous = post

    setPost({
      ...post,
      isHearted: !post.isHearted,
      likeCount: post.likeCount + (post.isHearted ? -1 : 1),
    })

    try {
      setIsHeartPending(true)
      await toggleHeart(post.postId)
    } catch {
      setPost(previous)
    } finally {
      setIsHeartPending(false)
    }
  }

  return { post, isLoading, isHeartPending, reloadPost, toggleHeartOfPost }
}
