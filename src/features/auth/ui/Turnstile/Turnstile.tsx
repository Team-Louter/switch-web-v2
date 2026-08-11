import { useEffect, useRef, useState } from 'react'

import * as S from './Turnstile.style'

const TURNSTILE_SCRIPT_ID = 'cloudflare-turnstile-script'
const TURNSTILE_SCRIPT_URL =
  'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit'

type TurnstileAction = 'email_verification' | 'login'

interface TurnstileRenderOptions {
  sitekey: string
  action: TurnstileAction
  theme: 'light'
  size: 'flexible'
  retry: 'auto'
  callback: (token: string) => void
  'expired-callback': () => void
  'error-callback': (errorCode: string) => boolean
  'response-field': boolean
}

interface TurnstileApi {
  render: (
    container: HTMLElement,
    options: TurnstileRenderOptions,
  ) => string
  remove: (widgetId: string) => void
}

interface TurnstileProps {
  siteKey: string
  action: TurnstileAction
  onVerify: (token: string) => void
  onExpire: () => void
  onError: () => void
}

type WidgetStatus = 'loading' | 'ready' | 'error'

declare global {
  interface Window {
    turnstile?: TurnstileApi
  }
}

let turnstileScriptPromise: Promise<TurnstileApi> | null = null

function loadTurnstileScript(): Promise<TurnstileApi> {
  if (window.turnstile) {
    return Promise.resolve(window.turnstile)
  }

  if (turnstileScriptPromise) {
    return turnstileScriptPromise
  }

  turnstileScriptPromise = new Promise((resolve, reject) => {
    const existingScript = document.getElementById(
      TURNSTILE_SCRIPT_ID,
    ) as HTMLScriptElement | null

    function handleLoad() {
      if (window.turnstile) {
        resolve(window.turnstile)
        return
      }

      turnstileScriptPromise = null
      reject(new Error('Cloudflare Turnstile API를 찾을 수 없습니다.'))
    }

    function handleError() {
      turnstileScriptPromise = null
      reject(new Error('Cloudflare Turnstile 스크립트를 불러오지 못했습니다.'))
    }

    if (existingScript) {
      existingScript.addEventListener('load', handleLoad, { once: true })
      existingScript.addEventListener('error', handleError, { once: true })
      return
    }

    const script = document.createElement('script')
    script.id = TURNSTILE_SCRIPT_ID
    script.src = TURNSTILE_SCRIPT_URL
    script.async = true
    script.defer = true
    script.addEventListener('load', handleLoad, { once: true })
    script.addEventListener('error', handleError, { once: true })
    document.head.appendChild(script)
  })

  return turnstileScriptPromise
}

export function Turnstile({
  siteKey,
  action,
  onVerify,
  onExpire,
  onError,
}: TurnstileProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [status, setStatus] = useState<WidgetStatus>('loading')

  useEffect(() => {
    let isDisposed = false
    let widgetId: string | null = null

    async function renderWidget() {
      try {
        const turnstile = await loadTurnstileScript()

        if (isDisposed || !containerRef.current) {
          return
        }

        widgetId = turnstile.render(containerRef.current, {
          sitekey: siteKey,
          action,
          theme: 'light',
          size: 'flexible',
          retry: 'auto',
          callback: onVerify,
          'expired-callback': onExpire,
          'error-callback': () => {
            setStatus('error')
            onError()
            return true
          },
          'response-field': false,
        })
        setStatus('ready')
      } catch {
        if (!isDisposed) {
          setStatus('error')
          onError()
        }
      }
    }

    void renderWidget()

    return () => {
      isDisposed = true

      if (widgetId && window.turnstile) {
        window.turnstile.remove(widgetId)
      }
    }
  }, [action, onError, onExpire, onVerify, siteKey])

  return (
    <S.WidgetShell aria-busy={status === 'loading'}>
      <S.WidgetContainer ref={containerRef} />
      {status === 'loading' && (
        <S.StatusMessage role="status">
          보안 인증을 불러오는 중입니다
        </S.StatusMessage>
      )}
      {status === 'error' && (
        <S.StatusMessage role="alert">
          보안 인증을 불러오지 못했습니다
        </S.StatusMessage>
      )}
    </S.WidgetShell>
  )
}
