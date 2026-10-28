import { create } from 'zustand'

import { AUTH_STATE_CHANGED_EVENT, getAccessToken, getPendingAccessToken } from '@/shared/lib/authToken'
import { queryClient } from '@/shared/lib/queryClient'

import { getMyProfile } from '../api/profileApi'
import { profileQueryKeys } from './profileQueries'

import type { ProfileResponse } from './types'

interface UserState {
  user: ProfileResponse | null
  profileLoadState: 'idle' | 'loading' | 'loaded' | 'error'
  sessionVersion: number
  fetchUser: () => Promise<ProfileResponse>
  resetUser: () => void
  setUser: (user: ProfileResponse) => void
}

let pendingProfile: { sessionVersion: number; promise: Promise<ProfileResponse> } | null = null

function getProfileToken() {
  return getAccessToken() ?? getPendingAccessToken()
}

export const useUserStore = create<UserState>((set, get) => ({
  user: null,
  profileLoadState: 'idle',
  sessionVersion: 0,
  fetchUser: () => {
    const sessionVersion = get().sessionVersion
    if (pendingProfile?.sessionVersion === sessionVersion) return pendingProfile.promise

    set({ profileLoadState: 'loading' })
    const promise = getMyProfile()
      .then((user) => {
        // 401 재시도로 토큰이 바뀌어도 같은 세션의 응답은 사용한다.
        // 로그아웃·계정 전환으로 교체된 요청만 제외한다.
        if (pendingProfile?.promise !== promise || !getProfileToken()) {
          throw new Error('프로필 조회 중 로그인 상태가 변경되었습니다.')
        }
        // userId 공개로 layout effect가 재실행되기 전에 같은 조회 결과를 준비한다.
        queryClient.setQueryData(profileQueryKeys.me(user.userId), user)
        set({ user, profileLoadState: 'loaded' })
        return user
      })
      .catch((error: unknown) => {
        if (pendingProfile?.promise === promise && Boolean(getProfileToken())) {
          set({ profileLoadState: 'error' })
        }
        throw error
      })
      .finally(() => {
        if (pendingProfile?.promise === promise) pendingProfile = null
      })

    pendingProfile = { sessionVersion, promise }
    return promise
  },
  resetUser: () => {
    pendingProfile = null
    set((state) => ({ user: null, profileLoadState: 'idle', sessionVersion: state.sessionVersion + 1 }))
  },
  setUser: (user) => set({ user, profileLoadState: 'loaded' }),
}))

window.addEventListener(AUTH_STATE_CHANGED_EVENT, () => {
  if (!getAccessToken()) {
    useUserStore.getState().resetUser()
  }
})

window.addEventListener('storage', (event) => {
  if (event.key === 'accessToken' || event.key === null) {
    useUserStore.getState().resetUser()
  }
})
