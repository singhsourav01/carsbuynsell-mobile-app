import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-white",
        secondary: "border-transparent bg-surface text-navy",
        success: "border-transparent bg-green-100 text-green-700",
        warning: "border-transparent bg-amber-100 text-amber-700",
        destructive: "border-transparent bg-red-100 text-red-700",
        outline: "text-navy border-gray-300",
        pending: "border-transparent bg-amber-100 text-amber-700",
        accepted: "border-transparent bg-green-100 text-green-700",
        rejected: "border-transparent bg-red-100 text-red-700",
        blocked: "border-transparent bg-gray-100 text-gray-700",
        active: "border-transparent bg-green-100 text-green-700",
        sold: "border-transparent bg-primary text-white",
        auction: "border-transparent bg-purple-100 text-purple-700",
        buy_now: "border-transparent bg-blue-100 text-blue-700",
        won: "border-transparent bg-green-100 text-green-700",
        pending_payment: "border-transparent bg-amber-100 text-amber-700",
        completed: "border-transparent bg-blue-100 text-blue-700",
        lost: "border-transparent bg-gray-100 text-gray-700",
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
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
