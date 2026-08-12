import { BadgeStatIcon } from './BadgeStatIcon'
import { PointStatIcon } from './PointStatIcon'
import { ViewStatIcon } from './ViewStatIcon'

import type { MyStat } from '../../types'

type MyStatIconProps = {
  type: MyStat['id']
}

export function MyStatIcon({ type }: MyStatIconProps) {
  if (type === 'point') {
    return <PointStatIcon />
  }

  if (type === 'badge') {
    return <BadgeStatIcon />
  }

  return <ViewStatIcon />
}
