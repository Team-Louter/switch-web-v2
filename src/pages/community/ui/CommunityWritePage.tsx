import {
  type ChangeEvent,
  type FocusEvent,
  Fragment,
  type FormEvent,
  type KeyboardEvent,
  type ReactNode,
  type UIEvent,
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

interface EditorSelection {
  start: number
  end: number
}

interface TextPosition {
  node: Text
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

const INLINE_MARKDOWN_PATTERN =
  /(\*\*[^*\n]+?\*\*|__[^_\n]+?__|~~[^~\n]+?~~|<u>[^<\n]+?<\/u>|`[^`\n]+?`|!\[[^\]\n]*?\]\([^)\n]+?\)|\[[^\]\n]+?\]\([^)\n]+?\)|\*[^*\n]+?\*)/g

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
          <S.FormattedText $format="bold">{token.slice(2, -2)}</S.FormattedText>
          <S.MarkdownSyntax>**</S.MarkdownSyntax>
        </Fragment>,
      )
    } else if (token.startsWith('__')) {
      nodes.push(
        <Fragment key={matchIndex}>
          <S.MarkdownSyntax>__</S.MarkdownSyntax>
          <S.FormattedText $format="underline">
            {token.slice(2, -2)}
          </S.FormattedText>
          <S.MarkdownSyntax>__</S.MarkdownSyntax>
        </Fragment>,
      )
    } else if (token.startsWith('~~')) {
      nodes.push(
        <Fragment key={matchIndex}>
          <S.MarkdownSyntax>~~</S.MarkdownSyntax>
          <S.FormattedText $format="strike">
            {token.slice(2, -2)}
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
            {token.slice(1, -1)}
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
      {renderedTokens.length > 0 ? renderedTokens : line || '\u200b'}
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
    return (
      <>
        <S.MarkdownSyntax>{heading[1]}</S.MarkdownSyntax>
        {heading[2]}
        <S.FormattedText $format="heading">
          {renderInlineMarkdown(heading[3])}
        </S.FormattedText>
      </>
    )
  }

  const listItem = line.match(/^(\s*)([-+*]|\d+\.)(\s+)(.*)$/)

  if (listItem) {
    return (
      <>
        {listItem[1]}
        <S.MarkdownSyntax>{listItem[2]}</S.MarkdownSyntax>
        {listItem[3]}
        {renderInlineMarkdown(listItem[4])}
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

  return line ? renderInlineMarkdown(line) : '\u200b'
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
        {renderEditorLineContent(quote[2])}
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
  const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT)
  let remainingOffset = offset
  let currentNode = walker.nextNode()

  while (currentNode) {
    const textLength = currentNode.textContent?.length ?? 0

    if (remainingOffset <= textLength) {
      return { node: currentNode as Text, offset: remainingOffset }
    }

    remainingOffset -= textLength
    currentNode = walker.nextNode()
  }

  return null
}

function getSelectionClientRect(
  preview: HTMLDivElement,
  value: string,
  selection: EditorSelection,
): DOMRect | null {
  const start = getLinePosition(value, selection.start)
  const end = getLinePosition(value, selection.end)
  const startLine = preview.children.item(start.lineIndex)
  const endLine = preview.children.item(end.lineIndex)

  if (!startLine || !endLine) {
    return null
  }

  const startPosition = getTextPosition(startLine, start.column)
  const endPosition = getTextPosition(endLine, end.column)

  if (!startPosition || !endPosition) {
    return null
  }

  const range = document.createRange()

  range.setStart(startPosition.node, startPosition.offset)
  range.setEnd(endPosition.node, endPosition.offset)

  return range.getClientRects().item(0) ?? range.getBoundingClientRect()
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

function createEditorInsertion(
  action: FormattingAction,
  selectedText: string,
): EditorInsertion {
  switch (action) {
    case 'bold':
      return wrapEditorText(selectedText, '굵은 텍스트', '**', '**')
    case 'italic':
      return wrapEditorText(selectedText, '기울임 텍스트', '*', '*')
    case 'underline':
      return wrapEditorText(selectedText, '밑줄 텍스트', '__', '__')
    case 'strike':
      return wrapEditorText(selectedText, '취소선 텍스트', '~~', '~~')
    case 'headingOne': {
      const value = (selectedText || '제목 1')
        .split('\n')
        .map((line) => `# ${line}`)
        .join('\n')

      return { value, selectionStart: 0, selectionEnd: value.length }
    }
    case 'headingTwo': {
      const value = (selectedText || '제목 2')
        .split('\n')
        .map((line) => `## ${line}`)
        .join('\n')

      return { value, selectionStart: 0, selectionEnd: value.length }
    }
    case 'unorderedList': {
      const value = (selectedText || '목록 항목')
        .split('\n')
        .map((line) => `- ${line}`)
        .join('\n')

      return { value, selectionStart: 0, selectionEnd: value.length }
    }
    case 'orderedList': {
      const value = (selectedText || '목록 항목')
        .split('\n')
        .map((line, index) => `${index + 1}. ${line}`)
        .join('\n')

      return { value, selectionStart: 0, selectionEnd: value.length }
    }
    case 'code':
      return wrapEditorText(selectedText, '코드', '```\n', '\n```')
    case 'quote': {
      const value = (selectedText || '인용문')
        .split('\n')
        .map((line) => `> ${line}`)
        .join('\n')

      return { value, selectionStart: 0, selectionEnd: value.length }
    }
    case 'link':
      return wrapEditorText(selectedText, '링크 텍스트', '[', '](https://)')
  }
}

