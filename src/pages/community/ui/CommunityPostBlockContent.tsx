import type { Block } from '@blocknote/core'
import { lazy, Suspense } from 'react'

import { getCommunityFileDownloadUrl, type PostFileResponse } from '@/entities/community'

import * as S from './CommunityPostBlockContent.style'

const BlockFallback = lazy(() => import('./CommunityPostBlockFallback').then(
  ({ CommunityPostBlockFallback }) => ({ default: CommunityPostBlockFallback }),
))

interface CommunityPostBlockContentProps {
  blocks: readonly Block[]
  files: readonly PostFileResponse[]
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

export function CommunityPostBlockContent({ blocks, files }: CommunityPostBlockContentProps) {
  if (!blocks.every(supportsStaticBlock)) {
    return (
      <Suspense fallback={<S.LoadingSkeleton aria-busy="true" aria-label="게시글 본문을 불러오는 중입니다.">
        <S.SkeletonLine $width="42%" />
        <S.SkeletonLine $width="100%" />
        <S.SkeletonLine $width="76%" />
      </S.LoadingSkeleton>}>
        <BlockFallback blocks={blocks} files={files} />
      </Suspense>
    )
  }

  const firstImageId = blocks.find((block) => block.type === 'image')?.id

  return (
    <S.Content aria-label="게시글 본문">
      {blocks.map((block) => {
        if (block.type === 'image') {
          const src = imageUrl(block, files)
          const width = block.props.previewWidth
          return (
            <S.Figure key={block.id}>
              {src && <img src={src} alt={block.props.name || '본문 이미지'}
                width={Number.isFinite(width) && width > 0 ? width : undefined}
                fetchPriority={block.id === firstImageId ? 'high' : 'auto'}
                loading={block.id === firstImageId ? 'eager' : 'lazy'}
                decoding="async" />}
              {block.props.caption && <figcaption>{block.props.caption}</figcaption>}
            </S.Figure>
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
