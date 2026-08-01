export interface CreateStudyRequest {
  month: number
  weekNumber: number
  title: string
  ownContent: string
  clubContent: string
}

export interface StudyRecord {
  title: string
  author?: string
  ownContent: string
  clubContent: string
}
