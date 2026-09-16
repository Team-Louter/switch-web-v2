import { css, keyframes } from 'styled-components'

const studyModalBackdropEnter = keyframes`
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
`

const studyModalContentEnter = keyframes`
  from {
    opacity: 0;
    transform: translateY(14px) scale(0.98);
  }

  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
`

export const studyModalBackdropAnimation = css`
  animation: ${studyModalBackdropEnter} 180ms ease-out both;

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`

export const studyModalContentAnimation = css`
  animation: ${studyModalContentEnter} 220ms cubic-bezier(0.22, 1, 0.36, 1)
    both;

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`
