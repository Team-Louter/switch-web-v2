import {
  type KeyboardEvent,
  type SyntheticEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { isAxiosError } from 'axios';
import ReactMarkdown from 'react-markdown';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize, { defaultSchema } from 'rehype-sanitize';
import remarkGfm from 'remark-gfm';

import {
  formatCommunityDate,
  formatCommunityRelativeDate,
  getCommunityFileDownloadUrl,
  getCommentReplies,
  getCommentTotalReplyCount,
  getComments,
  getPost,
  getPostCategoryLabel,
  getPostStats,
  resolveCommunityAssetUrl,
  type CommentResponse,
  type PostResponse,
} from '@/entities/community';
import { getCurrentMember, getMember } from '@/entities/member';
import {
  createComment,
  deleteComment,
  deletePost,
  setPostPinned,
  togglePostHeart,
  updateComment,
} from '@/features/community';
import eyeIcon from '@/shared/assets/my/eye-icon.svg';
import fallbackProfileImage from '@/shared/assets/sidebar/profile.png';
import { parseBlockNotePostContent } from '@/shared/lib/blockNotePostContent';
import { renderCustomUnderlineMarkdown } from '@/shared/lib/markdown';
import { getNameStyleKey } from '@/shared/styles';
import { Button, ConfirmModal } from '@/shared/ui';
import type { ProfileAvatarEquippedItems } from '@/shared/ui';

import attachmentChevronIcon from '../assets/svg/attachment-chevron.svg';
import backChevronIcon from '../assets/svg/back-chevron.svg';
import commentOutlineIcon from '../assets/svg/comment-outline.svg';
import heartColoredIcon from '../assets/svg/heart-colored.svg';
import heartOutlineIcon from '../assets/svg/heart-outline.svg';
import kebabIcon from '../assets/svg/kebab.svg';
import paperclipIcon from '../assets/svg/paperclip.svg';
import pinIcon from '../assets/svg/pin-solid.svg';
import sendIcon from '../assets/svg/send.svg';
import {
  FLATTENED_TREE_DEPTH,
  REPLY_LOAD_DEPTH_INTERVAL,
  appendCommentReplies,
  appendReplyComment,
  buildCommentTree,
  decrementAncestorReplyCounts,
  type CommunityCommentDeleteHandler,
  type CommunityCommentUpdateHandler,
  type CommunityReplyLoadHandler,
  type CommunityReplySubmitHandler,
} from '../model/commentTree';
import { CommunityCommentBranch } from './CommunityCommentBranch';
import { CommunityPostBlockContent } from './CommunityPostBlockContent';
import { CommunityRollingNumber } from './CommunityRollingNumber';
import * as S from './CommunityDetailPage.style';

const markdownSanitizeSchema = {
  ...defaultSchema,
  tagNames: [...(defaultSchema.tagNames ?? []), 'u'],
  attributes: {
    ...defaultSchema.attributes,
    img: [...(defaultSchema.attributes?.img ?? []), 'alt', 'width'],
  },
};

const COMMENT_SKELETON_ITEMS = [0, 1, 2];
const FLOATING_CONFIRM_ANIMATION_MS = 180;
const TARGET_COMMENT_SEARCH_CONCURRENCY = 4;

function getTargetCommentId(hash: string): number | null {
  const match = /^#comment-(\d+)$/.exec(hash);

  if (!match) {
    return null;
  }

  const commentId = Number(match[1]);

  return Number.isSafeInteger(commentId) ? commentId : null;
}

interface TargetCommentSearchNode {
  parentCommentId: number;
  rootCommentId: number;
  path: CommentResponse[];
}

interface TargetCommentSearchResult {
  rootCommentId: number;
  commentPath: CommentResponse[];
}

async function findTargetCommentPath(
  postId: number,
  rootComments: CommentResponse[],
  targetCommentId: number,
): Promise<TargetCommentSearchResult | null> {
  const pendingNodes: TargetCommentSearchNode[] = rootComments
    .filter((comment) => comment.replyCount > 0)
    .map((comment) => ({
      parentCommentId: comment.commentId,
      rootCommentId: comment.commentId,
      path: [],
    }));
  const scheduledCommentIds = new Set(
    pendingNodes.map((node) => node.parentCommentId),
  );

  while (pendingNodes.length > 0) {
    const currentNodes = pendingNodes.splice(
      0,
      TARGET_COMMENT_SEARCH_CONCURRENCY,
    );
    const responses = await Promise.all(
      currentNodes.map(async (node) => {
        try {
          return {
            node,
            replies: await getCommentReplies(postId, node.parentCommentId),
          };
        } catch {
          return null;
        }
      }),
    );

    for (const response of responses) {
      if (!response) {
        continue;
      }

      const depth = response.node.path.length + 1;

      for (const reply of response.replies) {
        const replyWithDepth = { ...reply, depth };
        const commentPath = [...response.node.path, replyWithDepth];

        if (reply.commentId === targetCommentId) {
          return {
            rootCommentId: response.node.rootCommentId,
            commentPath,
          };
        }

        if (
          reply.replyCount > 0 &&
          !scheduledCommentIds.has(reply.commentId)
        ) {
          scheduledCommentIds.add(reply.commentId);
          pendingNodes.push({
            parentCommentId: reply.commentId,
            rootCommentId: response.node.rootCommentId,
            path: commentPath,
          });
        }
      }
    }
  }

  return null;
}

function appendTargetCommentPath(
  comments: CommentResponse[],
  rootCommentId: number,
  targetCommentPath: CommentResponse[],
): CommentResponse[] {
  let nextComments = comments;
  let parentCommentId = rootCommentId;

  for (const comment of targetCommentPath) {
    nextComments = appendCommentReplies(nextComments, parentCommentId, [
      comment,
    ]);
    parentCommentId = comment.commentId;
  }

  return nextComments;
}

async function withTotalReplyCount(
  postId: number,
  comment: CommentResponse,
): Promise<CommentResponse> {
  try {
    const { count } = await getCommentTotalReplyCount(
      postId,
      comment.commentId,
    );

    return {
      ...comment,
      replyCount: Number.isSafeInteger(count)
        ? Math.max(0, count)
        : comment.replyCount,
    };
  } catch {
    return comment;
  }
}

export function CommunityDetailPage() {
  const { hash } = useLocation();
  const navigate = useNavigate();
  const { postId: postIdParam } = useParams();
  const postId = Number(postIdParam);
  const [post, setPost] = useState<PostResponse | null>(null);
  const [comments, setComments] = useState<CommentResponse[]>([]);
  const [loadedReplyCommentIds, setLoadedReplyCommentIds] = useState<
    ReadonlySet<number>
  >(() => new Set());
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isPostNotFound, setIsPostNotFound] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);
  const [isCommentsLoading, setIsCommentsLoading] = useState(true);
  const [commentLoadError, setCommentLoadError] = useState<string | null>(null);
  const [commentReloadKey, setCommentReloadKey] = useState(0);
  const [commentContent, setCommentContent] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [isCommentSubmitting, setIsCommentSubmitting] = useState(false);
  const [isHeartMutating, setIsHeartMutating] = useState(false);
  const [currentMemberId, setCurrentMemberId] = useState<number | null>(null);
  const [currentMemberProfileImageUrl, setCurrentMemberProfileImageUrl] =
    useState<string | undefined>(undefined);
  const [memberEquippedItems, setMemberEquippedItems] = useState<
    Record<number, ProfileAvatarEquippedItems>
  >({});
  const [canManagePostPin, setCanManagePostPin] = useState(false);
  const [isPinMutating, setIsPinMutating] = useState(false);
  const [isPostDeleting, setIsPostDeleting] = useState(false);
  const [isPostDeleteConfirmOpen, setIsPostDeleteConfirmOpen] = useState(false);
  const [isPostMenuOpen, setIsPostMenuOpen] = useState(false);
  const [pendingCommentDeleteId, setPendingCommentDeleteId] = useState<
    number | null
  >(null);
  const [isCommentDeleteConfirmClosing, setIsCommentDeleteConfirmClosing] =
    useState(false);
  const [isCommentDeleting, setIsCommentDeleting] = useState(false);
  const [isAttachmentListOpen, setIsAttachmentListOpen] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [postActionError, setPostActionError] = useState<string | null>(null);
  const postMenuRef = useRef<HTMLDivElement>(null);
  const attachmentListRef = useRef<HTMLDivElement>(null);
  const isHeartMutatingRef = useRef(false);
  const postStatsRefreshVersionRef = useRef(0);
  const commentDeleteCloseTimerRef = useRef<number | null>(null);
  const targetCommentSearchKeyRef = useRef<string | null>(null);

  const canManagePost = currentMemberId === post?.userId;
  const canOpenPostMenu = canManagePostPin || canManagePost;
  const isPostActionMutating = isPinMutating || isPostDeleting;
  const isPostStatsPollingReady = post?.postId === postId;
  const replyAuthorProfileImageUrl = resolveCommunityAssetUrl(
    currentMemberProfileImageUrl,
  );
  const attachmentFiles =
    post?.files?.filter((file) => !file.fileType.startsWith('image/')) ?? [];
  const firstAttachment = attachmentFiles[0];
  const resolvePostMediaUrl = (mediaUrl: string | undefined): string => {
    const matchingFile = post?.files?.find(
      (file) => file.fileName === mediaUrl,
    );

    return (
      getCommunityFileDownloadUrl(matchingFile?.fileUrl ?? mediaUrl) ??
      mediaUrl ??
      ''
    );
  };
  const serializedPostContent = post?.postContent;
  const postBlocks = useMemo(
    () =>
      serializedPostContent
        ? parseBlockNotePostContent(serializedPostContent)
        : null,
    [serializedPostContent],
  );
  const commentTree = useMemo(() => buildCommentTree(comments), [comments]);
  const targetCommentId = getTargetCommentId(hash);
  const postEquippedItems = post?.isAnonymous
    ? undefined
    : post?.equippedItems ??
      (post ? memberEquippedItems[post.userId] : undefined);
  const postNameColor = postEquippedItems?.nameColor;
  const postNameStyleKey = getNameStyleKey(
    postNameColor?.styleKey ??
      postNameColor?.valueColor ??
      postNameColor?.value_color ??
      postNameColor?.valueText ??
      postNameColor?.itemName,
  );
  const postBorder = postEquippedItems?.border;
  const postBorderImageUrl =
    postBorder?.valueImageUrl ??
    postBorder?.imageUrl ??
    postBorder?.itemImageUrl ??
    postBorder?.originalImageUrl ??
    postBorder?.previewImageUrl ??
    postBorder?.thumbnailUrl;
  const hasPostCustomBorder = Boolean(postBorderImageUrl?.trim());

  const handleBackToList = () => {
    navigate('/community');
  };

  const handleRetry = () => {
    setReloadKey((currentKey) => currentKey + 1);
  };

  const handleCommentsRetry = () => {
    setCommentReloadKey((currentKey) => currentKey + 1);
  };

  const handleProfileImageError = (event: SyntheticEvent<HTMLImageElement>) => {
    event.currentTarget.onerror = null;
    event.currentTarget.src = fallbackProfileImage;
  };

  const handleHeartToggle = async () => {
    if (!post || isHeartMutating) {
      return;
    }

    postStatsRefreshVersionRef.current += 1;
    isHeartMutatingRef.current = true;
    setIsHeartMutating(true);
    setActionError(null);

    try {
      await togglePostHeart(post.postId);
      setPost((currentPost) => {
        if (!currentPost) {
          return currentPost;
        }

        const nextIsHearted = !currentPost.isHearted;

        return {
          ...currentPost,
          isHearted: nextIsHearted,
          likeCount: Math.max(
            0,
            currentPost.likeCount + (nextIsHearted ? 1 : -1),
          ),
        };
      });
    } catch {
      setActionError('좋아요 상태를 변경하지 못했습니다.');
    } finally {
      isHeartMutatingRef.current = false;
      setIsHeartMutating(false);
    }
  };

  const handlePinToggle = async () => {
    if (!post || !canManagePostPin || isPinMutating) {
      return;
    }

    const nextPinned = !post.pinned;

    setIsPinMutating(true);
    setIsPostMenuOpen(false);
    setPostActionError(null);

    try {
      await setPostPinned(post.postId, nextPinned);
      setPost((currentPost) =>
        currentPost ? { ...currentPost, pinned: nextPinned } : currentPost,
      );
    } catch {
      setPostActionError(
        nextPinned
          ? '게시글을 고정하지 못했습니다. 잠시 후 다시 시도해주세요.'
          : '게시글 고정을 해제하지 못했습니다. 잠시 후 다시 시도해주세요.',
      );
    } finally {
      setIsPinMutating(false);
    }
  };

  const handleCommentSubmit = async () => {
    const trimmedContent = commentContent.trim();

    if (!post || !trimmedContent || isCommentSubmitting) {
      return;
    }

    setIsCommentSubmitting(true);
    setActionError(null);

    try {
      const comment = await createComment(post.postId, {
        content: trimmedContent,
        isAnonymous,
      });

      setComments((currentComments) => [...currentComments, comment]);
      setPost((currentPost) =>
        currentPost
          ? { ...currentPost, commentCount: currentPost.commentCount + 1 }
          : currentPost,
      );
      setCommentContent('');
      setIsAnonymous(false);
    } catch {
      setActionError('댓글을 등록하지 못했습니다.');
    } finally {
      setIsCommentSubmitting(false);
    }
  };

  const handleReplySubmit: CommunityReplySubmitHandler = async (
    parentCommentId,
    content,
    replyIsAnonymous,
  ) => {
    const trimmedContent = content.trim();

    if (!post || !trimmedContent) {
      return '답글 내용을 입력해주세요.';
    }

    try {
      const replyComment = await createComment(post.postId, {
        content: trimmedContent,
        isAnonymous: replyIsAnonymous,
        parentId: parentCommentId,
      });
      setComments((currentComments) =>
        appendReplyComment(currentComments, parentCommentId, replyComment),
      );
      setPost((currentPost) =>
        currentPost
          ? { ...currentPost, commentCount: currentPost.commentCount + 1 }
          : currentPost,
      );

      return null;
    } catch {
      return '답글을 등록하지 못했습니다.';
    }
  };

  const handleRepliesLoad: CommunityReplyLoadHandler = async (
    parentCommentId,
  ) => {
    const parentComment = comments.find(
      (comment) => comment.commentId === parentCommentId,
    );

    if (!post || !parentComment) {
      return '답글을 불러오지 못했습니다.';
    }

    try {
      const replyPostId = post.postId;
      const maxReplyDepth =
        parentComment.depth >= FLATTENED_TREE_DEPTH
          ? Number.POSITIVE_INFINITY
          : parentComment.depth + REPLY_LOAD_DEPTH_INTERVAL;
      const requestedCommentIds = new Set<number>([parentCommentId]);

      async function loadReplyBranch(
        comment: CommentResponse,
        depth: number,
      ): Promise<CommentResponse[]> {
        const currentComment = {
          ...comment,
          depth,
        };

        if (depth >= maxReplyDepth) {
          return [currentComment];
        }

        requestedCommentIds.add(comment.commentId);
        const replies = await getCommentReplies(replyPostId, comment.commentId);
        const replyBranches = await Promise.all(
          replies.map((reply) => loadReplyBranch(reply, depth + 1)),
        );

        return [currentComment, ...replyBranches.flat()];
      }

      const replies = await getCommentReplies(replyPostId, parentCommentId);
      const replyBranches = await Promise.all(
        replies.map((reply) => loadReplyBranch(reply, parentComment.depth + 1)),
      );

      setComments((currentComments) =>
        appendCommentReplies(
          currentComments,
          parentCommentId,
          replyBranches.flat(),
        ),
      );
      setLoadedReplyCommentIds((currentIds) => {
        const nextIds = new Set(currentIds);

        for (const commentId of requestedCommentIds) {
          nextIds.add(commentId);
        }

        return nextIds;
      });

      return null;
    } catch {
      return '답글을 불러오지 못했습니다.';
    }
  };

  const handleCommentUpdate: CommunityCommentUpdateHandler = async (
    commentId,
    content,
  ) => {
    if (!post) {
      return '댓글을 수정하지 못했습니다.';
    }

    try {
      const updatedComment = await updateComment(post.postId, commentId, {
        content,
      });

      setComments((currentComments) =>
        currentComments.map((currentComment) =>
          currentComment.commentId === commentId
            ? { ...currentComment, ...updatedComment }
            : currentComment,
        ),
      );

      return null;
    } catch {
      return '댓글을 수정하지 못했습니다. 잠시 후 다시 시도해주세요.';
    }
  };

  const handleCommentDelete: CommunityCommentDeleteHandler = async (
    commentId,
  ) => {
    if (!post) {
      return '댓글을 삭제하지 못했습니다.';
    }

    try {
      await deleteComment(post.postId, commentId);
      setComments((currentComments) => {
        const commentIndex = currentComments.findIndex(
          (currentComment) => currentComment.commentId === commentId,
        );
        const deletedComment = currentComments[commentIndex];
        const hasLoadedChildComments =
          deletedComment !== undefined &&
          currentComments[commentIndex + 1]?.depth > deletedComment.depth;
        const hasLoadedReplyBranch =
          deletedComment !== undefined &&
          loadedReplyCommentIds.has(deletedComment.commentId);
        const hasChildComments =
          deletedComment !== undefined &&
          (hasLoadedChildComments ||
            (!hasLoadedReplyBranch && deletedComment.replyCount > 0));
        const commentsWithUpdatedReplyCounts = decrementAncestorReplyCounts(
          currentComments,
          commentId,
        );

        if (!hasChildComments) {
          return commentsWithUpdatedReplyCounts.filter(
            (currentComment) => currentComment.commentId !== commentId,
          );
        }

        return commentsWithUpdatedReplyCounts.map((currentComment) =>
          currentComment.commentId === commentId
            ? {
                ...currentComment,
                content: '삭제된 댓글입니다.',
                deleted: true,
              }
            : currentComment,
        );
      });
      setPost((currentPost) =>
        currentPost
          ? {
              ...currentPost,
              commentCount: Math.max(0, currentPost.commentCount - 1),
            }
          : currentPost,
      );

      return null;
    } catch {
      return '댓글을 삭제하지 못했습니다. 잠시 후 다시 시도해주세요.';
    }
  };

  const clearCommentDeleteCloseTimer = () => {
    if (commentDeleteCloseTimerRef.current !== null) {
      window.clearTimeout(commentDeleteCloseTimerRef.current);
      commentDeleteCloseTimerRef.current = null;
    }
  };

  const closeCommentDeleteConfirm = (force = false) => {
    if (pendingCommentDeleteId === null || (isCommentDeleting && !force)) {
      return;
    }

    clearCommentDeleteCloseTimer();
    setIsCommentDeleteConfirmClosing(true);
    commentDeleteCloseTimerRef.current = window.setTimeout(() => {
      setPendingCommentDeleteId(null);
      setIsCommentDeleteConfirmClosing(false);
      commentDeleteCloseTimerRef.current = null;
    }, FLOATING_CONFIRM_ANIMATION_MS);
  };

  const handleCommentDeleteRequest = (commentId: number) => {
    if (isCommentDeleting || pendingCommentDeleteId === commentId) {
      return;
    }

    if (pendingCommentDeleteId === null) {
      setPendingCommentDeleteId(commentId);
      return;
    }

    clearCommentDeleteCloseTimer();
    setIsCommentDeleteConfirmClosing(true);
    commentDeleteCloseTimerRef.current = window.setTimeout(() => {
      setPendingCommentDeleteId(commentId);
      setIsCommentDeleteConfirmClosing(false);
      commentDeleteCloseTimerRef.current = null;
    }, FLOATING_CONFIRM_ANIMATION_MS);
  };

  const handleCommentDeleteConfirm = async () => {
    if (pendingCommentDeleteId === null || isCommentDeleting) {
      return;
    }

    setIsCommentDeleting(true);
    const deleteError = await handleCommentDelete(pendingCommentDeleteId);
    setIsCommentDeleting(false);

    if (!deleteError) {
      closeCommentDeleteConfirm(true);
    }
  };

  useEffect(
    () => () => {
      if (commentDeleteCloseTimerRef.current !== null) {
        window.clearTimeout(commentDeleteCloseTimerRef.current);
      }
    },
    [],
  );

  useEffect(() => {
    let isCancelled = false;

    getMember()
      .then((members) => {
        if (isCancelled) {
          return;
        }

        const nextMemberEquippedItems: Record<
          number,
          ProfileAvatarEquippedItems
        > = {};

        members.forEach((member) => {
          if (member.equippedItems) {
            nextMemberEquippedItems[member.userId] = member.equippedItems;
          }
        });

        setMemberEquippedItems(nextMemberEquippedItems);
      })
      .catch(() => {
        // 프로필 효과 조회 실패 시 게시글과 댓글은 기본 프로필로 표시한다.
      });

    return () => {
      isCancelled = true;
    };
  }, []);

  const handleCommentKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      void handleCommentSubmit();
    }
  };

  const handlePostMenuKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Escape') {
      setIsPostMenuOpen(false);
      event.currentTarget.querySelector<HTMLButtonElement>('button')?.focus();
    }
  };

  const handlePostEdit = () => {
    if (!post || !canManagePost) {
      return;
    }

    setIsPostMenuOpen(false);
    navigate(`/community/${post.postId}/edit`);
  };

  const handlePostDeleteRequest = () => {
    if (!post || !canManagePost || isPostDeleting) {
      return;
    }

    setIsPostMenuOpen(false);
    setIsPostDeleteConfirmOpen(true);
  };

  const handlePostDelete = async () => {
    if (!post || !canManagePost || isPostDeleting) {
      return;
    }

    setIsPostDeleting(true);
    setPostActionError(null);

    try {
      await deletePost(post.postId);
      setIsPostDeleteConfirmOpen(false);
      navigate('/community', { replace: true });
    } catch {
      setPostActionError(
        '게시글을 삭제하지 못했습니다. 잠시 후 다시 시도해주세요.',
      );
    } finally {
      setIsPostDeleting(false);
    }
  };

  const handleAttachmentOpen = (fileKeyOrUrl: string) => {
    const attachmentUrl = getCommunityFileDownloadUrl(fileKeyOrUrl);

    if (attachmentUrl) {
      window.open(attachmentUrl, '_blank', 'noopener,noreferrer');
    }
  };

  useEffect(() => {
    let isCancelled = false;

    async function loadCurrentMember() {
      try {
        const currentMember = await getCurrentMember();
        const canManagePin =
          currentMember.role === 'LEADER' || currentMember.role === 'MENTOR';

        if (!isCancelled) {
          setCurrentMemberId(currentMember.userId);
          setCurrentMemberProfileImageUrl(currentMember.profileImageUrl);
          setCanManagePostPin(canManagePin);
        }
      } catch {
        if (!isCancelled) {
          setCurrentMemberId(null);
          setCurrentMemberProfileImageUrl(undefined);
          setCanManagePostPin(false);
        }
      }
    }

    void loadCurrentMember();

    return () => {
      isCancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!isPostMenuOpen) {
      return;
    }

    function handleOutsidePointerDown(event: PointerEvent) {
      if (
        event.target instanceof Node &&
        !postMenuRef.current?.contains(event.target)
      ) {
        setIsPostMenuOpen(false);
      }
    }

    document.addEventListener('pointerdown', handleOutsidePointerDown);

    return () => {
      document.removeEventListener('pointerdown', handleOutsidePointerDown);
    };
  }, [isPostMenuOpen]);

  useEffect(() => {
    if (!isAttachmentListOpen) {
      return;
    }

    function handleOutsidePointerDown(event: PointerEvent) {
      if (
        event.target instanceof Node &&
        !attachmentListRef.current?.contains(event.target)
      ) {
        setIsAttachmentListOpen(false);
      }
    }

    document.addEventListener('pointerdown', handleOutsidePointerDown);

    return () => {
      document.removeEventListener('pointerdown', handleOutsidePointerDown);
    };
  }, [isAttachmentListOpen]);

  useEffect(() => {
    let isCancelled = false;

    async function loadPost() {
      if (!Number.isSafeInteger(postId) || postId <= 0) {
        setLoadError('삭제되었거나 존재하지 않는 게시글입니다.');
        setIsPostNotFound(true);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setLoadError(null);
      setIsPostNotFound(false);

      try {
        const postResponse = await getPost(postId);

        if (!isCancelled) {
          setPost(postResponse);
        }
      } catch (error) {
        if (!isCancelled) {
          const isNotFound =
            isAxiosError(error) && error.response?.status === 404;

          setIsPostNotFound(isNotFound);
          setLoadError(
            isNotFound
              ? '삭제되었거나 존재하지 않는 게시글입니다.'
              : '게시글을 불러오지 못했습니다.',
          );
          setPost(null);
          setComments([]);
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    }

    void loadPost();

    return () => {
      isCancelled = true;
    };
  }, [postId, reloadKey]);

  useEffect(() => {
    if (!isPostStatsPollingReady) {
      return;
    }

    let isCancelled = false;

    async function refreshPostStats() {
      const refreshVersion = postStatsRefreshVersionRef.current;

      try {
        const refreshedStats = await getPostStats(postId);

        if (
          isCancelled ||
          isHeartMutatingRef.current ||
          refreshVersion !== postStatsRefreshVersionRef.current
        ) {
          return;
        }

        setPost((currentPost) =>
          currentPost
            ? {
                ...currentPost,
                likeCount: refreshedStats.likeCount,
                viewers: refreshedStats.viewers,
              }
            : currentPost,
        );
      } catch {
        // 반응 수 갱신 실패는 게시글 조회 화면을 방해하지 않는다.
      }
    }

    const refreshIntervalId = window.setInterval(() => {
      void refreshPostStats();
    }, 5_000);

    return () => {
      isCancelled = true;
      window.clearInterval(refreshIntervalId);
    };
  }, [isPostStatsPollingReady, postId]);

  useEffect(() => {
    let isCancelled = false;

    async function loadComments() {
      if (!Number.isSafeInteger(postId) || postId <= 0) {
        setComments([]);
        setCommentLoadError(null);
        setIsCommentsLoading(false);
        return;
      }

      setIsCommentsLoading(true);
      setCommentLoadError(null);
      setComments([]);
      setLoadedReplyCommentIds(new Set());

      try {
        const rootComments = await getComments(postId);
        const commentsWithReplyCounts = await Promise.all(
          rootComments.map((comment) => withTotalReplyCount(postId, comment)),
        );

        if (!isCancelled) {
          setComments(
            commentsWithReplyCounts.map((comment) => ({
              ...comment,
              depth: 0,
            })),
          );
        }
      } catch {
        if (!isCancelled) {
          setComments([]);
          setCommentLoadError('댓글을 불러오지 못했습니다.');
        }
      } finally {
        if (!isCancelled) {
          setIsCommentsLoading(false);
        }
      }
    }

    void loadComments();

    return () => {
      isCancelled = true;
    };
  }, [postId, reloadKey, commentReloadKey]);

  useEffect(() => {
    if (
      isCommentsLoading ||
      targetCommentId === null ||
      !Number.isSafeInteger(postId) ||
      postId <= 0 ||
      comments.some((comment) => comment.commentId === targetCommentId)
    ) {
      return;
    }

    const targetId = targetCommentId;
    const searchKey = `${postId}:${targetId}:${commentReloadKey}`;

    if (targetCommentSearchKeyRef.current === searchKey) {
      return;
    }

    let isCancelled = false;

    async function loadTargetCommentPath() {
      const rootComments = comments.filter((comment) => comment.depth === 0);

      const targetCommentResult = await findTargetCommentPath(
        postId,
        rootComments,
        targetId,
      );

      if (isCancelled || !targetCommentResult) {
        return;
      }

      targetCommentSearchKeyRef.current = searchKey;
      setComments((currentComments) =>
        appendTargetCommentPath(
          currentComments,
          targetCommentResult.rootCommentId,
          targetCommentResult.commentPath,
        ),
      );
      setLoadedReplyCommentIds((currentIds) => {
        const nextIds = new Set(currentIds);
        const loadedCommentIds = [
          targetCommentResult.rootCommentId,
          ...targetCommentResult.commentPath
            .slice(0, -1)
            .map((comment) => comment.commentId),
        ];

        for (const commentId of loadedCommentIds) {
          nextIds.add(commentId);
        }

        return nextIds;
      });
    }

    void loadTargetCommentPath();

    return () => {
      isCancelled = true;

      if (targetCommentSearchKeyRef.current === searchKey) {
        targetCommentSearchKeyRef.current = null;
      }
    };
  }, [
    comments,
    commentReloadKey,
    isCommentsLoading,
    postId,
    targetCommentId,
  ]);

  useEffect(() => {
    if (isCommentsLoading || targetCommentId === null) {
      return;
    }

    document
      .getElementById(`comment-${targetCommentId}`)
      ?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, [commentTree, isCommentsLoading, targetCommentId]);

  return (
    <S.Page>
      <S.Content>
        <S.BackButton type="button" onClick={handleBackToList}>
          <S.BackIcon src={backChevronIcon} alt="" />
          목록 보기
        </S.BackButton>

        {isLoading && (
          <S.DetailSkeleton
            role="status"
            aria-label="게시글을 불러오는 중입니다."
          >
            <S.SkeletonGroup aria-hidden="true">
              <S.SkeletonBlock $width="80px" $height={29} />
              <S.SkeletonMetaRow>
                <S.SkeletonBlock $width="56%" $height={33} />
                <S.SkeletonBlock $width="240px" $height={22} />
              </S.SkeletonMetaRow>
              <S.Divider />
            </S.SkeletonGroup>

            <S.SkeletonGroup aria-hidden="true">
              <S.SkeletonBlock $width="92%" $height={21} />
              <S.SkeletonBlock $width="78%" $height={21} />
              <S.SkeletonBlock $width="64%" $height={21} />
            </S.SkeletonGroup>

            <S.SkeletonGroup aria-hidden="true">
              <S.SkeletonBlock $width="310px" $height={36} />
              <S.Divider />
            </S.SkeletonGroup>

            <S.SkeletonGroup aria-hidden="true">
              <S.SkeletonBlock $width="48px" $height={24} />
              <S.SkeletonBlock $height={52} />
              <S.SkeletonBlock $width="52%" $height={54} />
              <S.SkeletonBlock $width="46%" $height={54} />
            </S.SkeletonGroup>
          </S.DetailSkeleton>
        )}

        {!isLoading && loadError && (
          <S.PageStatus role="alert">
            <S.StatusMessage>{loadError}</S.StatusMessage>
            <Button
              size="sm"
              variant="neutral"
              onClick={isPostNotFound ? handleBackToList : handleRetry}
            >
              {isPostNotFound ? '목록으로 돌아가기' : '다시 시도'}
            </Button>
          </S.PageStatus>
        )}

        {!isLoading && !loadError && post && (
          <>
            <S.Article>
              <S.ArticleHeading>
                <S.TitleBlock>
                  <S.CategoryBadge>
                    {getPostCategoryLabel(post.category)}
                  </S.CategoryBadge>
                  <S.TitleRow>
                    <S.Title $isPinned={post.pinned}>
                      <S.PinnedTitleIcon
                        $isPinned={post.pinned}
                        src={pinIcon}
                        alt={post.pinned ? '고정된 게시글' : ''}
                        aria-hidden={!post.pinned}
                      />
                      {post.postTitle}
                    </S.Title>
                    <S.PostActions>
                      <S.PostMeta>
                        <S.PostAuthor>
                          <S.PostAuthorImage
                            alt={`${post.userName} 프로필`}
                            $hasBorder={hasPostCustomBorder}
                            equippedItems={postEquippedItems}
                            imageUrl={
                              resolveCommunityAssetUrl(
                                post.userProfileImageUrl,
                              ) ?? fallbackProfileImage
                            }
                            onImageError={handleProfileImageError}
                            size={22}
                          />
                          <S.PostAuthorName styleKey={postNameStyleKey}>
                            {post.userName}
                          </S.PostAuthorName>
                        </S.PostAuthor>
                        <S.MetaDot aria-hidden="true" />
                        <S.PostDate
                          dateTime={post.createdAt}
                          title={formatCommunityDate(post.createdAt)}
                        >
                          {formatCommunityRelativeDate(post.createdAt)}
                        </S.PostDate>
                        {canOpenPostMenu && (
                          <S.PostMenu
                            ref={postMenuRef}
                            onKeyDown={handlePostMenuKeyDown}
                          >
                            <S.PostMenuButton
                              type="button"
                              aria-label="게시글 관리 메뉴"
                              aria-expanded={isPostMenuOpen}
                              aria-haspopup="menu"
                              disabled={isPostActionMutating}
                              onClick={() =>
                                setIsPostMenuOpen((isOpen) => !isOpen)
                              }
                            >
                              <S.PostMenuIcon src={kebabIcon} alt="" />
                            </S.PostMenuButton>
                            {isPostMenuOpen && (
                              <S.PostMenuPanel
                                role="menu"
                                aria-label="게시글 관리"
                              >
                                {canManagePostPin && (
                                  <S.PostMenuItem
                                    type="button"
                                    role="menuitem"
                                    disabled={isPostActionMutating}
                                    onClick={handlePinToggle}
                                  >
                                    {post.pinned ? '고정 해제' : '고정하기'}
                                  </S.PostMenuItem>
                                )}
                                {canManagePostPin && canManagePost && (
                                  <S.PostMenuDivider aria-hidden="true" />
                                )}
                                {canManagePost && (
                                  <>
                                    <S.PostMenuItem
                                      type="button"
                                      role="menuitem"
                                      disabled={isPostActionMutating}
                                      onClick={handlePostEdit}
                                    >
                                      수정하기
                                    </S.PostMenuItem>
                                    <S.PostMenuDivider aria-hidden="true" />
                                    <S.PostMenuItem
                                      type="button"
                                      role="menuitem"
                                      $danger
                                      disabled={isPostActionMutating}
                                      onClick={handlePostDeleteRequest}
                                    >
                                      {isPostDeleting ? '삭제 중' : '삭제하기'}
                                    </S.PostMenuItem>
                                  </>
                                )}
                              </S.PostMenuPanel>
                            )}
                          </S.PostMenu>
                        )}
                      </S.PostMeta>
                      {postActionError && (
                        <S.PinActionError role="alert">
                          {postActionError}
                        </S.PinActionError>
                      )}
                    </S.PostActions>
                  </S.TitleRow>
                </S.TitleBlock>
                <S.Divider />
              </S.ArticleHeading>

              <S.BodyText>
                {postBlocks ? (
                  <CommunityPostBlockContent
                    key={post.postId}
                    blocks={postBlocks}
                    files={post.files ?? []}
                  />
                ) : (
                  <ReactMarkdown
                    components={{
                      img: ({ src, alt, ...imageProps }) => (
                        <img
                          {...imageProps}
                          src={resolvePostMediaUrl(src)}
                          alt={alt ?? ''}
                        />
                      ),
                    }}
                    remarkPlugins={[remarkGfm]}
                    rehypePlugins={[
                      rehypeRaw,
                      [rehypeSanitize, markdownSanitizeSchema],
                    ]}
                  >
                    {renderCustomUnderlineMarkdown(post.postContent)}
                  </ReactMarkdown>
                )}
              </S.BodyText>
            </S.Article>

            <S.Engagement aria-label="게시글 반응과 첨부파일">
              <S.EngagementRow>
                <S.StatGroup role="group" aria-label="게시글 반응">
                  <S.HeartButton
                    type="button"
                    aria-pressed={post.isHearted}
                    disabled={isHeartMutating}
                    onClick={handleHeartToggle}
                  >
                    <S.StatIcon
                      src={post.isHearted ? heartColoredIcon : heartOutlineIcon}
                      alt="좋아요"
                    />
                    <CommunityRollingNumber value={post.likeCount} />
                  </S.HeartButton>
                  <S.Stat>
                    <S.StatIcon src={commentOutlineIcon} alt="댓글" />
                    {post.commentCount}
                  </S.Stat>
                  <S.Stat>
                    <S.StatIcon src={eyeIcon} alt="조회" />
                    <CommunityRollingNumber value={post.viewers} />
                  </S.Stat>
                </S.StatGroup>

                {firstAttachment && (
                  <S.AttachmentArea ref={attachmentListRef}>
                    <S.AttachmentToggle
                      type="button"
                      aria-controls={`post-${post.postId}-attachments`}
                      aria-expanded={isAttachmentListOpen}
                      onClick={() =>
                        setIsAttachmentListOpen((isOpen) => !isOpen)
                      }
                    >
                      <S.AttachmentLabel>
                        <S.AttachmentIcon src={paperclipIcon} alt="" />
                        <S.AttachmentText>첨부 파일 “</S.AttachmentText>
                        <S.AttachmentSummaryFileName
                          title={firstAttachment.fileName}
                        >
                          {firstAttachment.fileName}
                        </S.AttachmentSummaryFileName>
                        <S.AttachmentText>
                          ”
                          {attachmentFiles.length > 1 &&
                            ` 외 ${attachmentFiles.length - 1}개`}
                        </S.AttachmentText>
                      </S.AttachmentLabel>
                      <S.AttachmentDivider aria-hidden="true" />
                      <S.AttachmentChevron
                        $isOpen={isAttachmentListOpen}
                        src={attachmentChevronIcon}
                        alt=""
                      />
                    </S.AttachmentToggle>
                    <S.AttachmentPanel
                      id={`post-${post.postId}-attachments`}
                      $isOpen={isAttachmentListOpen}
                      aria-hidden={!isAttachmentListOpen}
                    >
                      <S.AttachmentFileList>
                        {attachmentFiles.map((file) => (
                          <S.AttachmentFileButton
                            key={file.fileId}
                            type="button"
                            tabIndex={isAttachmentListOpen ? 0 : -1}
                            onClick={() => handleAttachmentOpen(file.fileUrl)}
                          >
                            <S.AttachmentFileIcon src={paperclipIcon} alt="" />
                            <S.AttachmentFileName>
                              {file.fileName}
                            </S.AttachmentFileName>
                          </S.AttachmentFileButton>
                        ))}
                      </S.AttachmentFileList>
                    </S.AttachmentPanel>
                  </S.AttachmentArea>
                )}
              </S.EngagementRow>
              <S.Divider />
            </S.Engagement>

            <S.Comments>
              <S.CommentComposer>
                <S.CommentForm>
                  <S.CommentHeading>댓글</S.CommentHeading>
                  <S.CommentInputRow>
                    <S.CommentInput
                      type="text"
                      aria-label="댓글 내용"
                      placeholder="어떤 댓글을 남겨볼까요?"
                      value={commentContent}
                      disabled={isCommentSubmitting}
                      onChange={(event) =>
                        setCommentContent(event.target.value)
                      }
                      onKeyDown={handleCommentKeyDown}
                    />
                    <S.SendButton
                      type="button"
                      aria-label="댓글 등록"
                      disabled={!commentContent.trim() || isCommentSubmitting}
                      onClick={handleCommentSubmit}
                    >
                      <S.SendIcon src={sendIcon} alt="" />
                    </S.SendButton>
                  </S.CommentInputRow>
                </S.CommentForm>
                <S.AnonymousLabel>
                  <S.AnonymousCheckbox
                    type="checkbox"
                    checked={isAnonymous}
                    disabled={isCommentSubmitting}
                    onChange={(event) => setIsAnonymous(event.target.checked)}
                  />
                  익명으로 게시
                </S.AnonymousLabel>
                {actionError && (
                  <S.ActionError role="alert">{actionError}</S.ActionError>
                )}
              </S.CommentComposer>

              <S.CommentList role="region" aria-label="댓글 목록">
                {isCommentsLoading && (
                  <S.CommentSkeletonList
                    role="status"
                    aria-label="댓글을 불러오는 중입니다."
                  >
                    {COMMENT_SKELETON_ITEMS.map((item) => (
                      <S.CommentSkeletonItem key={item} aria-hidden="true">
                        <S.CommentSkeletonAvatar $height={32} />
                        <S.CommentSkeletonContent>
                          <S.CommentSkeletonMeta>
                            <S.SkeletonBlock $width="112px" $height={16} />
                            <S.SkeletonBlock $width="84px" $height={14} />
                          </S.CommentSkeletonMeta>
                          <S.SkeletonBlock $width="68%" $height={18} />
                          <S.SkeletonBlock $width="44%" $height={18} />
                          <S.CommentSkeletonAction $height={14} />
                        </S.CommentSkeletonContent>
                      </S.CommentSkeletonItem>
                    ))}
                  </S.CommentSkeletonList>
                )}
                {!isCommentsLoading && commentLoadError && (
                  <S.CommentStatus role="alert">
                    {commentLoadError}
                    <Button
                      size="sm"
                      variant="neutral"
                      onClick={handleCommentsRetry}
                    >
                      다시 시도
                    </Button>
                  </S.CommentStatus>
                )}
                {commentTree.map((node) => (
                  <CommunityCommentBranch
                    key={node.comment.commentId}
                    node={node}
                    targetCommentId={targetCommentId}
                    onProfileImageError={handleProfileImageError}
                    onReplySubmit={handleReplySubmit}
                    onRepliesLoad={handleRepliesLoad}
                    loadedReplyCommentIds={loadedReplyCommentIds}
                    onCommentUpdate={handleCommentUpdate}
                    onCommentDeleteRequest={handleCommentDeleteRequest}
                    onCommentEditStart={closeCommentDeleteConfirm}
                    currentMemberId={currentMemberId}
                    replyAuthorProfileImageUrl={replyAuthorProfileImageUrl}
                    memberEquippedItemsByUserId={memberEquippedItems}
                  />
                ))}
              </S.CommentList>
            </S.Comments>
          </>
        )}
        {isPostDeleteConfirmOpen && post && (
          <ConfirmModal
            title="게시글을 삭제할까요?"
            placement="bottom-right"
            description="삭제한 게시글은 복구할 수 없습니다."
            confirmLabel="삭제"
            isConfirming={isPostDeleting}
            onCancel={() => setIsPostDeleteConfirmOpen(false)}
            onConfirm={() => void handlePostDelete()}
          />
        )}
        {pendingCommentDeleteId !== null && (
          <ConfirmModal
            placement="bottom-right"
            title="댓글을 삭제할까요?"
            description="삭제한 댓글은 복구할 수 없습니다."
            confirmLabel="삭제"
            isConfirming={isCommentDeleting}
            isClosing={isCommentDeleteConfirmClosing}
            onCancel={closeCommentDeleteConfirm}
            onConfirm={() => void handleCommentDeleteConfirm()}
          />
        )}
      </S.Content>
    </S.Page>
  );
}
