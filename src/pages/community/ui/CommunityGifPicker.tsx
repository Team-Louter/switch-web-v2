import { useInfiniteQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { MdClose } from 'react-icons/md';

import {
  getKlipyGifs,
  isKlipyGifApiConfigured,
  type KlipyGif,
} from '@/shared/api';
import { Modal } from '@/shared/ui';

import * as S from './CommunityGifPicker.style';

interface CommunityGifPickerProps {
  onSelect: (gif: KlipyGif) => void;
  onClose: () => void;
}

interface CommunityGifOptionProps {
  gif: KlipyGif;
  onSelect: (gif: KlipyGif) => void;
}

interface CommunityGifSkeletonProps {
  count?: number;
}

function CommunityGifSkeleton({ count = 6 }: CommunityGifSkeletonProps) {
  return (
    <S.Grid role="status" aria-label="GIF를 불러오는 중입니다.">
      {Array.from({ length: count }, (_, index) => (
        <S.GifSkeleton key={index} aria-hidden="true" />
      ))}
    </S.Grid>
  );
}

function CommunityGifOption({ gif, onSelect }: CommunityGifOptionProps) {
  const [imageState, setImageState] = useState<'loading' | 'loaded' | 'error'>('loading');

  return (
    <S.GifButton
      type="button"
      aria-label={`${gif.title || 'GIF'} 삽입`}
      aria-busy={imageState === 'loading'}
      disabled={imageState !== 'loaded'}
      onClick={() => onSelect(gif)}
    >
      <S.GifImage
        src={gif.url}
        alt={gif.contentDescription || gif.title || 'GIF'}
        loading="lazy"
        referrerPolicy="no-referrer"
        $loaded={imageState === 'loaded'}
        onLoad={() => setImageState('loaded')}
        onError={() => setImageState('error')}
      />
      {imageState === 'loading' && <S.ImageSkeleton aria-hidden="true" />}
      {imageState === 'error' && <S.ImageError>미리보기 없음</S.ImageError>}
    </S.GifButton>
  );
}

export function CommunityGifPicker({
  onSelect,
  onClose,
}: CommunityGifPickerProps) {
  const [searchInput, setSearchInput] = useState('');
  const searchQuery = searchInput.trim();
  const isConfigured = isKlipyGifApiConfigured();
  const {
    data,
    isPending,
    isError,
    isFetching,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    refetch,
  } = useInfiniteQuery({
    queryKey: ['community', 'gif-picker', searchQuery],
    queryFn: ({ pageParam, signal }) => getKlipyGifs({
      query: searchQuery,
      page: pageParam,
      signal,
    }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, pages) =>
      lastPage.hasNext ? pages.length + 1 : undefined,
    enabled: isConfigured,
    staleTime: 60_000,
    retry: 1,
    refetchOnWindowFocus: false,
  });
  const gifs = [...new Map(
    data?.pages.flatMap((page) => page.items).map((gif) => [gif.slug, gif]),
  ).values()];

  return (
    <Modal label="GIF 선택" width={440} onClose={onClose}>
      <S.Picker>
        <S.Header>
          <S.Title>GIF 선택</S.Title>
          <S.IconButton type="button" aria-label="GIF 선택 닫기" onClick={onClose}>
            <MdClose size={22} />
          </S.IconButton>
        </S.Header>
        <S.SearchField role="search">
          <S.SearchInput
            type="search"
            aria-label="GIF 검색어"
            placeholder="GIF 검색하기"
            value={searchInput}
            maxLength={100}
            disabled={!isConfigured}
            onChange={(event) => setSearchInput(event.target.value)}
          />
        </S.SearchField>
        <S.ResultsHeader>{searchQuery ? '검색 결과' : '인기 GIF'}</S.ResultsHeader>
        <S.Results aria-busy={isConfigured && isFetching}>
          {!isConfigured ? (
            <S.Status role="status">지금은 GIF 검색을 사용할 수 없어요.</S.Status>
          ) : isPending ? (
            <CommunityGifSkeleton />
          ) : (
            <>
              {gifs.length > 0 && (
                <S.Grid>
                  {gifs.map((gif) => (
                    <CommunityGifOption
                      key={gif.slug}
                      gif={gif}
                      onSelect={onSelect}
                    />
                  ))}
                </S.Grid>
              )}
              {isError ? (
                <S.Status role="alert">
                  GIF를 불러오지 못했어요. 잠시 후 다시 시도해주세요.
                  <S.MoreButton
                    type="button"
                    disabled={isFetching}
                    onClick={() => void (gifs.length > 0 ? fetchNextPage() : refetch())}
                  >
                    다시 시도
                  </S.MoreButton>
                </S.Status>
              ) : gifs.length === 0 && (
                <S.Status role="status">검색 결과가 없어요. 다른 검색어를 입력해주세요.</S.Status>
              )}
              {isFetchingNextPage && <CommunityGifSkeleton count={3} />}
              {hasNextPage && !isError && (
                <S.MoreButton
                  type="button"
                  disabled={isFetching}
                  onClick={() => void fetchNextPage()}
                >
                  {isFetchingNextPage ? '불러오는 중…' : '더 보기'}
                </S.MoreButton>
              )}
            </>
          )}
        </S.Results>
        <S.Attribution>Powered by KLIPY</S.Attribution>
      </S.Picker>
    </Modal>
  );
}
