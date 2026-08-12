import type { StoreIconProps } from './types'

export function CloseIcon({ size = 20 }: StoreIconProps) {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      height={size}
      viewBox="0 0 20 20"
      width={size}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M3.5 3.5L16.5 16.5M16.5 3.5L3.5 16.5"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="2.2"
      />
    </svg>
  )
}
