import { useEffect, useRef } from 'react'

import * as S from '../MyPage.style'
import { ActivityFilterBar } from './ActivityFilterBar'
import { ActivityPost } from './ActivityPost'
import type { MyActivityTab, MyActivityTabId, MyPost } from '../../types'

interface ProfilePostListProps {
  activeTabId: MyActivityTabId
  emptyMessage: string
  hasMore: boolean
  isFetchingMore: boolean
  isLoading: boolean
  loadMore: () => void
  onChangeTab: (tabId: MyActivityTabId) => void
  onPostClick: (post: MyPost) => void
  posts: MyPost[]
  tabs: MyActivityTab[]
}

const SKELETON_COUNT = 5
const MORE_SKELETON_COUNT = 3

export function ProfilePostList({
  activeTabId,
  emptyMessage,
  hasMore,
  isFetchingMore,
  isLoading,
  loadMore,
  onChangeTab,
  onPostClick,
  posts,
  tabs,
}: ProfilePostListProps) {
  const contentRef = useRef<HTMLDivElement>(null)
  const sentinelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const sentinel = sentinelRef.current
    const container = contentRef.current

    if (!sentinel || !container || !hasMore || isLoading) {
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting && !isFetchingMore) {
          loadMore()
        }
      },
      { root: container, threshold: 0.1 },
    )

    observer.observe(sentinel)

    return () => observer.disconnect()
  }, [hasMore, isFetchingMore, isLoading, loadMore])

  return (
    <S.ActivitySection>
      <ActivityFilterBar
        activeTabId={activeTabId}
        onChange={onChangeTab}
        tabs={tabs}
      />

      <S.TabContent ref={contentRef}>
        {isLoading ? (
          <S.PostList aria-label="활동 목록 불러오는 중">
            {Array.from({ length: SKELETON_COUNT }, (_, index) => (
              <S.SkeletonPostItem key={index}>
                <S.SkeletonBlock $width="58px" $height="22px" />
                <S.SkeletonBlock $width="42%" $height="17px" />
                <S.SkeletonMeta>
                  <S.SkeletonBlock $width="42px" $height="14px" />
                  <S.SkeletonBlock $width="42px" $height="14px" />
                  <S.SkeletonBlock $width="42px" $height="14px" />
                  <S.SkeletonBlock $width="82px" $height="14px" />
                </S.SkeletonMeta>
              </S.SkeletonPostItem>
            ))}
          </S.PostList>
        ) : posts.length === 0 ? (
          <S.EmptyMessage>{emptyMessage}</S.EmptyMessage>
        ) : (
          <S.PostList>
            {posts.map((post) => (
              <ActivityPost
                key={post.id}
                isLiked={activeTabId === 'likes' || post.isLiked}
                onClick={() => onPostClick(post)}
                post={post}
              />
            ))}
            <S.LoadMoreTrigger ref={sentinelRef} aria-hidden="true" />
            {isFetchingMore &&
              Array.from({ length: MORE_SKELETON_COUNT }, (_, index) => (
                <S.SkeletonPostItem key={`more-${index}`}>
                  <S.SkeletonBlock $width="58px" $height="22px" />
                  <S.SkeletonBlock $width="42%" $height="17px" />
                  <S.SkeletonMeta>
                    <S.SkeletonBlock $width="42px" $height="14px" />
                    <S.SkeletonBlock $width="42px" $height="14px" />
                    <S.SkeletonBlock $width="42px" $height="14px" />
                    <S.SkeletonBlock $width="82px" $height="14px" />
                  </S.SkeletonMeta>
                </S.SkeletonPostItem>
              ))}
          </S.PostList>
        )}
      </S.TabContent>
    </S.ActivitySection>
  )
}
