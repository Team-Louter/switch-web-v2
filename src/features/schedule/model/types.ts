export interface Schedule {
  scheduleId: number,
  title: string,
  content: string,
  startDate: string,
  endDate: string,
  color: string,
  users: {
    userId: number,
    userEmail: string,
    userName: string
  }[]
}