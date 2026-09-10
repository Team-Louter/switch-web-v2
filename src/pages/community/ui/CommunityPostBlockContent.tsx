import type { Block } from '@blocknote/core'
import { lazy, Suspense, useEffect, useState } from 'react'

import { getCommunityFileDownloadUrl, type PostFileResponse } from '@/entities/community'

import { getYouTubeTitle } from '@/shared/api'

import * as S from './CommunityPostBlockContent.style'

const BlockFallback = lazy(() => import('./CommunityPostBlockFallback').then(
  ({ CommunityPostBlockFallback }) => ({ default: CommunityPostBlockFallback }),
))

interface CommunityPostBlockContentProps {
  blocks: readonly Block[]
  files: readonly PostFileResponse[]
}

function getYouTubeEmbedUrl(value: string): string | null {
  try {
    const url = new URL(value)
    const hostname = url.hostname.toLowerCase()
    let videoId: string | null = null

    if (hostname === 'youtu.be') {
      videoId = url.pathname.split('/')[1] ?? null
    } else if (
      hostname === 'youtube.com' ||
      hostname === 'www.youtube.com' ||
      hostname === 'm.youtube.com'
    ) {
      if (url.pathname === '/watch') {
        videoId = url.searchParams.get('v')
      } else if (
        url.pathname.startsWith('/shorts/') ||
        url.pathname.startsWith('/embed/') ||
        url.pathname.startsWith('/live/')
      ) {
        videoId = url.pathname.split('/')[2] ?? null
      }
    }

    return videoId && /^[A-Za-z0-9_-]{11}$/.test(videoId)
      ? `https://www.youtube-nocookie.com/embed/${videoId}?rel=0`
      : null
  } catch {
    return null
  }
}

function getLinkFromBlock(block: Block): string | null {
  if (block.type !== 'paragraph' || !Array.isArray(block.content)) return null
  const content = block.content.filter((item) => item.type !== 'text' || item.text.trim())
  if (content.length !== 1) return null
  const item = content[0]
  const value = item.type === 'link' ? item.href : item.type === 'text' ? item.text.trim() : ''
  try {
    const url = new URL(value)
    return ['https:', 'http:'].includes(url.protocol) ? url.href : null
  } catch {
    return null
  }
}

function LinkPreview({ href }: { href: string }) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [videoTitle, setVideoTitle] = useState<string | null>(null)
  const embedUrl = getYouTubeEmbedUrl(href)
  const videoId = embedUrl ? new URL(embedUrl).pathname.split('/').pop() : null
  const hostname = new URL(href).hostname

  useEffect(() => {
    if (!videoId) return;
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 8000);
    getYouTubeTitle({ videoId, signal: controller.signal })
      .then((title) => {
        if (!controller.signal.aborted) setVideoTitle(title);
      })
      .catch(() => {
        // 비공개·삭제된 영상이나 네트워크 오류에도 원본 링크와 재생 버튼을 유지합니다.
      })
      .finally(() => window.clearTimeout(timeout));
    return () => {
      controller.abort();
      window.clearTimeout(timeout);
    };
  }, [videoId]);

  return (
    <S.LinkCard>
      <S.LinkDetails href={href} target="_blank" rel="noopener noreferrer">
        <S.LinkProvider>{embedUrl ? 'YouTube' : hostname}</S.LinkProvider>
        <S.LinkTitle>{embedUrl ? videoTitle ?? 'YouTube 동영상' : hostname}</S.LinkTitle>
        <S.LinkAddress>{href}</S.LinkAddress>
      </S.LinkDetails>
      {embedUrl && (
        <S.VideoEmbed>
          {isPlaying ? (
            <iframe
              src={`${embedUrl}&autoplay=1`}
              title={videoTitle ?? 'YouTube 동영상'}
              allow="autoplay; encrypted-media; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            />
          ) : (
            <S.PlayButton type="button" aria-label="YouTube 동영상 재생" onClick={() => setIsPlaying(true)}>
              <PostImage src={`https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`} alt="동영상 미리보기" fetchPriority="auto" loading="lazy" />
              <S.PlayIcon aria-hidden="true">▶</S.PlayIcon>
            </S.PlayButton>
          )}
        </S.VideoEmbed>
      )}
    </S.LinkCard>
  )
}

