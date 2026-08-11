// 앱 최상단에서 한 번 렌더링되어 기본 reset, 폰트, 배경, 상호작용 스타일을 적용합니다.
import { createGlobalStyle } from 'styled-components'

import * as token from '@/shared/styles/values/token'

export const GlobalStyle = createGlobalStyle`
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  html,
  body,
  #root {
    min-width: 320px;
    min-height: 100%;
  }

  body {
    min-height: 100vh;
    color: ${token.colors.gray.gray100};
    background: ${token.colors.white};
    font-family: ${token.fontFamily.system};
    line-height: 1.5;
    font-synthesis: none;
    text-rendering: optimizeLegibility;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  article,
  aside,
  details,
  figcaption,
  figure,
  footer,
  header,
  hgroup,
  menu,
  nav,
  section {
    display: block;
  }

  ul,
  ol {
    list-style: none;
  }

  a {
    color: inherit;
    text-decoration: none;
  }

  button {
    border: 0;
    background: none;
    color: inherit;
    cursor: pointer;
    font: inherit;
  }

  input,
  textarea,
  select {
    font: inherit;
  }

  img,
  picture,
  video,
  canvas,
  svg {
    display: block;
    max-width: 100%;
  }

  img,
  svg {
    user-select: none;
    -webkit-user-drag: none;
  }

  @media (prefers-reduced-motion: no-preference) {
    ::view-transition-old(root),
    ::view-transition-new(root) {
      animation: none;
    }

    ::view-transition-group(auth-card),
    ::view-transition-old(auth-card),
    ::view-transition-new(auth-card) {
      animation-duration: 640ms;
      animation-timing-function: cubic-bezier(0.22, 1, 0.36, 1);
    }

    ::view-transition-old(auth-card),
    ::view-transition-new(auth-card) {
      mix-blend-mode: normal;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    ::view-transition-group(auth-card),
    ::view-transition-old(auth-card),
    ::view-transition-new(auth-card) {
      animation-duration: 1ms;
    }
  }
`
