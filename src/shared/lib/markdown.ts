const CODE_FENCE_PATTERN = /^\s*```/
const INLINE_CODE_PATTERN = /(`[^`\n]*`)/g
const UNDERLINE_MARKDOWN_PATTERN =
  /(?<!\\)__(?!_)([^_\n]+?)(?<!\\)__(?!_)/g

/**
 * Converts the app-supported `__text__` underline syntax to HTML for the
 * sanitized Markdown renderer while preserving literal code snippets.
 */
export function renderCustomUnderlineMarkdown(value: string): string {
  let isFencedCode = false

  return value
    .split('\n')
    .map((line) => {
      if (CODE_FENCE_PATTERN.test(line)) {
        isFencedCode = !isFencedCode
        return line
      }

      if (isFencedCode) {
        return line
      }

      return line
        .split(INLINE_CODE_PATTERN)
        .map((segment) =>
          segment.startsWith('`')
            ? segment
            : segment.replace(UNDERLINE_MARKDOWN_PATTERN, '<u>$1</u>'),
        )
        .join('')
    })
    .join('\n')
}
