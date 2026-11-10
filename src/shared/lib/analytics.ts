const GA_MEASUREMENT_ID = 'G-00F722LWDP'
const CLARITY_PROJECT_ID = 'zbc603dpsy'

declare global {
  interface Window {
    dataLayer: unknown[][]
    gtag: (...args: unknown[]) => void
    clarity: ((...args: unknown[]) => void) & { q?: unknown[][] }
  }
}

const loadScript = (src: string) => {
  const script = document.createElement('script')
  script.async = true
  script.src = src
  document.head.appendChild(script)
}

const initializeGoogleAnalytics = () => {
  window.dataLayer = window.dataLayer || []
  window.gtag = (...args) => {
    window.dataLayer.push(args)
  }

  loadScript(`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`)
  window.gtag('js', new Date())
  window.gtag('config', GA_MEASUREMENT_ID)
}

const initializeClarity = () => {
  window.clarity =
    window.clarity ||
    ((...args) => {
      window.clarity.q = window.clarity.q || []
      window.clarity.q.push(args)
    })

  loadScript(`https://www.clarity.ms/tag/${CLARITY_PROJECT_ID}`)
}

export const initializeAnalytics = () => {
  if (!import.meta.env.PROD) return

  initializeGoogleAnalytics()
  initializeClarity()
}
