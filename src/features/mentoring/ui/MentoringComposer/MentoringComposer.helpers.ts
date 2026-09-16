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

export function restoreTextareaHeight(textarea: HTMLTextAreaElement | null) {
  window.setTimeout(() => {
    if (!textarea) {
      return
    }

    textarea.style.height = 'auto'
    textarea.style.height = `${textarea.scrollHeight}px`
  }, 0)
}
