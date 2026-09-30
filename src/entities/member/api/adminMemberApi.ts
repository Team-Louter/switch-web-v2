import { apiClient } from '@/shared/api'
import { memberQueryKeys } from '../model/memberQueries'
import { queryClient } from '@/shared/lib/queryClient'

import type {
  AdminMemberResponse,
  ChangeRoleRequest,
  GetAdminMembersParams,
  QuitMemberRequest,
} from '../model/types'

export const getAdminMembers = async ({
  keyword,
}: GetAdminMembersParams = {}) => {
  const response = await apiClient.get<AdminMemberResponse[]>('/admin/members', {
    params: keyword ? { keyword } : undefined,
  })

  return response.data
}

export const changeAdminMemberRole = async (body: ChangeRoleRequest) => {
  const response = await apiClient.put<AdminMemberResponse>(
    '/admin/members/role',
    body,
  )

  await queryClient.invalidateQueries({ queryKey: memberQueryKeys.all })
  return response.data
}

export const quitAdminMembers = async (body: QuitMemberRequest) => {
  await apiClient.delete('/admin/members', {
    data: body,
  })
  await queryClient.invalidateQueries({ queryKey: memberQueryKeys.all })
}

export const getAdminMemberEmail = async (userId: number) => {
  const response = await apiClient.get<string>(`/admin/members/${userId}/email`)

  return response.data
}
