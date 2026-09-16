import type { MemberRole } from '@/entities/member/model/profile'

/** 질문 진행 상태 (대기 / 진행 / 종료) */
export type QuestionStatus = 'PAUSED' | 'ACTIVE' | 'DONE'

export interface MentoringRoom {
  mentoringId: number
  mentoringName: string
  createdAt: string
}

export interface MentoringMember {
  memberId: number
  mentoringId: number
  userId: number
  role: MemberRole
}

/** 질문 / 메시지에 첨부할 파일 (fileUrl에는 업로드 응답의 key를 담는다) */
export interface MentoringFileRequest {
  fileUrl: string
  fileName: string
  fileType: string
  fileSize: number
}

/** 조회 응답의 fileUrl은 서버가 발급한 Presigned URL이라 그대로 사용한다 */
export interface MentoringFile extends MentoringFileRequest {
  fileId: number
  targetType: 'QUESTION' | 'MESSAGE'
  targetId: number
  createdAt: string
}

export interface MentoringQuestion {
  questionId: number
  mentoringId: number
  userId: number
  status: QuestionStatus
  title: string
  content: string
  files: MentoringFile[]
  createdAt: string
}

export interface MentoringMessage {
  messageId: number
  questionId: number
  userId: number
  content: string
  files: MentoringFile[]
  createdAt: string
}

export interface MentoringRequest {
  mentoringName: string
  memberIds: number[]
}

export interface CreateQuestionRequest {
  mentoringId: number
  title: string
  content: string
  files?: MentoringFileRequest[]
}

export interface CreateMessageRequest {
  questionId: number
  content: string
  files?: MentoringFileRequest[]
}
