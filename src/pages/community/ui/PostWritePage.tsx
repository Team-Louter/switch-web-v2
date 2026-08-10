import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'

import type { PostCategory } from '@/shared/constants/community'
import { Button } from '@/shared/ui'
import { ChevronLeftIcon } from '@/shared/ui/icons'
import type { PostFileRequest } from '@/entities/post'
import {
  CategorySelect,
  PostEditor,
  createPost,
  uploadFile,
} from '@/features/post'

import {
  BackButton,
  Body,
  IconBox,
  PageTitle,
} from './CommunityLayout.style'
import {
  EditorArea,
  ErrorText,
  FieldRow,
  Header,
  HeaderInner,
  TitleInput,
  TitleRow,
} from './PostWritePage.style'

const WriteBody = styled(Body)`
  gap: 20px;
`

export function PostWritePage() {
  const navigate = useNavigate()

  const [category, setCategory] = useState<PostCategory>()
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [isAnonymous, setIsAnonymous] = useState(false)
  const [files, setFiles] = useState<PostFileRequest[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const canSubmit = Boolean(category) && Boolean(title.trim()) && Boolean(content.trim())

  /**
   * 본문에 넣을 이미지를 업로드하고 첨부 파일 목록에도 추가한다.
   *
   * @param file 업로드할 이미지 파일
   */
  const handleImageUpload = async (file: File) => {
    try {
      const uploaded = await uploadFile(file)
      setFiles((prev) => [...prev, uploaded])
      return uploaded
    } catch {
      setErrorMessage('이미지를 업로드하지 못했습니다. 잠시 후 다시 시도해주세요.')
      return null
    }
  }

  const handleSubmit = async () => {
    if (!category || !canSubmit || isSubmitting) return

    try {
      setIsSubmitting(true)
      setErrorMessage('')

      const created = await createPost({
        title: title.trim(),
        content: content.trim(),
        isAnonymous,
        category,
        files,
      })

      navigate(`/community/${created.postId}`, { replace: true })
    } catch {
      setErrorMessage('게시글을 등록하지 못했습니다. 잠시 후 다시 시도해주세요.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <WriteBody>
      <Header>
        <BackButton type="button" onClick={() => navigate('/community')}>
          <IconBox>
            <ChevronLeftIcon aria-hidden="true" />
          </IconBox>
          목록 보기
        </BackButton>
        <HeaderInner>
          <TitleRow>
            <PageTitle>게시글 작성</PageTitle>
            <Button
              size="md"
              disabled={!canSubmit || isSubmitting}
              onClick={handleSubmit}
            >
              게시하기
            </Button>
          </TitleRow>
          <FieldRow>
            <CategorySelect value={category} onChange={setCategory} />
            <TitleInput
              placeholder="제목을 입력해주세요."
              value={title}
              onChange={(event) => setTitle(event.target.value)}
            />
          </FieldRow>
        </HeaderInner>
      </Header>
      {/* 등록 / 업로드에 실패했을 때만 안내 문구를 보여준다 */}
      {errorMessage && <ErrorText>{errorMessage}</ErrorText>}
      <EditorArea>
        <PostEditor
          value={content}
          onChange={setContent}
          isAnonymous={isAnonymous}
          onAnonymousChange={setIsAnonymous}
          onImageUpload={handleImageUpload}
        />
      </EditorArea>
    </WriteBody>
  )
}
