import { useCallback, useEffect, useRef, useState } from 'react'
import type {
  ChangeEvent,
  ClipboardEvent,
  KeyboardEvent,
} from 'react'

import {
  LIMIT_FEEDBACK_DURATION_MS,
  MAX_CONTENT_LENGTH,
} from './MentoringComposer.constants'
import {
  isCursorInsideCodeBlock,
  resetTextareaHeight,
  resizeTextareaHeight,
  restoreTextareaHeight,
} from './MentoringComposer.helpers'
import type {
  AttachedImage,
  MentoringComposerProps,
  UseMentoringComposerResult,
} from './MentoringComposer.types'

export function useMentoringComposer({
  allowFileOnly = true,
  isSubmitting = false,
  onSubmit,
}: Pick<
  MentoringComposerProps,
  'allowFileOnly' | 'isSubmitting' | 'onSubmit'
>): UseMentoringComposerResult {
  const [content, setContent] = useState('')
  const [attachedImages, setAttachedImages] = useState<AttachedImage[]>([])
  const [isSubmittingInternal, setIsSubmittingInternal] = useState(false)
  const [limitFeedbackKey, setLimitFeedbackKey] = useState(0)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const attachedImagesRef = useRef<AttachedImage[]>([])
  const limitFeedbackTimerRef = useRef<number | null>(null)
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

  const canSubmit =
    content.trim().length > 0 || (allowFileOnly && attachedImages.length > 0)

  const showLimitFeedback = useCallback(() => {
    setLimitFeedbackKey((currentKey) => currentKey + 1)

    if (limitFeedbackTimerRef.current !== null) {
      window.clearTimeout(limitFeedbackTimerRef.current)
    }

    limitFeedbackTimerRef.current = window.setTimeout(() => {
      setLimitFeedbackKey(0)
      limitFeedbackTimerRef.current = null
    }, LIMIT_FEEDBACK_DURATION_MS)
  }, [])

  const handleSubmit = async () => {
    if (submitting || !canSubmit) {
      return
    }

    const submittedContent = content
    const submittedImages = attachedImages

    // 전송 요청을 기다리는 동안에도 입력창을 즉시 비워 플레이스홀더를 보여준다.
    setContent('')
    setLimitFeedbackKey(0)
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
      showLimitFeedback()
      return
    }

    setContent(nextContent)
    window.setTimeout(() => {
      textarea.focus()
      resizeTextareaHeight(textarea)
      textarea.setSelectionRange(start + 4, start + 4 + selectedText.length)
    }, 0)
  }

  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    const value = event.currentTarget.value

    if (value.length > MAX_CONTENT_LENGTH) {
      showLimitFeedback()
      return
    }

    if (value.length < MAX_CONTENT_LENGTH) {
      setLimitFeedbackKey(0)
    }

    resizeTextareaHeight(event.currentTarget)
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

    if (imageFiles.length > 0) {
      event.preventDefault()
      appendImages(imageFiles)
      return
    }

    const pastedText = event.clipboardData
      .getData('text/plain')
      .replace(/\r\n?/g, '\n')
    const textarea = event.currentTarget
    const selectedLength = textarea.selectionEnd - textarea.selectionStart

    if (
      textarea.value.length - selectedLength + pastedText.length > MAX_CONTENT_LENGTH
    ) {
      showLimitFeedback()
    }
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

  useEffect(() => {
    const textarea = textareaRef.current

    if (!textarea) {
      return
    }

    let compositionBaseLength: number | null = null

    const handleCompositionStart = () => {
      compositionBaseLength =
        textarea.value.length - (textarea.selectionEnd - textarea.selectionStart)
    }
    const handleCompositionEnd = () => {
      compositionBaseLength = null
    }
    const handleBeforeInput = (event: InputEvent) => {
      if (
        ![
          'insertText',
          'insertCompositionText',
          'insertLineBreak',
          'insertParagraph',
        ].includes(event.inputType)
      ) {
        return
      }

      const insertedLength =
        event.inputType === 'insertLineBreak' || event.inputType === 'insertParagraph'
          ? 1
          : (event.data?.length ?? 0)
      const baseLength =
        event.isComposing && compositionBaseLength !== null
          ? compositionBaseLength
          : textarea.value.length - (textarea.selectionEnd - textarea.selectionStart)

      if (baseLength + insertedLength > MAX_CONTENT_LENGTH) {
        showLimitFeedback()
      }
    }

    // maxLength로 입력이 차단돼도 초과 시도를 감지하도록 원본 이벤트를 구독한다.
    textarea.addEventListener('beforeinput', handleBeforeInput)
    textarea.addEventListener('compositionstart', handleCompositionStart)
    textarea.addEventListener('compositionend', handleCompositionEnd)

    return () => {
      textarea.removeEventListener('beforeinput', handleBeforeInput)
      textarea.removeEventListener('compositionstart', handleCompositionStart)
      textarea.removeEventListener('compositionend', handleCompositionEnd)

      if (limitFeedbackTimerRef.current !== null) {
        window.clearTimeout(limitFeedbackTimerRef.current)
      }
    }
  }, [showLimitFeedback])

  return {
    canSubmit,
    content,
    limitFeedbackKey,
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
