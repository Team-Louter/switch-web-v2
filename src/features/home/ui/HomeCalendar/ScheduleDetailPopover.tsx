import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import styled from 'styled-components'
import type { Schedule } from '@/entities/schedule'

interface ScheduleDetailPopoverProps {
  schedule: Schedule
  x: number
  y: number
  onClose: () => void
}

export function ScheduleDetailPopover({ schedule, x, y, onClose }: ScheduleDetailPopoverProps) {
  const card = useRef<HTMLDivElement>(null)
  const [position, setPosition] = useState({ x: Math.max(8, Math.min(x, window.innerWidth - 416)), y: Math.max(8, Math.min(y, window.innerHeight - 300)) })
  const drag = useRef<{ x: number; y: number } | null>(null)

  useEffect(() => {
    const outside = (event: MouseEvent) => {
      if (event.target instanceof Node && !card.current?.contains(event.target)) onClose()
    }
    const escape = (event: KeyboardEvent) => { if (event.key === 'Escape') onClose() }
    document.addEventListener('mousedown', outside)
    document.addEventListener('keydown', escape)
    return () => {
      document.removeEventListener('mousedown', outside)
      document.removeEventListener('keydown', escape)
    }
  }, [onClose])

  return createPortal(
    <Card ref={card} role="dialog" aria-label="일정 상세" style={{ left: position.x, top: position.y }}
      onPointerDown={(event) => {
        if (event.target instanceof HTMLButtonElement) return
        drag.current = { x: event.clientX - position.x, y: event.clientY - position.y }
        event.currentTarget.setPointerCapture(event.pointerId)
      }}
      onPointerMove={(event) => { if (drag.current) setPosition({ x: event.clientX - drag.current.x, y: event.clientY - drag.current.y }) }}
      onPointerUp={() => { drag.current = null }}
      onPointerCancel={() => { drag.current = null }}>
      <Row><Label>제목</Label><Value>{schedule.title}</Value></Row>
      <Row><Label>날짜</Label><Value>{schedule.startDate.slice(0, 10)} ~ {schedule.endDate.slice(0, 10)}</Value></Row>
      <Row><Label>담당자</Label><Value>{formatAssignees(schedule)}</Value></Row>
      <Row><Label>설명</Label><Value>{schedule.content || '-'}</Value></Row>
    </Card>, document.body,
  )
}

const Card = styled.div`
  position: fixed;
  background: white;
  border-radius: 8px;
  padding: 24px;
  width: min(400px, calc(100vw - 16px));
  max-height: calc(100dvh - 16px);
  overflow: auto;
  z-index: 100;
  border: 1px solid #dfdfdf;
  cursor: grab;
  touch-action: none;
`
const Row = styled.div`display: flex; margin-bottom: 10px; &:last-child { margin-bottom: 0; }`
const Label = styled.div`font-size: .8125rem; font-weight: 600; color: #333; min-width: 100px; flex-shrink: 0;`
const Value = styled.div`font-size: .8125rem; font-weight: 500; color: #2a2b2b; line-height: 1.5; flex: 1; white-space: pre-wrap; overflow-wrap: anywhere;`

function formatAssignees(schedule: Schedule) {
  const names = schedule.users.map((user) => user.userName)
  if (names.length === 0) return '-'
  if (names.length === 1) return names[0]
  return `${names[0]} 외 ${names.length - 1}명`
}
