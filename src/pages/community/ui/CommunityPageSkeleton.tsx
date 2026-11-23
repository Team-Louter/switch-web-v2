import * as S from './CommunityList.style';

const SKELETON_ROW_COUNT = 16;
const SKELETON_TAB_COUNT = 8;

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
  return (
    <S.Page>
      <S.Content $animate={false}>
        <S.Header aria-hidden="true">
          <S.TabActionRow>
            <S.SkeletonTabs>
              {Array.from({ length: SKELETON_TAB_COUNT }, (_, index) => (
                <S.SkeletonTab key={index} />
              ))}
            </S.SkeletonTabs>
            <S.SkeletonWriteButton />
          </S.TabActionRow>
        </S.Header>
        <S.PostList aria-label="게시글 목록" aria-busy="true">
          <CommunityListSkeleton />
        </S.PostList>
      </S.Content>
    </S.Page>
  );
}
