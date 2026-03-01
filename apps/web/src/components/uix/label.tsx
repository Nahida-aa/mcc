// "use client";

import type * as React from 'react'
import { Label as LabelPrimitive } from "radix-ui"
import { cn } from '../../lib/utils'

export function Label({
  className,
  ...props
}: React.ComponentProps<typeof LabelPrimitive.Root>) {
  return (
    <LabelPrimitive.Root
      data-slot="label"
      className={cn(
        'flex items-center pb-2 gap-2  leading-none text-sm font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50',
        className,
      )}
      {...props}
    />
  )
}

export function Description({
  className,
  size = 'sm',
  ...props
}: React.HTMLAttributes<HTMLParagraphElement> & { size?: 'sm' | 'md' | 'lg' }) {
  return (
    <p
      className={cn(
        'text-sm text-muted-foreground line-clamp-2',
        {
          'text-base leading-[1.15] text-foreground': size === 'md',
        },
        className,
      )}
      {...props}
    />
  )
}
