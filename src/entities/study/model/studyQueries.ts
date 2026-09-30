import { queryOptions } from '@tanstack/react-query'

import { getMyStatus, getWeekStatus } from '../api/getStatus'
import { getAllStudies, getStudy } from '../api/getStudy'
import { getAllTotalStudies, getTotalStudy } from '../api/getTotalStudy'

export const studyQueryKeys = {
  all: ['studies'] as const,
  mine: (userId: number | null) => [...studyQueryKeys.all, 'mine', userId] as const,
  myMonth: (userId: number | null, year: number, month: number) =>
    [...studyQueryKeys.mine(userId), 'status', year, month] as const,
  myRecord: (
    userId: number | null,
    year: number,
    month: number,
    weekNumber: number,
  ) => [...studyQueryKeys.mine(userId), 'record', year, month, weekNumber] as const,
  management: (userId: number | null) =>
    [...studyQueryKeys.all, 'management', userId] as const,
  managementWeek: (
    userId: number | null,
    year: number,
    month: number,
    weekNumber: number,
  ) =>
    [...studyQueryKeys.management(userId), 'status', year, month, weekNumber] as const,
  allRecords: (userId: number | null) =>
    [...studyQueryKeys.management(userId), 'records'] as const,
  totalReports: (userId: number | null) =>
    [...studyQueryKeys.management(userId), 'club-reports'] as const,
  totalReport: (userId: number | null, reportId: number) =>
    [...studyQueryKeys.totalReports(userId), reportId] as const,
}

export function myStudyMonthOptions(
  userId: number | null,
  year: number,
  month: number,
) {
  return queryOptions({
    queryKey: studyQueryKeys.myMonth(userId, year, month),
    queryFn: () => getMyStatus(year, month),
  })
}

export function myStudyRecordOptions(
  userId: number | null,
  year: number,
  month: number,
  weekNumber: number,
) {
  return queryOptions({
    queryKey: studyQueryKeys.myRecord(userId, year, month, weekNumber),
    queryFn: () => getStudy(year, month, weekNumber),
  })
}

export function managementStudyWeekOptions(
  userId: number | null,
  year: number,
  month: number,
  weekNumber: number,
) {
  return queryOptions({
    queryKey: studyQueryKeys.managementWeek(userId, year, month, weekNumber),
    queryFn: () => getWeekStatus(year, month, weekNumber),
  })
}

export function allManagementStudiesOptions(userId: number | null) {
  return queryOptions({
    queryKey: studyQueryKeys.allRecords(userId),
    queryFn: getAllStudies,
  })
}

export function totalStudyReportsOptions(userId: number | null) {
  return queryOptions({
    queryKey: studyQueryKeys.totalReports(userId),
    queryFn: getAllTotalStudies,
  })
}

export function totalStudyReportOptions(userId: number | null, reportId: number) {
  return queryOptions({
    queryKey: studyQueryKeys.totalReport(userId, reportId),
    queryFn: () => getTotalStudy(reportId),
  })
}
