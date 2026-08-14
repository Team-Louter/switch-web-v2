import { type ChangeEvent, type FormEvent, useRef, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import { useNavigate } from 'react-router-dom'
import rehypeRaw from 'rehype-raw'
import rehypeSanitize, { defaultSchema } from 'rehype-sanitize'
import remarkGfm from 'remark-gfm'

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

const DEFAULT_IMAGE_WIDTH = 520
const MIN_IMAGE_WIDTH = 160
const MAX_IMAGE_WIDTH = 960

const markdownSanitizeSchema = {
  ...defaultSchema,
  tagNames: [...(defaultSchema.tagNames ?? []), 'u'],
  attributes: {
    ...defaultSchema.attributes,
    img: [...(defaultSchema.attributes?.img ?? []), 'alt', 'width'],
  },
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
      return wrapEditorText(selectedText, '굵게 텍스트', '**', '**')
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
      return wrapEditorText(
        selectedText,
        'print("Hello, World!")',
        '```py\n',
        '\n```',
      )
    case 'quote':
      return wrapEditorText(selectedText, '인용문', '> ', '')
    case 'link':
      return wrapEditorText(selectedText, '링크 텍스트', '[', '](https://)')
  }
}

export function CommunityWritePage() {
  const navigate = useNavigate()
  const contentInputRef = useRef<HTMLTextAreaElement>(null)
  const imageInputRef = useRef<HTMLInputElement>(null)
  const [category, setCategory] = useState<PostCategory | ''>('')
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([])
  const [isAnonymous, setIsAnonymous] = useState(false)
  const [isUploadingImage, setIsUploadingImage] = useState(false)
  const [imageUploadError, setImageUploadError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const previewContent = [
    content.trim(),
    uploadedImages.map(createUploadedImageMarkup).join('\n'),
  ]
    .filter(Boolean)
    .join('\n\n')

  const handleBackToList = () => {
    navigate('/community')
  }

  const handleEditorToolClick = (action: EditorAction) => {
    if (action === 'image') {
      imageInputRef.current?.click()
      return
    }

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

    const caretPosition = contentInputRef.current?.selectionStart ?? content.length

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
        const contentInput = contentInputRef.current

        if (!contentInput) {
          return
        }

        const nextCaretPosition = Math.min(caretPosition, content.length)

        contentInput.focus()
        contentInput.setSelectionRange(nextCaretPosition, nextCaretPosition)
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

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (isUploadingImage) {
      setSubmitError('이미지 업로드가 완료될 때까지 기다려주세요.')
      return
    }

    const postContent = previewContent

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
          <S.EditorContent>
            <S.EditorPane aria-label="마크다운 작성 영역">
              <S.EditorPaneLabel>작성</S.EditorPaneLabel>
              <S.EditorBody>
                <S.RichTextInput
                  ref={contentInputRef}
                  aria-label="게시글 내용"
                  placeholder="어떤 내용을 공유하고 싶으신가요?"
                  value={content}
                  required
                  disabled={isSubmitting}
                  onChange={(event) => setContent(event.target.value)}
                />
              </S.EditorBody>
            </S.EditorPane>
            <S.EditorPane aria-label="마크다운 미리보기 영역">
              <S.EditorPaneLabel>미리보기</S.EditorPaneLabel>
              <S.MarkdownPreview>
                {previewContent ? (
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    rehypePlugins={[
                      rehypeRaw,
                      [rehypeSanitize, markdownSanitizeSchema],
                    ]}
                  >
                    {previewContent}
                  </ReactMarkdown>
                ) : (
                  <S.PreviewPlaceholder>
                    작성한 마크다운이 여기에 표시됩니다.
                  </S.PreviewPlaceholder>
                )}
              </S.MarkdownPreview>
            </S.EditorPane>
          </S.EditorContent>
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
