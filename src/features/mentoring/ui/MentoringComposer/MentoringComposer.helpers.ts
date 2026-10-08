export function isCursorInsideCodeBlock(
  content: string,
  cursorPosition: number,
) {
  return content
    .slice(0, cursorPosition)
    .split('\n')
    .reduce(
      (isInsideCodeBlock, line) =>
        line.trimStart().startsWith('```')
          ? !isInsideCodeBlock
          : isInsideCodeBlock,
      false,
    )
}

export function resetTextareaHeight(textarea: HTMLTextAreaElement | null) {
  if (textarea) {
    textarea.style.height = 'auto'
  }
}

export function resizeTextareaHeight(textarea: HTMLTextAreaElement | null) {
  if (!textarea) {
    return
  }

  const scrollContainer = textarea.parentElement
  const scrollTop = scrollContainer?.scrollTop ?? 0
  const isAtBottom =
    !scrollContainer ||
    scrollContainer.scrollHeight - scrollContainer.clientHeight - scrollTop <= 1

  // 높이를 잠시 줄이면 부모 스크롤도 줄어들므로 재측정 후 작성 위치를 복구한다.
  textarea.style.height = 'auto'
  textarea.style.height = `${textarea.scrollHeight}px`

  if (scrollContainer) {
    scrollContainer.scrollTop = isAtBottom
      ? scrollContainer.scrollHeight - scrollContainer.clientHeight
      : scrollTop
  }
}

export function restoreTextareaHeight(textarea: HTMLTextAreaElement | null) {
  window.setTimeout(() => {
    resizeTextareaHeight(textarea)
  }, 0)
}
