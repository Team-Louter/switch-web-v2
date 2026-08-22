import type { CommentResponse } from '@/entities/community'

export interface CommentTreeNode {
  comment: CommentResponse
  children: CommentTreeNode[]
}

export type CommunityReplySubmitHandler = (
  parentCommentId: number,
  content: string,
  isAnonymous: boolean,
) => Promise<string | null>

export type CommunityCommentUpdateHandler = (
  commentId: number,
  content: string,
) => Promise<string | null>

export type CommunityCommentDeleteHandler = (
  commentId: number,
) => Promise<string | null>

export type CommunityReplyLoadHandler = (
  parentCommentId: number,
) => Promise<string | null>

export function buildCommentTree(
  comments: CommentResponse[],
): CommentTreeNode[] {
  const roots: CommentTreeNode[] = []
  const ancestors: CommentTreeNode[] = []

  for (const comment of comments) {
    const node: CommentTreeNode = { comment, children: [] }
    const parent =
      comment.depth > 0 ? ancestors[comment.depth - 1] : undefined

    if (parent) {
      parent.children.push(node)
    } else {
      roots.push(node)
    }

    ancestors[comment.depth] = node
    ancestors.length = comment.depth + 1
  }

  return roots
}

export function appendReplyComment(
  comments: CommentResponse[],
  parentCommentId: number,
  reply: CommentResponse,
): CommentResponse[] {
  const parentIndex = comments.findIndex(
    (comment) => comment.commentId === parentCommentId,
  )

  if (parentIndex === -1) {
    return comments
  }

  const parentComment = comments[parentIndex]
  const commentsWithReplyCount = comments.map((comment) =>
    comment.commentId === parentCommentId
      ? { ...comment, replyCount: comment.replyCount + 1 }
      : comment,
  )
  let insertIndex = parentIndex + 1

  while (
    insertIndex < commentsWithReplyCount.length &&
    commentsWithReplyCount[insertIndex].depth > parentComment.depth
  ) {
    insertIndex += 1
  }

  const replyWithDepth = { ...reply, depth: parentComment.depth + 1 }

  return [
    ...commentsWithReplyCount.slice(0, insertIndex),
    replyWithDepth,
    ...commentsWithReplyCount.slice(insertIndex),
  ]
}

export function appendCommentReplies(
  comments: CommentResponse[],
  parentCommentId: number,
  replies: CommentResponse[],
): CommentResponse[] {
  const parentIndex = comments.findIndex(
    (comment) => comment.commentId === parentCommentId,
  )

  if (parentIndex === -1) {
    return comments
  }

  const existingCommentIds = new Set(
    comments.map((comment) => comment.commentId),
  )
  const newReplies = replies.filter(
    (reply) => !existingCommentIds.has(reply.commentId),
  )

  if (newReplies.length === 0) {
    return comments
  }

  const parentComment = comments[parentIndex]
  let insertIndex = parentIndex + 1

  while (
    insertIndex < comments.length &&
    comments[insertIndex].depth > parentComment.depth
  ) {
    insertIndex += 1
  }

  const repliesWithDepth = newReplies.map((reply) => ({
    ...reply,
    depth: parentComment.depth + 1,
  }))

  return [
    ...comments.slice(0, insertIndex),
    ...repliesWithDepth,
    ...comments.slice(insertIndex),
  ]
}
