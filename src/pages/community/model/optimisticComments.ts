import {
  appendReplyComment,
  decrementAncestorReplyCounts,
  type CommunityComment,
} from './commentTree'

export interface OptimisticCommentsState {
  postId: number
  comments: CommunityComment[]
}

export type OptimisticCommentAction =
  | { kind: 'add'; postId: number; comment: CommunityComment; parentId?: number }
  | { kind: 'discard'; postId: number; optimisticId: number }

export function reduceOptimisticComments(
  state: OptimisticCommentsState,
  action: OptimisticCommentAction,
): OptimisticCommentsState {
  if (state.postId !== action.postId) return state

  if (action.kind === 'discard') {
    return {
      ...state,
      comments: decrementAncestorReplyCounts(state.comments, action.optimisticId)
        .filter((comment) => comment.commentId !== action.optimisticId),
    }
  }

  // 다른 전송이 진행 중이어도 확정된 항목은 임시 항목과 중복되지 않는다.
  if (state.comments.some((comment) => comment.optimisticId === action.comment.optimisticId)) {
    return state
  }

  return {
    ...state,
    comments: action.parentId === undefined
      ? [...state.comments, action.comment]
      : appendReplyComment(state.comments, action.parentId, action.comment),
  }
}

export function getPendingReplyAncestorIds(comments: CommunityComment[]): ReadonlySet<number> {
  const ancestors: number[] = []
  const pendingAncestorIds = new Set<number>()

  for (const comment of comments) {
    ancestors.length = comment.depth
    if (comment.commentId < 0) {
      for (const ancestorId of ancestors) pendingAncestorIds.add(ancestorId)
    }
    ancestors[comment.depth] = comment.commentId
  }

  return pendingAncestorIds
}
