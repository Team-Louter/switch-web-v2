import '@blocknote/core/fonts/inter.css';
import '@blocknote/mantine/style.css';

import {
  type ComputeDropPositionContext,
  SideMenuExtension,
} from '@blocknote/core/extensions';
import { ko } from '@blocknote/core/locales';
import { BlockNoteView } from '@blocknote/mantine';
import {
  AddBlockButton,
  DragHandleMenu,
  FormattingToolbarController,
  SideMenu,
  SideMenuController,
  useBlockNoteEditor,
  useComponentsContext,
  useCreateBlockNote,
  useDictionary,
  useExtension,
  useExtensionState,
} from '@blocknote/react';
import { isAxiosError } from 'axios';
import { MdDragIndicator } from 'react-icons/md';
import {
  type ChangeEvent,
  type ClipboardEvent as ReactClipboardEvent,
  type DragEvent as ReactDragEvent,
  type FocusEvent as ReactFocusEvent,
  type FormEvent,
  type KeyboardEvent as ReactKeyboardEvent,
  type MouseEvent as ReactMouseEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

import {
  getCommunityFileDownloadUrl,
  getCommunityFileKey,
  getPost,
  getPostTagLabel,
  POST_CATEGORY_OPTIONS,
  POST_TAG_OPTIONS_BY_CATEGORY,
  type PostCategory,
  type PostTag,
} from '@/entities/community';
import {
  createPost,
  updatePost,
  uploadCommunityFile,
} from '@/features/community';
import {
  parseBlockNotePostContent,
  serializeBlockNotePostContent,
} from '@/shared/lib/blockNotePostContent';
import { Button } from '@/shared/ui';

import attachmentChevronIcon from '../assets/svg/attachment-chevron.svg';
import backChevronIcon from '../assets/svg/back-chevron.svg';
import boldIcon from '../assets/svg/editor-bold.svg';
import codeIcon from '../assets/svg/editor-code.svg';
import headingOneIcon from '../assets/svg/editor-heading-one.svg';
import headingTwoIcon from '../assets/svg/editor-heading-two.svg';
import imageIcon from '../assets/svg/editor-image.svg';
import italicIcon from '../assets/svg/editor-italic.svg';
import linkIcon from '../assets/svg/editor-link.svg';
import orderedListIcon from '../assets/svg/editor-ordered-list.svg';
import paperclipIcon from '../assets/svg/paperclip.svg';
import quoteIcon from '../assets/svg/editor-quote.svg';
import strikeIcon from '../assets/svg/editor-strike.svg';
import underlineIcon from '../assets/svg/editor-underline.svg';
import unorderedListIcon from '../assets/svg/editor-unordered-list.svg';

import * as S from './CommunityWritePage.style';

interface UploadedFile {
  id: string;
  fileKey: string;
  fileName: string;
  fileType: string;
  fileSize: number;
}

interface BlockDropIndicatorPosition {
  left: number;
  top: number;
  width: number;
}

interface BlockDragOverEvent {
  clientX: number;
  clientY: number;
  dataTransfer: DataTransfer | null;
  target: EventTarget | null;
}

interface CommunityBlockSideMenuProps {
  onBlockMenuClick: (blockId: string) => void;
  onBlockDragStart: (blockId: string) => void;
  onBlockDragEnd: () => void;
}

interface CommunityDragHandleButtonProps {
  onBlockMenuOpen: (blockId: string) => void;
  onBlockDragStart: (blockId: string) => void;
  onBlockDragEnd: () => void;
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
  | 'file';

interface EditorTool {
  action: EditorAction;
  label: string;
  icon: string;
}

const COMMUNITY_EDITOR_DICTIONARY = {
  ...ko,
  placeholders: {
    ...ko.placeholders,
    default: undefined,
    emptyDocument: '/를 입력해 명령어 사용',
  },
};

const COMMUNITY_TITLE_MAX_LENGTH = 100;
const COMMUNITY_CONTENT_MAX_LENGTH = 20_000;

function getTitleTagPrefix(tag: PostTag | undefined): string {
  return tag ? `[${getPostTagLabel(tag)}] ` : '';
}

function removeTitleTagPrefix(title: string, tag: PostTag | undefined): string {
  const titleTagPrefix = getTitleTagPrefix(tag);
  const titleTagMarker = titleTagPrefix.trimEnd();

  if (!titleTagMarker || !title.startsWith(titleTagMarker)) {
    return title;
  }

  return title.slice(titleTagMarker.length).trimStart();
}

function applyTitleTagPrefix(title: string, tag: PostTag | undefined): string {
  const titleTagPrefix = getTitleTagPrefix(tag);
  const titleWithoutTag = removeTitleTagPrefix(title, tag);

  return `${titleTagPrefix}${titleWithoutTag}`.slice(
    0,
    COMMUNITY_TITLE_MAX_LENGTH,
  );
}

function keepTitleCursorAfterPrefix(
  input: HTMLInputElement,
  prefixLength: number,
): void {
  const selectionStart = input.selectionStart ?? 0;
  const selectionEnd = input.selectionEnd ?? selectionStart;

  if (selectionStart >= prefixLength && selectionEnd >= prefixLength) {
    return;
  }

  input.setSelectionRange(
    Math.max(prefixLength, selectionStart),
    Math.max(prefixLength, selectionEnd),
  );
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
];

function hasPostContent(content: string): boolean {
  const textContent = getCommunityTextContent(content).trim()

  return Boolean(textContent) || /<(img|audio|video)\b/i.test(content)
}

function getCommunityTextContent(content: string): string {
  return content
    .replaceAll(/<[^>]*>/g, '')
    .replaceAll('&nbsp;', ' ')
}

function getCommunityRequestErrorMessage(
  error: unknown,
  fallbackMessage: string,
): string {
  if (!isAxiosError<unknown>(error)) {
    return fallbackMessage;
  }

  const responseData = error.response?.data;

  if (typeof responseData === 'string' && responseData.trim()) {
    return responseData.trim();
  }

  if (typeof responseData !== 'object' || responseData === null) {
    return fallbackMessage;
  }

  const responseRecord = responseData as Record<string, unknown>;

  for (const key of ['message', 'error']) {
    const message = responseRecord[key];

    if (typeof message === 'string' && message.trim()) {
      return message.trim();
    }
  }

  return fallbackMessage;
}

function getCommunityDropCursorPosition({
  event,
  defaultPosition,
}: ComputeDropPositionContext) {
  return event.dataTransfer?.types.includes('blocknote/html')
    ? null
    : defaultPosition;
}

function CommunityDragHandleButton({
  onBlockMenuOpen,
  onBlockDragStart,
  onBlockDragEnd,
}: CommunityDragHandleButtonProps) {
  const Components = useComponentsContext()!;
  const dictionary = useDictionary();
  const editor = useBlockNoteEditor();
  const sideMenu = useExtension(SideMenuExtension, { editor });
  const block = useExtensionState(SideMenuExtension, {
    editor,
    selector: (state) => state?.block,
  });

  if (!block) {
    return null;
  }

  return (
    <Components.Generic.Menu.Root
      onOpenChange={(isOpen) => {
        if (isOpen) {
          sideMenu.freezeMenu();
          onBlockMenuOpen(block.id);
        } else {
          sideMenu.unfreezeMenu();
        }
      }}
      position="left"
    >
      <Components.Generic.Menu.Trigger>
        <Components.SideMenu.Button
          className="bn-button"
          label={dictionary.side_menu.drag_handle_label}
          draggable={true}
          onClick={() => onBlockMenuOpen(block.id)}
          onDragStart={(event) => {
            onBlockDragStart(block.id);
            sideMenu.blockDragStart(event, block);
          }}
          onDragEnd={() => {
            sideMenu.blockDragEnd();
            onBlockDragEnd();
          }}
          icon={<MdDragIndicator size={24} data-test="dragHandle" />}
        />
      </Components.Generic.Menu.Trigger>
      <DragHandleMenu />
    </Components.Generic.Menu.Root>
  );
}

function CommunityBlockSideMenu({
  onBlockMenuClick,
  onBlockDragStart,
  onBlockDragEnd,
}: CommunityBlockSideMenuProps) {
  return (
    <S.BlockSideMenu>
      <SideMenu>
        <AddBlockButton />
        <CommunityDragHandleButton
          onBlockMenuOpen={onBlockMenuClick}
          onBlockDragStart={onBlockDragStart}
          onBlockDragEnd={onBlockDragEnd}
        />
      </SideMenu>
    </S.BlockSideMenu>
  );
}

export function CommunityWritePage() {
  const navigate = useNavigate();
  const { postId: postIdParam } = useParams();
  const isEditRoute = postIdParam !== undefined;
  const editingPostId = Number(postIdParam);
  const isEditing =
    isEditRoute && Number.isSafeInteger(editingPostId) && editingPostId > 0;
  const invalidEditRoute = isEditRoute && !isEditing;
  const imageInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const editorAreaRef = useRef<HTMLElement>(null);
  const categoryFieldRef = useRef<HTMLDivElement>(null);
  const draggedBlockIdRef = useRef<string | null>(null);
  const isPostLoadingRef = useRef(false);
  const [category, setCategory] = useState<PostCategory | ''>('');
  const [categoryAnimationKey, setCategoryAnimationKey] = useState(0);
  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false);
  const [tag, setTag] = useState<PostTag | undefined>(undefined);
  const [title, setTitle] = useState('');
  const [contentLength, setContentLength] = useState(0);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [pendingFileUploadCount, setPendingFileUploadCount] = useState(0);
  const [fileUploadError, setFileUploadError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [isEditorPlaceholderVisible, setIsEditorPlaceholderVisible] =
    useState(false);
  const [isPostLoading, setIsPostLoading] = useState(isEditing);
  const [postLoadError, setPostLoadError] = useState<string | null>(null);
  const [blockDropIndicator, setBlockDropIndicator] =
    useState<BlockDropIndicatorPosition | null>(null);
  const isUploadingFile = pendingFileUploadCount > 0;
  const visiblePostLoadError = invalidEditRoute
    ? '올바르지 않은 게시글 주소입니다.'
    : postLoadError;
  const isEditorDisabled =
    isSubmitting || isPostLoading || Boolean(visiblePostLoadError);
  const selectedCategoryLabel =
    POST_CATEGORY_OPTIONS.find((option) => option.value === category)?.label ??
    '카테고리';
  const selectedTagOptions = category
    ? POST_TAG_OPTIONS_BY_CATEGORY[category]
    : [];
  const titleTagPrefix = getTitleTagPrefix(tag);
  const titleLength = title.length;
  const isTitleOverLimit = titleLength > COMMUNITY_TITLE_MAX_LENGTH;

  const handleCategorySelect = (nextCategory: PostCategory) => {
    if (category !== nextCategory) {
      setCategoryAnimationKey((animationKey) => animationKey + 1);
    }

    setCategory(nextCategory);
    setTag(undefined);
    setTitle(
      removeTitleTagPrefix(title, tag).slice(0, COMMUNITY_TITLE_MAX_LENGTH),
    );
    setIsCategoryMenuOpen(false);
  };

  const handleTagSelect = (nextTag: PostTag) => {
    const nextSelectedTag = tag === nextTag ? undefined : nextTag;
    const titleWithoutCurrentTag = removeTitleTagPrefix(title, tag);

    setTag(nextSelectedTag);
    setTitle(applyTitleTagPrefix(titleWithoutCurrentTag, nextSelectedTag));
  };

  const handleTitleKeyDown = (
    event: ReactKeyboardEvent<HTMLInputElement>,
  ) => {
    if (!titleTagPrefix) {
      return;
    }

    const input = event.currentTarget;
    const prefixLength = titleTagPrefix.length;
    const selectionStart = input.selectionStart ?? 0;
    const selectionEnd = input.selectionEnd ?? selectionStart;
    const isPrefixSelected = selectionStart < prefixLength && selectionEnd > 0;

    if (
      (event.ctrlKey || event.metaKey) &&
      event.key.toLowerCase() === 'a'
    ) {
      event.preventDefault();
      input.setSelectionRange(prefixLength, input.value.length);
      return;
    }

    if (event.key === 'Home') {
      event.preventDefault();
      input.setSelectionRange(prefixLength, prefixLength);
      return;
    }

    if (event.key === 'Backspace') {
      const shouldBlock =
        isPrefixSelected ||
        (selectionStart === selectionEnd && selectionStart <= prefixLength);

      if (shouldBlock) {
        event.preventDefault();
      }

      return;
    }

    if (event.key === 'Delete') {
      const shouldBlock =
        isPrefixSelected ||
        (selectionStart === selectionEnd && selectionStart < prefixLength);

      if (shouldBlock) {
        event.preventDefault();
      }

      return;
    }

    if (
      event.key === 'ArrowLeft' &&
      selectionStart === selectionEnd &&
      selectionStart <= prefixLength
    ) {
      event.preventDefault();
      input.setSelectionRange(prefixLength, prefixLength);
      return;
    }

    if (
      event.key.length === 1 &&
      !event.ctrlKey &&
      !event.metaKey &&
      !event.altKey &&
      (selectionStart < prefixLength || selectionEnd < prefixLength)
    ) {
      event.preventDefault();
      keepTitleCursorAfterPrefix(input, prefixLength);
    }
  };

  const handleTitleCut = (event: ReactClipboardEvent<HTMLInputElement>) => {
    if (!titleTagPrefix) {
      return;
    }

    const selectionStart = event.currentTarget.selectionStart ?? 0;

    if (selectionStart < titleTagPrefix.length) {
      event.preventDefault();
    }
  };

  const uploadPostFile = useCallback(async (file: File) => {
    setPendingFileUploadCount((count) => count + 1);
    setFileUploadError(null);

    try {
      const uploadedFile = await uploadCommunityFile(file);
      const fileKey = uploadedFile.key.trim();
      const fileUrl = getCommunityFileDownloadUrl(fileKey);
      const fileName = uploadedFile.fileName || file.name;

      if (!fileUrl) {
        throw new Error('파일 다운로드 URL을 생성하지 못했습니다.');
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
      ]);

      return { url: fileUrl, name: fileName };
    } catch (error) {
      setFileUploadError(
        '파일을 업로드하지 못했습니다. 잠시 후 다시 시도해주세요.',
      );
      throw error;
    } finally {
      setPendingFileUploadCount((count) => count - 1);
    }
  }, []);

  const handleEditorFileUpload = useCallback(
    (file: File) => uploadPostFile(file),
    [uploadPostFile],
  );

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
  );

  const isEditorPortalTarget = (element: Element | null) =>
    element !== null && editor.portalElement.contains(element);

  const handleBlockMenuOpen = useCallback((blockId: string) => {
    setSelectedBlockId(blockId);
    setIsEditorPlaceholderVisible(false);
  }, []);

  const handleBlockDragStart = useCallback((blockId: string) => {
    draggedBlockIdRef.current = blockId;
    setSelectedBlockId(null);
  }, []);

  const handleBlockDragEnd = useCallback(() => {
    const draggedBlockId = draggedBlockIdRef.current;

    draggedBlockIdRef.current = null;

    if (draggedBlockId) {
      setSelectedBlockId(draggedBlockId);
    }

    setBlockDropIndicator(null);
  }, []);

  const communityBlockSideMenu = useCallback(
    () => (
      <CommunityBlockSideMenu
        onBlockMenuClick={handleBlockMenuOpen}
        onBlockDragStart={handleBlockDragStart}
        onBlockDragEnd={handleBlockDragEnd}
      />
    ),
    [handleBlockDragEnd, handleBlockDragStart, handleBlockMenuOpen],
  );

  const handleBackToList = () => {
    navigate(isEditing ? `/community/${editingPostId}` : '/community');
  };

  const handleEditorToolClick = (action: EditorAction) => {
    if (action === 'image') {
      imageInputRef.current?.click();
      return;
    }

    if (action === 'file') {
      fileInputRef.current?.click();
      return;
    }

    if (action === 'link') {
      const url = window.prompt('링크 주소를 입력해주세요.');

      if (url?.trim()) {
        editor.createLink(url.trim(), editor.getSelectedText() || undefined);
      }

      editor.focus();
      return;
    }

    const currentBlock = editor.getTextCursorPosition().block;

    switch (action) {
      case 'bold':
        editor.toggleStyles({ bold: true });
        break;
      case 'italic':
        editor.toggleStyles({ italic: true });
        break;
      case 'underline':
        editor.toggleStyles({ underline: true });
        break;
      case 'strike':
        editor.toggleStyles({ strike: true });
        break;
      case 'headingOne':
        editor.updateBlock(currentBlock, {
          type: 'heading',
          props: { level: 1 },
        });
        break;
      case 'headingTwo':
        editor.updateBlock(currentBlock, {
          type: 'heading',
          props: { level: 2 },
        });
        break;
      case 'unorderedList':
        editor.updateBlock(currentBlock, { type: 'bulletListItem' });
        break;
      case 'orderedList':
        editor.updateBlock(currentBlock, { type: 'numberedListItem' });
        break;
      case 'code':
        editor.updateBlock(currentBlock, { type: 'codeBlock' });
        break;
      case 'quote':
        editor.updateBlock(currentBlock, { type: 'quote' });
        break;
      default:
        break;
    }

    editor.focus();
  };

  const handleImageSelection = async (event: ChangeEvent<HTMLInputElement>) => {
    const [file] = Array.from(event.target.files ?? []);

    event.target.value = '';

    if (!file) {
      return;
    }

    try {
      const uploadedImage = await handleEditorFileUpload(file);
      const currentBlock = editor.getTextCursorPosition().block;
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
      );

      editor.setTextCursorPosition(imageBlock, 'end');
    } catch {
      // 이미지 업로드 실패 메시지는 handleImageUpload에서 표시합니다.
    }
  };

  const handleFileSelection = async (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);

    event.target.value = '';

    if (files.length === 0) {
      return;
    }

    let currentBlock = editor.getTextCursorPosition().block;

    for (const file of files) {
      try {
        const uploadedFile = await handleEditorFileUpload(file);
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
        );

        const insertedFileBlock = fileBlock
          ? editor.getBlock(fileBlock.id)
          : undefined;

        if (insertedFileBlock) {
          currentBlock = insertedFileBlock;
        }
      } catch {
        // 파일 업로드 실패 메시지는 uploadPostFile에서 표시합니다.
      }
    }

    editor.setTextCursorPosition(currentBlock, 'end');
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isEditRoute && !isEditing) {
      toast.error('올바르지 않은 게시글 주소입니다.');
      return;
    }

    if (isPostLoading || postLoadError) {
      return;
    }

    if (isUploadingFile) {
      toast.error('파일 업로드가 완료될 때까지 기다려주세요.');
      return;
    }

    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      toast.error('제목을 입력해주세요.');
      return;
    }

    if (isTitleOverLimit) {
      toast.error(
        `제목은 ${COMMUNITY_TITLE_MAX_LENGTH}자 이내로 입력해주세요.`,
      );
      return;
    }

    if (!category) {
      toast.error('카테고리를 선택해주세요.');
      return;
    }

    const postContentHtml = editor.blocksToHTMLLossy();

    if (!hasPostContent(postContentHtml)) {
      toast.error('본문을 입력해주세요.');
      return;
    }

    const postContentLength = getCommunityTextContent(postContentHtml).length;

    if (postContentLength > COMMUNITY_CONTENT_MAX_LENGTH) {
      toast.error(
        `본문은 ${COMMUNITY_CONTENT_MAX_LENGTH.toLocaleString()}자 이내로 입력해주세요.`,
      );
      return;
    }

    const postContent = serializeBlockNotePostContent(editor.document);

    setIsSubmitting(true);

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
      };
      const post = isEditing
        ? await updatePost(editingPostId, postRequest)
        : await createPost(postRequest);

      navigate(`/community/${post.postId}`, { replace: true });
    } catch (error: unknown) {
      const fallbackMessage = isEditing
        ? '게시글을 수정하지 못했습니다. 잠시 후 다시 시도해주세요.'
        : '게시글을 등록하지 못했습니다. 잠시 후 다시 시도해주세요.';

      toast.error(getCommunityRequestErrorMessage(error, fallbackMessage));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditorDragOver = useCallback((event: BlockDragOverEvent) => {
    if (!event.dataTransfer?.types.includes('blocknote/html')) {
      return;
    }

    const editorArea = editorAreaRef.current;
    const blockEditor = editorArea?.querySelector<HTMLElement>(
      '.community-block-editor',
    );

    if (!editorArea || !blockEditor) {
      return;
    }

    const editorBounds = editorArea.getBoundingClientRect();
    const blockEditorBounds = blockEditor.getBoundingClientRect();

    if (
      event.clientX < editorBounds.left ||
      event.clientX > editorBounds.right ||
      event.clientY < blockEditorBounds.top ||
      event.clientY > blockEditorBounds.bottom
    ) {
      return;
    }

    const blockElements = Array.from(
      blockEditor.querySelectorAll<HTMLElement>(
        '[data-node-type="blockContainer"]',
      ),
    );

    if (blockElements.length === 0) {
      return;
    }

    const targetElement =
      event.target instanceof Element ? event.target : undefined;
    const targetBlock = targetElement?.closest<HTMLElement>(
      '[data-node-type="blockContainer"]',
    );
    const blockElement =
      targetBlock && blockEditor.contains(targetBlock)
        ? targetBlock
        : blockElements.find((candidateBlock) => {
            const candidateBounds = candidateBlock.getBoundingClientRect();

            return (
              event.clientY <=
              candidateBounds.top + candidateBounds.height / 2
            );
          }) ?? blockElements.at(-1);

    if (!blockElement) {
      return;
    }

    const blockBounds = blockElement.getBoundingClientRect();
    const scaleX =
      editorArea.offsetWidth > 0
        ? editorBounds.width / editorArea.offsetWidth
        : 1;
    const scaleY =
      editorArea.offsetHeight > 0
        ? editorBounds.height / editorArea.offsetHeight
        : 1;
    const targetTop =
      event.clientY < blockBounds.top + blockBounds.height / 2
        ? blockBounds.top
        : blockBounds.bottom;
    const nextIndicator = {
      left: (blockBounds.left - editorBounds.left) / scaleX,
      top: (targetTop - editorBounds.top) / scaleY,
      width: blockBounds.width / scaleX,
    };

    setBlockDropIndicator((indicator) => {
      if (
        indicator?.left === nextIndicator.left &&
        indicator.top === nextIndicator.top &&
        indicator.width === nextIndicator.width
      ) {
        return indicator;
      }

      return nextIndicator;
    });
  }, []);

  const handleEditorDragLeave = (event: ReactDragEvent<HTMLElement>) => {
    if (
      event.relatedTarget instanceof Node &&
      event.currentTarget.contains(event.relatedTarget)
    ) {
      return;
    }

    if (
      event.relatedTarget instanceof Element &&
      event.relatedTarget.closest('.bn-side-menu')
    ) {
      return;
    }

    setBlockDropIndicator(null);
  };

  const hideBlockDropIndicator = useCallback(() => {
    setBlockDropIndicator(null);
  }, []);

  const focusEditorAtEnd = () => {
    const lastBlock = editor.document.at(-1);

    if (!lastBlock) {
      editor.focus();
      return;
    }

    if (
      lastBlock.type === 'paragraph' &&
      Array.isArray(lastBlock.content) &&
      lastBlock.content.length === 0
    ) {
      editor.setTextCursorPosition(lastBlock, 'end');
      editor.focus();
      return;
    }

    const [emptyBlock] = editor.insertBlocks(
      [{ type: 'paragraph' }],
      lastBlock,
      'after',
    );

    if (emptyBlock) {
      editor.setTextCursorPosition(emptyBlock, 'start');
      editor.focus();
    }
  };

  const handleEditorContentAreaClick = (
    event: ReactMouseEvent<HTMLDivElement>,
  ) => {
    if (
      isEditorDisabled ||
      isUploadingFile ||
      !(event.target instanceof Element)
    ) {
      return;
    }

    if (
      event.target.closest('.bn-side-menu') ||
      event.target.closest('.bn-drag-handle-menu') ||
      !event.target.closest('.bn-block-outer')
    ) {
      return;
    }

    setIsEditorPlaceholderVisible(true);
    setSelectedBlockId(null);
  };

  const handleEditorBlankAreaClick = (
    event: ReactMouseEvent<HTMLDivElement>,
  ) => {
    if (
      isEditorDisabled ||
      isUploadingFile ||
      !(event.target instanceof Element) ||
      event.target.closest('.bn-block-outer') ||
      event.target.closest('.bn-side-menu') ||
      event.target.closest('.bn-drag-handle-menu') ||
      isEditorPortalTarget(event.target)
    ) {
      return;
    }

    setIsEditorPlaceholderVisible(true);
    setSelectedBlockId(null);
    focusEditorAtEnd();
  };

  const handleEditorContentAreaFocus = (
    event: ReactFocusEvent<HTMLDivElement>,
  ) => {
    if (
      isEditorDisabled ||
      isUploadingFile ||
      !(event.target instanceof Element) ||
      event.target.closest('.bn-side-menu')
    ) {
      return;
    }

    setIsEditorPlaceholderVisible(true);
    setSelectedBlockId(null);
  };

  const handleEditorContentAreaBlur = (
    event: ReactFocusEvent<HTMLDivElement>,
  ) => {
    const relatedElement =
      event.relatedTarget instanceof Element ? event.relatedTarget : null;

    if (relatedElement?.closest('.bn-side-menu')) {
      setIsEditorPlaceholderVisible(false);
      return;
    }

    if (isEditorPortalTarget(relatedElement)) {
      return;
    }

    if (
      event.relatedTarget instanceof Node &&
      event.currentTarget.contains(event.relatedTarget)
    ) {
      return;
    }

    setIsEditorPlaceholderVisible(false);
    setSelectedBlockId(null);
  };

  useEffect(() => {
    return editor.onBeforeChange(({ tr }) => {
      if (!tr.docChanged || isPostLoadingRef.current) {
        return true;
      }

      const nextContentLength = tr.doc.textContent.length;
      const currentContentLength = tr.before.textContent.length;

      // Allow users to reduce existing posts that were saved over the limit.
      return (
        nextContentLength <= COMMUNITY_CONTENT_MAX_LENGTH ||
        nextContentLength <= currentContentLength
      );
    });
  }, [editor]);

  useEffect(() => {
    if (!isEditRoute) {
      isPostLoadingRef.current = false;
      return;
    }

    if (!isEditing) {
      isPostLoadingRef.current = false;
      return;
    }

    let isCancelled = false;

    async function loadPostForEdit() {
      isPostLoadingRef.current = true;
      setIsPostLoading(true);
      setPostLoadError(null);

      try {
        const post = await getPost(editingPostId);
        const postBlocks = parseBlockNotePostContent(post.postContent);
        const contentBlocks =
          postBlocks ?? editor.tryParseHTMLToBlocks(post.postContent);

        if (isCancelled) {
          return;
        }

        setCategory(post.category);
        setTag(post.tag);
        setTitle(applyTitleTagPrefix(post.postTitle, post.tag));
        setIsAnonymous(post.isAnonymous);
        setUploadedFiles(
          post.files?.map((file) => ({
            id: String(file.fileId),
            fileKey: getCommunityFileKey(file.fileUrl) ?? file.fileUrl,
            fileName: file.fileName,
            fileType: file.fileType,
            fileSize: file.fileSize,
          })) ?? [],
        );

        if (contentBlocks.length > 0) {
          editor.replaceBlocks(editor.document, contentBlocks);
          setContentLength(
            getCommunityTextContent(editor.blocksToHTMLLossy()).length,
          );
        }
      } catch {
        if (!isCancelled) {
          setPostLoadError(
            '게시글을 불러오지 못했습니다. 목록으로 돌아가 다시 시도해주세요.',
          );
        }
      } finally {
        if (!isCancelled) {
          isPostLoadingRef.current = false;
          setIsPostLoading(false);
        }
      }
    }

    void loadPostForEdit();

    return () => {
      isCancelled = true;
      isPostLoadingRef.current = false;
    };
  }, [editor, editingPostId, isEditing, isEditRoute]);

  useEffect(() => {
    if (!isCategoryMenuOpen) {
      return;
    }

    const handleOutsidePointerDown = (event: PointerEvent) => {
      if (
        event.target instanceof Node &&
        !categoryFieldRef.current?.contains(event.target)
      ) {
        setIsCategoryMenuOpen(false);
      }
    };

    document.addEventListener('pointerdown', handleOutsidePointerDown);

    return () => {
      document.removeEventListener('pointerdown', handleOutsidePointerDown);
    };
  }, [isCategoryMenuOpen]);

  useEffect(() => {
    const handleDocumentPointerDown = (event: PointerEvent) => {
      if (!(event.target instanceof Element)) {
        return;
      }

      if (
        event.target.closest('.bn-side-menu') ||
        event.target.closest('.bn-drag-handle-menu') ||
        editor.portalElement.contains(event.target)
      ) {
        return;
      }

      const sideMenu = editor.getExtension(SideMenuExtension);

      if (sideMenu?.menuFrozen) {
        sideMenu.unfreezeMenu();
      }

      setSelectedBlockId(null);

      if (!event.target.closest('.community-block-editor')) {
        setIsEditorPlaceholderVisible(false);
      }
    };

    document.addEventListener('pointerdown', handleDocumentPointerDown);

    return () => {
      document.removeEventListener('pointerdown', handleDocumentPointerDown);
    };
  }, [editor]);

  useEffect(() => {
    const handleDocumentMouseMove = (event: MouseEvent) => {
      const editorBounds = editorAreaRef.current?.getBoundingClientRect();

      if (!editorBounds) {
        return;
      }

      const isWithinEditorWidth =
        event.clientX >= editorBounds.left &&
        event.clientX <= editorBounds.right;

      if (!isWithinEditorWidth) {
        editor.getExtension(SideMenuExtension)?.hideMenuIfNotFrozen();
      }
    };
    const handleDocumentDragOver = (event: DragEvent) => {
      handleEditorDragOver(event);
    };

    document.addEventListener('mousemove', handleDocumentMouseMove);
    // BlockNote's side menu is portaled to body, so the editor-local
    // dragover handler is skipped there.
    document.addEventListener('dragover', handleDocumentDragOver);
    document.addEventListener('dragend', hideBlockDropIndicator);

    return () => {
      document.removeEventListener('mousemove', handleDocumentMouseMove);
      document.removeEventListener('dragover', handleDocumentDragOver);
      document.removeEventListener('dragend', hideBlockDropIndicator);
    };
  }, [editor, handleEditorDragOver, hideBlockDropIndicator]);

  return (
    <S.Page>
      <S.Content>
        <S.Header>
          <S.BackButton type="button" onClick={handleBackToList}>
            <S.BackIcon src={backChevronIcon} alt="" />
            목록 보기
          </S.BackButton>

          <S.WriteForm
            id="community-write-form"
            noValidate
            onSubmit={handleSubmit}
          >
            <S.TitleRow>
              <S.Heading>
                {isEditRoute ? '게시글 수정' : '게시글 작성'}
              </S.Heading>
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
              <S.CategoryField ref={categoryFieldRef}>
                <S.CategoryTrigger
                  type="button"
                  role="combobox"
                  aria-label="카테고리"
                  aria-controls="community-category-options"
                  aria-expanded={isCategoryMenuOpen}
                  aria-haspopup="listbox"
                  disabled={isEditorDisabled}
                  onClick={() => setIsCategoryMenuOpen((isOpen) => !isOpen)}
                  onKeyDown={(event) => {
                    if (event.key === 'Escape') {
                      setIsCategoryMenuOpen(false);
                    }
                  }}
                >
                  {selectedCategoryLabel}
                </S.CategoryTrigger>
                <S.CategoryChevron
                  src={attachmentChevronIcon}
                  alt=""
                  $open={isCategoryMenuOpen}
                />
                {isCategoryMenuOpen && (
                  <S.CategoryOptions
                    id="community-category-options"
                    role="listbox"
                    aria-label="카테고리 목록"
                  >
                    {POST_CATEGORY_OPTIONS.map((option) => (
                      <S.CategoryOption
                        key={option.value}
                        type="button"
                        role="option"
                        aria-selected={category === option.value}
                        $selected={category === option.value}
                        onClick={() => handleCategorySelect(option.value)}
                      >
                        {option.label}
                      </S.CategoryOption>
                    ))}
                  </S.CategoryOptions>
                )}
              </S.CategoryField>

              <S.TitleField>
                <S.TitleInput
                  type="text"
                  aria-label="게시글 제목"
                  aria-describedby="community-title-length"
                  aria-invalid={isTitleOverLimit}
                  placeholder="제목을 입력해주세요"
                  value={title}
                  maxLength={COMMUNITY_TITLE_MAX_LENGTH}
                  required
                  disabled={isEditorDisabled}
                  $isOverLimit={isTitleOverLimit}
                  onChange={(event) =>
                    setTitle(
                      event.target.value.startsWith(titleTagPrefix)
                        ? event.target.value.slice(
                            0,
                            COMMUNITY_TITLE_MAX_LENGTH,
                          )
                        : applyTitleTagPrefix(event.target.value, tag),
                    )
                  }
                  onKeyDown={handleTitleKeyDown}
                  onCut={handleTitleCut}
                  onFocus={(event) =>
                    keepTitleCursorAfterPrefix(
                      event.currentTarget,
                      titleTagPrefix.length,
                    )
                  }
                  onClick={(event) =>
                    keepTitleCursorAfterPrefix(
                      event.currentTarget,
                      titleTagPrefix.length,
                    )
                  }
                  onSelect={(event) =>
                    keepTitleCursorAfterPrefix(
                      event.currentTarget,
                      titleTagPrefix.length,
                    )
                  }
                />
                <S.TitleCounter
                  id="community-title-length"
                  $isOverLimit={isTitleOverLimit}
                >
                  {titleLength} / {COMMUNITY_TITLE_MAX_LENGTH}
                </S.TitleCounter>
              </S.TitleField>
            </S.Fields>

            {selectedTagOptions.length > 0 && (
              <S.TagField $animationKey={categoryAnimationKey}>
                <S.TagOptions aria-label="말머리 선택">
                  {selectedTagOptions.map((option) => (
                    <S.TagOption
                      key={option.value}
                      type="button"
                      aria-pressed={tag === option.value}
                      $selected={tag === option.value}
                      disabled={isEditorDisabled}
                      onClick={() => handleTagSelect(option.value)}
                    >
                      {option.label}
                    </S.TagOption>
                  ))}
                </S.TagOptions>
              </S.TagField>
            )}
          </S.WriteForm>
        </S.Header>

        <S.Editor
          ref={editorAreaRef}
          $animationKey={categoryAnimationKey}
          $shouldAnimate={Boolean(category)}
          $selectedBlockId={selectedBlockId}
          $showEditorPlaceholder={isEditorPlaceholderVisible}
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
            onClickCapture={handleEditorBlankAreaClick}
            onFocusCapture={handleEditorContentAreaFocus}
            onBlurCapture={handleEditorContentAreaBlur}
          >
            <BlockNoteView
              editor={editor}
              editable={!isEditorDisabled}
              onChange={(changedEditor) => {
                setContentLength(
                  getCommunityTextContent(
                    changedEditor.blocksToHTMLLossy(),
                  ).length,
                );
              }}
              sideMenu={false}
              formattingToolbar={false}
              portalElements={{ default: null }}
            >
              <FormattingToolbarController
                floatingUIOptions={{
                  useTransitionStylesProps: {
                    common: {
                      transitionProperty: 'opacity, transform',
                    },
                  },
                }}
              />
              <SideMenuController sideMenu={communityBlockSideMenu} />
            </BlockNoteView>
            {isUploadingFile && (
              <S.FileUploadSkeleton
                role="status"
                aria-label="파일을 업로드하는 중입니다."
              />
            )}
          </div>
          <S.ContentCounter aria-label="본문 글자 수">
            {contentLength.toLocaleString()} /{' '}
            {COMMUNITY_CONTENT_MAX_LENGTH.toLocaleString()}
          </S.ContentCounter>
        </S.Editor>
        {isUploadingFile && (
          <S.FileUploadStatus role="status">
            파일을 업로드하고 있어요.
          </S.FileUploadStatus>
        )}
        {fileUploadError && (
          <S.SubmitError role="alert">{fileUploadError}</S.SubmitError>
        )}
        {visiblePostLoadError && (
          <S.SubmitError role="alert">{visiblePostLoadError}</S.SubmitError>
        )}
      </S.Content>
    </S.Page>
  );
}
