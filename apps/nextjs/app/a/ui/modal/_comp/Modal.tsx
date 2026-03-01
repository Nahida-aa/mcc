import { Button } from '../../../../../components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../../../../../components/ui/dialog'
import { cn } from '../../../../../lib/utils'
import type { DialogContentProps, DialogProps } from '@radix-ui/react-dialog'

interface Modal extends DialogProps {
  children: React.ReactNode
  content?: Omit<DialogContentProps, 'children'>
  className?: string
  title?: React.ReactNode
  isDismissable?: boolean
}
// const [open, setOpen] = useState(false)
export function Modal({
  children,
  content,
  className,
  isDismissable = true, // 是否可以通过点击覆盖层或按 Esc 键关闭模态框。
  title = '',
  ...dialog
}: Modal) {
  return (
    <Dialog {...dialog}>
      <DialogContent
        {...content}
        onInteractOutside={e => {
          if (!isDismissable) {
            e.preventDefault()
          }
        }}
        className={cn('overflow-hidden', className)}
        aria-describedby="ModalDialog"
      >
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  )
}
