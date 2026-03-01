'use client'
import type { dialogContentVariants } from '@/components/html/css'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import type { VariantProps } from 'class-variance-authority'
import { ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { VisuallyHidden } from 'radix-ui'
import type { ReactElement } from 'react'

interface ModalProps extends VariantProps<typeof dialogContentVariants> {
  children?: React.ReactNode
  title?: React.ReactNode
  description?: React.ReactNode
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  disableDismissal?: boolean // 是否可以通过点击遮罩层 关闭模态框

  showCloseButton?: boolean
  className?: string
  Trigger?: ReactElement
}
export function Modal({
  children,
  title,
  description,
  open,
  defaultOpen,
  onOpenChange,
  disableDismissal = false, // 是否 使通过点击遮罩层 关闭模态框 失效
  size = 'md',
  showCloseButton = true,
  className = 'p-4',
  Trigger,
}: ModalProps) {
  return (
    <Dialog
      open={open}
      defaultOpen={defaultOpen}
      onOpenChange={onOpenChange}
      // modal={false}
      // disablePointerDismissal={disableDismissal}
    >
      {Trigger && <DialogTrigger asChild children={Trigger} />}
      <DialogContent
        className={className}
        showCloseButton={showCloseButton}
        size={size}
        onInteractOutside={e => {
          if (disableDismissal) {
            e.preventDefault()
          }
        }}
      >
        {title ? (
          <DialogHeader className="h-fit">
            <DialogTitle className="text-xl">{title}</DialogTitle>
            <DialogDescription>{description}</DialogDescription>
          </DialogHeader>
        ) : (
          <VisuallyHidden.Root asChild>
            <DialogHeader className="h-fit">
              <DialogTitle className="text-xl">{title}</DialogTitle>
              <DialogDescription>{description}</DialogDescription>
            </DialogHeader>
          </VisuallyHidden.Root>
        )}

        {/* <div className="py-2">{children}</div> */}
        {/* 'px-6 py-4 my-2' */}
        {/* <section
            className={cn('max-h-full max-w-full', contentClassName)}
          >
          </section> */}
        {children}
      </DialogContent>
    </Dialog>
  )
}
interface ModalOnRouteProps extends ModalProps {
  showBackButton?: boolean
}
export function ModalOnRoute({
  defaultOpen = true,
  showBackButton = false, // 控制 是否显示返回按钮
  disableDismissal = true,
  onOpenChange,
  children,
  size,
  ...props
}: ModalOnRouteProps) {
  const router = useRouter()
  if (!onOpenChange) {
    onOpenChange = () => router.back()
  }
  return (
    <Modal
      defaultOpen={defaultOpen}
      onOpenChange={onOpenChange}
      size={size}
      disableDismissal={disableDismissal}
      {...props}
    >
      {children}
      {showBackButton ||
        (size === 'full' && (
          <Button
            variant="ghost"
            size="icon-sm"
            className="absolute top-1 left-1 p-0 rounded-full"
            onClick={() => router.back()}
          >
            <ArrowLeft />
          </Button>
        ))}
    </Modal>
  )
}
