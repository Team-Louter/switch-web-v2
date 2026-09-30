import { useInfiniteQuery } from '@tanstack/react-query';
import { type FormEvent, useState } from 'react';
import { MdClose, MdSearch } from 'react-icons/md';

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

export function CommunityGifPicker({
  onSelect,
  onClose,
}: CommunityGifPickerProps) {
  const [searchInput, setSearchInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
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

  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSearchQuery(searchInput.trim());
  };

  return (
    <Modal label="GIF 선택" width={560} onClose={onClose}>
      <S.Picker>
        <S.Header>
          <S.Title>GIF 선택</S.Title>
          <S.IconButton type="button" aria-label="GIF 선택 닫기" onClick={onClose}>
            <MdClose size={22} />
          </S.IconButton>
        </S.Header>
        <S.SearchForm role="search" onSubmit={handleSearch}>
          <S.SearchInput
            type="search"
            aria-label="GIF 검색어"
            placeholder="Search KLIPY"
            value={searchInput}
            maxLength={100}
            disabled={!isConfigured}
            onChange={(event) => setSearchInput(event.target.value)}
          />
          <S.IconButton type="submit" aria-label="GIF 검색" disabled={!isConfigured}>
            <MdSearch size={24} />
          </S.IconButton>
        </S.SearchForm>
        <S.ResultsHeader>{searchQuery ? '검색 결과' : '인기 GIF'}</S.ResultsHeader>
        <S.Results aria-busy={isConfigured && isFetching}>
          {!isConfigured ? (
            <S.Status role="status">지금은 GIF 검색을 사용할 수 없어요.</S.Status>
          ) : isPending ? (
            <S.Status role="status">GIF를 불러오고 있어요.</S.Status>
          ) : (
            <>
              {gifs.length > 0 && (
                <S.Grid>
                  {gifs.map((gif) => (
                    <S.GifButton
                      key={gif.slug}
                      type="button"
                      aria-label={`${gif.title || 'GIF'} 삽입`}
                      onClick={() => onSelect(gif)}
                    >
                      <S.GifImage
                        src={gif.url}
                        alt={gif.contentDescription || gif.title || 'GIF'}
                        loading="lazy"
                        referrerPolicy="no-referrer"
                      />
                    </S.GifButton>
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
