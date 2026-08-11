import axios from 'axios'

import {
  clearAccessToken,
  clearPendingAccessToken,
  getAccessToken,
  getPendingAccessToken,
} from '@/shared/lib/authToken'

export const UNAUTHORIZED_EVENT = 'auth:unauthorized'

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000,
  withCredentials: true,
  headers: {
    Accept: 'application/json',
  },
})

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
  (error: unknown) => {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      clearAccessToken()
      clearPendingAccessToken()
      window.dispatchEvent(new CustomEvent(UNAUTHORIZED_EVENT))
    }

    return Promise.reject(error)
  },
)
