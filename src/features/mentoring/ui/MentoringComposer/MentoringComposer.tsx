import { useEffect, useRef, useState } from 'react'
import { PiCode, PiImage, PiPaperPlaneTilt, PiTrash } from 'react-icons/pi'

import * as S from './MentoringComposer.style'

const MAX_LENGTH = 700

interface AttachedImage {
  file: File
  previewUrl: string
}

interface MentoringComposerProps {
  isSubmitting?: boolean
  onSubmit: (content: string, files: File[]) => Promise<void>
  placeholder: string
}

export function MentoringComposer({
  isSubmitting = false,
  onSubmit,
  placeholder,
}: MentoringComposerProps) {
  const [content, setContent] = useState('')
  const [attachedImages, setAttachedImages] = useState<AttachedImage[]>([])
  const [isSubmittingInternal, setIsSubmittingInternal] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const attachedImagesRef = useRef<AttachedImage[]>([])
  const submitting = isSubmitting || isSubmittingInternal

  useEffect(() => {
    attachedImagesRef.current = attachedImages
  }, [attachedImages])

  useEffect(() => {
    return () => {
      attachedImagesRef.current.forEach(({ previewUrl }) =>
        URL.revokeObjectURL(previewUrl),
      )
    }
  }, [])

  const appendImages = (files: File[]) => {
    const imageFiles = files.filter((file) => file.type.startsWith('image/'))

    if (imageFiles.length === 0) {
      return
    }

    setAttachedImages((currentImages) => [
      ...currentImages,
      ...imageFiles.map((file) => ({
        file,
        previewUrl: URL.createObjectURL(file),
      })),
    ])
  }

  const handleSubmit = async () => {
    if (submitting || (!content.trim() && attachedImages.length === 0)) {
      return
    }

    try {
      setIsSubmittingInternal(true)
      await onSubmit(
        content.trim(),
        attachedImages.map(({ file }) => file),
      )
    } catch {
      // 전송에 실패하면 작성 중인 내용을 유지한다.
      return
    } finally {
      setIsSubmittingInternal(false)
    }

    attachedImages.forEach(({ previewUrl }) => URL.revokeObjectURL(previewUrl))
    setContent('')
    setAttachedImages([])
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
    }
  }

  const handleCodeInsert = () => {
    const textarea = textareaRef.current

    if (!textarea) {
      return
    }

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = content.slice(start, end)
    const snippet = `\`\`\`\n${selectedText}\n\`\`\``
    const nextContent = content.slice(0, start) + snippet + content.slice(end)

    if (nextContent.length > MAX_LENGTH) {
      return
    }

    setContent(nextContent)
    window.setTimeout(() => {
      textarea.focus()
      textarea.setSelectionRange(start + 4, start + 4 + selectedText.length)
    }, 0)
  }

  const handleChange = (value: string) => {
    if (value.length > MAX_LENGTH) {
      return
    }

    setContent(value)
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (
      event.key === 'Enter' &&
      !event.metaKey &&
      !event.shiftKey &&
      !event.nativeEvent.isComposing
    ) {
      event.preventDefault()
      void handleSubmit()
    }
  }

  const handlePaste = (event: React.ClipboardEvent<HTMLTextAreaElement>) => {
    const imageFiles = Array.from(event.clipboardData.items)
      .filter((item) => item.kind === 'file' && item.type.startsWith('image/'))
      .map((item) => item.getAsFile())
      .filter((file): file is File => file !== null)

    if (imageFiles.length === 0) {
      return
    }

    event.preventDefault()
    appendImages(imageFiles)
  }

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    appendImages(Array.from(event.target.files ?? []))
    event.target.value = ''
  }

  const handleRemoveImage = (previewUrl: string) => {
    URL.revokeObjectURL(previewUrl)
    setAttachedImages((currentImages) =>
      currentImages.filter((image) => image.previewUrl !== previewUrl),
    )
  }

  return (
    <S.Wrapper>
      {attachedImages.length > 0 && (
        <S.ImagePreviewArea>
          {attachedImages.map(({ file, previewUrl }) => (
            <S.ImagePreviewItem key={previewUrl}>
              <S.PreviewImage src={previewUrl} alt={file.name} />
              <S.RemoveImageButton
                type="button"
                aria-label={`${file.name} 첨부 삭제`}
                disabled={submitting}
                onClick={() => handleRemoveImage(previewUrl)}
              >
                <PiTrash aria-hidden="true" />
              </S.RemoveImageButton>
            </S.ImagePreviewItem>
          ))}
        </S.ImagePreviewArea>
      )}

      <S.TextareaWrap>
        <S.Textarea
          ref={textareaRef}
          rows={1}
          value={content}
          disabled={submitting}
          placeholder={submitting ? '전송 중...' : placeholder}
          onChange={(event) => {
            event.currentTarget.style.height = 'auto'
            event.currentTarget.style.height = `${event.currentTarget.scrollHeight}px`
            handleChange(event.target.value)
          }}
          onKeyDown={handleKeyDown}
          onPaste={handlePaste}
        />
      </S.TextareaWrap>

      <S.Toolbar>
        <S.ToolGroup>
          <S.ImageButton
            aria-label="이미지 첨부"
          >
            <PiImage aria-hidden="true" />
            <input
              type="file"
              accept="image/*"
              multiple
              disabled={submitting}
              onChange={handleImageSelect}
            />
          </S.ImageButton>
          <S.IconButton
            type="button"
            aria-label="코드 블록 삽입"
            disabled={submitting}
            onClick={handleCodeInsert}
          >
            <PiCode aria-hidden="true" />
          </S.IconButton>
        </S.ToolGroup>
        <S.ToolGroup>
          <S.CharacterCount>
            {content.length}/{MAX_LENGTH}
          </S.CharacterCount>
          <S.IconButton
            type="button"
            aria-label="전송"
            disabled={
              submitting || (!content.trim() && attachedImages.length === 0)
            }
            onClick={() => void handleSubmit()}
          >
            <PiPaperPlaneTilt aria-hidden="true" />
          </S.IconButton>
        </S.ToolGroup>
      </S.Toolbar>
    </S.Wrapper>
  )
}
