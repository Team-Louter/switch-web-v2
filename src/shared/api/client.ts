type ApiRequestOptions = Omit<RequestInit, 'body'> & {
  body?: BodyInit | object | null
  query?: Record<string, number | string | string[] | undefined>
}

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? ''
const protectedPathPrefixes = ['/admin', '/me', '/mentoring']

const createRequestUrl = (
  path: string,
  query: ApiRequestOptions['query'],
) => {
  const baseUrl = apiBaseUrl.replace(/\/$/, '')
  const requestPath = path.startsWith('/') ? path : `/${path}`

  return `${baseUrl}${requestPath}${createQueryString(query)}`
}

const createQueryString = (query: ApiRequestOptions['query']) => {
  if (!query) {
    return ''
  }

  const params = new URLSearchParams()

  Object.entries(query).forEach(([key, value]) => {
    if (value === undefined) {
      return
    }

    if (Array.isArray(value)) {
      value.forEach((item) => params.append(key, item))
      return
    }

    params.set(key, String(value))
  })

  const queryString = params.toString()

  return queryString ? `?${queryString}` : ''
}

export const getApiAccessToken = () =>
  localStorage.getItem('accessToken') ??
  localStorage.getItem('access_token') ??
  localStorage.getItem('token')

export const isProtectedApiEnabled = () =>
  import.meta.env.VITE_ENABLE_PROTECTED_API === 'true'

export const hasApiAccessToken = () =>
  isProtectedApiEnabled() && Boolean(getApiAccessToken())

const isProtectedPath = (path: string) =>
  protectedPathPrefixes.some(
    (prefix) => path === prefix || path.startsWith(`${prefix}/`),
  )

const createRequestBody = (body: ApiRequestOptions['body']) => {
  if (!body || body instanceof FormData || typeof body === 'string') {
    return body
  }

  return JSON.stringify(body)
}

export class ApiError extends Error {
  status: number

  constructor(status: number, message: string) {
    super(message)
    this.status = status
  }
}

// 서버 요청 공통 옵션을 맞춘다.
// 1) base url과 query를 합친다
// 2) JSON body와 인증 헤더를 구성한다
// 3) 실패 응답을 ApiError로 통일한다
export async function apiRequest<T>(
  path: string,
  options: ApiRequestOptions = {},
): Promise<T> {
  const { body, headers, query, ...requestOptions } = options
  const token = getApiAccessToken()

  if (isProtectedApiEnabled() && isProtectedPath(path) && !getApiAccessToken()) {
    throw new ApiError(401, '로그인 기능이 연결된 뒤 사용할 수 있어요')
  }

  const requestBody = createRequestBody(body)
  const shouldSetJsonContentType =
    requestBody !== undefined &&
    requestBody !== null &&
    !(requestBody instanceof FormData)

  const response = await fetch(createRequestUrl(path, query), {
    credentials: 'include',
    ...requestOptions,
    headers: {
      ...(shouldSetJsonContentType
        ? { 'Content-Type': 'application/json' }
        : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    body: requestBody,
  })

  const responseText = await response.text()

  if (!response.ok) {
    throw new ApiError(response.status, responseText || 'API 요청에 실패했어요')
  }

  if (!responseText) {
    return undefined as T
  }

  try {
    return JSON.parse(responseText) as T
  } catch {
    return responseText as T
  }
}
