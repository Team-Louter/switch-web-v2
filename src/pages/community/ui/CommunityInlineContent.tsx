import { Fragment, type ReactNode } from 'react'
import type { Block } from '@blocknote/core'

type InlineContent = Extract<Block['content'], unknown[]>

interface CommunityInlineContentProps {
  content: InlineContent
}

function safeHref(value: string): string | undefined {
  try {
    const url = new URL(value, window.location.href)
    return ['http:', 'https:', 'mailto:', 'tel:'].includes(url.protocol)
      ? url.href
      : undefined
  } catch {
    return undefined
  }
}

export function CommunityInlineContent({ content }: CommunityInlineContentProps) {
  return content.map((item, index) => {
    if (item.type === 'link') {
      const href = safeHref(item.href)
      const children = <CommunityInlineContent content={item.content} />
      return href
        ? <a key={index} href={href} target="_blank" rel="noopener noreferrer">{children}</a>
        : <Fragment key={index}>{children}</Fragment>
    }
    let text: ReactNode = item.text
    if (item.styles.code) text = <code>{text}</code>
    if (item.styles.bold) text = <strong>{text}</strong>
    if (item.styles.italic) text = <em>{text}</em>
    if (item.styles.underline) text = <u>{text}</u>
    if (item.styles.strike) text = <s>{text}</s>
    return <Fragment key={index}>{text}</Fragment>
  })
}
