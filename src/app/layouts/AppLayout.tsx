import type { CSSProperties, PropsWithChildren } from 'react'
import { useEffect, useState } from 'react'
import styled from 'styled-components'

import { Sidebar } from '@/shared/ui'
import * as token from '@/shared/styles/values/token'

const FIGMA_CANVAS_WIDTH = 1440
const FIGMA_SIDEBAR_HEIGHT = 922
const FIGMA_SIDE_WIDTH = 309
const FIGMA_SIDE_PADDING = 30

export function AppLayout({ children }: PropsWithChildren) {
  const sidebarScale = useSidebarScale()
  const sideStyle = {
    '--sidebar-scale': sidebarScale,
    flexBasis: FIGMA_SIDE_WIDTH * sidebarScale,
    width: FIGMA_SIDE_WIDTH * sidebarScale,
    padding: FIGMA_SIDE_PADDING * sidebarScale,
  } as CSSProperties

  return (
    <Layout>
      <Side style={sideStyle}>
        <Sidebar />
      </Side>
      <Body>{children}</Body>
    </Layout>
  )
}

function useSidebarScale() {
  const [scale, setScale] = useState(getSidebarScale)

  useEffect(() => {
    const updateScale = () => {
      setScale(getSidebarScale())
    }

    window.addEventListener('resize', updateScale)
    return () => window.removeEventListener('resize', updateScale)
  }, [])

  return scale
}

function getSidebarScale() {
  if (typeof window === 'undefined') {
    return 1
  }

  const heightScale = (window.innerHeight - FIGMA_SIDE_PADDING * 2) / FIGMA_SIDEBAR_HEIGHT
  const widthScale = window.innerWidth / FIGMA_CANVAS_WIDTH

  return Math.max(0.6, Math.min(heightScale, widthScale))
}

const Layout = styled.main`
  ${token.flexRow}
  align-items: flex-start;
  min-height: 100vh;
  width: 100%;
  background: ${token.colors.white};
`

const Side = styled.div`
  ${token.flexLeft}
  align-items: flex-start;
  min-height: 100vh;
`

const Body = styled.section`
  flex: 1 1 0;
  min-width: 0;
  min-height: 100vh;
  background: ${token.colors.white};
`
