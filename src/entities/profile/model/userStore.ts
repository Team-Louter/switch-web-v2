import { create } from 'zustand'

import { AUTH_STATE_CHANGED_EVENT, getAccessToken } from '@/shared/lib/authToken'

import { getMyProfile } from '../api/profileApi'

import type { ProfileResponse } from './types'

interface UserState {
  user: ProfileResponse | null
  fetchUser: () => Promise<ProfileResponse>
  resetUser: () => void
  setUser: (user: ProfileResponse) => void
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  fetchUser: async () => {
    const user = await getMyProfile()

    set({ user })

    return user
  },
  resetUser: () => set({ user: null }),
  setUser: (user) => set({ user }),
}))

window.addEventListener(AUTH_STATE_CHANGED_EVENT, () => {
  if (!getAccessToken()) {
    useUserStore.getState().resetUser()
  }
})
