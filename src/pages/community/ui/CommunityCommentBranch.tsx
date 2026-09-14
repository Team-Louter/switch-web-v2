import {
  type KeyboardEvent,
  type SyntheticEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

import {
  formatCommunityDate,
  formatCommunityRelativeDate,
  resolveCommunityAssetUrl,
} from '@/entities/community';
import fallbackProfileImage from '@/shared/assets/sidebar/profile.png';

import anonymousProfileImage from '../assets/images/anonymousProfile.png';
import {
  FLATTENED_TREE_DEPTH,
  type CommentTreeNode,
  type CommunityCommentUpdateHandler,
  type CommunityReplyLoadHandler,
  type CommunityReplySubmitHandler,
} from '../model/commentTree';
import kebabIcon from '../assets/svg/kebab.svg';
import * as S from './CommunityCommentBranch.style';

interface ReplyLoadingSkeletonProps {
  isWithinReplies?: boolean;
}

interface CommunityCommentBranchProps {
  node: CommentTreeNode;
  targetCommentId: number | null;
  onProfileImageError: (event: SyntheticEvent<HTMLImageElement>) => void;
  onReplySubmit: CommunityReplySubmitHandler;
  onRepliesLoad: CommunityReplyLoadHandler;
  onCommentUpdate: CommunityCommentUpdateHandler;
  onCommentDeleteRequest: (commentId: number) => void;
  onCommentEditStart: () => void;
  currentMemberId: number | null;
  loadedReplyCommentIds: ReadonlySet<number>;
  replyAuthorProfileImageUrl?: string;
  replyToUserName?: string;
  isExpandedByAncestor?: boolean;
  hasNextSibling?: boolean;
}

function ReplyLoadingSkeleton({
  isWithinReplies = false,
}: ReplyLoadingSkeletonProps) {
  return (
    <S.ReplyLoadSkeleton
      $isWithinReplies={isWithinReplies}
      role="status"
      aria-label="답글을 불러오는 중입니다."
    >
      <S.ReplyLoadSkeletonAvatar aria-hidden="true" />
      <S.ReplyLoadSkeletonContent aria-hidden="true">
        <S.ReplyLoadSkeletonLine $width="42%" />
        <S.ReplyLoadSkeletonLine $width="76%" />
      </S.ReplyLoadSkeletonContent>
    </S.ReplyLoadSkeleton>
  );
}

function hasTargetComment(
  node: CommentTreeNode,
  targetCommentId: number,
): boolean {
  return (
    node.comment.commentId === targetCommentId ||
    node.children.some((child) => hasTargetComment(child, targetCommentId))
  );
}

export function CommunityCommentBranch({
  node,
  targetCommentId,
  onProfileImageError,
  onReplySubmit,
  onRepliesLoad,
  onCommentUpdate,
  onCommentDeleteRequest,
  onCommentEditStart,
  currentMemberId,
  loadedReplyCommentIds,
  replyAuthorProfileImageUrl,
  replyToUserName,
  isExpandedByAncestor = false,
  hasNextSibling = false,
}: CommunityCommentBranchProps) {
  const { comment } = node;
  const [isRepliesOpen, setIsRepliesOpen] = useState(false);
  const [isReplyComposerOpen, setIsReplyComposerOpen] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const [isReplyAnonymous, setIsReplyAnonymous] = useState(false);
  const [isReplySubmitting, setIsReplySubmitting] = useState(false);
  const [replySubmitError, setReplySubmitError] = useState<string | null>(null);
  const [isRepliesLoading, setIsRepliesLoading] = useState(false);
  const [replyLoadError, setReplyLoadError] = useState<string | null>(null);
  const [hasReplyLoadAttempted, setHasReplyLoadAttempted] = useState(
    loadedReplyCommentIds.has(comment.commentId) || node.children.length > 0,
  );
  const [isCommentMenuOpen, setIsCommentMenuOpen] = useState(false);
  const [isCommentEditing, setIsCommentEditing] = useState(false);
  const [editedCommentContent, setEditedCommentContent] = useState('');
  const [isCommentMutating, setIsCommentMutating] = useState(false);
  const commentMenuRef = useRef<HTMLDivElement>(null);
  const targetAutoLoadIdRef = useRef<number | null>(null);

  const loadedReplyCount = node.children.length;
  const totalReplyCount = Math.max(0, comment.replyCount);
  const hasReplies = totalReplyCount > 0 || loadedReplyCount > 0;
  const canManageComment =
    !comment.deleted && currentMemberId === comment.userId;
  const isReplyLoadKnown = loadedReplyCommentIds.has(comment.commentId);
  const requiresInitialReplyLoad =
    hasReplies &&
    !hasReplyLoadAttempted &&
    !isReplyLoadKnown &&
    loadedReplyCount === 0;
  const hasCollapseControl =
    !isExpandedByAncestor || comment.depth === FLATTENED_TREE_DEPTH;
  const shouldShowReplies =
    hasReplies && (!hasCollapseControl || isRepliesOpen);
  const containsTargetComment =
    targetCommentId !== null && hasTargetComment(node, targetCommentId);
  const shouldFlattenChildTree = comment.depth > FLATTENED_TREE_DEPTH;
  const isFlattenedTree = comment.depth > FLATTENED_TREE_DEPTH;
  const hasCommonConnector = comment.depth === FLATTENED_TREE_DEPTH;
  const repliesToggleLabel = isRepliesOpen
    ? '답글 숨기기'
    : comment.depth >= FLATTENED_TREE_DEPTH
      ? '답글 더보기'
      : `답글 ${totalReplyCount}개`;
  const repliesLoadLabel = replyLoadError
    ? '답글 다시 불러오기'
    : '답글 더보기';

  const handleReplyComposerOpen = () => {
    setIsReplyComposerOpen(true);
    setReplySubmitError(null);
  };

  const handleReplyComposerCancel = () => {
    setIsReplyComposerOpen(false);
    setReplyContent('');
    setIsReplyAnonymous(false);
    setReplySubmitError(null);
  };

  const handleReplyFormSubmit = async () => {
    const trimmedContent = replyContent.trim();

    if (!trimmedContent || isReplySubmitting) {
      return;
    }

    setIsReplySubmitting(true);
    setReplySubmitError(null);

    const submitError = await onReplySubmit(
      comment.commentId,
      trimmedContent,
      isReplyAnonymous,
    );

    if (submitError) {
      setReplySubmitError(submitError);
    } else {
      setIsRepliesOpen(true);
      setReplyLoadError(null);
      setHasReplyLoadAttempted(true);
      handleReplyComposerCancel();
    }

    setIsReplySubmitting(false);
  };

  const handleRepliesLoad = useCallback(async () => {
    if (isRepliesLoading) {
      return;
    }

    setIsRepliesLoading(true);
    setReplyLoadError(null);

    const loadError = await onRepliesLoad(comment.commentId);

    setReplyLoadError(loadError);
    if (!loadError) {
      setHasReplyLoadAttempted(true);
      setIsRepliesOpen(true);
    }
    setIsRepliesLoading(false);
  }, [comment.commentId, isRepliesLoading, onRepliesLoad]);

  const handleReplyKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      void handleReplyFormSubmit();
    }
  };

  const handleCommentEditStart = () => {
    onCommentEditStart();
    setEditedCommentContent(comment.content);
    setIsCommentEditing(true);
    setIsCommentMenuOpen(false);
  };

  const handleCommentEditCancel = () => {
    setEditedCommentContent('');
    setIsCommentEditing(false);
  };

  const handleCommentEditSubmit = async () => {
    const trimmedContent = editedCommentContent.trim();

    if (!trimmedContent || isCommentMutating) {
      return;
    }

    setIsCommentMutating(true);

    const actionError = await onCommentUpdate(
      comment.commentId,
      trimmedContent,
    );

    if (!actionError) {
      setIsCommentEditing(false);
      setEditedCommentContent('');
    }

    setIsCommentMutating(false);
  };

  const handleCommentEditKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      void handleCommentEditSubmit();
    }
  };

  const handleCommentDeleteRequest = () => {
    if (isCommentMutating) {
      return;
    }

    setIsCommentMenuOpen(false);
    onCommentDeleteRequest(comment.commentId);
  };

  const handleCommentMenuKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Escape') {
      setIsCommentMenuOpen(false);
      event.currentTarget.querySelector<HTMLButtonElement>('button')?.focus();
    }
  };

  useEffect(() => {
    if (targetCommentId === null) {
      targetAutoLoadIdRef.current = null;
      return;
    }

    if (
      targetAutoLoadIdRef.current === targetCommentId ||
      containsTargetComment ||
      !requiresInitialReplyLoad ||
      isRepliesLoading
    ) {
      return;
    }

    targetAutoLoadIdRef.current = targetCommentId;
    void handleRepliesLoad();
  }, [
    containsTargetComment,
    handleRepliesLoad,
    isRepliesLoading,
    requiresInitialReplyLoad,
    targetCommentId,
  ]);

  useEffect(() => {
    if (!isCommentMenuOpen) {
      return;
    }

    function handleOutsidePointerDown(event: PointerEvent) {
      if (
        event.target instanceof Node &&
        !commentMenuRef.current?.contains(event.target)
      ) {
        setIsCommentMenuOpen(false);
      }
    }

    document.addEventListener('pointerdown', handleOutsidePointerDown);

    return () => {
      document.removeEventListener('pointerdown', handleOutsidePointerDown);
    };
  }, [isCommentMenuOpen]);

  return (
    <S.CommentTreeNode
      $hasNextSibling={hasNextSibling}
      $isFlattened={isFlattenedTree}
    >
      <S.CommentRow
        id={`comment-${comment.commentId}`}
        $isReply={comment.depth > 0}
        $isFlattened={isFlattenedTree}
        $hasFlattenedChildren={shouldFlattenChildTree}
      >
        <S.CommentItem $isTarget={comment.commentId === targetCommentId}>
          <S.CommentAuthorImage
            src={
              resolveCommunityAssetUrl(comment.userProfileImageUrl) ??
              fallbackProfileImage
            }
            alt={`${comment.userName} 프로필`}
            onError={onProfileImageError}
          />
          <S.CommentContent>
            <S.CommentHeader>
              <S.CommentMeta>
                <S.CommentAuthor>{comment.userName}</S.CommentAuthor>
                <S.CommentMetaDot aria-hidden="true" />
                <S.CommentDate
                  dateTime={comment.createdAt}
                  title={formatCommunityDate(comment.createdAt)}
                >
                  {formatCommunityRelativeDate(comment.createdAt)}
                </S.CommentDate>
              </S.CommentMeta>
              {canManageComment && (
                <S.CommentMenu
                  ref={commentMenuRef}
                  onKeyDown={handleCommentMenuKeyDown}
                >
                  <S.CommentMenuButton
                    type="button"
                    aria-label="댓글 관리 메뉴"
                    aria-expanded={isCommentMenuOpen}
                    aria-haspopup="menu"
                    disabled={isCommentMutating}
                    onClick={() => setIsCommentMenuOpen((isOpen) => !isOpen)}
                  >
                    <S.CommentMenuIcon src={kebabIcon} alt="" />
                  </S.CommentMenuButton>
                  {isCommentMenuOpen && (
                    <S.CommentMenuPanel role="menu" aria-label="댓글 관리">
                      <S.CommentMenuItem
                        type="button"
                        role="menuitem"
                        disabled={isCommentMutating}
                        onClick={handleCommentEditStart}
                      >
                        수정하기
                      </S.CommentMenuItem>
                      <S.CommentMenuDivider aria-hidden="true" />
                      <S.CommentMenuItem
                        type="button"
                        role="menuitem"
                        $danger
                        disabled={isCommentMutating}
                        onClick={handleCommentDeleteRequest}
                      >
                        {isCommentMutating ? '삭제 중' : '삭제하기'}
                      </S.CommentMenuItem>
                    </S.CommentMenuPanel>
                  )}
                </S.CommentMenu>
              )}
            </S.CommentHeader>
            {isCommentEditing ? (
              <S.CommentEditForm>
                <S.CommentEditInput
                  type="text"
                  aria-label="댓글 수정"
                  value={editedCommentContent}
                  disabled={isCommentMutating}
                  onChange={(event) => {
                    setEditedCommentContent(event.target.value);
                  }}
                  onKeyDown={handleCommentEditKeyDown}
                />
                <S.CommentEditActions>
                  <S.CommentEditButton
                    type="button"
                    disabled={isCommentMutating}
                    onClick={handleCommentEditCancel}
                  >
                    취소
                  </S.CommentEditButton>
                  <S.CommentEditSaveButton
                    type="button"
                    disabled={!editedCommentContent.trim() || isCommentMutating}
                    onClick={() => void handleCommentEditSubmit()}
                  >
                    저장
                  </S.CommentEditSaveButton>
                </S.CommentEditActions>
              </S.CommentEditForm>
            ) : (
              <>
                <S.CommentText $isDeleted={comment.deleted}>
                  {replyToUserName && (
                    <S.CommentMention>@{replyToUserName}</S.CommentMention>
                  )}
                  {comment.content}
                </S.CommentText>
                <S.ReplyActionButton
                  type="button"
                  aria-expanded={isReplyComposerOpen}
                  onClick={handleReplyComposerOpen}
                >
                  답글 작성
                </S.ReplyActionButton>
                {isReplyComposerOpen && (
                  <S.ReplyComposer>
                    <S.ReplyComposerAvatar
                      $isAnonymous={isReplyAnonymous}
                      src={
                        isReplyAnonymous
                          ? anonymousProfileImage
                          : (replyAuthorProfileImageUrl ?? fallbackProfileImage)
                      }
                      alt=""
                      onError={onProfileImageError}
                    />
                    <S.ReplyComposerBody>
                      <S.ReplyComposerInput
                        type="text"
                        aria-label={`${comment.userName} 댓글에 답글 작성`}
                        placeholder="답글을 남겨보세요"
                        value={replyContent}
                        disabled={isReplySubmitting}
                        onChange={(event) => {
                          setReplyContent(event.target.value);
                          setReplySubmitError(null);
                        }}
                        onKeyDown={handleReplyKeyDown}
                      />
                      <S.ReplyComposerFooter>
                        <S.ReplyComposerTools>
                          <S.ReplyAnonymousLabel>
                            <S.ReplyAnonymousCheckbox
                              type="checkbox"
                              checked={isReplyAnonymous}
                              disabled={isReplySubmitting}
                              onChange={(event) =>
                                setIsReplyAnonymous(event.target.checked)
                              }
                            />
                            익명
                          </S.ReplyAnonymousLabel>
                        </S.ReplyComposerTools>
                        <S.ReplyComposerActions>
                          <S.ReplyCancelButton
                            type="button"
                            disabled={isReplySubmitting}
                            onClick={handleReplyComposerCancel}
                          >
                            취소
                          </S.ReplyCancelButton>
                          <S.ReplySubmitButton
                            type="button"
                            disabled={!replyContent.trim() || isReplySubmitting}
                            onClick={() => void handleReplyFormSubmit()}
                          >
                            답글
                          </S.ReplySubmitButton>
                        </S.ReplyComposerActions>
                      </S.ReplyComposerFooter>
                      {replySubmitError && (
                        <S.ReplyActionError role="alert">
                          {replySubmitError}
                        </S.ReplyActionError>
                      )}
                    </S.ReplyComposerBody>
                  </S.ReplyComposer>
                )}
              </>
            )}
          </S.CommentContent>
        </S.CommentItem>
      </S.CommentRow>
      {requiresInitialReplyLoad &&
        (isRepliesLoading ? (
          <ReplyLoadingSkeleton isWithinReplies={shouldFlattenChildTree} />
        ) : (
          <S.RepliesToggleRow $isWithinReplies={shouldFlattenChildTree}>
            <S.RepliesToggle
              type="button"
              aria-label={repliesLoadLabel}
              onClick={() => void handleRepliesLoad()}
            >
              {repliesLoadLabel}
              <S.RepliesCaret $isOpen={false} aria-hidden="true" />
            </S.RepliesToggle>
          </S.RepliesToggleRow>
        ))}
      {hasReplies && (
        <>
          {shouldShowReplies &&
            (loadedReplyCount > 0 || hasCollapseControl) && (
              <S.CommentChildren
                $isFlattened={shouldFlattenChildTree}
                $hasCommonConnector={hasCommonConnector}
              >
                {node.children.map((child, index) => {
                  const hasFollowingItem =
                    index < node.children.length - 1 || hasCollapseControl;

                  return (
                    <CommunityCommentBranch
                      key={child.comment.commentId}
                      node={child}
                      targetCommentId={targetCommentId}
                      onProfileImageError={onProfileImageError}
                      onReplySubmit={onReplySubmit}
                      onRepliesLoad={onRepliesLoad}
                      onCommentUpdate={onCommentUpdate}
                      onCommentDeleteRequest={onCommentDeleteRequest}
                      onCommentEditStart={onCommentEditStart}
                      currentMemberId={currentMemberId}
                      loadedReplyCommentIds={loadedReplyCommentIds}
                      replyAuthorProfileImageUrl={replyAuthorProfileImageUrl}
                      replyToUserName={
                        child.comment.depth > FLATTENED_TREE_DEPTH
                          ? comment.userName
                          : undefined
                      }
                      isExpandedByAncestor={shouldShowReplies}
                      hasNextSibling={hasFollowingItem}
                    />
                  );
                })}
                {hasCollapseControl && (
                  <S.RepliesToggleRow $isWithinReplies>
                    <S.RepliesToggle
                      type="button"
                      aria-expanded={isRepliesOpen}
                      onClick={() => setIsRepliesOpen((isOpen) => !isOpen)}
                    >
                      {repliesToggleLabel}
                      <S.RepliesCaret
                        $isOpen={isRepliesOpen}
                        aria-hidden="true"
                      />
                    </S.RepliesToggle>
                  </S.RepliesToggleRow>
                )}
              </S.CommentChildren>
            )}
          {hasCollapseControl &&
            !isRepliesOpen &&
            !requiresInitialReplyLoad && (
              <S.RepliesToggleRow $isWithinReplies={shouldFlattenChildTree}>
                <S.RepliesToggle
                  type="button"
                  aria-expanded={isRepliesOpen}
                  onClick={() => setIsRepliesOpen((isOpen) => !isOpen)}
                >
                  {repliesToggleLabel}
                  <S.RepliesCaret $isOpen={isRepliesOpen} aria-hidden="true" />
                </S.RepliesToggle>
              </S.RepliesToggleRow>
            )}
        </>
      )}
    </S.CommentTreeNode>
  );
}
