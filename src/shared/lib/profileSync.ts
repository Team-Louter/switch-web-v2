import type { ProfileAvatarEquippedItems } from '@/shared/ui'

export const PROFILE_SYNC_EVENT_NAME = 'switch:profile-sync'

export type ProfileSyncPayload = {
  equippedItems?: ProfileAvatarEquippedItems
}

export function dispatchProfileSync(payload?: ProfileSyncPayload) {
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
