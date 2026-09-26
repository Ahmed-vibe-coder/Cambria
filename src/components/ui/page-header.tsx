import React from "react";
import { Container } from "./container";
import { DoubleRingDivider } from "./double-ring-divider";
import { cn } from "@/lib/utils";

interface PageHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
  variant?: "navy" | "offwhite";
  centered?: boolean;
  className?: string;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  eyebrow,
  title,
  description,
  variant = "navy",
  centered = false,
  className,
}) => {
  const isNavy = variant === "navy";

  return (
    <div
      className={cn(
        "py-16 md:py-20 relative overflow-hidden border-b",
        isNavy
          ? "bg-cambria-navy text-white border-cambria-deep"
          : "bg-cambria-offwhite text-cambria-navy border-slate-200",
        className
      )}
    >
      <Container>
        <div className={cn("max-w-3xl", centered && "mx-auto text-center")}>
          {eyebrow && (
            <p className="text-xs uppercase tracking-[0.2em] font-semibold text-[#C8A84E] mb-3">
              {eyebrow}
            </p>
          )}
          <h1
            className={cn(
              "font-serif text-4xl sm:text-5xl md:text-6xl font-semibold tracking-tight leading-[1.1]",
              isNavy ? "text-white" : "text-cambria-navy"
            )}
          >
            {title}
          </h1>
          <DoubleRingDivider
            variant={isNavy ? "dark" : "light"}
            centered={centered}
            withStar
          />
          {description && (
            <p
              className={cn(
                "text-lg md:text-xl font-normal leading-relaxed",
                isNavy ? "text-slate-300" : "text-slate-600"
              )}
            >
              {description}
            </p>
          )}
        </div>
      </Container>
    </div>
  );
};
