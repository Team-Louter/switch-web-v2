import chickFrame from '../assets/chick-frame.webp'
import chickFrameSmall from '../assets/chick-frame-small.webp'
import cookieFrame from '../assets/cookie-frame.webp'
import cookieFrameSmall from '../assets/cookie-frame-small.webp'
import halloweenCatFrame from '../assets/halloween-cat-frame.webp'
import halloweenCatFrameSmall from '../assets/halloween-cat-frame-small.webp'
import halloweenFrame from '../assets/halloween-frame.webp'
import halloweenFrameSmall from '../assets/halloween-frame-small.webp'
import papayaFrame from '../assets/papaya-frame.webp'
import papayaFrameSmall from '../assets/papaya-frame-small.webp'

interface DecorationImages {
  large: string
  small: string
  smallMaxSize: number
}

const IMAGES: Record<string, DecorationImages> = {
  'chick-frame2.png': { large: chickFrame, small: chickFrameSmall, smallMaxSize: 50 },
  '0aa8639a-c611-4a9f-b171-48494d7efcd4.png': {
    large: cookieFrame, small: cookieFrameSmall, smallMaxSize: 80,
  },
  '598b5cf0-38ef-446b-9d88-225704a7adde.png': {
    large: halloweenCatFrame, small: halloweenCatFrameSmall, smallMaxSize: 80,
  },
  '3cd2bfc3-2ea5-474e-85fc-cdeb85959a7d.png': {
    large: halloweenFrame, small: halloweenFrameSmall, smallMaxSize: 80,
  },
  '4169d6c8-bc96-4b93-b7bc-3f463c8626fc.png': {
    large: papayaFrame, small: papayaFrameSmall, smallMaxSize: 80,
  },
}

// 원본 식별자로 치환하므로 서명 쿼리가 갱신되어도 같은 빌드 에셋을 재사용한다.
export function getProfileDecorationImageUrl(src: string, size = 200): string {
  const filename = src.split(/[?#]/, 1)[0].split('/').pop()?.replace(/\.apng$/i, '.png')
  const images = filename && Object.hasOwn(IMAGES, filename) ? IMAGES[filename] : undefined

  return images
    ? size <= images.smallMaxSize ? images.small : images.large
    : src
}
