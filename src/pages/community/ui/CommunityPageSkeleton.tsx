import { useSearchParams } from 'react-router-dom';

import { getCommunityListFilters } from '../model/useCommunityListNavigation';
import { CommunityListHeader } from './CommunityListHeader';
import * as S from './CommunityList.style';

const SKELETON_ROW_COUNT = 16;

export function CommunityListSkeleton() {
  return (
    <div role="status" aria-label="게시글을 불러오는 중입니다.">
      {Array.from({ length: SKELETON_ROW_COUNT }, (_, index) => (
        <S.SkeletonRow key={index} aria-hidden="true">
          <S.SkeletonCategory />
          <S.SkeletonTitle />
          <S.SkeletonAuthor />
          <S.SkeletonDate />
          <S.SkeletonStats />
        </S.SkeletonRow>
      ))}
    </div>
  );
}

export function CommunityPageSkeleton() {
  const [searchParams] = useSearchParams();
  const { selectedCategory } = getCommunityListFilters(searchParams);

  return (
    <S.Page>
      <S.Content>
        <CommunityListHeader selectedCategory={selectedCategory} />
        <S.PostList aria-label="게시글 목록" aria-busy="true">
          <CommunityListSkeleton />
        </S.PostList>
      </S.Content>
    </S.Page>
  );
}
