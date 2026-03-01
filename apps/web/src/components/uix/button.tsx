import type { ComponentProps, ReactNode } from 'react'
import { Button as UiButton } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Spinner } from '../ui/spinner'
import { NoStyleLink } from './link'
export interface ButtonProps extends ComponentProps<typeof UiButton> {
  href?: string
  pending?: boolean
  Icon?: ReactNode
  classNames?: {
    href?: string
  }
}
export const Button = ({
  children,
  className,
  classNames,
  variant,
  href,
  pending,
  disabled,
  size,
  Icon,
  ...props
}: ButtonProps) => {
  variant = href && !variant ? 'ghost' : variant
  const content = (
    <UiButton
      className={cn(
        'appearance-none select-none subpixel-antialiased overflow-hidden  transform-gpu  cursor-pointer   px-4     leading-[1.15]',
        'active:scale-95 transition-transform duration-100', // data-[pressed=true]:scale-[0.97]
        {
          'justify-start': href && variant === 'ghost',
          'p-2 ': size === 'icon-sm',
        },
        className,
      )}
      variant={variant}
      disabled={pending || disabled}
      size={size}
      {...props}
    >
      {Icon ? (
        <span className={cn('shrink-0', { 'animate-spin': pending })}>{Icon}</span>
      ) : (
        pending && <Spinner />
      )}
      {children}
    </UiButton>
  )

  return href ? (
    <NoStyleLink
      className={cn('flex w-full justify-start', classNames?.href)}
      href={href}
    >
      {content}
    </NoStyleLink>
  ) : (
    content
  )
}
