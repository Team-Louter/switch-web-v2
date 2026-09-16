import { NAME_STYLE_PRESETS } from './nameStylePresets'

import type { NameStyleKey } from './nameStylePresets'

export function isNameStyleKey(styleKey?: string): styleKey is NameStyleKey {
  return Boolean(
    styleKey &&
      Object.prototype.hasOwnProperty.call(NAME_STYLE_PRESETS, styleKey),
  )
}

export function normalizeNameStyleKey(styleKey?: string) {
  const trimmedStyleKey = styleKey?.trim()

  if (!trimmedStyleKey) {
    return undefined
  }

  if (isNameStyleKey(trimmedStyleKey)) {
    return trimmedStyleKey
  }

  const enumStyleKey = trimmedStyleKey.toUpperCase().replace(/-/g, '_')

  return isNameStyleKey(enumStyleKey) ? enumStyleKey : undefined
}

export function getNameStyleKey(styleKey?: string) {
  return normalizeNameStyleKey(styleKey)
}

export function getNameStylePreset(styleKey?: string) {
  const normalizedStyleKey = normalizeNameStyleKey(styleKey)

  return normalizedStyleKey
    ? NAME_STYLE_PRESETS[normalizedStyleKey]
    : NAME_STYLE_PRESETS.default
}
