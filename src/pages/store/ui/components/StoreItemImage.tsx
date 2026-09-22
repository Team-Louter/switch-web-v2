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

type ResolvedImage = {
  source: string
  url: string
}

// 인증이 필요한 상점 이미지를 API 클라이언트로 받아 브라우저 이미지 URL로 변환한다.
export function StoreItemImage({ alt, className, src }: StoreItemImageProps) {
  const shouldFetchImage =
    !isDirectImageSource(src) && isApiImageSource(src)
  const [resolvedImage, setResolvedImage] = useState<ResolvedImage | null>(null)

  useEffect(() => {
    if (!shouldFetchImage) {
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

        if (shouldIgnore) {
          URL.revokeObjectURL(objectUrl)
          return
        }

        setResolvedImage({ source: src, url: objectUrl })
      } catch {
        if (!shouldIgnore) {
          setResolvedImage({ source: src, url: src })
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
  }, [shouldFetchImage, src])

  const resolvedSrc =
    shouldFetchImage && resolvedImage?.source === src ? resolvedImage.url : src

  return <img className={className} src={resolvedSrc} alt={alt} />
}
