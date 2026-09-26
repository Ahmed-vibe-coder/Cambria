import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[4px] text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cambria-academic focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-cambria-navy text-white hover:bg-cambria-academic shadow-subtle",
        destructive:
          "bg-rose-700 text-white hover:bg-rose-800 shadow-subtle",
        outline:
          "border border-slate-300 bg-white text-cambria-navy hover:bg-slate-50 hover:border-cambria-academic",
        outlineDark:
          "border border-white/30 bg-white/10 text-white hover:bg-white/20 hover:border-white shadow-subtle",
        secondary:
          "bg-cambria-soft text-cambria-navy hover:bg-blue-100",
        ghost: "hover:bg-slate-100 text-cambria-navy",
        link: "text-cambria-academic underline-offset-4 hover:underline",
        gold: "bg-[#C8A84E] text-cambria-deep font-semibold hover:bg-[#B89840] shadow-subtle",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-8 rounded-[4px] px-3 text-xs",
        lg: "h-11 rounded-[4px] px-6 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";
