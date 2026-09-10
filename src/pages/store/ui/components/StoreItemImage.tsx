import { useEffect, useState } from 'react'

import { apiClient } from '@/shared/api'

type StoreItemImageProps = {
  alt: string
  className?: string
  src: string
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? ''

const isDirectImageSource = (src: string) => /^(blob:|data:)/.test(src)

const isApiImageSource = (src: string) => {
  const baseUrl = API_BASE_URL.replace(/\/$/, '')

  return src.startsWith('/') || Boolean(baseUrl && src.startsWith(baseUrl))
}

// 인증이 필요한 상점 이미지를 API 클라이언트로 받아 브라우저 이미지 URL로 변환한다.
export function StoreItemImage({ alt, className, src }: StoreItemImageProps) {
  const [resolvedSrc, setResolvedSrc] = useState(src)

  useEffect(() => {
    if (isDirectImageSource(src) || !isApiImageSource(src)) {
      setResolvedSrc(src)
      return
    }

    let objectUrl = ''
    let shouldIgnore = false

    const loadImage = async () => {
      try {
        const response = await apiClient.get<Blob>(src, {
          responseType: 'blob',
        })
        objectUrl = URL.createObjectURL(response.data)

        if (!shouldIgnore) {
          setResolvedSrc(objectUrl)
        }
      } catch {
        if (!shouldIgnore) {
          setResolvedSrc(src)
        }
      }
    }

    void loadImage()

    return () => {
      shouldIgnore = true

      if (objectUrl) {
        URL.revokeObjectURL(objectUrl)
      }
    }
  }, [src])

  return <img className={className} src={resolvedSrc} alt={alt} />
}
