import { Component, Suspense, type PropsWithChildren } from 'react'

import { Button } from '../Button'
import * as S from './AsyncBoundary.style'

interface AsyncBoundaryState {
  hasError: boolean
}

export class AsyncBoundary extends Component<PropsWithChildren, AsyncBoundaryState> {
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

    return (
      <Suspense fallback={<S.Status role="status">화면을 불러오는 중입니다.</S.Status>}>
        {this.props.children}
      </Suspense>
    )
  }
}
