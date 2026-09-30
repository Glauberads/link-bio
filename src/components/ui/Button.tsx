import * as React from "react"
import { cn } from "@/lib/utils"

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm" | "lg" | "icon";
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center whitespace-nowrap rounded-full text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary disabled:pointer-events-none disabled:opacity-50",
          variant === "default" && "bg-primary text-[#0A0806] shadow hover:bg-primary/90",
          variant === "outline" && "border border-primary/35 bg-transparent shadow-sm hover:bg-primary/10 text-primary",
          variant === "ghost" && "hover:bg-surface text-text",
          size === "default" && "h-14 px-8 py-4 text-base",
          size === "sm" && "h-8 rounded-md px-3 text-xs",
          size === "lg" && "h-16 rounded-full px-10 text-lg",
          size === "icon" && "h-12 w-12",
          className
        )}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }
