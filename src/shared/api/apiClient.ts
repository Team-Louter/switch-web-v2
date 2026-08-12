import axios from 'axios'
import type { InternalAxiosRequestConfig } from 'axios'

import {
  clearAccessToken,
  clearPendingAccessToken,
  getAccessToken,
  getPendingAccessToken,
  setAccessToken,
} from '@/shared/lib/authToken'

export const UNAUTHORIZED_EVENT = 'auth:unauthorized'

interface RefreshAccessTokenResponse {
  access_token: string
}

interface RetryableRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean
}

const apiConfig = {
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000,
  withCredentials: true,
  headers: {
    Accept: 'application/json',
  },
}

export const apiClient = axios.create(apiConfig)
const refreshClient = axios.create(apiConfig)

let refreshPromise: Promise<string> | null = null

export function refreshAccessToken(): Promise<string> {
  if (refreshPromise) {
    return refreshPromise
  }

  refreshPromise = refreshClient
    .post<RefreshAccessTokenResponse>('/auth/refresh')
    .then((response) => {
      const accessToken = response.data.access_token?.trim()

      if (!accessToken) {
        throw new Error('토큰 갱신 응답에 액세스 토큰이 없습니다.')
      }

      setAccessToken(accessToken)

      return accessToken
    })
    .finally(() => {
      refreshPromise = null
    })

  return refreshPromise
}

apiClient.interceptors.request.use(
  (config) => {
    const accessToken = getAccessToken() ?? getPendingAccessToken()

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`
    }

    return config
  },
  (error: unknown) => Promise.reject(error),
)

apiClient.interceptors.response.use(
  (response) => response,
  async (error: unknown) => {
    if (!axios.isAxiosError(error) || error.response?.status !== 401) {
      return Promise.reject(error)
    }

    const originalRequest = error.config as RetryableRequestConfig | undefined
    const isAuthRequest = originalRequest?.url?.includes('/auth/') ?? false
    const canRefresh =
      originalRequest !== undefined &&
      !originalRequest._retry &&
      !isAuthRequest &&
      Boolean(getAccessToken())

    if (!canRefresh) {
      clearAccessToken()
      clearPendingAccessToken()
      window.dispatchEvent(new CustomEvent(UNAUTHORIZED_EVENT))

      return Promise.reject(error)
    }

    originalRequest._retry = true

    try {
      const accessToken = await refreshAccessToken()

      originalRequest.headers.Authorization = `Bearer ${accessToken}`

      return apiClient(originalRequest)
    } catch (refreshError: unknown) {
      clearAccessToken()
      clearPendingAccessToken()
      window.dispatchEvent(new CustomEvent(UNAUTHORIZED_EVENT))

      return Promise.reject(refreshError)
    }
  },
)
