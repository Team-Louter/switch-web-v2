export interface CreateStudyRequest {
  year: number
  month: number
  weekNumber: number
  title: string
  ownContent: string
  clubContent: string
}

export interface StudyRecord {
  studyId: number
  authorName: string
  year: number
  month: number
  weekNumber: number
  title: string
  ownContent: string
  clubContent: string
  fullContent: string
  summary: string
  createdAt: string
}

export interface StudyStatus {
  userId: number
  userName: string
  studyId: number
  status: 'SUBMITTED' | 'PENDING' | 'OVERDUE'
}

export interface StudyRequest {
  scheduleIds: number[]
  year: number
  month: number
  weekNumber: number
}

export interface StudyResponse {
  clubReportId: number
  scheduleIds: number[]
  scheduleTitles: string[]
  month: number
  weekNumber: number
  activityContent: string
  createdAt: string
}
