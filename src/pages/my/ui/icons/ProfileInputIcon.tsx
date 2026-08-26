import { ArrowDownIcon } from './ArrowDownIcon'
import { GithubIcon } from './GithubIcon'
import { LinkedinIcon } from './LinkedinIcon'

type ProfileInputIconType = 'arrowDown' | 'github' | 'linkedin'

type ProfileInputIconProps = {
  type: ProfileInputIconType
}

export function ProfileInputIcon({ type }: ProfileInputIconProps) {
  if (type === 'arrowDown') {
    return <ArrowDownIcon />
  }

  if (type === 'github') {
    return <GithubIcon />
  }

  return <LinkedinIcon />
}