export function CommunityWritePage() {
  const navigate = useNavigate()
  const editorBodyRef = useRef<HTMLDivElement>(null)
  const contentInputRef = useRef<HTMLTextAreaElement>(null)
  const inlinePreviewRef = useRef<HTMLDivElement>(null)
  const imageInputRef = useRef<HTMLInputElement>(null)
  const [category, setCategory] = useState<PostCategory | ''>('')
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [uploadedFiles, setUploadedFiles] = useState<PostFileRequest[]>([])
  const [isAnonymous, setIsAnonymous] = useState(false)
  const [isUploadingImage, setIsUploadingImage] = useState(false)
  const [imageUploadError, setImageUploadError] = useState<string | null>(null)
  const [selectionToolbarPosition, setSelectionToolbarPosition] =
    useState<SelectionToolbarPosition | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

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

    const selection = isLineEditorAction(action)
      ? getLineSelection(
          contentInput.value,
          contentInput.selectionStart,
          contentInput.selectionEnd,
        )
      : {
          start: contentInput.selectionStart,
          end: contentInput.selectionEnd,
        }
    const selectionStart = selection.start
    const selectionEnd = selection.end
    const selectedText = contentInput.value.slice(selectionStart, selectionEnd)
    const insertion = createEditorInsertion(action, selectedText)
    const nextContent =
      contentInput.value.slice(0, selectionStart) +
      insertion.value +
      contentInput.value.slice(selectionEnd)

    setContent(nextContent)
    setSelectionToolbarPosition(null)
    window.requestAnimationFrame(() => {
      contentInput.focus()
      contentInput.setSelectionRange(
        selectionStart + insertion.selectionStart,
        selectionStart + insertion.selectionEnd,
      )
    })
  }

  const updateSelectionToolbar = () => {
    const editorBody = editorBodyRef.current
    const contentInput = contentInputRef.current
    const preview = inlinePreviewRef.current

    if (!editorBody || !contentInput || !preview) {
      setSelectionToolbarPosition(null)
      return
    }

    const selection = {
      start: contentInput.selectionStart,
      end: contentInput.selectionEnd,
    }

    if (selection.start === selection.end) {
      setSelectionToolbarPosition(null)
      return
    }

    const selectionRect = getSelectionClientRect(
      preview,
      contentInput.value,
      selection,
    )

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

  const handleContentBlur = (event: FocusEvent<HTMLTextAreaElement>) => {
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
    const selectionStart = contentInput?.selectionStart ?? content.length
    const selectionEnd = contentInput?.selectionEnd ?? selectionStart

    setIsUploadingImage(true)
    setImageUploadError(null)

    try {
      const uploadedFile = await uploadCommunityImage(file)
      const currentContent = contentInputRef.current?.value ?? content
      const safeSelectionStart = Math.min(selectionStart, currentContent.length)
      const safeSelectionEnd = Math.min(selectionEnd, currentContent.length)
      const imageName = (uploadedFile.fileName || file.name)
        .replace(/[[\]\n]/g, ' ')
        .trim()
      const imageMarkdown = `![${imageName || '업로드한 이미지'}](${uploadedFile.url})`
      const nextContent =
        currentContent.slice(0, safeSelectionStart) +
        imageMarkdown +
        currentContent.slice(safeSelectionEnd)
      const nextCaretPosition = safeSelectionStart + imageMarkdown.length

      setContent(nextContent)
      setUploadedFiles((files) => [
        ...files,
        {
          fileUrl: uploadedFile.url,
          fileName: uploadedFile.fileName || file.name,
          fileType: uploadedFile.fileType || file.type,
          fileSize: uploadedFile.fileSize || file.size,
        },
      ])

      window.requestAnimationFrame(() => {
        contentInputRef.current?.focus()
        contentInputRef.current?.setSelectionRange(
          nextCaretPosition,
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

  const handleContentScroll = (event: UIEvent<HTMLTextAreaElement>) => {
    if (!inlinePreviewRef.current) {
      return
    }

    inlinePreviewRef.current.scrollTop = event.currentTarget.scrollTop
    inlinePreviewRef.current.scrollLeft = event.currentTarget.scrollLeft
    window.requestAnimationFrame(updateSelectionToolbar)
  }

  const handleContentKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key !== 'Backspace') {
      return
    }

    const contentInput = event.currentTarget
    const selectionStart = contentInput.selectionStart
    const selectionEnd = contentInput.selectionEnd

    if (selectionStart !== selectionEnd) {
      return
    }

    const lineStart = contentInput.value.lastIndexOf('\n', selectionStart - 1) + 1
    const nextLineBreak = contentInput.value.indexOf('\n', selectionStart)
    const lineEnd =
      nextLineBreak === -1 ? contentInput.value.length : nextLineBreak
    const line = contentInput.value.slice(lineStart, lineEnd)
    const emptyQuote = line.match(/^(\s*)>\s?$/)

    if (!emptyQuote || selectionStart !== lineEnd) {
      return
    }

    event.preventDefault()

    const indentation = emptyQuote[1]
    const nextContent =
      contentInput.value.slice(0, lineStart) +
      indentation +
      contentInput.value.slice(lineEnd)
    const nextCaretPosition = lineStart + indentation.length

    setContent(nextContent)
    window.requestAnimationFrame(() => {
      contentInput.focus()
      contentInput.setSelectionRange(nextCaretPosition, nextCaretPosition)
    })
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (isUploadingImage) {
      setSubmitError('이미지 업로드가 완료될 때까지 기다려주세요.')
      return
    }

    if (!category || !title.trim() || !content.trim()) {
      setSubmitError('카테고리와 제목, 내용을 모두 입력해주세요.')
      return
    }

    setIsSubmitting(true)
    setSubmitError(null)

    try {
      const post = await createPost({
        title: title.trim(),
        content: content.trim(),
        isAnonymous,
        category,
        files: uploadedFiles,
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
            <S.InlineMarkdownPreview ref={inlinePreviewRef} aria-hidden="true">
              <InlineMarkdownPreview value={content} />
            </S.InlineMarkdownPreview>
            <S.ContentInput
              ref={contentInputRef}
              aria-label="게시글 내용"
              placeholder="어떤 내용을 공유하고 싶으신가요?"
              value={content}
              required
              disabled={isSubmitting}
              onBlur={handleContentBlur}
              onChange={(event) => {
                setContent(event.target.value)
                setSelectionToolbarPosition(null)
              }}
              onKeyDown={handleContentKeyDown}
              onSelect={handleContentSelection}
              onScroll={handleContentScroll}
            />
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
