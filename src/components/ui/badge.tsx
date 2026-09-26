import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-[4px] border px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-cambria-navy text-white hover:bg-cambria-navy/80",
        secondary:
          "border-transparent bg-cambria-soft text-cambria-navy hover:bg-cambria-soft/80",
        destructive:
          "border-transparent bg-rose-50 text-rose-800 border-rose-200",
        outline: "text-cambria-navy border-slate-300",
        gold: "border-[#E2CCA0] bg-amber-50/60 text-[#8C6D23]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
