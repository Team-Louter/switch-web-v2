import { useLayoutEffect, useRef } from 'react'
import { useLocation, useSearchParams } from 'react-router-dom'

import { POST_CATEGORY_OPTIONS, type PostCategory } from '@/entities/community'

interface CommunityListState {
  communityList: { path: string; scrollY: number }
}

const scrollPositions = new Map<string, number>()
const MAX_SAVED_SCROLL_POSITIONS = 50

function saveScrollPosition(key: string, scrollY: number) {
  scrollPositions.set(key, scrollY)

  if (scrollPositions.size > MAX_SAVED_SCROLL_POSITIONS) {
    const oldestKey = scrollPositions.keys().next().value

    if (oldestKey !== undefined) {
      scrollPositions.delete(oldestKey)
    }
  }
}

export function getCommunityListReturnTo(state: unknown): {
  to: string
  state: CommunityListState | undefined
} {
  if (typeof state === 'object' && state !== null && 'communityList' in state) {
    const list = state.communityList

    if (
      typeof list === 'object' &&
      list !== null &&
      'path' in list &&
      typeof list.path === 'string' &&
      /^\/community(?:\?|$)/.test(list.path) &&
      'scrollY' in list &&
      typeof list.scrollY === 'number' &&
      Number.isFinite(list.scrollY) &&
      list.scrollY >= 0
    ) {
      return {
        to: list.path,
        state: { communityList: { path: list.path, scrollY: list.scrollY } },
      }
    }
  }

  return { to: '/community', state: undefined }
}

export function getCommunityListFilters(searchParams: URLSearchParams) {
  const categoryParam = searchParams.get('category')
  const selectedCategory =
    POST_CATEGORY_OPTIONS.find(({ value }) => value === categoryParam)?.value ??
    null
  const pageParam = Number(searchParams.get('page') ?? 1)
  const currentPage =
    Number.isSafeInteger(pageParam) && pageParam > 0 ? pageParam - 1 : 0

  return { selectedCategory, currentPage }
}

export function useCommunityListScroll(hasData: boolean) {
  const location = useLocation()
  const restorationRef = useRef({ key: '', scrollY: 0, restored: false })

  useLayoutEffect(() => {
    if (restorationRef.current.key !== location.key) {
      restorationRef.current = {
        key: location.key,
        scrollY:
          scrollPositions.get(location.key) ??
          getCommunityListReturnTo(location.state).state?.communityList.scrollY ??
          0,
        restored: false,
      }

      if (!hasData) {
        window.scrollTo({ top: 0, behavior: 'instant' })
      }
    }

    if (hasData && !restorationRef.current.restored) {
      // 만료된 캐시를 다시 조회할 때도 목록 높이가 확보된 뒤 위치를 복원한다.
      window.scrollTo({
        top: restorationRef.current.scrollY,
        behavior: 'instant',
      })
      restorationRef.current.restored = true
    }

    function handleScroll() {
      if (restorationRef.current.restored) {
        saveScrollPosition(location.key, window.scrollY)
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => window.removeEventListener('scroll', handleScroll)
  }, [hasData, location.key, location.state])
}

export function useCommunityListNavigation() {
  const location = useLocation()
  const [searchParams, setSearchParams] = useSearchParams()
  const { selectedCategory, currentPage } = getCommunityListFilters(searchParams)

  const updateFilters = (
    category: PostCategory | null,
    page: number,
    replace = false,
  ) => {
    saveScrollPosition(location.key, window.scrollY)
    const nextParams = new URLSearchParams(searchParams)

    if (category) {
      nextParams.set('category', category)
    } else {
      nextParams.delete('category')
    }

    if (page > 0) {
      nextParams.set('page', String(page + 1))
    } else {
      nextParams.delete('page')
    }

    setSearchParams(nextParams, { replace })
  }

  const getNavigationState = (): CommunityListState => {
    saveScrollPosition(location.key, window.scrollY)

    return {
      communityList: {
        path: `${location.pathname}${location.search}`,
        scrollY: window.scrollY,
      },
    }
  }

  return {
    selectedCategory,
    currentPage,
    selectCategory: (category: PostCategory | null) => updateFilters(category, 0),
    selectPage: (page: number, replace = false) =>
      updateFilters(selectedCategory, page, replace),
    getNavigationState,
  }
}
