import React from "react";
import { cn } from "@/lib/utils";

interface GoldStarProps {
  className?: string;
  size?: number;
}

export const GoldStar: React.FC<GoldStarProps> = ({ className, size = 14 }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="#C8A84E"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("inline-block flex-shrink-0", className)}
      aria-hidden="true"
    >
      <polygon points="12,2 15,9 22,9 16,14 18,21 12,17 6,21 8,14 2,9 9,9" />
    </svg>
  );
};
