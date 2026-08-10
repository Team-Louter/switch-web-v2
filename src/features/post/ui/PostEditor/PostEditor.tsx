import type { ChangeEvent, ComponentType, SVGProps } from 'react'
import { useRef, useState } from 'react'

import {
  BoldIcon,
  CodeIcon,
  HeadingOneIcon,
  HeadingTwoIcon,
  ImageIcon,
  ItalicIcon,
  LinkIcon,
  ListOrderedIcon,
  ListUnorderedIcon,
  QuoteIcon,
  StrikeIcon,
  UnderlineIcon,
} from '@/shared/ui/icons'
import type { PostFileRequest } from '@/entities/post'

import {
  applyMarkdown,
  insertImageMarkdown,
  type MarkdownCommand,
  type MarkdownResult,
} from '../../lib/markdown'
import {
  AnonymousArea,
  AnonymousLabel,
  ContentInput,
  Divider,
  Editor,
  HiddenFileInput,
  Switch,
  ToolButton,
  ToolGroup,
  Toolbar,
} from './PostEditor.style'

type ToolbarItem = {
  command: MarkdownCommand
  label: string
  Icon: ComponentType<SVGProps<SVGSVGElement>>
}

const TOOLBAR_ITEMS: ToolbarItem[] = [
  { command: 'bold', label: '굵게', Icon: BoldIcon },
  { command: 'italic', label: '기울임', Icon: ItalicIcon },
  { command: 'underline', label: '밑줄', Icon: UnderlineIcon },
  { command: 'strike', label: '취소선', Icon: StrikeIcon },
  { command: 'heading1', label: '제목 1', Icon: HeadingOneIcon },
  { command: 'heading2', label: '제목 2', Icon: HeadingTwoIcon },
  { command: 'unorderedList', label: '글머리 기호 목록', Icon: ListUnorderedIcon },
  { command: 'orderedList', label: '번호 목록', Icon: ListOrderedIcon },
  { command: 'code', label: '코드', Icon: CodeIcon },
  { command: 'quote', label: '인용', Icon: QuoteIcon },
  { command: 'link', label: '링크', Icon: LinkIcon },
]

type PostEditorProps = {
  value: string
  onChange: (value: string) => void
  isAnonymous: boolean
  onAnonymousChange: (isAnonymous: boolean) => void
  onImageUpload: (file: File) => Promise<PostFileRequest | null>
}

export function PostEditor({
  value,
  onChange,
  isAnonymous,
  onAnonymousChange,
  onImageUpload,
}: PostEditorProps) {
  const contentRef = useRef<HTMLTextAreaElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isUploading, setIsUploading] = useState(false)

  /**
   * 마크다운 적용 결과를 내용에 반영하고 커서 위치를 되돌린다.
   *
   * @param result 마크다운 적용 결과
   */
  const applyResult = (result: MarkdownResult) => {
    onChange(result.value)

    requestAnimationFrame(() => {
      const textarea = contentRef.current
      if (!textarea) return

      textarea.focus()
      textarea.setSelectionRange(result.selectionStart, result.selectionEnd)
    })
  }

  const handleCommandClick = (command: MarkdownCommand) => {
    const textarea = contentRef.current
    if (!textarea) return

    applyResult(
      applyMarkdown(command, {
        value,
        start: textarea.selectionStart,
        end: textarea.selectionEnd,
      }),
    )
  }

  const handleImageChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    event.target.value = ''

    if (!file) return

    const textarea = contentRef.current
    const start = textarea?.selectionStart ?? value.length
    const end = textarea?.selectionEnd ?? value.length

    try {
      setIsUploading(true)
      const uploaded = await onImageUpload(file)

      if (!uploaded) return

      applyResult(
        insertImageMarkdown(
          { value, start, end },
          uploaded.fileName,
          uploaded.fileUrl,
        ),
      )
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <Editor>
      <Toolbar>
        <ToolGroup>
          {TOOLBAR_ITEMS.map(({ command, label, Icon }) => (
            <ToolButton
              key={command}
              type="button"
              title={label}
              aria-label={label}
              onClick={() => handleCommandClick(command)}
            >
              <Icon aria-hidden="true" />
            </ToolButton>
          ))}
          <ToolButton
            type="button"
            title="이미지"
            aria-label="이미지"
            disabled={isUploading}
            onClick={() => fileInputRef.current?.click()}
          >
            <ImageIcon aria-hidden="true" />
          </ToolButton>
          <HiddenFileInput
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageChange}
          />
        </ToolGroup>
        <AnonymousArea>
          <AnonymousLabel>익명으로 게시하기</AnonymousLabel>
          <Switch
            type="button"
            role="switch"
            aria-checked={isAnonymous}
            aria-label="익명으로 게시하기"
            $on={isAnonymous}
            onClick={() => onAnonymousChange(!isAnonymous)}
          />
        </AnonymousArea>
      </Toolbar>
      <Divider aria-hidden="true" />
      <ContentInput
        ref={contentRef}
        placeholder="내용을 입력해주세요."
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </Editor>
  )
}
