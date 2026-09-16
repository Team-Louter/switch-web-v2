import { keyframes } from 'styled-components'

/** 목록 콘텐츠가 로드된 뒤 자연스럽게 나타날 때 사용하는 공용 진입 애니메이션 */
export const contentReveal = keyframes`
  from {
    opacity: 0;
    transform: translateY(14px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
`
