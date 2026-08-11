import { apiClient } from '@/shared/api'
import type { MentoringFileRequest } from '@/entities/mentoring'

interface FileUploadResponse {
  url: string
  key: string
  fileName: string
  fileType: string
  fileSize: number
}

/** 멘토링 첨부파일 저장 경로 접두사 */
const MENTORING_FILE_PREFIX = 'files'

/**
 * 파일을 업로드하고 질문 / 메시지에 첨부할 수 있는 형태로 돌려준다.
 *
 * 저장 요청의 fileUrl에는 Presigned URL(url)이 아닌 key를 담아야 한다.
 *
 * @param file 업로드할 파일
 */
export const uploadMentoringFile = async (
  file: File,
): Promise<MentoringFileRequest> => {
  const formData = new FormData()
  formData.append('file', file)

  const response = await apiClient.post<FileUploadResponse>(
    '/files/upload',
    formData,
    {
      params: { prefix: MENTORING_FILE_PREFIX },
      headers: { 'Content-Type': 'multipart/form-data' },
    },
  )

  return {
    fileUrl: response.data.key,
    fileName: response.data.fileName,
    fileType: response.data.fileType,
    fileSize: response.data.fileSize,
  }
}
