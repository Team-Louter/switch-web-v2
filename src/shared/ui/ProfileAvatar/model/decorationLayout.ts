import catMask from '../assets/cat-frame-mask.svg?url'
import chickMask from '../assets/chick-frame-mask.svg?url'
import ringMask from '../assets/ring-frame-mask.svg?url'

interface DecorationLayout {
  canvasSize: number
  profileDiameter: number
  centerX: number
  centerY: number
  maskUrl?: string
}

const DEFAULT_LAYOUT: DecorationLayout = {
  canvasSize: 512,
  profileDiameter: 400,
  centerX: 256,
  centerY: 256,
}

/**
 * 원본 좌표계에서 사진이 놓일 기준 원을 정의한다. 사진 자체는 확대·축소하지 않는다.
 * 장식의 의미(귀, 모자, 링)는 투명 여백만으로 추론할 수 없어 에셋별로 등록한다.
 * 새 비표준 에셋은 기준 원을 추가하고, 닫힌 프레임은 외곽 마스크도 함께 등록한다.
 * 마스크는 원본 알파에서 바깥과 연결된 투명 영역을 제외한 실루엣이다.
 */
const LAYOUTS: Record<string, DecorationLayout> = {
  // 얼굴 전체를 덮는 가면
  'd8d094d6-6d17-4080-977f-bbef7e4fcbdf.png': {
    canvasSize: 512, profileDiameter: 420, centerX: 256, centerY: 256,
  },
  // 모자와 안경: 머리 중심을 사진 중심보다 위에 둔다.
  '656fa30f-b60c-4f20-ac49-d234748798d3.png': {
    canvasSize: 1254, profileDiameter: 1000, centerX: 627, centerY: 710,
  },
  // 고양이 얼굴 테두리
  '3459da46-eb88-4d62-a54c-1f37d331e546.png': {
    canvasSize: 512, profileDiameter: 420, centerX: 256, centerY: 270, maskUrl: catMask,
  },
  // 귀와 리본은 사진 위쪽 둘레에 걸친다. 열린 장식에는 마스크를 씌우지 않는다.
  'f26c9247-3d96-4e4c-9733-4b43cdac028b.png': {
    canvasSize: 512, profileDiameter: 400, centerX: 256, centerY: 248,
  },
  // 분홍 링
  '75f26650-8dbc-467d-8353-581099544ff7.png': {
    canvasSize: 1254, profileDiameter: 1020, centerX: 627, centerY: 627, maskUrl: ringMask,
  },
  // 병아리 프레임: 머리 장식 때문에 기준 원이 캔버스 중심보다 아래에 있다.
  'chick-frame2.png': {
    canvasSize: 512, profileDiameter: 400, centerX: 256, centerY: 280, maskUrl: chickMask,
  },
}

export function getDecorationLayout(src: string | undefined, profileSize: number) {
  const filename = src?.split(/[?#]/, 1)[0].split('/').pop()?.replace(/\.apng$/i, '.png')
  const layout = (filename && LAYOUTS[filename]) || DEFAULT_LAYOUT
  const scale = profileSize / layout.profileDiameter
  return {
    displaySize: layout.canvasSize * scale,
    offsetX: (layout.canvasSize / 2 - layout.centerX) * scale,
    offsetY: (layout.canvasSize / 2 - layout.centerY) * scale,
    maskUrl: layout.maskUrl,
  }
}
