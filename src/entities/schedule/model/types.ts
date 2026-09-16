export type ScheduleColor =
  | 'LIGHTGREY'
  | 'PINK'
  | 'GOLD'
  | 'LIGHTGREEN'
  | 'LIGHTBLUE'

export interface Schedule {
  scheduleId: number,
  title: string,
  content: string,
  startDate: string,
  endDate: string,
  color: ScheduleColor,
  users: {
    userId: number,
    userEmail: string,
    userName: string
  }[]
}
