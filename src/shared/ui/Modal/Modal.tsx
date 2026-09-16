import type { MouseEvent, ReactNode } from 'react'
import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'

import { Card, Overlay } from './Modal.style'

/** 모달 안에서 포커스를 받을 수 있는 요소 */
const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]'

type ModalProps = {
  label: string // 스크린리더용 모달 이름
  children: ReactNode
  width?: number
  minHeight?: number
  placement?: 'center' | 'bottom-right'
  isClosing?: boolean
  onClose: () => void
}

export function Modal({
  label,
  children,
  width = 486,
  minHeight,
  placement = 'center',
  isClosing = false,
  onClose,
}: ModalProps) {
  const isFloating = placement === 'bottom-right'
  const mouseDownTargetRef = useRef<EventTarget | null>(null)
  const cardRef = useRef<HTMLDivElement>(null)

  /** 모달 안에서 포커스를 받을 수 있는 요소를 순서대로 찾습니다. */
  const getFocusableElements = () =>
    [
      ...(cardRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR) ??
        []),
    ].filter((element) => element.tabIndex !== -1)

  // 중앙 모달만 배경을 차단하고 포커스를 가둡니다. 오른쪽 아래 확인 카드는 페이지 조작을 유지합니다.
  useEffect(() => {
    if (isFloating) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
        return
      }

      if (event.key !== 'Tab') return

      const focusableElements = getFocusableElements()

      if (focusableElements.length === 0) {
        event.preventDefault()
        cardRef.current?.focus()
        return
      }

      const firstElement = focusableElements[0]
      const lastElement = focusableElements[focusableElements.length - 1]
      const activeElement = document.activeElement

      if (!event.shiftKey && activeElement === lastElement) {
        event.preventDefault()
        firstElement.focus()
        return
      }

      if (
        event.shiftKey &&
        (activeElement === firstElement || activeElement === cardRef.current)
      ) {
        event.preventDefault()
        lastElement.focus()
      }
    }

    const previousOverflow = document.body.style.overflow
    const previouslyFocusedElement = document.activeElement as HTMLElement | null

    document.addEventListener('keydown', handleKeyDown)
    document.body.style.overflow = 'hidden'
    // 모달을 열면 첫 요소로 포커스를 옮기고, 닫을 때 원래 위치로 되돌립니다.
    ;(getFocusableElements()[0] ?? cardRef.current)?.focus()

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = previousOverflow
      previouslyFocusedElement?.focus()
    }
  }, [isFloating, onClose])

  /** 누르기 시작한 위치를 기억합니다. (카드 안에서 드래그해 밖에서 뗀 경우 닫히지 않도록) */
  const handleOverlayMouseDown = (event: MouseEvent<HTMLDivElement>) => {
    if (isFloating) return

    mouseDownTargetRef.current = event.target
  }

  /**
   * 카드 바깥(오버레이)을 눌렀다 뗀 경우에만 닫습니다.
   *
   * mousedown이 아닌 click에서 닫아야 뒤쪽 캘린더로 클릭이 이어지지 않습니다.
   */
  const handleOverlayClick = (event: MouseEvent<HTMLDivElement>) => {
    if (isFloating) return

    if (
      event.target === event.currentTarget &&
      mouseDownTargetRef.current === event.currentTarget
    ) {
      onClose()
    }
  }

  return createPortal(
    <Overlay
      $placement={placement}
      onMouseDown={handleOverlayMouseDown}
      onClick={handleOverlayClick}
    >
      <Card
        ref={cardRef}
        role="dialog"
        aria-modal={!isFloating}
        aria-label={label}
        tabIndex={-1}
        $width={width}
        $placement={placement}
        $isClosing={isClosing}
        $minHeight={minHeight}
      >
        {children}
      </Card>
    </Overlay>,
    document.body,
  )
}
