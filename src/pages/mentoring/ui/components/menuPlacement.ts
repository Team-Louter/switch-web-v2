export type MenuPlacement = 'bottom' | 'top'

const MENU_GAP = 4

function findScrollContainer(element: HTMLElement): HTMLElement | null {
  let parent = element.parentElement

  while (parent && parent !== document.body) {
    const overflowY = window.getComputedStyle(parent).overflowY

    if (overflowY === 'auto' || overflowY === 'scroll') {
      return parent
    }

    parent = parent.parentElement
  }

  return null
}

/** 목록 경계 안에서 메뉴가 잘리지 않도록 메뉴가 열리는 방향을 계산한다. */
export function getMenuPlacement(
  trigger: HTMLElement,
  menuHeight: number,
): MenuPlacement {
  const triggerRect = trigger.getBoundingClientRect()
  const scrollContainer = findScrollContainer(trigger)
  const containerRect = scrollContainer?.getBoundingClientRect()
  const containerTop = containerRect?.top ?? 0
  const containerBottom =
    containerRect?.bottom ??
    Math.max(document.documentElement.clientHeight, window.innerHeight)
  const spaceAbove = triggerRect.top - containerTop
  const spaceBelow = containerBottom - triggerRect.bottom

  if (spaceBelow < menuHeight + MENU_GAP && spaceAbove > spaceBelow) {
    return 'top'
  }

  return 'bottom'
}
