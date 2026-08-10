export type MarkdownCommand =
  | 'bold'
  | 'italic'
  | 'underline'
  | 'strike'
  | 'heading1'
  | 'heading2'
  | 'unorderedList'
  | 'orderedList'
  | 'code'
  | 'quote'
  | 'link'

export interface MarkdownSelection {
  value: string
  start: number
  end: number
}

export interface MarkdownResult {
  value: string
  selectionStart: number
  selectionEnd: number
}

/** 선택 영역을 감싸는 방식의 서식 */
const WRAP_SYNTAX: Partial<
  Record<MarkdownCommand, { prefix: string; suffix: string; placeholder: string }>
> = {
  bold: { prefix: '**', suffix: '**', placeholder: '굵게' },
  italic: { prefix: '*', suffix: '*', placeholder: '기울임' },
  underline: { prefix: '<u>', suffix: '</u>', placeholder: '밑줄' },
  strike: { prefix: '~~', suffix: '~~', placeholder: '취소선' },
  code: { prefix: '`', suffix: '`', placeholder: '코드' },
  link: { prefix: '[', suffix: '](https://)', placeholder: '링크 텍스트' },
}

/** 줄 앞에 붙이는 방식의 서식 */
const LINE_SYNTAX: Partial<Record<MarkdownCommand, string>> = {
  heading1: '# ',
  heading2: '## ',
  unorderedList: '- ',
  orderedList: '1. ',
  quote: '> ',
}

/**
 * 커서가 놓인 줄의 시작 위치를 찾는다.
 *
 * @param value 전체 내용
 * @param start 커서(선택 영역) 시작 위치
 */
const getLineStart = (value: string, start: number): number =>
  value.lastIndexOf('\n', start - 1) + 1

/**
 * 툴바 명령에 맞는 마크다운 문법을 적용한 결과를 만든다.
 *
 * @param command 툴바에서 누른 명령
 * @param selection 현재 내용과 선택 영역
 */
export const applyMarkdown = (
  command: MarkdownCommand,
  { value, start, end }: MarkdownSelection,
): MarkdownResult => {
  const linePrefix = LINE_SYNTAX[command]

  if (linePrefix) {
    const lineStart = getLineStart(value, start)
    const hasPrefix = value.startsWith(linePrefix, lineStart)
    const offset = hasPrefix ? -linePrefix.length : linePrefix.length
    const nextValue = hasPrefix
      ? value.slice(0, lineStart) + value.slice(lineStart + linePrefix.length)
      : value.slice(0, lineStart) + linePrefix + value.slice(lineStart)

    return {
      value: nextValue,
      selectionStart: start + offset,
      selectionEnd: end + offset,
    }
  }

  const wrap = WRAP_SYNTAX[command]

  if (!wrap) {
    return { value, selectionStart: start, selectionEnd: end }
  }

  const selected = value.slice(start, end) || wrap.placeholder
  const nextValue =
    value.slice(0, start) + wrap.prefix + selected + wrap.suffix + value.slice(end)

  return {
    value: nextValue,
    selectionStart: start + wrap.prefix.length,
    selectionEnd: start + wrap.prefix.length + selected.length,
  }
}

/**
 * 커서 위치에 이미지 마크다운을 끼워 넣는다.
 *
 * @param selection 현재 내용과 선택 영역
 * @param fileName 이미지 이름
 * @param fileUrl 업로드된 이미지 주소
 */
export const insertImageMarkdown = (
  { value, start, end }: MarkdownSelection,
  fileName: string,
  fileUrl: string,
): MarkdownResult => {
  const snippet = `![${fileName}](${fileUrl})`
  const nextValue = value.slice(0, start) + snippet + value.slice(end)

  return {
    value: nextValue,
    selectionStart: start + snippet.length,
    selectionEnd: start + snippet.length,
  }
}
