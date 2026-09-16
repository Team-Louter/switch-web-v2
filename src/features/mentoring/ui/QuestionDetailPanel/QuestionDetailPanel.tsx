import { useEffect, useMemo, useRef, useState } from 'react'
import { PiCaretDoubleRight } from 'react-icons/pi'

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

interface MessageGroup {
  groupId: number
  userId: number
  messages: MentoringMessage[]
  createdAt: string
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

const isImageFile = (file: MentoringFile) => file.fileType?.startsWith('image/')

interface QuestionDetailPanelProps {
  question: MentoringQuestion
  roomName: string
  currentUserId?: number
  canChangeStatus: boolean
  membersByUserId: Record<number, Member>
  embedded?: boolean
  onClose: () => void
  onStatusChange?: (status: QuestionStatus) => void | Promise<void>
}

export function QuestionDetailPanel({
  question,
  roomName,
  currentUserId,
  canChangeStatus,
  membersByUserId,
  embedded = false,
  onClose,
  onStatusChange,
}: QuestionDetailPanelProps) {
  const [messages, setMessages] = useState<MentoringMessage[]>([])
  const [isSending, setIsSending] = useState(false)
  const messageListRef = useRef<HTMLDivElement>(null)

  const loadMessages = async (questionId: number) => {
    // 서버에 질문 단위 조회가 없어 전체 메시지에서 해당 질문만 추린다.
    const allMessages = await getMessages()

    return allMessages
      .filter((message) => message.questionId === questionId)
      .sort((first, second) => first.createdAt.localeCompare(second.createdAt))
  }

  useEffect(() => {
    let isCancelled = false

    loadMessages(question.questionId)
      .then((questionMessages) => {
        if (!isCancelled) setMessages(questionMessages)
      })
      .catch(() => {})

    return () => {
      isCancelled = true
    }
  }, [question.questionId])

  useEffect(() => {
    messageListRef.current?.scrollTo({
      top: messageListRef.current.scrollHeight,
    })
  }, [messages])

  const handleSend = async (nextContent: string, nextFiles: File[]) => {
    // 전송 중에는 버튼/엔터 어느 쪽으로도 중복 전송되지 않게 막는다.
    if (isSending) return
    if (!nextContent.trim() && nextFiles.length === 0) return

    try {
      setIsSending(true)
      const uploadedFiles = await Promise.all(
        nextFiles.map((file) => uploadMentoringFile(file)),
      )

      await createMessage({
        questionId: question.questionId,
        content: nextContent.trim(),
        files: uploadedFiles,
      })

      setMessages(await loadMessages(question.questionId))
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

  const messageGroups = useMemo(() => groupMessages(messages), [messages])
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
          <S.Title>{question.title}</S.Title>
        </S.QuestionInfo>
      </S.Header>
      <S.CreatedAt $embedded={embedded}>
        {formatQuestionDate(question.createdAt)}
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
                  {question.content}
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

          {/* 질문에 달린 답변이 없으면 안내 문구를 보여준다 */}
          {messageGroups.length === 0 ? (
            <S.EmptyText>아직 답변이 없어요.</S.EmptyText>
          ) : (
            messageGroups.map((group) => {
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
                          key={message.messageId}
                          $isMine={embedded ? false : isMine}
                          $embedded={embedded}
                        >
                          {message.content}
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
            })
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
