import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { PiCaretDoubleRight } from 'react-icons/pi'
import ReactMarkdown from 'react-markdown'
import rehypeSanitize from 'rehype-sanitize'
import remarkGfm from 'remark-gfm'

import { Button } from '@/shared/ui'
import type { Member } from '@/entities/member/model/types'
import { getMessages } from '@/entities/mentoring'
import type {
  MentoringFile,
  MentoringMessage,
  MentoringQuestion,
  QuestionStatus,
} from '@/entities/mentoring'

import { createMessage } from '../../api/createMessage'
import { changeQuestionStatus } from '../../api/createQuestion'
import { uploadMentoringFile } from '../../api/uploadMentoringFile'
import {
  formatQuestionCreatedAt,
  formatQuestionDate,
  QUESTION_STATUS_COLOR,
  QUESTION_STATUS_LABEL,
} from '../../lib/questionStatus'
import { MemberAvatar } from '../MemberAvatar'
import { MentoringComposer } from '../MentoringComposer'
import * as S from './QuestionDetailPanel.style'

/** 상태 변경 버튼이 가리키는 다음 상태 */
const NEXT_STATUS: Record<QuestionStatus, QuestionStatus> = {
  PAUSED: 'ACTIVE',
  ACTIVE: 'DONE',
  DONE: 'ACTIVE',
}

/** 현재 상태에서 노출할 상태 변경 버튼 문구 */
const STATUS_CHANGE_LABEL: Record<QuestionStatus, string> = {
  PAUSED: '진행으로 변경',
  ACTIVE: '종료로 변경',
  DONE: '진행으로 변경',
}

// 상세 화면이 열려 있을 때 새 답변을 빠르게 확인하되, 요청을 과도하게 만들지 않는다.
const MESSAGE_POLLING_INTERVAL_MS = 3_000
const MESSAGE_LIST_BOTTOM_THRESHOLD_PX = 24

interface MessageGroup {
  groupId: number
  userId: number
  messages: MentoringMessage[]
  createdAt: string
}

interface LoadedQuestionMessages {
  questionId: number
  messages: MentoringMessage[]
}

/**
 * 같은 사람이 연달아 보낸 메시지를 하나의 묶음으로 만든다.
 *
 * @param messages 시간순으로 정렬된 메시지 목록
 */
function groupMessages(messages: MentoringMessage[]): MessageGroup[] {
  return messages.reduce<MessageGroup[]>((groups, message) => {
    const lastGroup = groups.at(-1)

    if (lastGroup && lastGroup.userId === message.userId) {
      lastGroup.messages.push(message)
      lastGroup.createdAt = message.createdAt
      return groups
    }

    return [
      ...groups,
      {
        groupId: message.messageId,
        userId: message.userId,
        messages: [message],
        createdAt: message.createdAt,
      },
    ]
  }, [])
}

function sortMessages(messages: MentoringMessage[]) {
  return [...messages].sort(
    (first, second) =>
      first.createdAt.localeCompare(second.createdAt) ||
      first.messageId - second.messageId,
  )
}

const isImageFile = (file: MentoringFile) => file.fileType?.startsWith('image/')

interface MessageMarkdownProps {
  content: string
}

function MessageMarkdown({ content }: MessageMarkdownProps) {
  return (
    <S.MessageMarkdown>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeSanitize]}
      >
        {content}
      </ReactMarkdown>
    </S.MessageMarkdown>
  )
}

interface QuestionDetailPanelProps {
  question: MentoringQuestion
  roomName: string
  currentUserId?: number
  canChangeStatus: boolean
  membersByUserId: Record<number, Member>
  messagesPromise?: Promise<MentoringMessage[]>
  targetMessageId?: number | null
  embedded?: boolean
  showCompleteAction?: boolean
  isCompleting?: boolean
  onClose: () => void
  onComplete?: () => void | Promise<void>
  onStatusChange?: (status: QuestionStatus) => void | Promise<void>
}

