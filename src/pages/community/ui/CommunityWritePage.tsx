import { type FormEvent, useRef, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import { useNavigate } from 'react-router-dom'
import rehypeRaw from 'rehype-raw'
import rehypeSanitize, { defaultSchema } from 'rehype-sanitize'
import remarkGfm from 'remark-gfm'

import {
  POST_CATEGORY_OPTIONS,
  type PostCategory,
} from '@/entities/community'
import { createPost } from '@/features/community'

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

const markdownSanitizeSchema = {
  ...defaultSchema,
  tagNames: [...(defaultSchema.tagNames ?? []), 'u'],
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
  action: EditorAction,
  selectedText: string,
): EditorInsertion {
  switch (action) {
    case 'bold':
      return wrapEditorText(selectedText, '굵은 텍스트', '**', '**')
    case 'italic':
      return wrapEditorText(selectedText, '기울임 텍스트', '*', '*')
    case 'underline':
      return wrapEditorText(selectedText, '밑줄 텍스트', '<u>', '</u>')
    case 'strike':
      return wrapEditorText(selectedText, '취소선 텍스트', '~~', '~~')
    case 'headingOne':
      return wrapEditorText(selectedText, '제목 1', '# ', '')
    case 'headingTwo':
      return wrapEditorText(selectedText, '제목 2', '## ', '')
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
      return selectedText.includes('\n')
        ? wrapEditorText(selectedText, '코드', '```\n', '\n```')
        : wrapEditorText(selectedText, '코드', '`', '`')
    case 'quote': {
      const value = (selectedText || '인용문')
        .split('\n')
        .map((line) => `> ${line}`)
        .join('\n')

      return { value, selectionStart: 0, selectionEnd: value.length }
    }
    case 'link':
      return wrapEditorText(selectedText, '링크 텍스트', '[', '](https://)')
    case 'image':
      return wrapEditorText(selectedText, '이미지 설명', '![', '](https://)')
  }
}

export function CommunityWritePage() {
  const navigate = useNavigate()
  const contentInputRef = useRef<HTMLTextAreaElement>(null)
  const [category, setCategory] = useState<PostCategory | ''>('')
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [isAnonymous, setIsAnonymous] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const handleBackToList = () => {
    navigate('/community')
  }

  const handleEditorToolClick = (action: EditorAction) => {
    const contentInput = contentInputRef.current

    if (!contentInput) {
      return
    }

    const selectionStart = contentInput.selectionStart
    const selectionEnd = contentInput.selectionEnd
    const selectedText = contentInput.value.slice(selectionStart, selectionEnd)
    const insertion = createEditorInsertion(action, selectedText)
    const nextContent =
      contentInput.value.slice(0, selectionStart) +
      insertion.value +
      contentInput.value.slice(selectionEnd)

    setContent(nextContent)
    window.requestAnimationFrame(() => {
      contentInput.focus()
      contentInput.setSelectionRange(
        selectionStart + insertion.selectionStart,
        selectionStart + insertion.selectionEnd,
      )
    })
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

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
        files: [],
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
              <Button size="md" type="submit" disabled={isSubmitting}>
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
                  aria-label={tool.label}
                  disabled={isSubmitting}
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

          <S.EditorDivider />
          <S.EditorBody>
            <S.ContentInput
              ref={contentInputRef}
              aria-label="게시글 내용"
              placeholder="어떤 내용을 공유하고 싶으신가요?"
              value={content}
              required
              disabled={isSubmitting}
              onChange={(event) => setContent(event.target.value)}
            />
            <S.MarkdownPreview aria-label="게시글 실시간 미리보기">
              {content.trim() ? (
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[
                    rehypeRaw,
                    [rehypeSanitize, markdownSanitizeSchema],
                  ]}
                >
                  {content}
                </ReactMarkdown>
              ) : (
                <S.PreviewPlaceholder>
                  입력한 내용이 실시간으로 표시됩니다.
                </S.PreviewPlaceholder>
              )}
            </S.MarkdownPreview>
          </S.EditorBody>
        </S.Editor>
        {submitError && (
          <S.SubmitError role="alert">{submitError}</S.SubmitError>
        )}
      </S.Content>
    </S.Page>
  )
}
