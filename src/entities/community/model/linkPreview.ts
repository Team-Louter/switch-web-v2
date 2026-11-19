export interface LinkPreviewResponse {
  title: string
  description: string
  siteName: string
  imageUrl: string | null
  imageAlt: string
  layout: 'large' | 'thumbnail'
}
