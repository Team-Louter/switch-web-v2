import { useEffect, useRef, useState } from 'react'
import type {
  ChangeEvent,
  ClipboardEvent,
  KeyboardEvent,
} from 'react'

import { MAX_CONTENT_LENGTH } from './MentoringComposer.constants'
import {
  isCursorInsideCodeBlock,
  resetTextareaHeight,
  restoreTextareaHeight,
} from './MentoringComposer.helpers'
import type {
  AttachedImage,
  MentoringComposerProps,
  UseMentoringComposerResult,
} from './MentoringComposer.types'

export function useMentoringComposer({
  isSubmitting = false,
  onSubmit,
}: Pick<MentoringComposerProps, 'isSubmitting' | 'onSubmit'>): UseMentoringComposerResult {
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

    const submittedContent = content
    const submittedImages = attachedImages

    // 전송 요청을 기다리는 동안에도 입력창을 즉시 비워 플레이스홀더를 보여준다.
    setContent('')
    setAttachedImages([])
    resetTextareaHeight(textareaRef.current)

    try {
      setIsSubmittingInternal(true)
      await onSubmit(
        submittedContent.trim(),
        submittedImages.map(({ file }) => file),
      )
    } catch {
      // 실패 시 초안과 첨부 이미지를 복원해 작성 중인 내용을 잃지 않게 한다.
      setContent(submittedContent)
      setAttachedImages(submittedImages)
      restoreTextareaHeight(textareaRef.current)
      return
    } finally {
      setIsSubmittingInternal(false)
    }

    submittedImages.forEach(({ previewUrl }) => URL.revokeObjectURL(previewUrl))
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

    if (nextContent.length > MAX_CONTENT_LENGTH) {
      return
    }

    setContent(nextContent)
    window.setTimeout(() => {
      textarea.focus()
      textarea.style.height = 'auto'
      textarea.style.height = `${textarea.scrollHeight}px`
      textarea.setSelectionRange(start + 4, start + 4 + selectedText.length)
    }, 0)
  }

  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    const value = event.currentTarget.value

    if (value.length > MAX_CONTENT_LENGTH) {
      return
    }

    event.currentTarget.style.height = 'auto'
    event.currentTarget.style.height = `${event.currentTarget.scrollHeight}px`
    setContent(value)
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key !== 'Enter' || event.nativeEvent.isComposing) {
      return
    }

    const isInsideCodeBlock = isCursorInsideCodeBlock(
      content,
      event.currentTarget.selectionStart,
    )
    const shouldSubmit = isInsideCodeBlock
      ? event.metaKey || event.ctrlKey
      : !event.metaKey && !event.ctrlKey && !event.shiftKey

    if (shouldSubmit) {
      event.preventDefault()
      void handleSubmit()
    }
  }

  const handlePaste = (event: ClipboardEvent<HTMLTextAreaElement>) => {
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

  const handleImageSelect = (event: ChangeEvent<HTMLInputElement>) => {
    appendImages(Array.from(event.target.files ?? []))
    event.target.value = ''
  }

  const handleRemoveImage = (previewUrl: string) => {
    URL.revokeObjectURL(previewUrl)
    setAttachedImages((currentImages) =>
      currentImages.filter((image) => image.previewUrl !== previewUrl),
    )
  }

  return {
    content,
    attachedImages,
    textareaRef,
    submitting,
    handleChange,
    handleKeyDown,
    handlePaste,
    handleImageSelect,
    handleRemoveImage,
    handleCodeInsert,
    handleSubmit,
  }
}
