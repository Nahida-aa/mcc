import { cn } from '@/lib/utils'

function Skeleton({
  className,
  isPulse = true,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {
  isPulse?: boolean
}) {
  return (
    <div
      className={cn('rounded-md bg-accent', { 'animate-pulse': isPulse }, className)}
      {...props}
    />
  )
}

export { Skeleton }
