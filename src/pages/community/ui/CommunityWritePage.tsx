import {
  type ChangeEvent,
  type CompositionEvent,
  type FocusEvent,
  Fragment,
  type FormEvent,
  type KeyboardEvent,
  type MouseEvent,
  type ReactNode,
  useEffect,
  useRef,
  useState,
} from 'react'
import * as monaco from 'monaco-editor'
import { useNavigate } from 'react-router-dom'

import {
  POST_CATEGORY_OPTIONS,
  type PostCategory,
} from '@/entities/community'
import {
  createPost,
  type PostFileRequest,
  uploadCommunityImage,
} from '@/features/community'

import attachmentChevronIcon from '../assets/svg/attachment-chevron.svg'
import backChevronIcon from '../assets/svg/back-chevron.svg'
import boldIcon from '../assets/svg/editor-bold.svg'
import codeIcon from '../assets/svg/editor-code.svg'
import headingOneIcon from '../assets/svg/editor-heading-one.svg'
import headingTwoIcon from '../assets/svg/editor-heading-two.svg'
import imageIcon from '../assets/svg/editor-image.svg'
import italicIcon from '../assets/svg/editor-italic.svg'
import linkIcon from '../assets/svg/editor-link.svg'
import orderedListIcon from '../assets/svg/editor-ordered-list.svg'
import quoteIcon from '../assets/svg/editor-quote.svg'
import strikeIcon from '../assets/svg/editor-strike.svg'
import underlineIcon from '../assets/svg/editor-underline.svg'
import unorderedListIcon from '../assets/svg/editor-unordered-list.svg'
import { Button } from '@/shared/ui'

import * as S from './CommunityWritePage.style'

interface EditorTool {
  action: EditorAction
  label: string
  icon: string
  width: number
  height: number
}

interface EditorInsertion {
  value: string
  selectionStart: number
  selectionEnd: number
}

interface EditorHistoryEntry {
  value: string
  selectionStart: number
  selectionEnd: number
}

interface EditorSelection {
  start: number
  end: number
}

interface TextPosition {
  node: Node
  offset: number
}

interface LinePosition {
  lineIndex: number
  column: number
}

interface SelectionToolbarPosition {
  top: number
  left: number
  placement: 'above' | 'below'
}

interface UploadedImage extends PostFileRequest {
  id: string
  width: number
}

type EditorAction =
  | 'bold'
  | 'italic'
  | 'underline'
  | 'strike'
  | 'headingOne'
  | 'headingTwo'
  | 'unorderedList'
  | 'orderedList'
  | 'code'
  | 'quote'
  | 'link'
  | 'image'

type FormattingAction = Exclude<EditorAction, 'image'>

const EDITOR_TOOLS: readonly EditorTool[] = [
  {
    action: 'bold',
    label: '굵게',
    icon: boldIcon,
    width: 15.001,
    height: 21.314,
  },
  {
    action: 'italic',
    label: '기울임',
    icon: italicIcon,
    width: 11,
    height: 21.314,
  },
  {
    action: 'underline',
    label: '밑줄',
    icon: underlineIcon,
    width: 14.999,
    height: 21.314,
  },
  {
    action: 'strike',
    label: '취소선',
    icon: strikeIcon,
    width: 16.999,
    height: 21.314,
  },
  {
    action: 'headingOne',
    label: '제목 1',
    icon: headingOneIcon,
    width: 24,
    height: 24,
  },
  {
    action: 'headingTwo',
    label: '제목 2',
    icon: headingTwoIcon,
    width: 24,
    height: 24,
  },
  {
    action: 'unorderedList',
    label: '글머리표 목록',
    icon: unorderedListIcon,
    width: 20,
    height: 20,
  },
  {
    action: 'orderedList',
    label: '번호 목록',
    icon: orderedListIcon,
    width: 20,
    height: 20,
  },
  { action: 'code', label: '코드', icon: codeIcon, width: 22, height: 22 },
  { action: 'quote', label: '인용', icon: quoteIcon, width: 24, height: 24 },
  { action: 'link', label: '링크', icon: linkIcon, width: 21.001, height: 21 },
  { action: 'image', label: '이미지', icon: imageIcon, width: 20, height: 20 },
]

const SELECTION_EDITOR_TOOLS = (
  ['bold', 'italic', 'underline', 'strike', 'quote', 'code', 'link'] as const
).flatMap((action) => EDITOR_TOOLS.filter((tool) => tool.action === action))

const LINE_EDITOR_ACTIONS: readonly FormattingAction[] = [
  'headingOne',
  'headingTwo',
  'unorderedList',
  'orderedList',
  'quote',
  'code',
]

const MAX_EDITOR_HISTORY_LENGTH = 100
const DEFAULT_IMAGE_WIDTH = 520
const MIN_IMAGE_WIDTH = 160
const MAX_IMAGE_WIDTH = 960

