import '@blocknote/core/fonts/inter.css'
import '@blocknote/mantine/style.css'

import {
  type ComputeDropPositionContext,
  SideMenuExtension,
} from '@blocknote/core/extensions'
import { ko } from '@blocknote/core/locales'
import { BlockNoteView } from '@blocknote/mantine'
import {
  SideMenu,
  SideMenuController,
  type SideMenuProps,
  useCreateBlockNote,
} from '@blocknote/react'
import {
  type ChangeEvent,
  type DragEvent as ReactDragEvent,
  type FormEvent,
  type MouseEvent as ReactMouseEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import {
  getCommunityFileDownloadUrl,
  getCommunityFileKey,
  getPost,
  POST_CATEGORY_OPTIONS,
  type PostCategory,
  type PostTag,
} from '@/entities/community'
import {
  createPost,
  updatePost,
  uploadCommunityFile,
} from '@/features/community'
import {
  parseBlockNotePostContent,
  serializeBlockNotePostContent,
} from '@/shared/lib/blockNotePostContent'
import { Button } from '@/shared/ui'

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
import paperclipIcon from '../assets/svg/paperclip.svg'
import quoteIcon from '../assets/svg/editor-quote.svg'
import strikeIcon from '../assets/svg/editor-strike.svg'
import underlineIcon from '../assets/svg/editor-underline.svg'
import unorderedListIcon from '../assets/svg/editor-unordered-list.svg'

import * as S from './CommunityWritePage.style'

interface UploadedFile {
  id: string
  fileKey: string
  fileName: string
  fileType: string
  fileSize: number
}

interface BlockDropIndicatorPosition {
  left: number
  top: number
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
  | 'file'

interface EditorTool {
  action: EditorAction
  label: string
  icon: string
}

const COMMUNITY_EDITOR_DICTIONARY = {
  ...ko,
  placeholders: {
    ...ko.placeholders,
    default: undefined,
    emptyDocument: '내용을 입력해주세요.',
  },
}

const EDITOR_TOOLS: EditorTool[] = [
  { action: 'bold', label: '굵게', icon: boldIcon },
  { action: 'italic', label: '기울임', icon: italicIcon },
  { action: 'underline', label: '밑줄', icon: underlineIcon },
  { action: 'strike', label: '취소선', icon: strikeIcon },
  { action: 'headingOne', label: '제목 1', icon: headingOneIcon },
  { action: 'headingTwo', label: '제목 2', icon: headingTwoIcon },
  {
    action: 'unorderedList',
    label: '글머리 기호 목록',
    icon: unorderedListIcon,
  },
  { action: 'orderedList', label: '번호 목록', icon: orderedListIcon },
  { action: 'code', label: '코드 블록', icon: codeIcon },
  { action: 'quote', label: '인용문', icon: quoteIcon },
  { action: 'link', label: '링크', icon: linkIcon },
  { action: 'image', label: '이미지', icon: imageIcon },
  { action: 'file', label: '파일 첨부', icon: paperclipIcon },
]

function hasPostContent(content: string): boolean {
  const textContent = content
    .replaceAll(/<[^>]*>/g, '')
    .replaceAll('&nbsp;', ' ')
    .trim()

  return Boolean(textContent) || /<(img|audio|video)\b/i.test(content)
}

function getCommunityDropCursorPosition({
  event,
  defaultPosition,
}: ComputeDropPositionContext) {
  return event.dataTransfer?.types.includes('blocknote/html')
    ? null
    : defaultPosition
}

function CommunityBlockSideMenu(props: SideMenuProps) {
  return (
    <S.BlockSideMenu>
      <SideMenu {...props} />
    </S.BlockSideMenu>
  )
}

export function CommunityWritePage() {
  const navigate = useNavigate()
  const { postId: postIdParam } = useParams()
  const isEditRoute = postIdParam !== undefined
  const editingPostId = Number(postIdParam)
  const isEditing =
    isEditRoute && Number.isSafeInteger(editingPostId) && editingPostId > 0
  const invalidEditRoute = isEditRoute && !isEditing
  const imageInputRef = useRef<HTMLInputElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const editorAreaRef = useRef<HTMLElement>(null)
  const [category, setCategory] = useState<PostCategory | ''>('')
  const [tag, setTag] = useState<PostTag | undefined>(undefined)
  const [title, setTitle] = useState('')
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const [isAnonymous, setIsAnonymous] = useState(false)
  const [pendingFileUploadCount, setPendingFileUploadCount] = useState(0)
  const [fileUploadError, setFileUploadError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [isPostLoading, setIsPostLoading] = useState(isEditing)
  const [postLoadError, setPostLoadError] = useState<string | null>(null)
  const [blockDropIndicator, setBlockDropIndicator] =
    useState<BlockDropIndicatorPosition | null>(null)
  const isUploadingFile = pendingFileUploadCount > 0
  const visiblePostLoadError = invalidEditRoute
    ? '올바르지 않은 게시글 주소입니다.'
    : postLoadError
  const isEditorDisabled =
    isSubmitting || isPostLoading || Boolean(visiblePostLoadError)

  const uploadPostFile = useCallback(
    async (file: File) => {
      setPendingFileUploadCount((count) => count + 1)
      setFileUploadError(null)

      try {
        const uploadedFile = await uploadCommunityFile(file)
        const fileKey = uploadedFile.key.trim()
        const fileUrl = getCommunityFileDownloadUrl(fileKey)
        const fileName = uploadedFile.fileName || file.name

        if (!fileUrl) {
          throw new Error('파일 다운로드 URL을 생성하지 못했습니다.')
        }

        setUploadedFiles((files) => [
          ...files,
          {
            id: fileKey,
            fileKey,
            fileName,
            fileType: uploadedFile.fileType || file.type,
            fileSize: uploadedFile.fileSize || file.size,
          },
        ])

        return { url: fileUrl, name: fileName }
      } catch (error) {
        setFileUploadError(
          '파일을 업로드하지 못했습니다. 잠시 후 다시 시도해주세요.',
        )
        throw error
      } finally {
        setPendingFileUploadCount((count) => count - 1)
      }
    },
    [],
  )

  const handleEditorFileUpload = useCallback(
    (file: File) => uploadPostFile(file),
    [uploadPostFile],
  )

  const editor = useCreateBlockNote(
    {
      dictionary: COMMUNITY_EDITOR_DICTIONARY,
      domAttributes: {
        editor: { 'aria-label': '게시글 내용' },
      },
      dropCursor: {
        hooks: { computeDropPosition: getCommunityDropCursorPosition },
      },
      uploadFile: handleEditorFileUpload,
    },
    [handleEditorFileUpload],
  )

  const handleBackToList = () => {
    navigate(isEditing ? `/community/${editingPostId}` : '/community')
  }

  const handleEditorToolClick = (action: EditorAction) => {
    if (action === 'image') {
      imageInputRef.current?.click()
      return
    }

    if (action === 'file') {
      fileInputRef.current?.click()
      return
    }

    if (action === 'link') {
      const url = window.prompt('링크 주소를 입력해주세요.')

      if (url?.trim()) {
        editor.createLink(url.trim(), editor.getSelectedText() || undefined)
      }

      editor.focus()
      return
    }

    const currentBlock = editor.getTextCursorPosition().block

    switch (action) {
      case 'bold':
        editor.toggleStyles({ bold: true })
        break
      case 'italic':
        editor.toggleStyles({ italic: true })
        break
      case 'underline':
        editor.toggleStyles({ underline: true })
        break
      case 'strike':
        editor.toggleStyles({ strike: true })
        break
      case 'headingOne':
        editor.updateBlock(currentBlock, {
          type: 'heading',
          props: { level: 1 },
        })
        break
      case 'headingTwo':
        editor.updateBlock(currentBlock, {
          type: 'heading',
          props: { level: 2 },
        })
        break
      case 'unorderedList':
        editor.updateBlock(currentBlock, { type: 'bulletListItem' })
        break
      case 'orderedList':
        editor.updateBlock(currentBlock, { type: 'numberedListItem' })
        break
      case 'code':
        editor.updateBlock(currentBlock, { type: 'codeBlock' })
        break
      case 'quote':
        editor.updateBlock(currentBlock, { type: 'quote' })
        break
      default:
        break
    }

    editor.focus()
  }

  const handleImageSelection = async (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    const [file] = Array.from(event.target.files ?? [])

    event.target.value = ''

    if (!file) {
      return
    }

    try {
      const uploadedImage = await handleEditorFileUpload(file)
      const currentBlock = editor.getTextCursorPosition().block
      const [imageBlock] = editor.insertBlocks(
        [
          {
            type: 'image',
            props: {
              url: uploadedImage.url,
              name: uploadedImage.name,
            },
          },
        ],
        currentBlock,
        'after',
      )

      editor.setTextCursorPosition(imageBlock, 'end')
    } catch {
      // 이미지 업로드 실패 메시지는 handleImageUpload에서 표시합니다.
    }
  }

  const handleFileSelection = async (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    const files = Array.from(event.target.files ?? [])

    event.target.value = ''

    if (files.length === 0) {
      return
    }

    let currentBlock = editor.getTextCursorPosition().block

    for (const file of files) {
      try {
        const uploadedFile = await handleEditorFileUpload(file)
        const [fileBlock] = editor.insertBlocks(
          [
            {
              type: 'file',
              props: {
                url: uploadedFile.url,
                name: uploadedFile.name,
              },
            },
          ],
          currentBlock,
          'after',
        )

        const insertedFileBlock = fileBlock
          ? editor.getBlock(fileBlock.id)
          : undefined

        if (insertedFileBlock) {
          currentBlock = insertedFileBlock
        }
      } catch {
        // 파일 업로드 실패 메시지는 uploadPostFile에서 표시합니다.
      }
    }

    editor.setTextCursorPosition(currentBlock, 'end')
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (isEditRoute && !isEditing) {
      setSubmitError('올바르지 않은 게시글 주소입니다.')
      return
    }

    if (isPostLoading || postLoadError) {
      return
    }

    if (isUploadingFile) {
      setSubmitError('파일 업로드가 완료될 때까지 기다려주세요.')
      return
    }

    const postContentHtml = editor.blocksToHTMLLossy()

    if (!category || !title.trim() || !hasPostContent(postContentHtml)) {
      setSubmitError('카테고리와 제목, 내용을 모두 입력해주세요.')
      return
    }

    const postContent = serializeBlockNotePostContent(editor.document)

    setIsSubmitting(true)
    setSubmitError(null)

    try {
      const postRequest = {
        title: title.trim(),
        content: postContent,
        isAnonymous,
        category,
        tag,
        files: uploadedFiles.map(
          ({ fileKey, fileName, fileType, fileSize }) => ({
            fileUrl: fileKey,
            fileName,
            fileType,
            fileSize,
          }),
        ),
      }
      const post = isEditing
        ? await updatePost(editingPostId, postRequest)
        : await createPost(postRequest)

      navigate(`/community/${post.postId}`, { replace: true })
    } catch {
      setSubmitError(
        isEditing
          ? '게시글을 수정하지 못했습니다. 잠시 후 다시 시도해주세요.'
          : '게시글을 등록하지 못했습니다. 잠시 후 다시 시도해주세요.',
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEditorDragOver = (event: ReactDragEvent<HTMLElement>) => {
    if (!event.dataTransfer.types.includes('blocknote/html')) {
      return
    }

    const editorArea = editorAreaRef.current
    const target = event.target

    if (!editorArea || !(target instanceof Element)) {
      return
    }

    const blockElement = target.closest<HTMLElement>(
      '[data-node-type="blockContainer"]',
    )

    if (!blockElement) {
      return
    }

    const editorBounds = editorArea.getBoundingClientRect()
    const blockBounds = blockElement.getBoundingClientRect()
    const scaleX = editorBounds.width / editorArea.offsetWidth
    const scaleY = editorBounds.height / editorArea.offsetHeight
    const targetTop =
      event.clientY < blockBounds.top + blockBounds.height / 2
        ? blockBounds.top
        : blockBounds.bottom
    const nextIndicator = {
      left: (blockBounds.left - editorBounds.left) / scaleX,
      top: (targetTop - editorBounds.top) / scaleY,
      width: blockBounds.width / scaleX,
    }

    setBlockDropIndicator((indicator) => {
      if (
        indicator?.left === nextIndicator.left &&
        indicator.top === nextIndicator.top &&
        indicator.width === nextIndicator.width
      ) {
        return indicator
      }

      return nextIndicator
    })
  }

  const handleEditorContentAreaClick = (
    event: ReactMouseEvent<HTMLDivElement>,
  ) => {
    if (
      isEditorDisabled ||
      isUploadingFile ||
      !(event.target instanceof Element) ||
      event.target.closest('.bn-block-outer')
    ) {
      return
    }

    const lastBlock = editor.document.at(-1)

    if (!lastBlock) {
      editor.focus()
      return
    }

    if (
      lastBlock.type === 'paragraph' &&
      Array.isArray(lastBlock.content) &&
      lastBlock.content.length === 0
    ) {
      editor.setTextCursorPosition(lastBlock, 'end')
      return
    }

    const [emptyBlock] = editor.insertBlocks(
      [{ type: 'paragraph' }],
      lastBlock,
      'after',
    )

    if (emptyBlock) {
      editor.setTextCursorPosition(emptyBlock, 'start')
    }
  }

  const handleEditorDragLeave = (event: ReactDragEvent<HTMLElement>) => {
    if (
      event.relatedTarget instanceof Node &&
      event.currentTarget.contains(event.relatedTarget)
    ) {
      return
    }

    setBlockDropIndicator(null)
  }

  const hideBlockDropIndicator = () => {
    setBlockDropIndicator(null)
  }

  useEffect(() => {
    if (!isEditRoute) {
      return
    }

    if (!isEditing) {
      return
    }

    let isCancelled = false

    async function loadPostForEdit() {
      setIsPostLoading(true)
      setPostLoadError(null)

      try {
        const post = await getPost(editingPostId)
        const postBlocks = parseBlockNotePostContent(post.postContent)
        const contentBlocks =
          postBlocks ?? editor.tryParseHTMLToBlocks(post.postContent)

        if (isCancelled) {
          return
        }

        setCategory(post.category)
        setTag(post.tag)
        setTitle(post.postTitle)
        setIsAnonymous(post.isAnonymous)
        setUploadedFiles(
          post.files?.map((file) => ({
            id: String(file.fileId),
            fileKey: getCommunityFileKey(file.fileUrl) ?? file.fileUrl,
            fileName: file.fileName,
            fileType: file.fileType,
            fileSize: file.fileSize,
          })) ?? [],
        )

        if (contentBlocks.length > 0) {
          editor.replaceBlocks(editor.document, contentBlocks)
        }
      } catch {
        if (!isCancelled) {
          setPostLoadError(
            '게시글을 불러오지 못했습니다. 목록으로 돌아가 다시 시도해주세요.',
          )
        }
      } finally {
        if (!isCancelled) {
          setIsPostLoading(false)
        }
      }
    }

    void loadPostForEdit()

    return () => {
      isCancelled = true
    }
  }, [editor, editingPostId, isEditing, isEditRoute])

  useEffect(() => {
    const handleDocumentMouseMove = (event: MouseEvent) => {
      const editorBounds = editorAreaRef.current?.getBoundingClientRect()

      if (!editorBounds) {
        return
      }

      const isWithinEditorWidth =
        event.clientX >= editorBounds.left && event.clientX <= editorBounds.right

      if (!isWithinEditorWidth) {
        editor
          .getExtension(SideMenuExtension)
          ?.hideMenuIfNotFrozen()
      }
    }

    document.addEventListener('mousemove', handleDocumentMouseMove)
    document.addEventListener('dragend', hideBlockDropIndicator)

    return () => {
      document.removeEventListener('mousemove', handleDocumentMouseMove)
      document.removeEventListener('dragend', hideBlockDropIndicator)
    }
  }, [editor])

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
              <S.Heading>{isEditRoute ? '게시글 수정' : '게시글 작성'}</S.Heading>
              <Button
                size="md"
                type="submit"
                disabled={isEditorDisabled || isUploadingFile}
              >
                {isPostLoading
                  ? '불러오는 중'
                  : isSubmitting
                    ? isEditing
                      ? '저장 중'
                      : '게시 중'
                    : isEditing
                      ? '저장하기'
                      : '게시하기'}
              </Button>
            </S.TitleRow>

            <S.Fields>
              <S.CategoryField>
                <S.CategorySelect
                  value={category}
                  aria-label="카테고리"
                  required
                  disabled={isEditorDisabled}
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
                disabled={isEditorDisabled}
                onChange={(event) => setTitle(event.target.value)}
              />
            </S.Fields>
          </S.WriteForm>
        </S.Header>

        <S.Editor
          ref={editorAreaRef}
          aria-label="게시글 내용 편집기"
          onDragOver={handleEditorDragOver}
          onDragLeave={handleEditorDragLeave}
          onDrop={hideBlockDropIndicator}
        >
          {blockDropIndicator && (
            <S.BlockDropIndicator
              $left={blockDropIndicator.left}
              $top={blockDropIndicator.top}
              $width={blockDropIndicator.width}
            />
          )}
          <S.Toolbar>
            <div className="community-toolbar-actions" aria-label="서식 도구">
              {EDITOR_TOOLS.map((tool) => (
                <button
                  key={tool.action}
                  className="community-toolbar-button"
                  type="button"
                  aria-label={tool.label}
                  title={tool.label}
                  disabled={isEditorDisabled || isUploadingFile}
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={() => handleEditorToolClick(tool.action)}
                >
                  <img src={tool.icon} alt="" />
                </button>
              ))}
            </div>
            <S.AnonymousLabel>
              익명으로 게시하기
              <S.AnonymousToggle
                type="checkbox"
                role="switch"
                checked={isAnonymous}
                disabled={isEditorDisabled}
                onChange={(event) => setIsAnonymous(event.target.checked)}
              />
            </S.AnonymousLabel>
          </S.Toolbar>

          <S.EditorDivider />
          <input
            ref={imageInputRef}
            className="community-image-input"
            type="file"
            accept="image/*"
            tabIndex={-1}
            aria-hidden="true"
            disabled={isEditorDisabled}
            onChange={handleImageSelection}
          />
          <input
            ref={fileInputRef}
            className="community-file-input"
            type="file"
            multiple
            tabIndex={-1}
            aria-hidden="true"
            disabled={isEditorDisabled}
            onChange={handleFileSelection}
          />
          <div
            className="community-block-editor"
            onClick={handleEditorContentAreaClick}
          >
            <BlockNoteView
              editor={editor}
              editable={!isEditorDisabled}
              sideMenu={false}
              portalElements={{ default: null }}
            >
              <SideMenuController sideMenu={CommunityBlockSideMenu} />
            </BlockNoteView>
            {isUploadingFile && (
              <S.FileUploadSkeleton
                role="status"
                aria-label="파일을 업로드하는 중입니다."
              />
            )}
          </div>
        </S.Editor>
        {isUploadingFile && (
          <S.FileUploadStatus role="status">
            파일을 업로드하고 있어요.
          </S.FileUploadStatus>
        )}
        {fileUploadError && (
          <S.SubmitError role="alert">{fileUploadError}</S.SubmitError>
        )}
        {submitError && (
          <S.SubmitError role="alert">{submitError}</S.SubmitError>
        )}
        {visiblePostLoadError && (
          <S.SubmitError role="alert">
            {visiblePostLoadError}
          </S.SubmitError>
        )}
      </S.Content>
    </S.Page>
  )
}
