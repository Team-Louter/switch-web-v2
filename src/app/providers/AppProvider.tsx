import type { PropsWithChildren } from 'react'
import { useEffect, useSyncExternalStore } from 'react'
import { Bounce, ToastContainer } from 'react-toastify'
import { useLocation } from 'react-router-dom'
import 'react-toastify/dist/ReactToastify.css'

import {
  CLUB_STORAGE_CHANGE_EVENT,
  getActiveClubSlug,
  getClubApplicationBySlug,
} from '@/entities/club'
import { GlobalStyle, PaletteThemeStyle } from '@/shared/styles'
import {
  DEFAULT_PALETTE_ID,
  PALETTES,
} from '@/shared/styles/values/_palettes'

function subscribeToClubStorage(onStoreChange: () => void) {
  window.addEventListener('storage', onStoreChange)
  window.addEventListener(CLUB_STORAGE_CHANGE_EVENT, onStoreChange)

  return () => {
    window.removeEventListener('storage', onStoreChange)
    window.removeEventListener(CLUB_STORAGE_CHANGE_EVENT, onStoreChange)
  }
}

function getClubStorageSnapshot(): string {
  const activeClubSlug = getActiveClubSlug() ?? ''
  const clubApplication = activeClubSlug
    ? getClubApplicationBySlug(activeClubSlug)
    : null

  return [
    activeClubSlug,
    clubApplication?.paletteId ?? '',
    clubApplication?.createdAt ?? '',
  ].join('|')
}

function getPaletteId(pathname: string, clubStorageSnapshot: string) {
  const defaultPaths = new Set([
    '/',
    '/login',
    '/create',
    '/signup',
    '/extra-signup',
  ])
  if (defaultPaths.has(pathname) || pathname.startsWith('/oauth/')) {
    return DEFAULT_PALETTE_ID
  }

  const slugLoginMatch = pathname.match(/^\/([^/]+)\/login$/)
  if (slugLoginMatch) {
    return (
      getClubApplicationBySlug(slugLoginMatch[1])?.paletteId ??
      DEFAULT_PALETTE_ID
    )
  }

  const activeClubSlug = clubStorageSnapshot.split('|')[0]
  return activeClubSlug
    ? getClubApplicationBySlug(activeClubSlug)?.paletteId ?? DEFAULT_PALETTE_ID
    : DEFAULT_PALETTE_ID
}

export function AppProvider({ children }: PropsWithChildren) {
  const location = useLocation()
  const clubStorageSnapshot = useSyncExternalStore(
    subscribeToClubStorage,
    getClubStorageSnapshot,
    () => '',
  )
  const paletteId = getPaletteId(location.pathname, clubStorageSnapshot)

  useEffect(() => {
    function preventMediaDrag(event: DragEvent) {
      const target = event.target

      if (target instanceof Element && target.closest('img, svg')) {
        event.preventDefault()
      }
    }

    document.addEventListener('dragstart', preventMediaDrag)

    return () => document.removeEventListener('dragstart', preventMediaDrag)
  }, [])

  return (
    <>
      <PaletteThemeStyle $palette={PALETTES[paletteId]} />
      <GlobalStyle />
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition={Bounce}
      />
      {children}
    </>
  )
}
