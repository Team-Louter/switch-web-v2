import type { Block } from '@blocknote/core'

interface BlockNotePostPayload {
  version: 1
  blocks: readonly Block[]
}

const BLOCK_NOTE_POST_PREFIX = 'SWITCH_BLOCKNOTE:'
const DEFAULT_BLOCK_TYPES = new Set([
  'audio',
  'bulletListItem',
  'checkListItem',
  'codeBlock',
  'divider',
  'file',
  'heading',
  'image',
  'numberedListItem',
  'paragraph',
  'quote',
  'table',
  'toggleListItem',
  'video',
])

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function isSerializedBlock(value: unknown): boolean {
  if (!isRecord(value)) {
    return false
  }

  return (
    typeof value.id === 'string' &&
    typeof value.type === 'string' &&
    DEFAULT_BLOCK_TYPES.has(value.type) &&
    isRecord(value.props) &&
    Array.isArray(value.children) &&
    value.children.every(isSerializedBlock)
  )
}

export function serializeBlockNotePostContent(
  blocks: readonly Block[],
): string {
  const payload: BlockNotePostPayload = {
    version: 1,
    blocks,
  }

  return `${BLOCK_NOTE_POST_PREFIX}${JSON.stringify(payload)}`
}

export function parseBlockNotePostContent(content: string): Block[] | null {
  if (!content.startsWith(BLOCK_NOTE_POST_PREFIX)) {
    return null
  }

  try {
    const payload: unknown = JSON.parse(
      content.slice(BLOCK_NOTE_POST_PREFIX.length),
    )

    if (
      !isRecord(payload) ||
      payload.version !== 1 ||
      !Array.isArray(payload.blocks) ||
      payload.blocks.length === 0 ||
      !payload.blocks.every(isSerializedBlock)
    ) {
      return null
    }

    return payload.blocks as Block[]
  } catch {
    return null
  }
}
