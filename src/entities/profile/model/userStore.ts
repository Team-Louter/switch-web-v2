import { create } from 'zustand'

import { AUTH_STATE_CHANGED_EVENT, getAccessToken } from '@/shared/lib/authToken'

import { getMyProfile } from '../api/profileApi'

import type { ProfileResponse } from './types'

interface UserState {
  user: ProfileResponse | null
  profileLoadState: 'idle' | 'loading' | 'loaded' | 'error'
  fetchUser: () => Promise<ProfileResponse>
  resetUser: () => void
  setUser: (user: ProfileResponse) => void
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  profileLoadState: 'idle',
  fetchUser: async () => {
    set({ profileLoadState: 'loading' })

    try {
      const user = await getMyProfile()
      set({ user, profileLoadState: 'loaded' })

      return user
    } catch (error) {
      set({ profileLoadState: 'error' })

      throw error
    }
  },
  resetUser: () => set({ user: null, profileLoadState: 'idle' }),
  setUser: (user) => set({ user, profileLoadState: 'loaded' }),
}))

window.addEventListener(AUTH_STATE_CHANGED_EVENT, () => {
  if (!getAccessToken()) {
    useUserStore.getState().resetUser()
  }
})
