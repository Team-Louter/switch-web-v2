import type {
  ChangeEvent,
  ClipboardEvent,
  KeyboardEvent,
  RefObject,
} from 'react'

export interface AttachedImage {
  file: File
  previewUrl: string
}

export interface MentoringComposerProps {
  isSubmitting?: boolean
  onSubmit: (content: string, files: File[]) => Promise<void>
  placeholder: string
}

export interface MentoringComposerHandlers {
  handleChange: (event: ChangeEvent<HTMLTextAreaElement>) => void
  handleKeyDown: (event: KeyboardEvent<HTMLTextAreaElement>) => void
  handlePaste: (event: ClipboardEvent<HTMLTextAreaElement>) => void
  handleImageSelect: (event: ChangeEvent<HTMLInputElement>) => void
  handleRemoveImage: (previewUrl: string) => void
  handleCodeInsert: () => void
  handleSubmit: () => Promise<void>
}

export interface UseMentoringComposerResult
  extends MentoringComposerHandlers {
  content: string
  attachedImages: AttachedImage[]
  textareaRef: RefObject<HTMLTextAreaElement | null>
  submitting: boolean
}
