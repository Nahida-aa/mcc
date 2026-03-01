import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { ComponentPropsWithoutRef } from 'react'

export function XTooltip({
  children,
  side = 'top',
  content,
}: ComponentPropsWithoutRef<typeof Tooltip> & {
  content: React.ReactNode
  // side?: 'top' | 'bottom' | 'left' | 'right'
} & ComponentPropsWithoutRef<typeof TooltipContent>) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent side={side}>{content}</TooltipContent>
    </Tooltip>
  )
}
