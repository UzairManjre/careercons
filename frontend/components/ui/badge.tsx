import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-3 py-1 text-meta font-mono transition-all",
  {
    variants: {
      variant: {
        default: "bg-brand-500/15 text-brand-300 border border-brand-500/20",
        secondary: "bg-white/10 text-white/60 border border-white/10",
        destructive: "bg-red-500/15 text-red-300 border border-red-500/20",
        success: "bg-green-500/15 text-green-300 border border-green-500/20",
        outline: "border border-white/15 text-white/50",
        brand: "bg-gradient-to-r from-brand-500/20 to-accent-purple/20 text-brand-300 border border-brand-500/20",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />
}

export { Badge, badgeVariants }
