import {
  PiCode,
  PiImage,
  PiPaperPlaneTilt,
  PiSpinnerGap,
  PiTrash,
} from 'react-icons/pi'

import * as S from './MentoringComposer.style'
import { MAX_CONTENT_LENGTH } from './MentoringComposer.constants'
import type { MentoringComposerProps } from './MentoringComposer.types'
import { useMentoringComposer } from './useMentoringComposer'

export function MentoringComposer({
  isSubmitting = false,
  onSubmit,
  placeholder,
}: MentoringComposerProps) {
  const {
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
  } = useMentoringComposer({ isSubmitting, onSubmit })

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
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onPaste={handlePaste}
        />
      </S.TextareaWrap>

      <S.Toolbar>
        <S.ToolGroup>
          <S.ImageButton aria-label="이미지 첨부">
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
            {content.length}/{MAX_CONTENT_LENGTH}
          </S.CharacterCount>
          <S.IconButton
            type="button"
            aria-label="전송"
            aria-busy={submitting}
            disabled={
              submitting || (!content.trim() && attachedImages.length === 0)
            }
            onClick={() => void handleSubmit()}
          >
            {submitting ? (
              <S.SubmitSpinner aria-hidden="true">
                <PiSpinnerGap />
              </S.SubmitSpinner>
            ) : (
              <PiPaperPlaneTilt aria-hidden="true" />
            )}
          </S.IconButton>
        </S.ToolGroup>
      </S.Toolbar>
    </S.Wrapper>
  )
}
