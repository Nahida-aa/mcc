import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"

// const badgeVariants = cva(
//   "inline-flex items-center justify-center rounded-full border border-transparent px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden",
//   {
//     variants: {
//       variant: {
//         default: "bg-primary text-primary-foreground [a&]:hover:bg-primary/90",
//         secondary:
//           "bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90",
//         destructive:
//           "bg-destructive text-white [a&]:hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
//         outline:
//           "border-border text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground",
//         ghost: "[a&]:hover:bg-accent [a&]:hover:text-accent-foreground",
//         link: "text-primary underline-offset-4 [a&]:hover:underline",
//       },
//     },
//     defaultVariants: {
//       variant: "default",
//     },
//   }
// )
const badgeVariants = cva(
  'inline-flex items-center justify-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        default: cn(
          'border-transparent bg-button text-secondary-foreground  min-w-5 rounded-full px-2',
        ),
        inherit: cn(
          'justify-center border-transparent bg-inherit text-inherit hover:bg-transparent min-w-5 rounded-full px-0.5  text-center',
        ),
        extra:
          'border-transparent bg-button text-secondary-foreground p-0 min-w-4 absolute top-0 right-0',
        primary:
          'border-transparent bg-primary text-primary-foreground hover:bg-primary/80 min-w-5 rounded-full px-1',
        secondary:
          'border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80',
        destructive:
          'border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80',
        outline: 'text-foreground',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
)
function Badge({
  className,
  variant = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : "span"

  return (
    <Comp
      data-slot="badge"
      data-variant={variant}
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
