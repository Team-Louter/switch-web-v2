import type { SVGProps } from 'react';
import { FaHammer } from 'react-icons/fa';

interface PixelHammerIconProps extends SVGProps<SVGSVGElement> {
  size?: number;
}

export function PixelHammerIcon({
  size = 14,
  ...props
}: PixelHammerIconProps) {
  return (
    <FaHammer
      {...props}
      size={size}
      aria-hidden="true"
      focusable="false"
    />
  );
}
