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
        fill="currentColor"
        d="M2 2h7v1h3v1h2v4h-2v1H7v1H6v1H5v2H3v1H1v-2h2v-2h1V9h1V8H2V7H1V3h1V2Zm1 2v2h8V4H3Z"
      />
      <path
        fill="currentColor"
        opacity="0.55"
        d="M8 9h2v2H9v2H8v1H7v1H5v-2h1v-2h1V9h1Z"
      />
    </svg>
  );
}