// Keep complex blocks in the compatible renderer rather than losing formatting.
function supportsStaticBlock(block: Block): boolean {
  if (block.children.length > 0) return false
  if (!['paragraph', 'heading', 'image'].includes(block.type)) return false
  const props = block.props as Record<string, unknown>
  if (props.textColor && props.textColor !== 'default') return false
  if (props.backgroundColor && props.backgroundColor !== 'default') return false
  if (props.textAlignment && props.textAlignment !== 'left') return false
  if (block.type === 'heading' && props.isToggleable) return false
  if (block.type === 'image') return props.showPreview !== false
  if (!Array.isArray(block.content)) return false
  if (getLinkFromBlock(block)) return true
  return block.content.every((item) => item.type === 'text'
    && Object.keys(item.styles).length === 0)
}

function imageUrl(block: Block, files: readonly PostFileResponse[]) {
  if (block.type !== 'image') return undefined
  const url = files.find((file) => file.fileName === block.props.url)?.fileUrl
    ?? block.props.url
  if (/^[a-z][a-z\d+.-]*:/i.test(url) && !/^https?:\/\//i.test(url)) return undefined
  const resolved = getCommunityFileDownloadUrl(url)
  return resolved && /^(https?:\/\/|\/(?!\/))/i.test(resolved) ? resolved : undefined
}

interface PostImageProps {
  alt: string
  caption?: string
  fetchPriority: 'auto' | 'high'
  loading: 'eager' | 'lazy'
  src: string
  width?: number
}

function PostImage({
  alt,
  caption,
  fetchPriority,
  loading,
  src,
  width,
}: PostImageProps) {
  const [status, setStatus] = useState<'loading' | 'loaded' | 'error'>('loading')
  const isLoading = status === 'loading'

  return (
    <S.Figure $width={width} aria-busy={isLoading}>
      <S.ImageSurface $isLoading={isLoading}>
        {status === 'error' ? (
          <S.ImageError role="status">이미지를 불러오지 못했습니다.</S.ImageError>
        ) : (
          <img
            src={src}
            alt={alt}
            width={width}
            fetchPriority={fetchPriority}
            loading={loading}
            decoding="async"
            onLoad={() => setStatus('loaded')}
            onError={() => setStatus('error')}
          />
        )}
      </S.ImageSurface>
      {caption && <figcaption>{caption}</figcaption>}
    </S.Figure>
  )
}

export function CommunityPostBlockContent({ blocks, files }: CommunityPostBlockContentProps) {
  // 목록 등 연속된 복합 블록은 함께 렌더링해 기존 서식을 유지합니다.
  const groups: Block[][] = []
  for (const block of blocks) {
    const previous = groups.at(-1)
    if (!supportsStaticBlock(block) && previous && !supportsStaticBlock(previous[0])) {
      previous.push(block)
    } else {
      groups.push([block])
    }
  }

  const firstImageId = blocks.find((block) => block.type === 'image')?.id

  return (
    <S.Content aria-label="게시글 본문">
      {groups.map((group) => {
        const block = group[0]
        if (!supportsStaticBlock(block)) {
          return (
            <Suspense
              key={group.map((item) => item.id).join(',')}
              fallback={(
                <S.LoadingSkeleton aria-busy="true" aria-label="본문을 불러오는 중">
                  <S.SkeletonLine $width="76%" />
                </S.LoadingSkeleton>
              )}
            >
              <BlockFallback blocks={group} files={files} />
            </Suspense>
          )
        }
        const href = getLinkFromBlock(block)
        if (href) return <LinkPreview key={`${block.id}:${href}`} href={href} />

        if (block.type === 'image') {
          const src = imageUrl(block, files)
          const width = block.props.previewWidth

          if (!src) {
            return null
          }

          return (
            <PostImage
              key={`${block.id}:${src}`}
              src={src}
              alt={block.props.name || '본문 이미지'}
              caption={block.props.caption || undefined}
              width={Number.isFinite(width) && width > 0 ? width : undefined}
              fetchPriority={block.id === firstImageId ? 'high' : 'auto'}
              loading={block.id === firstImageId ? 'eager' : 'lazy'}
            />
          )
        }
        const text = Array.isArray(block.content)
          ? block.content.map((item) => item.type === 'text' ? item.text : '').join('')
          : ''
        if (block.type === 'heading') {
          const level = block.props.level
          const Heading = level === 1 ? 'h1' : level === 2 ? 'h2' : level === 3 ? 'h3'
            : level === 4 ? 'h4' : level === 5 ? 'h5' : 'h6'
          return <Heading key={block.id}>{text || <br />}</Heading>
        }
        return <p key={block.id}>{text || <br />}</p>
      })}
    </S.Content>
  )
}
