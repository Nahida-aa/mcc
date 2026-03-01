import { cn } from '@/lib/utils'
import type { LinkProps } from 'next/link'
import Link from 'next/link'
import type { AnchorHTMLAttributes } from 'react'

type NoStyleLinkProps = LinkProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof LinkProps> & {
    className?: string
  }

export const NoStyleLink = ({ children, className, ...props }: NoStyleLinkProps) => {
  return (
    <Link
      {...props}
      className={cn('text-inherit no-underline inline-flex items-center', className)}
    >
      {children}
    </Link>
  )
}

export const UserLink = ({ username }: { username: string }) => (
  <NoStyleLink href={`/user/${username}`} className="hover:underline hover:text-primary">
    {username}
  </NoStyleLink>
)
