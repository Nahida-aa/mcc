import { toastError } from '@/components/uix/toast'

export const Form = ({
  className,
  children,
  onSubmit,
}: {
  className?: string
  children: React.ReactNode
  onSubmit?: () => void | Promise<void>
}) => {
  return (
    <form
      className={className}
      onSubmit={async e => {
        e.preventDefault()
        try {
          await onSubmit?.()
        } catch (error) {
          toastError(error)
        }
      }}
    >
      {children}
    </form>
  )
}