const INLINE_MARKDOWN_PATTERN =
  /(\*\*[^*\n]*?\*\*|__[^_\n]*?__|~~[^~\n]*?~~|<u>[^<\n]+?<\/u>|`[^`\n]+?`|!\[[^\]\n]*?\]\([^)\n]+?\)|\[[^\]\n]+?\]\([^)\n]+?\)|\*[^*\n]*?\*)/g

const CODE_LANGUAGE_ALIASES: Readonly<Record<string, string>> = {
  py: 'python',
  python3: 'python',
  js: 'javascript',
  jsx: 'javascript',
  node: 'javascript',
  ts: 'typescript',
  tsx: 'typescript',
  sh: 'shell',
  bash: 'shell',
  zsh: 'shell',
  cs: 'csharp',
  'c#': 'csharp',
  'c++': 'cpp',
  cxx: 'cpp',
  md: 'markdown',
  yml: 'yaml',
  rb: 'ruby',
  rs: 'rust',
  kt: 'kotlin',
  kts: 'kotlin',
  text: 'plaintext',
  txt: 'plaintext',
}

const OPENING_CODE_FENCE_PATTERN = /^\s*```([^\s`]*)?.*$/
const CLOSING_CODE_FENCE_PATTERN = /^\s*```\s*$/

function renderEditorPlaceholder(label: string): ReactNode {
  return (
    <S.EditorPlaceholder contentEditable={false} data-editor-placeholder>
      {label}
    </S.EditorPlaceholder>
  )
}

function renderFormattedValue(value: string, placeholder: string): ReactNode {
  return value || renderEditorPlaceholder(placeholder)
}

function getHeadingFormat(
  level: number,
): 'headingOne' | 'headingTwo' | 'headingThree' {
  if (level === 1) {
    return 'headingOne'
  }

  if (level === 2) {
    return 'headingTwo'
  }

  return 'headingThree'
}

function renderInlineMarkdown(value: string): ReactNode[] {
  const nodes: ReactNode[] = []
  let sourceIndex = 0

  for (const match of value.matchAll(INLINE_MARKDOWN_PATTERN)) {
    const matchIndex = match.index ?? 0
    const token = match[0]

    if (matchIndex > sourceIndex) {
      nodes.push(value.slice(sourceIndex, matchIndex))
    }

    if (token.startsWith('**')) {
      nodes.push(
        <Fragment key={matchIndex}>
          <S.MarkdownSyntax>**</S.MarkdownSyntax>
          <S.FormattedText $format="bold">
            {renderFormattedValue(token.slice(2, -2), '굵게 텍스트')}
          </S.FormattedText>
          <S.MarkdownSyntax>**</S.MarkdownSyntax>
        </Fragment>,
      )
    } else if (token.startsWith('__')) {
      nodes.push(
        <Fragment key={matchIndex}>
          <S.MarkdownSyntax>__</S.MarkdownSyntax>
          <S.FormattedText $format="underline">
            {renderFormattedValue(token.slice(2, -2), '밑줄 텍스트')}
          </S.FormattedText>
          <S.MarkdownSyntax>__</S.MarkdownSyntax>
        </Fragment>,
      )
    } else if (token.startsWith('~~')) {
      nodes.push(
        <Fragment key={matchIndex}>
          <S.MarkdownSyntax>~~</S.MarkdownSyntax>
          <S.FormattedText $format="strike">
            {renderFormattedValue(token.slice(2, -2), '취소선 텍스트')}
          </S.FormattedText>
          <S.MarkdownSyntax>~~</S.MarkdownSyntax>
        </Fragment>,
      )
    } else if (token.startsWith('<u>')) {
      nodes.push(
        <Fragment key={matchIndex}>
          <S.MarkdownSyntax>&lt;u&gt;</S.MarkdownSyntax>
          <S.FormattedText $format="underline">
            {token.slice(3, -4)}
          </S.FormattedText>
          <S.MarkdownSyntax>&lt;/u&gt;</S.MarkdownSyntax>
        </Fragment>,
      )
    } else if (token.startsWith('`')) {
      nodes.push(
        <Fragment key={matchIndex}>
          <S.MarkdownSyntax>`</S.MarkdownSyntax>
          <S.FormattedText $format="code">{token.slice(1, -1)}</S.FormattedText>
          <S.MarkdownSyntax>`</S.MarkdownSyntax>
        </Fragment>,
      )
    } else if (token.startsWith('![')) {
      const labelEndIndex = token.indexOf('](')

      nodes.push(
        <Fragment key={matchIndex}>
          <S.MarkdownSyntax>![</S.MarkdownSyntax>
          <S.FormattedText $format="image">
            {token.slice(2, labelEndIndex)}
          </S.FormattedText>
          <S.MarkdownSyntax>{token.slice(labelEndIndex)}</S.MarkdownSyntax>
        </Fragment>,
      )
    } else if (token.startsWith('[')) {
      const labelEndIndex = token.indexOf('](')

      nodes.push(
        <Fragment key={matchIndex}>
          <S.MarkdownSyntax>[</S.MarkdownSyntax>
          <S.FormattedText $format="link">
            {token.slice(1, labelEndIndex)}
          </S.FormattedText>
          <S.MarkdownSyntax>{token.slice(labelEndIndex)}</S.MarkdownSyntax>
        </Fragment>,
      )
    } else {
      nodes.push(
        <Fragment key={matchIndex}>
          <S.MarkdownSyntax>*</S.MarkdownSyntax>
          <S.FormattedText $format="italic">
            {renderFormattedValue(token.slice(1, -1), '기울임 텍스트')}
          </S.FormattedText>
          <S.MarkdownSyntax>*</S.MarkdownSyntax>
        </Fragment>,
      )
    }

    sourceIndex = matchIndex + token.length
  }

  if (sourceIndex < value.length) {
    nodes.push(value.slice(sourceIndex))
  }

  return nodes
}

function getCodeTokenFormat(tokenType: string): S.CodeTokenFormat {
  const normalizedType = tokenType.toLowerCase()

  if (normalizedType.includes('comment')) {
    return 'comment'
  }

  if (normalizedType.includes('regexp')) {
    return 'regexp'
  }

  if (normalizedType.includes('string')) {
    return 'string'
  }

  if (
    normalizedType.includes('number') ||
    normalizedType.includes('numeric')
  ) {
    return 'number'
  }

  if (
    normalizedType.includes('keyword') ||
    normalizedType.includes('storage')
  ) {
    return 'keyword'
  }

  if (
    normalizedType.includes('type') ||
    normalizedType.includes('class') ||
    normalizedType.includes('constructor') ||
    normalizedType.includes('namespace')
  ) {
    return 'type'
  }

  if (normalizedType.includes('tag')) {
    return 'tag'
  }

  if (normalizedType.includes('attribute')) {
    return 'attribute'
  }

  if (
    normalizedType.includes('delimiter') ||
    normalizedType.includes('operator')
  ) {
    return 'operator'
  }

  return 'default'
}

function resolveCodeLanguage(language: string): string {
  const normalizedLanguage = language.trim().toLowerCase()

  if (!normalizedLanguage) {
    return 'plaintext'
  }

  return CODE_LANGUAGE_ALIASES[normalizedLanguage] ?? normalizedLanguage
}

function renderCodeEditorLine(
  line: string,
  lineIndex: number,
  tokens: readonly monaco.Token[],
): ReactNode {
  const renderedTokens: ReactNode[] = []
  let sourceIndex = 0

  tokens.forEach((token, tokenIndex) => {
    const tokenEnd = tokens[tokenIndex + 1]?.offset ?? line.length

    if (token.offset > sourceIndex) {
      renderedTokens.push(line.slice(sourceIndex, token.offset))
    }

    if (tokenEnd > token.offset) {
      renderedTokens.push(
        <S.CodeToken
          key={`${token.offset}-${token.type}`}
          $format={getCodeTokenFormat(token.type)}
        >
          {line.slice(token.offset, tokenEnd)}
        </S.CodeToken>,
      )
    }

    sourceIndex = tokenEnd
  })

  if (sourceIndex < line.length) {
    renderedTokens.push(line.slice(sourceIndex))
  }

  return (
    <S.EditorLine key={lineIndex} $format="code">
      {renderedTokens.length > 0
        ? renderedTokens
        : line || renderEditorPlaceholder('\u200b')}
    </S.EditorLine>
  )
}

function tokenizeCodeLines(
  lines: readonly string[],
  language: string,
): monaco.Token[][] {
  try {
    return monaco.editor.tokenize(
      lines.join('\n'),
      resolveCodeLanguage(language),
    )
  } catch {
    return lines.map(() => [])
  }
}

function getCodeLanguages(value: string): string[] {
  const languages = new Set<string>()
  let isFencedCode = false

  value.split('\n').forEach((line) => {
    if (isFencedCode) {
      if (CLOSING_CODE_FENCE_PATTERN.test(line)) {
        isFencedCode = false
      }

      return
    }

    const openingFence = line.match(OPENING_CODE_FENCE_PATTERN)

    if (!openingFence) {
      return
    }

    languages.add(resolveCodeLanguage(openingFence[1] ?? ''))
    isFencedCode = true
  })

  return [...languages].sort()
}

function renderEditorLineContent(line: string): ReactNode {
  const heading = line.match(/^(#{1,6})(\s+)(.*)$/)

  if (heading) {
    const headingLevel = heading[1].length

    return (
      <>
        <S.HiddenMarkdownSyntax>
          {heading[1]}
          {heading[2]}
        </S.HiddenMarkdownSyntax>
        <S.FormattedText $format={getHeadingFormat(headingLevel)}>
          {heading[3]
            ? renderInlineMarkdown(heading[3])
            : renderEditorPlaceholder(`제목${headingLevel}`)}
        </S.FormattedText>
      </>
    )
  }

  const listItem = line.match(/^(\s*)([-+*]|\d+\.)(\s+)(.*)$/)

  if (listItem) {
    return (
      <>
        {listItem[1]}
        <S.ListMarker>
          {/^\d+\.$/.test(listItem[2]) ? listItem[2] : '•'}
        </S.ListMarker>
        {listItem[3]}
        {listItem[4]
          ? renderInlineMarkdown(listItem[4])
          : renderEditorPlaceholder('리스트')}
      </>
    )
  }

  const fence = line.match(/^(\s*)(```)(.*)$/)

  if (fence) {
    return (
      <>
        {fence[1]}
        <S.MarkdownSyntax>{fence[2]}</S.MarkdownSyntax>
        <S.CodeToken $format="type">{fence[3]}</S.CodeToken>
      </>
    )
  }

  return line ? renderInlineMarkdown(line) : renderEditorPlaceholder('\u200b')
}

function renderEditorLine(line: string, lineIndex: number): ReactNode {
  const fence = line.match(/^(\s*)(```)(.*)$/)

  if (fence) {
    return (
      <S.EditorLine key={lineIndex} $format="code">
        {renderEditorLineContent(line)}
      </S.EditorLine>
    )
  }

  const quote = line.match(/^(\s*>\s?)(.*)$/)

  if (quote) {
    return (
      <S.EditorLine key={lineIndex} $format="quote">
        <S.HiddenQuoteMarker>{quote[1]}</S.HiddenQuoteMarker>
        {quote[2]
          ? renderEditorLineContent(quote[2])
          : renderEditorPlaceholder('비어 있는 인용')}
      </S.EditorLine>
    )
  }

  return (
    <S.EditorLine key={lineIndex} $format="default">
      {renderEditorLineContent(line)}
    </S.EditorLine>
  )
}

function InlineMarkdownPreview({ value }: { value: string }) {
  const codeLanguageKey = getCodeLanguages(value).join(',')
  const [, refreshTokenization] = useState(0)

  useEffect(() => {
    let isActive = true
    const languages = codeLanguageKey ? codeLanguageKey.split(',') : []

    void Promise.allSettled(
      languages.map((language) =>
        monaco.editor.colorize('', language, { tabSize: 4 }),
      ),
    ).then(() => {
      if (isActive) {
        refreshTokenization((revision) => revision + 1)
      }
    })

    return () => {
      isActive = false
    }
  }, [codeLanguageKey])

  const lines = value.split('\n')
  const renderedLines: ReactNode[] = []
  let lineIndex = 0

  while (lineIndex < lines.length) {
    const openingFence = lines[lineIndex].match(OPENING_CODE_FENCE_PATTERN)

    if (!openingFence) {
      renderedLines.push(renderEditorLine(lines[lineIndex], lineIndex))
      lineIndex += 1
      continue
    }

    renderedLines.push(renderEditorLine(lines[lineIndex], lineIndex))

    const codeStartIndex = lineIndex + 1
    let codeEndIndex = codeStartIndex

    while (
      codeEndIndex < lines.length &&
      !CLOSING_CODE_FENCE_PATTERN.test(lines[codeEndIndex])
    ) {
      codeEndIndex += 1
    }

    const codeLines = lines.slice(codeStartIndex, codeEndIndex)
    const tokenizedLines = tokenizeCodeLines(codeLines, openingFence[1] ?? '')

    codeLines.forEach((line, codeLineIndex) => {
      renderedLines.push(
        renderCodeEditorLine(
          line,
          codeStartIndex + codeLineIndex,
          tokenizedLines[codeLineIndex] ?? [],
        ),
      )
    })

    if (codeEndIndex < lines.length) {
      renderedLines.push(renderEditorLine(lines[codeEndIndex], codeEndIndex))
      lineIndex = codeEndIndex + 1
    } else {
      lineIndex = codeEndIndex
    }
  }

  return renderedLines
}

function isLineEditorAction(
  action: FormattingAction,
): action is (typeof LINE_EDITOR_ACTIONS)[number] {
  return LINE_EDITOR_ACTIONS.includes(action)
}

function getLineSelection(
  value: string,
  selectionStart: number,
  selectionEnd: number,
): EditorSelection {
  const start = value.lastIndexOf('\n', selectionStart - 1) + 1
  const endSearchStart =
    selectionEnd > selectionStart && value[selectionEnd - 1] === '\n'
      ? selectionEnd - 1
      : selectionEnd
  const nextLineBreak = value.indexOf('\n', endSearchStart)
  const end = nextLineBreak === -1 ? value.length : nextLineBreak

  return { start, end }
}

function getLinePosition(value: string, offset: number): LinePosition {
  const linesBeforeOffset = value.slice(0, offset).split('\n')

  return {
    lineIndex: linesBeforeOffset.length - 1,
    column: linesBeforeOffset.at(-1)?.length ?? 0,
  }
}

function getTextPosition(element: Element, offset: number): TextPosition | null {
  const placeholder = element.querySelector('[data-editor-placeholder]')

  if (
    placeholder &&
    getTextOffsetBeforeElement(element, placeholder) === offset &&
    placeholder.parentNode
  ) {
    return {
      node: placeholder.parentNode,
      offset: Array.from(placeholder.parentNode.childNodes).indexOf(placeholder),
    }
  }

  const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT, {
    acceptNode: (node) =>
      node.parentElement?.closest('[data-editor-placeholder]')
        ? NodeFilter.FILTER_REJECT
        : NodeFilter.FILTER_ACCEPT,
  })
  let remainingOffset = offset
  let currentNode = walker.nextNode()

  while (currentNode) {
    const textLength = currentNode.textContent?.length ?? 0

    if (remainingOffset < textLength) {
      return { node: currentNode, offset: remainingOffset }
    }

    if (remainingOffset === textLength) {
      const nextNode = walker.nextNode()

      return nextNode
        ? { node: nextNode, offset: 0 }
        : { node: currentNode, offset: textLength }
    }

    remainingOffset -= textLength
    currentNode = walker.nextNode()
  }

  return null
}

function getTextOffsetBeforeElement(element: Element, target: Element): number {
  const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT)
  let offset = 0
  let currentNode = walker.nextNode()

  while (currentNode) {
    if (target.contains(currentNode)) {
      return offset
    }

    if (!currentNode.parentElement?.closest('[data-editor-placeholder]')) {
      offset += currentNode.textContent?.length ?? 0
    }

    currentNode = walker.nextNode()
  }

  return offset
}

function getEditorNodeText(node: Node): string {
  if (
    node instanceof HTMLElement &&
    node.matches('[data-editor-placeholder]')
  ) {
    return ''
  }

  if (node.nodeType === Node.TEXT_NODE) {
    return node.textContent ?? ''
  }

  if (node instanceof HTMLBRElement) {
    return '\n'
  }

  return Array.from(node.childNodes).map(getEditorNodeText).join('')
}

function getEditorContent(editor: HTMLDivElement): string {
  const contentRoot =
    editor.querySelector<HTMLElement>(':scope > [data-editor-content]') ??
    editor

  if (contentRoot === editor) {
    return Array.from(contentRoot.childNodes).map(getEditorNodeText).join('\n')
  }

  return Array.from(editor.childNodes)
    .map((node) =>
      node === contentRoot
        ? Array.from(contentRoot.childNodes).map(getEditorNodeText).join('\n')
        : getEditorNodeText(node),
    )
    .join('')
}

function removeEditorDomArtifacts(editor: HTMLDivElement) {
  const contentRoot = editor.querySelector(':scope > [data-editor-content]')

  if (!contentRoot) {
    return
  }

  Array.from(editor.childNodes).forEach((node) => {
    if (node !== contentRoot) {
      node.remove()
    }
  })
}

function getEditorOffsetAtPoint(
  editor: HTMLDivElement,
  node: Node,
  offset: number,
): number {
  const range = document.createRange()
  const fragmentContainer = document.createElement('div')

  range.selectNodeContents(editor)
  range.setEnd(node, offset)
  fragmentContainer.append(range.cloneContents())

  return getEditorContent(fragmentContainer).length
}

function getContentEditableSelection(
  editor: HTMLDivElement,
): EditorSelection | null {
  const selection = window.getSelection()

  if (
    !selection ||
    !selection.anchorNode ||
    !selection.focusNode ||
    !editor.contains(selection.anchorNode) ||
    !editor.contains(selection.focusNode)
  ) {
    return null
  }

  const anchor = getEditorOffsetAtPoint(
    editor,
    selection.anchorNode,
    selection.anchorOffset,
  )
  const focus = getEditorOffsetAtPoint(
    editor,
    selection.focusNode,
    selection.focusOffset,
  )

  return {
    start: Math.min(anchor, focus),
    end: Math.max(anchor, focus),
  }
}

function setContentEditableSelection(
  editor: HTMLDivElement,
  value: string,
  start: number,
  end = start,
) {
  const selection = window.getSelection()

  if (!selection) {
    return
  }

  if (!value || editor.children.length === 0) {
    const range = document.createRange()
    const contentRoot =
      editor.querySelector<HTMLElement>(':scope > [data-editor-content]') ??
      editor

    range.selectNodeContents(contentRoot)
    range.collapse(true)
    selection.removeAllRanges()
    selection.addRange(range)
    return
  }

  const startLinePosition = getLinePosition(value, start)
  const endLinePosition = getLinePosition(value, end)
  const contentRoot =
    editor.querySelector<HTMLElement>(':scope > [data-editor-content]') ??
    editor
  const startLine = contentRoot.children.item(startLinePosition.lineIndex)
  const endLine = contentRoot.children.item(endLinePosition.lineIndex)

  if (!startLine || !endLine) {
    return
  }

  const startPosition = getTextPosition(startLine, startLinePosition.column)
  const endPosition = getTextPosition(endLine, endLinePosition.column)

  if (!startPosition || !endPosition) {
    return
  }

  const range = document.createRange()

  range.setStart(startPosition.node, startPosition.offset)
  range.setEnd(endPosition.node, endPosition.offset)
  selection.removeAllRanges()
  selection.addRange(range)
}

function wrapEditorText(
  selectedText: string,
  fallbackText: string,
  prefix: string,
  suffix: string,
): EditorInsertion {
  const text = selectedText || fallbackText

  return {
    value: `${prefix}${text}${suffix}`,
    selectionStart: prefix.length,
    selectionEnd: prefix.length + text.length,
  }
}

function escapeHtmlAttribute(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('"', '&quot;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
}

function createUploadedImageMarkup(image: UploadedImage): string {
  return `<img src="${escapeHtmlAttribute(image.fileUrl)}" alt="${escapeHtmlAttribute(image.fileName)}" width="${image.width}" />`
}

function createEditorInsertion(
  action: FormattingAction,
  selectedText: string,
): EditorInsertion {
  switch (action) {
    case 'bold':
      return wrapEditorText(selectedText, '', '**', '**')
    case 'italic':
      return wrapEditorText(selectedText, '', '*', '*')
    case 'underline':
      return wrapEditorText(selectedText, '', '__', '__')
    case 'strike':
      return wrapEditorText(selectedText, '', '~~', '~~')
    case 'headingOne': {
      const value = selectedText
        ? selectedText
            .split('\n')
            .map((line) => `# ${line}`)
            .join('\n')
        : '# '

      return { value, selectionStart: value.length, selectionEnd: value.length }
    }
    case 'headingTwo': {
      const value = selectedText
        ? selectedText
            .split('\n')
            .map((line) => `## ${line}`)
            .join('\n')
        : '## '

      return { value, selectionStart: value.length, selectionEnd: value.length }
    }
    case 'unorderedList': {
      const value = selectedText
        ? selectedText
            .split('\n')
            .map((line) => `- ${line}`)
            .join('\n')
        : '- '

      return { value, selectionStart: value.length, selectionEnd: value.length }
    }
    case 'orderedList': {
      const value = selectedText
        ? selectedText
            .split('\n')
            .map((line, index) => `${index + 1}. ${line}`)
            .join('\n')
        : '1. '

      return { value, selectionStart: value.length, selectionEnd: value.length }
    }
    case 'code':
      return wrapEditorText(
        selectedText,
        'print("Hello, World!")',
        '```py\n',
        '\n```',
      )
    case 'quote': {
      const value = selectedText
        ? selectedText
            .split('\n')
            .map((line) => `> ${line}`)
            .join('\n')
        : '> '

      return { value, selectionStart: value.length, selectionEnd: value.length }
    }
    case 'link':
      return wrapEditorText(selectedText, '링크 텍스트', '[', '](https://)')
  }
}

export function CommunityWritePage() {
  const navigate = useNavigate()
  const editorBodyRef = useRef<HTMLDivElement>(null)
  const contentInputRef = useRef<HTMLDivElement>(null)
  const imageInputRef = useRef<HTMLInputElement>(null)
  const isComposingRef = useRef(false)
  const contentHistoryRef = useRef<EditorHistoryEntry[]>([
    { value: '', selectionStart: 0, selectionEnd: 0 },
  ])
  const contentHistoryIndexRef = useRef(0)
  const [category, setCategory] = useState<PostCategory | ''>('')
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([])
  const [isAnonymous, setIsAnonymous] = useState(false)
  const [isUploadingImage, setIsUploadingImage] = useState(false)
  const [imageUploadError, setImageUploadError] = useState<string | null>(null)
  const [selectionToolbarPosition, setSelectionToolbarPosition] =
    useState<SelectionToolbarPosition | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const commitContent = (
    nextValue: string,
    selectionStart = nextValue.length,
    selectionEnd = selectionStart,
  ) => {
    const history = contentHistoryRef.current
    const currentIndex = contentHistoryIndexRef.current
    const currentEntry = history[currentIndex]

    if (currentEntry?.value === nextValue) {
      history[currentIndex] = {
        value: nextValue,
        selectionStart,
        selectionEnd,
      }
      setContent(nextValue)
      return
    }

    const nextHistory = history.slice(0, currentIndex + 1)

    nextHistory.push({ value: nextValue, selectionStart, selectionEnd })

    if (nextHistory.length > MAX_EDITOR_HISTORY_LENGTH) {
      nextHistory.shift()
    }

    contentHistoryRef.current = nextHistory
    contentHistoryIndexRef.current = nextHistory.length - 1
    setContent(nextValue)
  }

  const restoreContentFromHistory = (direction: -1 | 1) => {
    const history = contentHistoryRef.current
    const nextIndex = Math.min(
      Math.max(contentHistoryIndexRef.current + direction, 0),
      history.length - 1,
    )

    if (nextIndex === contentHistoryIndexRef.current) {
      return
    }

    const nextEntry = history[nextIndex]

    contentHistoryIndexRef.current = nextIndex
    setContent(nextEntry.value)
    setSelectionToolbarPosition(null)
    window.requestAnimationFrame(() => {
      contentInputRef.current?.focus()
      if (contentInputRef.current) {
        setContentEditableSelection(
          contentInputRef.current,
          nextEntry.value,
          nextEntry.selectionStart,
          nextEntry.selectionEnd,
        )
      }
    })
  }

  const handleBackToList = () => {
    navigate('/community')
  }

  const handleEditorToolClick = (action: EditorAction) => {
    if (action === 'image') {
      imageInputRef.current?.click()
      setSelectionToolbarPosition(null)
      return
    }

    const contentInput = contentInputRef.current

    if (!contentInput) {
      return
    }

    const currentSelection = getContentEditableSelection(contentInput) ?? {
      start: content.length,
      end: content.length,
    }
    const selection = isLineEditorAction(action)
      ? getLineSelection(
          content,
          currentSelection.start,
          currentSelection.end,
        )
      : currentSelection
    const selectionStart = selection.start
    const selectionEnd = selection.end
    const selectedText = content.slice(selectionStart, selectionEnd)
    const insertion = createEditorInsertion(action, selectedText)
    const nextContent =
      content.slice(0, selectionStart) +
      insertion.value +
      content.slice(selectionEnd)
    const nextCaretPosition =
      selectionStart +
      (selectedText ? insertion.value.length : insertion.selectionEnd)

    commitContent(nextContent, nextCaretPosition)
    setSelectionToolbarPosition(null)
    window.requestAnimationFrame(() => {
      contentInput.focus()
      setContentEditableSelection(
        contentInput,
        nextContent,
        nextCaretPosition,
      )
    })
  }

  const updateSelectionToolbar = () => {
    const editorBody = editorBodyRef.current
    const contentInput = contentInputRef.current
    const domSelection = window.getSelection()

    if (!editorBody || !contentInput || !domSelection?.rangeCount) {
      setSelectionToolbarPosition(null)
      return
    }

    const selection = getContentEditableSelection(contentInput)

    if (!selection || selection.start === selection.end) {
      setSelectionToolbarPosition(null)
      return
    }

    const range = domSelection.getRangeAt(0)
    const selectionRect =
      range.getClientRects().item(0) ?? range.getBoundingClientRect()

    if (!selectionRect) {
      setSelectionToolbarPosition(null)
      return
    }

    const editorBodyRect = editorBody.getBoundingClientRect()
    const relativeTop = selectionRect.top - editorBodyRect.top
    const placement = relativeTop >= 52 ? 'above' : 'below'
    const toolbarHalfWidth = 116
    const left = Math.min(
      Math.max(
        selectionRect.left - editorBodyRect.left + selectionRect.width / 2,
        toolbarHalfWidth,
      ),
      Math.max(toolbarHalfWidth, editorBodyRect.width - toolbarHalfWidth),
    )

    setSelectionToolbarPosition({
      top:
        placement === 'above'
          ? relativeTop
          : selectionRect.bottom - editorBodyRect.top,
      left,
      placement,
    })
  }

  const handleContentSelection = () => {
    window.requestAnimationFrame(updateSelectionToolbar)
  }

  const handleContentMouseDown = (event: MouseEvent<HTMLDivElement>) => {
    const target = event.target

    if (!(target instanceof HTMLElement)) {
      return
    }

    const placeholder = target.closest('[data-editor-placeholder]')

    if (!placeholder?.parentNode) {
      return
    }

    event.preventDefault()

    const editor = event.currentTarget
    const placeholderIndex = Array.from(
      placeholder.parentNode.childNodes,
    ).indexOf(placeholder)
    const nextCaretPosition = getEditorOffsetAtPoint(
      editor,
      placeholder.parentNode,
      placeholderIndex,
    )

    editor.focus()
    setContentEditableSelection(
      editor,
      content,
      nextCaretPosition,
    )
  }

  const handleContentBlur = (event: FocusEvent<HTMLDivElement>) => {
    const nextTarget = event.relatedTarget

    if (
      nextTarget instanceof HTMLElement &&
      nextTarget.closest('[data-selection-toolbar]')
    ) {
      return
    }

    setSelectionToolbarPosition(null)
  }

  const handleImageSelection = async (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.currentTarget.files?.[0]

    event.currentTarget.value = ''

    if (!file || isUploadingImage) {
      return
    }

    if (!file.type.startsWith('image/')) {
      setImageUploadError('이미지 파일만 업로드할 수 있어요.')
      return
    }

    const contentInput = contentInputRef.current
    const caretPosition = contentInput
      ? (getContentEditableSelection(contentInput)?.start ?? content.length)
      : content.length

    setIsUploadingImage(true)
    setImageUploadError(null)

    try {
      const uploadedFile = await uploadCommunityImage(file)
      const imageName = uploadedFile.fileName || file.name

      setUploadedImages((images) => [
        ...images,
        {
          id: uploadedFile.key || `${file.name}-${Date.now()}`,
          width: DEFAULT_IMAGE_WIDTH,
          fileUrl: uploadedFile.url,
          fileName: imageName,
          fileType: uploadedFile.fileType || file.type,
          fileSize: uploadedFile.fileSize || file.size,
        },
      ])

      window.requestAnimationFrame(() => {
        const currentInput = contentInputRef.current

        if (!currentInput) {
          return
        }

        const nextCaretPosition = Math.min(
          caretPosition,
          content.length,
        )

        currentInput.focus()
        setContentEditableSelection(
          currentInput,
          content,
          nextCaretPosition,
        )
      })
    } catch {
      setImageUploadError(
        '이미지를 업로드하지 못했습니다. 잠시 후 다시 시도해주세요.',
      )
    } finally {
      setIsUploadingImage(false)
    }
  }

  const handleImageWidthChange = (imageId: string, width: number) => {
    const nextWidth = Math.min(
      Math.max(width, MIN_IMAGE_WIDTH),
      MAX_IMAGE_WIDTH,
    )

    setUploadedImages((images) =>
      images.map((image) =>
        image.id === imageId ? { ...image, width: nextWidth } : image,
      ),
    )
  }

  const handleImageRemove = (imageId: string) => {
    setUploadedImages((images) =>
      images.filter((image) => image.id !== imageId),
    )
  }

  const handleContentScroll = () => {
    window.requestAnimationFrame(updateSelectionToolbar)
  }

  const handleContentInput = (event: FormEvent<HTMLDivElement>) => {
    if (isComposingRef.current) {
      return
    }

    const editor = event.currentTarget
    const nextContent = getEditorContent(editor)
    const selection = getContentEditableSelection(editor) ?? {
      start: nextContent.length,
      end: nextContent.length,
    }

    removeEditorDomArtifacts(editor)
    commitContent(nextContent, selection.start, selection.end)
    setSelectionToolbarPosition(null)
    window.requestAnimationFrame(() => {
      setContentEditableSelection(
        editor,
        nextContent,
        selection.start,
        selection.end,
      )
    })
  }

  const handleContentCompositionStart = () => {
    isComposingRef.current = true
    setSelectionToolbarPosition(null)
  }

  const handleContentCompositionEnd = (
    event: CompositionEvent<HTMLDivElement>,
  ) => {
    const editor = event.currentTarget
    const nextContent = getEditorContent(editor)
    const selection = getContentEditableSelection(editor) ?? {
      start: nextContent.length,
      end: nextContent.length,
    }

    isComposingRef.current = false
    removeEditorDomArtifacts(editor)
    commitContent(nextContent, selection.start, selection.end)
    window.requestAnimationFrame(() => {
      setContentEditableSelection(
        editor,
        nextContent,
        selection.start,
        selection.end,
      )
    })
  }

  const handleContentKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (isComposingRef.current || event.nativeEvent.isComposing) {
      return
    }

    const normalizedKey = event.key.toLowerCase()
    const hasHistoryModifier = event.metaKey || event.ctrlKey
    const isUndo =
      hasHistoryModifier && normalizedKey === 'z' && !event.shiftKey
    const isRedo =
      hasHistoryModifier &&
      ((normalizedKey === 'z' && event.shiftKey) || normalizedKey === 'y')

    if (isUndo || isRedo) {
      event.preventDefault()
      restoreContentFromHistory(isUndo ? -1 : 1)
      return
    }

    if (event.key !== 'Backspace' && event.key !== 'Enter') {
      return
    }

    const contentInput = event.currentTarget
    const selection = getContentEditableSelection(contentInput) ?? {
      start: content.length,
      end: content.length,
    }
    const selectionStart = selection.start
    const selectionEnd = selection.end
    const lineStart = content.lastIndexOf('\n', selectionStart - 1) + 1
    const nextLineBreak = content.indexOf('\n', selectionStart)
    const lineEnd =
      nextLineBreak === -1 ? content.length : nextLineBreak
    const line = content.slice(lineStart, lineEnd)
    const quote = line.match(/^(\s*)>\s?(.*)$/)
    const listItem = line.match(/^(\s*)([-+*]|\d+\.)(\s+)(.*)$/)
    const commitAndRestore = (nextContent: string, nextCaretPosition: number) => {
      commitContent(nextContent, nextCaretPosition)
      setSelectionToolbarPosition(null)
      window.requestAnimationFrame(() => {
        contentInput.focus()
        setContentEditableSelection(
          contentInput,
          nextContent,
          nextCaretPosition,
        )
      })
    }

    if (
      event.key === 'Backspace' &&
      listItem &&
      selectionStart === selectionEnd &&
      selectionStart === lineEnd &&
      !listItem[4]
    ) {
      event.preventDefault()

      const indentation = listItem[1]
      const nextContent =
        content.slice(0, lineStart) +
        indentation +
        content.slice(lineEnd)
      const nextCaretPosition = lineStart + indentation.length

      commitAndRestore(nextContent, nextCaretPosition)
      return
    }

    if (event.key === 'Enter' && event.shiftKey && quote) {
      event.preventDefault()

      const nextQuotePrefix = `${quote[1]}> `
      const nextContent =
        content.slice(0, selectionStart) +
        `\n${nextQuotePrefix}` +
        content.slice(selectionEnd)
      const nextCaretPosition =
        selectionStart + nextQuotePrefix.length + 1

      commitAndRestore(nextContent, nextCaretPosition)
      return
    }

    if (event.key === 'Enter' && !event.shiftKey && listItem) {
      event.preventDefault()

      const isEmptyListItem =
        selectionStart === selectionEnd &&
        selectionStart === lineEnd &&
        !listItem[4]

      if (isEmptyListItem) {
        const indentation = listItem[1]
        const nextContent =
          content.slice(0, lineStart) +
          indentation +
          content.slice(lineEnd)
        const nextCaretPosition = lineStart + indentation.length

        commitAndRestore(nextContent, nextCaretPosition)
        return
      }

      const isOrderedList = /^\d+\.$/.test(listItem[2])
      const nextMarker = isOrderedList
        ? `${Number.parseInt(listItem[2], 10) + 1}.`
        : '-'
      const nextListPrefix = `${listItem[1]}${nextMarker} `
      const nextContent =
        content.slice(0, selectionStart) +
        `\n${nextListPrefix}` +
        content.slice(selectionEnd)
      const nextCaretPosition =
        selectionStart + nextListPrefix.length + 1

      commitAndRestore(nextContent, nextCaretPosition)
      return
    }

    if (selectionStart !== selectionEnd) {
      return
    }

    const emptyQuote = line.match(/^(\s*)>\s?$/)
    const shouldExitEmptyQuote =
      emptyQuote &&
      selectionStart === lineEnd &&
      (event.key === 'Backspace' ||
        (event.key === 'Enter' && !event.shiftKey))

    if (shouldExitEmptyQuote) {
      event.preventDefault()

      const indentation = emptyQuote[1]
      const nextContent =
        content.slice(0, lineStart) + indentation + content.slice(lineEnd)
      const nextCaretPosition = lineStart + indentation.length

      commitAndRestore(nextContent, nextCaretPosition)
      return
    }

    if (event.key === 'Enter') {
      event.preventDefault()

      const nextContent =
        content.slice(0, selectionStart) +
        '\n' +
        content.slice(selectionEnd)
      const nextCaretPosition = selectionStart + 1

      commitAndRestore(nextContent, nextCaretPosition)
    }
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (isUploadingImage) {
      setSubmitError('이미지 업로드가 완료될 때까지 기다려주세요.')
      return
    }

    const textContent = content.trim()
    const imageContent = uploadedImages
      .map(createUploadedImageMarkup)
      .join('\n')
    const postContent = [textContent, imageContent].filter(Boolean).join('\n\n')

    if (!category || !title.trim() || !postContent) {
      setSubmitError('카테고리와 제목, 내용을 모두 입력해주세요.')
      return
    }

    setIsSubmitting(true)
    setSubmitError(null)

    try {
      const post = await createPost({
        title: title.trim(),
        content: postContent,
        isAnonymous,
        category,
        files: uploadedImages.map(
          ({ fileUrl, fileName, fileType, fileSize }) => ({
            fileUrl,
            fileName,
            fileType,
            fileSize,
          }),
        ),
      })

      navigate(`/community/${post.postId}`, { replace: true })
    } catch {
      setSubmitError('게시글을 등록하지 못했습니다. 잠시 후 다시 시도해주세요.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <S.Page>
      <S.Content>
        <S.Header>
          <S.BackButton type="button" onClick={handleBackToList}>
            <S.BackIcon src={backChevronIcon} alt="" />
            목록 보기
          </S.BackButton>

          <S.WriteForm id="community-write-form" onSubmit={handleSubmit}>
            <S.TitleRow>
              <S.Heading>게시글 작성</S.Heading>
              <Button
                size="md"
                type="submit"
                disabled={isSubmitting || isUploadingImage}
              >
                {isSubmitting ? '게시 중' : '게시하기'}
              </Button>
            </S.TitleRow>

            <S.Fields>
              <S.CategoryField>
                <S.CategorySelect
                  value={category}
                  aria-label="카테고리"
                  required
                  disabled={isSubmitting}
                  onChange={(event) =>
                    setCategory(event.target.value as PostCategory | '')
                  }
                >
                  <option value="" disabled>
                    카테고리
                  </option>
                  {POST_CATEGORY_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </S.CategorySelect>
                <S.CategoryChevron src={attachmentChevronIcon} alt="" />
              </S.CategoryField>

              <S.TitleInput
                type="text"
                aria-label="게시글 제목"
                placeholder="제목을 입력해주세요"
                value={title}
                required
                disabled={isSubmitting}
                onChange={(event) => setTitle(event.target.value)}
              />
            </S.Fields>
          </S.WriteForm>
        </S.Header>

        <S.Editor aria-label="게시글 내용 편집기">
          <S.Toolbar>
            <S.ToolbarActions aria-label="서식 도구">
              {EDITOR_TOOLS.map((tool) => (
                <S.ToolbarButton
                  key={tool.label}
                  type="button"
                  aria-label={
                    tool.action === 'image' && isUploadingImage
                      ? '이미지 업로드 중'
                      : tool.label
                  }
                  disabled={
                    isSubmitting ||
                    (tool.action === 'image' && isUploadingImage)
                  }
                  onClick={() => handleEditorToolClick(tool.action)}
                >
                  <S.ToolbarIcon
                    src={tool.icon}
                    alt=""
                    $width={tool.width}
                    $height={tool.height}
                  />
                </S.ToolbarButton>
              ))}
            </S.ToolbarActions>

            <S.AnonymousLabel>
              익명으로 게시하기
              <S.AnonymousToggle
                type="checkbox"
                role="switch"
                checked={isAnonymous}
                disabled={isSubmitting}
                onChange={(event) => setIsAnonymous(event.target.checked)}
              />
            </S.AnonymousLabel>
          </S.Toolbar>

          <S.ImageInput
            ref={imageInputRef}
            type="file"
            accept="image/*"
            aria-label="게시글 이미지 선택"
            disabled={isSubmitting || isUploadingImage}
            onChange={handleImageSelection}
          />

          <S.EditorDivider />
          <S.EditorBody ref={editorBodyRef}>
            <S.RichTextInput
              ref={contentInputRef}
              role="textbox"
              aria-label="게시글 내용"
              aria-disabled={isSubmitting}
              aria-multiline="true"
              contentEditable={!isSubmitting}
              data-empty={content.length === 0}
              data-placeholder="어떤 내용을 공유하고 싶으신가요?"
              suppressContentEditableWarning
              onBlur={handleContentBlur}
              onCompositionEnd={handleContentCompositionEnd}
              onCompositionStart={handleContentCompositionStart}
              onFocus={handleContentSelection}
              onInput={handleContentInput}
              onKeyDown={handleContentKeyDown}
              onKeyUp={handleContentSelection}
              onMouseDown={handleContentMouseDown}
              onMouseUp={handleContentSelection}
              onSelect={handleContentSelection}
              onScroll={handleContentScroll}
            >
              <div key={content} data-editor-content>
                {content ? <InlineMarkdownPreview value={content} /> : null}
              </div>
            </S.RichTextInput>
            {selectionToolbarPosition && (
              <S.SelectionToolbar
                data-selection-toolbar
                role="toolbar"
                aria-label="선택한 글 서식"
                $top={selectionToolbarPosition.top}
                $left={selectionToolbarPosition.left}
                $placement={selectionToolbarPosition.placement}
              >
                {SELECTION_EDITOR_TOOLS.map((tool) => (
                  <S.SelectionToolbarButton
                    key={tool.label}
                    type="button"
                    aria-label={tool.label}
                    disabled={isSubmitting}
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={() => handleEditorToolClick(tool.action)}
                  >
                    <S.SelectionToolbarIcon
                      src={tool.icon}
                      alt=""
                      $width={tool.width}
                      $height={tool.height}
                    />
                  </S.SelectionToolbarButton>
                ))}
              </S.SelectionToolbar>
            )}
          </S.EditorBody>
          {uploadedImages.length > 0 && (
            <S.UploadedImageList aria-label="첨부 이미지 미리보기">
              {uploadedImages.map((image) => (
                <S.UploadedImageCard key={image.id}>
                  <S.UploadedImagePreview>
                    <S.UploadedImage
                      src={image.fileUrl}
                      alt={image.fileName}
                      $width={image.width}
                    />
                  </S.UploadedImagePreview>
                  <S.UploadedImageControls>
                    <S.UploadedImageName>{image.fileName}</S.UploadedImageName>
                    <S.ImageSizeLabel>
                      이미지 크기
                      <S.ImageSizeInput
                        type="range"
                        min={MIN_IMAGE_WIDTH}
                        max={MAX_IMAGE_WIDTH}
                        step={40}
                        value={image.width}
                        aria-label={`${image.fileName} 크기`}
                        onChange={(event) =>
                          handleImageWidthChange(
                            image.id,
                            Number(event.target.value),
                          )
                        }
                      />
                      <S.ImageSizeValue>{image.width}px</S.ImageSizeValue>
                    </S.ImageSizeLabel>
                    <S.ImageRemoveButton
                      type="button"
                      aria-label={`${image.fileName} 삭제`}
                      onClick={() => handleImageRemove(image.id)}
                    >
                      삭제
                    </S.ImageRemoveButton>
                  </S.UploadedImageControls>
                </S.UploadedImageCard>
              ))}
            </S.UploadedImageList>
          )}
        </S.Editor>
        {isUploadingImage && (
          <S.ImageUploadStatus role="status">
            이미지를 업로드하고 있어요.
          </S.ImageUploadStatus>
        )}
        {imageUploadError && (
          <S.SubmitError role="alert">{imageUploadError}</S.SubmitError>
        )}
        {submitError && (
          <S.SubmitError role="alert">{submitError}</S.SubmitError>
        )}
      </S.Content>
    </S.Page>
  )
}
