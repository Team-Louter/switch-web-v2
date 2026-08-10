import { useEffect, useState } from 'react'

import type { Comment } from '@/entities/comment'
import { getReplies, getRootComments } from '@/entities/comment'

import { createComment, deleteComment } from '../api/createComment'

type RepliesByCommentId = Record<number, Comment[]>

/**
 * 게시글의 댓글과 답글을 불러오고 작성 / 삭제를 처리한다.
 *
 * @param postId 게시글 id
 */
export const useComments = (postId: number) => {
  const [rootComments, setRootComments] = useState<Comment[]>([])
  const [repliesByCommentId, setRepliesByCommentId] =
    useState<RepliesByCommentId>({})
  const [isLoading, setIsLoading] = useState(true)
  const [reloadCount, setReloadCount] = useState(0)

  useEffect(() => {
    let isCurrent = true

    const loadComments = async () => {
      try {
        setIsLoading(true)
        const comments = await getRootComments(postId)

        // 답글이 있는 댓글만 골라 답글 목록을 함께 불러온다.
        const replyEntries = await Promise.all(
          comments
            .filter((comment) => comment.replyCount > 0)
            .map(async (comment) => {
              const replies = await getReplies(postId, comment.commentId)
              return [comment.commentId, replies] as const
            }),
        )

        if (!isCurrent) return

        setRootComments(comments)
        setRepliesByCommentId(Object.fromEntries(replyEntries))
      } catch {
        if (!isCurrent) return

        setRootComments([])
        setRepliesByCommentId({})
      } finally {
        if (isCurrent) setIsLoading(false)
      }
    }

    void loadComments()

    return () => {
      isCurrent = false
    }
  }, [postId, reloadCount])

  const reloadComments = () => setReloadCount((count) => count + 1)

  /**
   * 댓글 또는 답글을 작성한다.
   *
   * @param content 댓글 내용
   * @param isAnonymous 익명 여부
   * @param parentId 답글일 때의 부모 댓글 id
   */
  const submitComment = async (
    content: string,
    isAnonymous: boolean,
    parentId?: number,
  ) => {
    await createComment(postId, { content, isAnonymous, parentId })
    reloadComments()
  }

  const removeComment = async (commentId: number) => {
    await deleteComment(postId, commentId)
    reloadComments()
  }

  return {
    rootComments,
    repliesByCommentId,
    isLoading,
    submitComment,
    removeComment,
  }
}
