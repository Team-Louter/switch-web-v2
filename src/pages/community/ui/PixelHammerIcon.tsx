import type { SVGProps } from 'react';

interface PixelHammerIconProps extends SVGProps<SVGSVGElement> {
  size?: number;
}

export function PixelHammerIcon({
  size = 14,
  ...props
}: PixelHammerIconProps) {
  return (
    <svg
      {...props}
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      shapeRendering="crispEdges"
      aria-hidden="true"
      focusable="false"
    >
      <path
        fill="#1d2028"
        d="M4 2h4v1h3v1h2v1h2v1h1v2h1v2h-1v2h-2v1h-2v-1h-2v-1H9v2H8v2H7v1H6v1H4v1H2v-1H1v-3h1v-2h1V9h1V7h1V5H4V2Zm1 1v2h1v2h1v1h2v1h2v1h2v1h2v-1h1V9h-1V7h-2V6h-2V5H9V4H6V3H5Z"
      />
      <path
        fill="#cbd7eb"
        d="M6 3h2v1h3v1h2v1h2v2h1v2h-2v1h-2v-1h-2V9H8V8H7V7H6V5H5V4h1V3Z"
      />
      <path
        fill="#7184a5"
        d="M12 6h2v1h2v2h1v1h-2v1h-2v-1h-1V9h-1V8h1V7h-1V6h1Z"
      />
      <path
        fill="#f3f7ff"
        d="M7 4h2v1h2v1h2v1h1v1h-2V8h-2V7H9V6H7V5H6V4h1Z"
      />
      <path
        fill="#e46c22"
        d="M3 10h1V8h1V7h2v1h1v2H7v2H6v1H5v2H4v1H2v-2h1v-2h1v-1H3v-1h1v-1H3v1Z"
      />
      <path
        fill="#ff9d16"
        d="M4 10h1V8h1v1h1v1H6v2H5v1H4v2H3v-1h1v-2h1v-1H4v-1Z"
      />
      <path
        fill="#b94425"
        d="M2 14h2v-1h1v-1h1v-1h1v-1h1v1H7v2H6v1H5v1H3v1H2v-1H1v-1h1Z"
      />
    </svg>
  );
}
