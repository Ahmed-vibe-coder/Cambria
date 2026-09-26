import React from "react";
import { cn } from "@/lib/utils";

interface DoubleRingDividerProps {
  className?: string;
  variant?: "light" | "dark";
  centered?: boolean;
  withStar?: boolean;
}

export const DoubleRingDivider: React.FC<DoubleRingDividerProps> = ({
  className,
  variant = "light",
  centered = false,
  withStar = false,
}) => {
  const isDark = variant === "dark";

  return (
    <div
      className={cn(
        "flex items-center my-6",
        centered ? "justify-center" : "justify-start",
        className
      )}
      role="separator"
    >
      <div
        className={cn(
          "w-16 sm:w-24 h-[3px]",
          isDark ? "border-t border-b border-white/20" : "border-t border-b border-cambria-navy/20"
        )}
      />
      {withStar && (
        <span className="mx-2 text-[#C8A84E] text-xs select-none">★</span>
      )}
      <div
        className={cn(
          "w-16 sm:w-24 h-[3px]",
          isDark ? "border-t border-b border-white/20" : "border-t border-b border-cambria-navy/20"
        )}
      />
    </div>
  );
};
