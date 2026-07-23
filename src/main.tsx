// React 앱 진입점이며 FSD app 레이어의 App을 DOM에 마운트합니다.
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import { App } from '@/app'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
