import { Component, Suspense, type PropsWithChildren, type ReactNode } from 'react'

import { Button } from '../Button'
import * as S from './AsyncBoundary.style'

interface AsyncBoundaryState {
  hasError: boolean
}

interface AsyncBoundaryProps {
  fallback?: ReactNode
}

function LoadingSkeleton() {
  return (
    <S.Loading role="status" aria-label="페이지 로딩 중" aria-busy="true">
      <S.LoadingTitle aria-hidden="true" />
      <S.LoadingContent aria-hidden="true">
        {Array.from({ length: 5 }, (_, index) => (
          <S.LoadingRow key={index} />
        ))}
      </S.LoadingContent>
    </S.Loading>
  )
}

export class AsyncBoundary extends Component<PropsWithChildren<AsyncBoundaryProps>, AsyncBoundaryState> {
  state: AsyncBoundaryState = { hasError: false }

  static getDerivedStateFromError(): AsyncBoundaryState {
    return { hasError: true }
  }

  render() {
    if (this.state.hasError) {
      return (
        <S.Status role="alert">
          <p>화면을 불러오지 못했습니다. 새로고침 후 다시 시도해주세요.</p>
          <Button onClick={() => window.location.reload()}>새로고침</Button>
        </S.Status>
      )
    }

    const { children, fallback = <LoadingSkeleton /> } = this.props

    return <Suspense fallback={fallback}>{children}</Suspense>
  }
}
