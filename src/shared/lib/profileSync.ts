import type {
  ProfileAvatarDecorationItem,
  ProfileAvatarEquippedItems,
} from '@/shared/ui'

const PROFILE_NAME_COLOR_STORAGE_KEY = 'switch:profile-name-color'

export const PROFILE_SYNC_EVENT_NAME = 'switch:profile-sync'

export type ProfileSyncPayload = {
  equippedItems?: ProfileAvatarEquippedItems
}

function saveSyncedNameColor(nameColor?: ProfileAvatarDecorationItem) {
  if (typeof window === 'undefined') {
    return
  }

  if (!nameColor) {
    window.localStorage.removeItem(PROFILE_NAME_COLOR_STORAGE_KEY)
    return
  }

  window.localStorage.setItem(
    PROFILE_NAME_COLOR_STORAGE_KEY,
    JSON.stringify(nameColor),
  )
}

export function getSyncedNameColor() {
  if (typeof window === 'undefined') {
    return undefined
  }

  const storedNameColor = window.localStorage.getItem(
    PROFILE_NAME_COLOR_STORAGE_KEY,
  )

  if (!storedNameColor) {
    return undefined
  }

  try {
    return JSON.parse(storedNameColor) as ProfileAvatarDecorationItem
  } catch {
    window.localStorage.removeItem(PROFILE_NAME_COLOR_STORAGE_KEY)
    return undefined
  }
}

export function mergeSyncedEquippedItems(
  equippedItems?: ProfileAvatarEquippedItems,
): ProfileAvatarEquippedItems | undefined {
  const syncedNameColor = getSyncedNameColor()

  if (!syncedNameColor) {
    return equippedItems
  }

  return {
    ...equippedItems,
    nameColor: syncedNameColor,
  }
}

export function dispatchProfileSync(payload?: ProfileSyncPayload) {
  if (payload?.equippedItems) {
    saveSyncedNameColor(payload.equippedItems.nameColor)
  }

  window.dispatchEvent(
    new CustomEvent<ProfileSyncPayload>(PROFILE_SYNC_EVENT_NAME, {
      detail: payload,
    }),
  )
}

export function getProfileSyncPayload(event: Event) {
  return event instanceof CustomEvent
    ? (event.detail as ProfileSyncPayload)
    : undefined
}
