import React from "react";
import { cn } from "@/lib/utils";
import { CambriaSeal } from "./cambria-seal";

interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  variant?: "offwhite" | "white" | "navy" | "deep";
  watermark?: boolean;
}

export const Section: React.FC<SectionProps> = ({
  className,
  variant = "offwhite",
  watermark = false,
  children,
  ...props
}) => {
  const getBgClass = () => {
    switch (variant) {
      case "white":
        return "bg-white text-cambria-navy";
      case "navy":
        return "bg-cambria-navy text-white";
      case "deep":
        return "bg-cambria-deep text-white";
      case "offwhite":
      default:
        return "bg-cambria-offwhite text-cambria-navy";
    }
  };

  return (
    <section
      className={cn("relative py-16 md:py-24 overflow-hidden", getBgClass(), className)}
      {...props}
    >
      {watermark && (
        <div
          className="absolute -right-24 -bottom-24 pointer-events-none select-none opacity-[0.035] transform rotate-12"
          aria-hidden="true"
        >
          <CambriaSeal
            size={500}
            variant={variant === "navy" || variant === "deep" ? "white" : "navy"}
          />
        </div>
      )}
      <div className="relative z-10">{children}</div>
    </section>
  );
};
