import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-display font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-surface focus-visible:ring-brand-400 disabled:pointer-events-none disabled:opacity-50 select-none",
  {
    variants: {
      variant: {
        default:
          "bg-brand-500 text-white hover:bg-brand-600 shadow-lg shadow-brand-500/25 active:scale-[0.97] tracking-wide",
        destructive:
          "bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30",
        outline:
          "glass glass-hover text-white",
        secondary:
          "bg-white/10 text-white hover:bg-white/15",
        ghost:
          "text-white/50 hover:text-white hover:bg-white/5",
        link:
          "text-brand-400 underline-offset-4 hover:underline",
        gradient:
          "bg-gradient-to-r from-brand-500 to-accent-purple text-white shadow-lg shadow-brand-500/25 hover:shadow-brand-500/40 active:scale-[0.97] tracking-wide",
        glass:
          "glass text-white hover:bg-white/10 hover:border-brand-500/30 active:scale-[0.97]",
      },
      size: {
        default: "h-11 px-6 py-2",
        sm: "h-9 rounded-lg px-4 text-xs",
        lg: "h-12 rounded-xl px-8 text-base",
        xl: "h-14 rounded-2xl px-10 text-base",
        icon: "h-10 w-10",
        "icon-sm": "h-8 w-8 rounded-lg",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
