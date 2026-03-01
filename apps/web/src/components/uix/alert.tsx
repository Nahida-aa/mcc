import type * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'

import { AlertCircleIcon, CheckCircle2, CircleX, Info, TriangleAlert } from 'lucide-react'
import { cn } from '@/lib/utils'

const alertVariants = cva(
  'relative  text-base leading-none grid has-[>svg]:grid-cols-[calc(var(--spacing)*4)_1fr] grid-cols-[0_1fr] has-[>svg]:gap-x-1 gap-y-0.5 items-start [&>svg]:size-4  [&>svg]:text-current',
  {
    variants: {
      variant: {
        default: 'bg-card text-card-foreground',
        warning: 'bg-transparent text-ctp-yellow',
        destructive:
          'text-destructive bg-card [&>svg]:text-current *:data-[slot=alert-description]:text-destructive/90',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
)

function _Alert({
  className,
  variant,
  ...props
}: React.ComponentProps<'div'> & VariantProps<typeof alertVariants>) {
  return (
    <div
      data-slot="alert"
      role="alert"
      className={cn(alertVariants({ variant }), className)}
      {...props}
    />
  )
}
function _AlertTitle({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="alert-title"
      className={cn(
        'col-start-2 line-clamp-1 min-h-4 font-medium tracking-tight',
        className,
      )}
      {...props}
    />
  )
}
// 图标映射表
const variantIcons = {
  default: Info,
  info: Info,
  warning: TriangleAlert,
  success: CheckCircle2,
  destructive: AlertCircleIcon, // CircleX
} as const
export function Alert({
  className,
  variant,
  children,
  ...props
}: React.ComponentProps<'div'> & VariantProps<typeof alertVariants>) {
  const Icon = variantIcons[variant || 'default'] ?? Info
  return (
    <_Alert className={` bg-transparent ${className}`} variant={variant} {...props}>
      <Icon size={16} />
      {/* 自动换行 */}
      {/* line-clamp-1 */}
      <div className="col-start-2  min-h-4 font-medium tracking-tight">
        <p className="wrap-break-word break-keep relative top-[0.7px]">{children}</p>
      </div>
    </_Alert>
  )
}
