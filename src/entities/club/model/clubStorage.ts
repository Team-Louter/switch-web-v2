import type { ClubApplication } from './types'

export const CLUB_STORAGE_CHANGE_EVENT = 'switch:club-storage-change'

const CLUB_APPLICATIONS_STORAGE_KEY = 'switch:dummy-club-applications'
const ACTIVE_CLUB_SLUG_STORAGE_KEY = 'switch:active-club-slug'

export class ClubApplicationStorageError extends Error {
  constructor(message = '동아리 데이터를 저장할 수 없습니다.') {
    super(message)
    this.name = 'ClubApplicationStorageError'
  }
}

function getStorage(): Storage {
  if (typeof window === 'undefined' || !window.localStorage) {
    throw new ClubApplicationStorageError()
  }

  return window.localStorage
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function isClubApplication(value: unknown): value is ClubApplication {
  if (!isRecord(value)) {
    return false
  }

  return (
    typeof value.slug === 'string' &&
    typeof value.koreanName === 'string' &&
    typeof value.englishName === 'string' &&
    typeof value.clubLogoPreview === 'string' &&
    typeof value.representativeImagePreview === 'string' &&
    (value.paletteId === 'yellow' || value.paletteId === 'blue') &&
    typeof value.clubOlga === 'string' &&
    typeof value.createdAt === 'string'
  )
}

function readStoredApplications(storage: Storage): Record<string, ClubApplication> {
  const raw = storage.getItem(CLUB_APPLICATIONS_STORAGE_KEY)
  if (!raw) {
    return {}
  }

  let parsed: unknown
  try {
    parsed = JSON.parse(raw)
  } catch {
    throw new ClubApplicationStorageError('저장된 동아리 데이터가 올바르지 않습니다.')
  }

  if (!isRecord(parsed)) {
    throw new ClubApplicationStorageError('저장된 동아리 데이터가 올바르지 않습니다.')
  }

  const applications: Record<string, ClubApplication> = {}
  for (const [slug, value] of Object.entries(parsed)) {
    if (!isClubApplication(value) || value.slug !== slug) {
      throw new ClubApplicationStorageError('저장된 동아리 데이터가 올바르지 않습니다.')
    }

    applications[slug] = value
  }

  return applications
}

function emitStorageChange() {
  window.dispatchEvent(new Event(CLUB_STORAGE_CHANGE_EVENT))
}

export function saveClubApplication(application: ClubApplication): void {
  const storage = getStorage()
  const applications = readStoredApplications(storage)
  applications[application.slug] = application

  try {
    storage.setItem(CLUB_APPLICATIONS_STORAGE_KEY, JSON.stringify(applications))
  } catch {
    throw new ClubApplicationStorageError(
      '이미지 용량이 커서 동아리 데이터를 저장하지 못했습니다.',
    )
  }

  emitStorageChange()
}

export function getClubApplications(): Record<string, ClubApplication> {
  try {
    return readStoredApplications(getStorage())
  } catch {
    return {}
  }
}

export function getClubApplicationBySlug(slug: string): ClubApplication | null {
  return getClubApplications()[slug] ?? null
}

export function getActiveClubSlug(): string | null {
  try {
    return getStorage().getItem(ACTIVE_CLUB_SLUG_STORAGE_KEY)
  } catch {
    return null
  }
}

export function setActiveClubSlug(slug: string): void {
  const storage = getStorage()

  try {
    storage.setItem(ACTIVE_CLUB_SLUG_STORAGE_KEY, slug)
  } catch {
    throw new ClubApplicationStorageError(
      '현재 동아리 정보를 저장하지 못했습니다.',
    )
  }

  emitStorageChange()
}

export function clearActiveClubSlug(): void {
  try {
    getStorage().removeItem(ACTIVE_CLUB_SLUG_STORAGE_KEY)
    emitStorageChange()
  } catch {
    // 저장소를 사용할 수 없는 환경에서는 기본 테마를 유지합니다.
  }
}
