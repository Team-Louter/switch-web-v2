const ARCHIVE_EXTENSIONS = new Set([
  'zip', 'rar', '7z', 'tar', 'gz', 'tgz', 'bz2', 'xz', 'zst', 'iso',
])
const EXECUTABLE_EXTENSIONS = new Set([
  'exe', 'msi', 'msix', 'com', 'scr', 'bat', 'cmd', 'ps1', 'sh', 'bash',
  'js', 'mjs', 'cjs', 'vbs', 'vbe', 'wsf', 'hta', 'lnk', 'url',
  'apk', 'app', 'dmg', 'pkg', 'jar', 'deb', 'rpm',
  'docm', 'dotm', 'xlsm', 'xlam', 'pptm', 'ppam',
])
const ARCHIVE_MIME_TYPES = new Set([
  'application/zip', 'application/x-zip-compressed', 'application/vnd.rar',
  'application/x-rar-compressed', 'application/x-7z-compressed', 'application/x-tar',
  'application/gzip', 'application/x-gzip', 'application/x-bzip2', 'application/x-xz',
  'application/x-iso9660-image',
])
const EXECUTABLE_MIME_TYPES = new Set([
  'application/x-msdownload', 'application/x-msdos-program',
  'application/vnd.microsoft.portable-executable', 'application/x-executable',
  'application/x-sh', 'application/x-shellscript', 'application/javascript',
  'text/javascript', 'application/java-archive', 'application/vnd.android.package-archive',
  'application/x-apple-diskimage',
  'application/vnd.ms-word.document.macroenabled.12',
  'application/vnd.ms-excel.sheet.macroenabled.12',
  'application/vnd.ms-powerpoint.presentation.macroenabled.12',
])

export type CommunityDownloadRisk = 'archive' | 'executable' | null

export function getCommunityDownloadRisk(fileName: string, fileType = ''): CommunityDownloadRisk {
  const normalizedName = fileName.normalize('NFKC').trim().replace(/[. ]+$/, '').toLowerCase()
  const extension = normalizedName.includes('.') ? normalizedName.split('.').at(-1) ?? '' : ''
  const mimeType = fileType.split(';')[0].trim().toLowerCase()
  if (EXECUTABLE_EXTENSIONS.has(extension) || EXECUTABLE_MIME_TYPES.has(mimeType)) return 'executable'
  if (ARCHIVE_EXTENSIONS.has(extension) || ARCHIVE_MIME_TYPES.has(mimeType)) return 'archive'
  return null
}
