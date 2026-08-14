import '@blocknote/core/fonts/inter.css'
import '@blocknote/mantine/style.css'

import type { Block } from '@blocknote/core'
import { ko } from '@blocknote/core/locales'
import { BlockNoteView } from '@blocknote/mantine'
import { useCreateBlockNote } from '@blocknote/react'
import { type FormEvent, useCallback, useState } from 'react'
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
import { Button } from '@/shared/ui'

import attachmentChevronIcon from '../assets/svg/attachment-chevron.svg'
import backChevronIcon from '../assets/svg/back-chevron.svg'

import * as S from './CommunityWritePage.style'

interface UploadedImage extends PostFileRequest {
  id: string
}

function getEmbeddedImageUrls(blocks: readonly Block[]): Set<string> {
  const urls = new Set<string>()

  blocks.forEach((block) => {
    if ('url' in block.props && typeof block.props.url === 'string') {
      urls.add(block.props.url)
    }

    getEmbeddedImageUrls(block.children).forEach((url) => urls.add(url))
  })

  return urls
}

function hasPostContent(content: string): boolean {
  const textContent = content
    .replaceAll(/<[^>]*>/g, '')
    .replaceAll('&nbsp;', ' ')
    .trim()

  return Boolean(textContent) || /<(img|audio|video)\b/i.test(content)
}

export function CommunityWritePage() {
  const navigate = useNavigate()
  const [category, setCategory] = useState<PostCategory | ''>('')
  const [title, setTitle] = useState('')
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([])
  const [isAnonymous, setIsAnonymous] = useState(false)
  const [pendingImageUploadCount, setPendingImageUploadCount] = useState(0)
  const [imageUploadError, setImageUploadError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const isUploadingImage = pendingImageUploadCount > 0

  const handleImageUpload = useCallback(async (file: File) => {
    if (!file.type.startsWith('image/')) {
      const message = '이미지 파일만 업로드할 수 있어요.'

      setImageUploadError(message)
      throw new Error(message)
    }

    setPendingImageUploadCount((count) => count + 1)
    setImageUploadError(null)

    try {
      const uploadedFile = await uploadCommunityImage(file)
      const imageName = uploadedFile.fileName || file.name

      setUploadedImages((images) => [
        ...images,
        {
          id: uploadedFile.key || `${file.name}-${Date.now()}`,
          fileUrl: uploadedFile.url,
          fileName: imageName,
          fileType: uploadedFile.fileType || file.type,
          fileSize: uploadedFile.fileSize || file.size,
        },
      ])

      return { url: uploadedFile.url, name: imageName }
    } catch (error) {
      setImageUploadError(
        '이미지를 업로드하지 못했습니다. 잠시 후 다시 시도해주세요.',
      )
      throw error
    } finally {
      setPendingImageUploadCount((count) => count - 1)
    }
  }, [])

  const editor = useCreateBlockNote(
    {
      dictionary: ko,
      domAttributes: {
        editor: { 'aria-label': '게시글 내용' },
      },
      uploadFile: handleImageUpload,
    },
    [handleImageUpload],
  )

  const handleBackToList = () => {
    navigate('/community')
  }

  const handleEditorChange = () => {
    const embeddedImageUrls = getEmbeddedImageUrls(editor.document)

    setUploadedImages((images) => {
      const remainingImages = images.filter((image) =>
        embeddedImageUrls.has(image.fileUrl),
      )

      return remainingImages.length === images.length ? images : remainingImages
    })
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (isUploadingImage) {
      setSubmitError('이미지 업로드가 완료될 때까지 기다려주세요.')
      return
    }

    const postContent = editor.blocksToHTMLLossy()

    if (!category || !title.trim() || !hasPostContent(postContent)) {
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
            <p className="community-editor-guide">
              <strong>/</strong>를 입력해 블록을 추가하세요.
            </p>
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
          <div className="community-block-editor">
            <BlockNoteView
              editor={editor}
              editable={!isSubmitting}
              onChange={handleEditorChange}
            />
          </div>
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
