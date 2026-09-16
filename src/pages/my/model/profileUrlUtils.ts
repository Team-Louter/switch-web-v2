const extractHandle = (url: string, pattern: RegExp | string) => {
  const parts = url.split(pattern).filter(Boolean)
  return parts.at(-1)?.split('/')[0] ?? ''
}

export const extractGithubHandle = (url: string) =>
  extractHandle(url, 'github.com/')

export const extractLinkedinHandle = (url: string) =>
  extractHandle(url, /linkedin\.com\/in\//i)

const normalizeUrl = (
  url: string,
  pattern: RegExp | string,
  base: string,
) => {
  const handle = extractHandle(url, pattern)
  return handle ? `${base}/${handle}` : url
}

export const normalizeGithubUrl = (url: string) =>
  normalizeUrl(url, 'github.com/', 'https://github.com')

export const normalizeLinkedinUrl = (url: string) =>
  normalizeUrl(url, /linkedin\.com\/in\//i, 'https://www.linkedin.com/in')