export function QuestionDetailPanel({
  question,
  roomName,
  currentUserId,
  canChangeStatus,
  membersByUserId,
  messagesPromise,
  targetMessageId = null,
  embedded = false,
  showCompleteAction = false,
  isCompleting = false,
  onClose,
  onComplete,
  onStatusChange,
}: QuestionDetailPanelProps) {
  const [loadedMessages, setLoadedMessages] =
    useState<LoadedQuestionMessages | null>(null)
  const [isSending, setIsSending] = useState(false)
  const messageListRef = useRef<HTMLDivElement>(null)
  const messagesCacheRef = useRef(new Map<number, MentoringMessage[]>())
  const pendingMessagesRef = useRef(new Map<number, MentoringMessage[]>())
  const optimisticMessageIdRef = useRef(-1)
  const allMessagesPromiseRef = useRef<Promise<MentoringMessage[]> | null>(
    messagesPromise ?? null,
  )
  const pollingRequestRef = useRef<Promise<MentoringMessage[]> | null>(null)
  const hasLoadedAllMessagesRef = useRef(false)
  const scrollToBottomQuestionIdRef = useRef<number | null>(null)
  const targetMessageScrollKeyRef = useRef<string | null>(null)

  const mergePendingMessages = useCallback(
    (questionId: number, messages: MentoringMessage[]) => [
      ...sortMessages(messages),
      ...(pendingMessagesRef.current.get(questionId) ?? []),
    ],
    [],
  )

  const updateQuestionMessages = useCallback(
    (questionId: number, messages: MentoringMessage[]) => {
      messagesCacheRef.current.set(questionId, messages)
      setLoadedMessages((currentMessages) => {
        if (currentMessages && currentMessages.questionId !== questionId) {
          return currentMessages
        }

        return { questionId, messages }
      })
    },
    [],
  )

  const appendNewQuestionMessages = useCallback(
    (questionId: number, incomingMessages: MentoringMessage[]) => {
      const currentMessages = messagesCacheRef.current.get(questionId) ?? []
      const knownMessageIds = new Set(
        currentMessages.map(({ messageId }) => messageId),
      )
      const newMessages = incomingMessages.filter(({ messageId }) => {
        if (knownMessageIds.has(messageId)) {
          return false
        }

        knownMessageIds.add(messageId)
        return true
      })

      if (newMessages.length === 0) {
        return false
      }

      const pendingMessages = pendingMessagesRef.current.get(questionId) ?? []
      const pendingMessageIds = new Set(
        pendingMessages.map(({ messageId }) => messageId),
      )
      const messagesWithoutPending = currentMessages.filter(
        ({ messageId }) => !pendingMessageIds.has(messageId),
      )

      // 서버 메시지만 새로 붙이고, 전송 중인 임시 메시지는 항상 대화의 마지막에 둔다.
      updateQuestionMessages(questionId, [
        ...messagesWithoutPending,
        ...sortMessages(newMessages),
        ...pendingMessages,
      ])

      return true
    },
    [updateQuestionMessages],
  )

  const loadMessages = useCallback(
    async (questionId: number) => {
      const cachedMessages = messagesCacheRef.current.get(questionId)

      if (
        cachedMessages &&
        !pendingMessagesRef.current.has(questionId)
      ) {
        return cachedMessages
      }

      if (hasLoadedAllMessagesRef.current) {
        const emptyMessages = mergePendingMessages(questionId, [])
        messagesCacheRef.current.set(questionId, emptyMessages)
        return emptyMessages
      }

      // 서버에 질문 단위 조회가 없어 전체 메시지에서 해당 질문만 추린다.
      const request =
        allMessagesPromiseRef.current ??
        (allMessagesPromiseRef.current = getMessages())

      try {
        const allMessages = await request
        const groupedMessages = new Map<number, MentoringMessage[]>()

        allMessages.forEach((message) => {
          const questionMessages =
            groupedMessages.get(message.questionId) ?? []
          questionMessages.push(message)
          groupedMessages.set(message.questionId, questionMessages)
        })

        groupedMessages.forEach((questionMessages, cachedQuestionId) => {
          messagesCacheRef.current.set(
            cachedQuestionId,
            mergePendingMessages(
              cachedQuestionId,
              sortMessages(questionMessages),
            ),
          )
        })
        hasLoadedAllMessagesRef.current = true

        const questionMessages =
          messagesCacheRef.current.get(questionId) ??
          mergePendingMessages(questionId, [])
        messagesCacheRef.current.set(questionId, questionMessages)

        return questionMessages
      } finally {
        if (allMessagesPromiseRef.current === request) {
          allMessagesPromiseRef.current = null
        }
      }
    },
    [mergePendingMessages],
  )

  useEffect(() => {
    let isCancelled = false

    loadMessages(question.questionId)
      .then((questionMessages) => {
        if (!isCancelled) {
          setLoadedMessages({
            questionId: question.questionId,
            messages: questionMessages,
          })
        }
      })
      .catch(() => {
        const questionMessages =
          messagesCacheRef.current.get(question.questionId) ??
          mergePendingMessages(question.questionId, [])
        messagesCacheRef.current.set(question.questionId, questionMessages)
        if (!isCancelled) {
          setLoadedMessages({
            questionId: question.questionId,
            messages: questionMessages,
          })
        }
      })

    return () => {
      isCancelled = true
    }
  }, [loadMessages, mergePendingMessages, question.questionId])

  useEffect(() => {
    if (loadedMessages?.questionId !== question.questionId) {
      return
    }

    let isCancelled = false
    let isPolling = false

    const refreshMessages = async () => {
      if (
        isCancelled ||
        document.hidden ||
        isPolling ||
        pollingRequestRef.current
      ) {
        return
      }

      isPolling = true
      const request = getMessages()
      pollingRequestRef.current = request

      try {
        const allMessages = await request

        if (isCancelled) {
          return
        }

        const currentQuestionMessages = allMessages.filter(
          ({ questionId }) => questionId === question.questionId,
        )
        const messageList = messageListRef.current
        const isNearBottom =
          !messageList ||
          messageList.scrollHeight -
            messageList.scrollTop -
            messageList.clientHeight <=
            MESSAGE_LIST_BOTTOM_THRESHOLD_PX
        const hasNewMessages = appendNewQuestionMessages(
          question.questionId,
          currentQuestionMessages,
        )

        if (hasNewMessages && isNearBottom) {
          scrollToBottomQuestionIdRef.current = question.questionId
        }
      } catch {
        // 실시간 갱신 실패는 현재 대화 화면을 방해하지 않고 다음 주기에 재시도한다.
      } finally {
        if (pollingRequestRef.current === request) {
          pollingRequestRef.current = null
        }
        isPolling = false
      }
    }

    const pollingTimer = window.setInterval(() => {
      void refreshMessages()
    }, MESSAGE_POLLING_INTERVAL_MS)
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        void refreshMessages()
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      isCancelled = true
      window.clearInterval(pollingTimer)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [appendNewQuestionMessages, loadedMessages?.questionId, question.questionId])

  useLayoutEffect(() => {
    scrollToBottomQuestionIdRef.current = null
    messageListRef.current?.scrollTo({
      top: 0,
    })
  }, [question.questionId])

  useEffect(() => {
    if (
      scrollToBottomQuestionIdRef.current !== question.questionId ||
      loadedMessages?.questionId !== question.questionId
    ) {
      if (loadedMessages?.questionId !== question.questionId) {
        scrollToBottomQuestionIdRef.current = null
      }
      return
    }

    scrollToBottomQuestionIdRef.current = null
    messageListRef.current?.scrollTo({
      top: messageListRef.current.scrollHeight,
    })
  }, [loadedMessages, question.questionId])

  useEffect(() => {
    targetMessageScrollKeyRef.current = null
  }, [question.questionId, targetMessageId])

  useEffect(() => {
    if (
      targetMessageId === null ||
      loadedMessages?.questionId !== question.questionId
    ) {
      return
    }

    const targetMessageKey = `${question.questionId}:${targetMessageId}`

    if (targetMessageScrollKeyRef.current === targetMessageKey) {
      return
    }

    const targetMessage = document.getElementById(`message-${targetMessageId}`)

    if (!targetMessage) {
      return
    }

    targetMessage.scrollIntoView({ behavior: 'smooth', block: 'center' })
    targetMessageScrollKeyRef.current = targetMessageKey
  }, [loadedMessages, question.questionId, targetMessageId])

  const handleSend = async (nextContent: string, nextFiles: File[]) => {
    // 전송 중에는 버튼/엔터 어느 쪽으로도 중복 전송되지 않게 막는다.
    if (isSending) return
    if (!nextContent.trim() && nextFiles.length === 0) return

    const questionId = question.questionId
    const optimisticMessageId = optimisticMessageIdRef.current
    optimisticMessageIdRef.current -= 1
    // 서버 응답을 기다리는 동안에도 답변 흐름을 끊지 않도록 임시 메시지를 먼저 표시한다.
    // 업로드 또는 저장에 실패하면 catch에서 임시 메시지를 제거하고 입력 내용을 유지한다.
    const optimisticMessage: MentoringMessage = {
      messageId: optimisticMessageId,
      questionId,
      userId: currentUserId ?? 0,
      content: nextContent.trim(),
      files: [],
      createdAt: new Date().toISOString(),
    }
    const pendingMessages = pendingMessagesRef.current.get(questionId) ?? []
    pendingMessagesRef.current.set(questionId, [
      ...pendingMessages,
      optimisticMessage,
    ])

    const currentMessages =
      messagesCacheRef.current.get(questionId) ??
      (loadedMessages?.questionId === questionId ? loadedMessages.messages : [])
    // 임시 메시지는 서버 시간 형식과 무관하게 대화의 마지막에 표시한다.
    const optimisticMessages = [...currentMessages, optimisticMessage]

    setIsSending(true)
    updateQuestionMessages(questionId, optimisticMessages)
    scrollToBottomQuestionIdRef.current = questionId

    try {
      const uploadedFiles = await Promise.all(
        nextFiles.map((file) => uploadMentoringFile(file)),
      )

      const createdMessage = await createMessage({
        questionId,
        content: nextContent.trim(),
        files: uploadedFiles,
      })

      const remainingPendingMessages = (
        pendingMessagesRef.current.get(questionId) ?? []
      ).filter(({ messageId }) => messageId !== optimisticMessageId)
      if (remainingPendingMessages.length > 0) {
        pendingMessagesRef.current.set(questionId, remainingPendingMessages)
      } else {
        pendingMessagesRef.current.delete(questionId)
      }

      const nextMessages = [
        ...(messagesCacheRef.current.get(questionId) ?? []).filter(
          ({ messageId }) =>
            messageId !== optimisticMessageId &&
            messageId !== createdMessage.messageId,
        ),
        createdMessage,
      ]

      updateQuestionMessages(questionId, nextMessages)
    } catch (error) {
      const remainingPendingMessages = (
        pendingMessagesRef.current.get(questionId) ?? []
      ).filter(({ messageId }) => messageId !== optimisticMessageId)
      if (remainingPendingMessages.length > 0) {
        pendingMessagesRef.current.set(questionId, remainingPendingMessages)
      } else {
        pendingMessagesRef.current.delete(questionId)
      }

      const nextMessages = (
        messagesCacheRef.current.get(questionId) ?? []
      ).filter(({ messageId }) => messageId !== optimisticMessageId)
      updateQuestionMessages(questionId, nextMessages)
      throw error
    } finally {
      setIsSending(false)
    }
  }

  const handleChangeStatus = async () => {
    const nextStatus = NEXT_STATUS[question.status]

    try {
      await changeQuestionStatus(question.questionId, nextStatus)
      void onStatusChange?.(nextStatus)
    } catch {
      // 실패 시 기존 상태를 유지한다.
    }
  }

  const isLoadingMessages = loadedMessages?.questionId !== question.questionId
  const messageGroups = useMemo(
    () =>
      groupMessages(
        loadedMessages?.questionId === question.questionId
          ? loadedMessages.messages
          : [],
      ),
    [loadedMessages, question.questionId],
  )
  const questionAuthor = membersByUserId[question.userId]

  return (
    <S.Panel $embedded={embedded} aria-label="질문 상세">
      {!embedded && (
        <S.CloseButton
          type="button"
          aria-label="질문 상세 닫기"
          onClick={onClose}
        >
          <PiCaretDoubleRight aria-hidden="true" />
        </S.CloseButton>
      )}
      <S.Header $embedded={embedded}>
        <S.StatusRow>
          <S.Status $color={QUESTION_STATUS_COLOR[question.status]}>
            {QUESTION_STATUS_LABEL[question.status]}
          </S.Status>
          {/* 멘토만 질문 상태를 변경할 수 있다 */}
          {canChangeStatus && (
            <Button
              type="button"
              size="sm"
              variant="neutral"
              onClick={() => void handleChangeStatus()}
            >
              {STATUS_CHANGE_LABEL[question.status]}
            </Button>
          )}
        </S.StatusRow>
        <S.QuestionInfo>
          <S.RoomName>{roomName}</S.RoomName>
          <S.TitleRow>
            <S.Title>{question.title}</S.Title>
          </S.TitleRow>
          {showCompleteAction && (
            <S.CompletionAction>
              <S.CompletionButton
                type="button"
                disabled={isCompleting}
                onClick={() => void onComplete?.()}
              >
                답변 완료
              </S.CompletionButton>
            </S.CompletionAction>
          )}
        </S.QuestionInfo>
      </S.Header>
      <S.CreatedAt $embedded={embedded}>
        {formatQuestionCreatedAt(question.createdAt)}
      </S.CreatedAt>
      <S.Chat $embedded={embedded}>
        <S.MessageList ref={messageListRef}>
          <S.MessageGroup $isMine={false}>
            <MemberAvatar
              userName={questionAuthor?.userName ?? '질문자'}
              profileImageUrl={questionAuthor?.profileImageUrl}
            />
            <S.MessageBody>
              <S.SenderName>{questionAuthor?.userName ?? '질문자'}</S.SenderName>
              <S.Bubbles $isMine={false}>
                <S.Bubble $isMine={false} $isRoot $embedded={embedded}>
                  <MessageMarkdown content={question.content} />
                  {question.files?.map((file) =>
                    isImageFile(file) ? (
                      <S.AttachedImage
                        key={file.fileId}
                        src={file.fileUrl}
                        alt={file.fileName}
                      />
                    ) : (
                      <S.AttachedFile
                        key={file.fileId}
                        href={file.fileUrl}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {file.fileName}
                      </S.AttachedFile>
                    ),
                  )}
                </S.Bubble>
                <S.MessageTime $isMine={false} $embedded={embedded}>
                  {formatQuestionDate(question.createdAt)}
                </S.MessageTime>
              </S.Bubbles>
            </S.MessageBody>
          </S.MessageGroup>

          {isLoadingMessages ? (
            <S.MessageLoading aria-label="답변을 불러오는 중입니다.">
              <S.MessageLoadingGroup aria-hidden="true">
                <S.MessageLoadingAvatar />
                <S.MessageLoadingBody>
                  <S.MessageLoadingLine $width="56px" />
                  <S.MessageLoadingBubble $width="220px" />
                  <S.MessageLoadingLine $width="82px" />
                </S.MessageLoadingBody>
              </S.MessageLoadingGroup>
              <S.MessageLoadingGroup aria-hidden="true">
                <S.MessageLoadingAvatar />
                <S.MessageLoadingBody>
                  <S.MessageLoadingLine $width="64px" />
                  <S.MessageLoadingBubble $width="320px" />
                  <S.MessageLoadingLine $width="82px" />
                </S.MessageLoadingBody>
              </S.MessageLoadingGroup>
            </S.MessageLoading>
          ) : (
            <S.MessageContent>
              {messageGroups.map((group) => {
                const isMine = group.userId === currentUserId
                const sender = membersByUserId[group.userId]

                return (
                  <S.MessageGroup
                    key={group.groupId}
                    $isMine={embedded ? false : isMine}
                  >
                    {(!isMine || embedded) && (
                      <MemberAvatar
                        userName={sender?.userName}
                        profileImageUrl={sender?.profileImageUrl}
                      />
                    )}
                    <S.MessageBody>
                      {(!isMine || embedded) && (
                        <S.SenderName>{sender?.userName ?? '멤버'}</S.SenderName>
                      )}
                      <S.Bubbles $isMine={embedded ? false : isMine}>
                        {group.messages.map((message) => (
                          <S.Bubble
                            id={`message-${message.messageId}`}
                            key={message.messageId}
                            $isMine={embedded ? false : isMine}
                            $embedded={embedded}
                            $isTarget={message.messageId === targetMessageId}
                          >
                            <MessageMarkdown content={message.content} />
                            {message.files?.map((file) =>
                              isImageFile(file) ? (
                                <S.AttachedImage
                                  key={file.fileId}
                                  src={file.fileUrl}
                                  alt={file.fileName}
                                />
                              ) : (
                                <S.AttachedFile
                                  key={file.fileId}
                                  href={file.fileUrl}
                                  target="_blank"
                                  rel="noreferrer"
                                >
                                  {file.fileName}
                                </S.AttachedFile>
                              ),
                            )}
                          </S.Bubble>
                        ))}
                        <S.MessageTime
                          $isMine={embedded ? false : isMine}
                          $embedded={embedded}
                        >
                          {formatQuestionDate(group.createdAt)}
                        </S.MessageTime>
                      </S.Bubbles>
                    </S.MessageBody>
                  </S.MessageGroup>
                )
              })}
            </S.MessageContent>
          )}
        </S.MessageList>
        {question.status !== 'DONE' && (
          <MentoringComposer
            isSubmitting={isSending}
            placeholder="답변을 남겨보세요."
            onSubmit={handleSend}
          />
        )}
      </S.Chat>
    </S.Panel>
  )
}
