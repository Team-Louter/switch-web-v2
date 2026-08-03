import type { MouseEvent, ReactNode } from 'react'
import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'

import { Card, Overlay } from './Modal.style'

type ModalProps = {
  label: string // 스크린리더용 모달 이름
  children: ReactNode
  width?: number
  minHeight?: number
  onClose: () => void
}

export function Modal({
  label,
  children,
  width = 486,
  minHeight,
  onClose,
}: ModalProps) {
  const mouseDownTargetRef = useRef<EventTarget | null>(null)

  // ESC 키로 닫고, 열려 있는 동안 배경 스크롤을 막습니다.
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    const previousOverflow = document.body.style.overflow

    document.addEventListener('keydown', handleKeyDown)
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = previousOverflow
    }
  }, [onClose])

  /** 누르기 시작한 위치를 기억합니다. (카드 안에서 드래그해 밖에서 뗀 경우 닫히지 않도록) */
  const handleOverlayMouseDown = (event: MouseEvent<HTMLDivElement>) => {
    mouseDownTargetRef.current = event.target
  }

  /**
   * 카드 바깥(오버레이)을 눌렀다 뗀 경우에만 닫습니다.
   *
   * mousedown이 아닌 click에서 닫아야 뒤쪽 캘린더로 클릭이 이어지지 않습니다.
   */
  const handleOverlayClick = (event: MouseEvent<HTMLDivElement>) => {
    if (
      event.target === event.currentTarget &&
      mouseDownTargetRef.current === event.currentTarget
    ) {
      onClose()
    }
  }

  return createPortal(
    <Overlay onMouseDown={handleOverlayMouseDown} onClick={handleOverlayClick}>
      <Card
        role="dialog"
        aria-modal="true"
        aria-label={label}
        $width={width}
        $minHeight={minHeight}
      >
        {children}
      </Card>
    </Overlay>,
    document.body,
  )
}
