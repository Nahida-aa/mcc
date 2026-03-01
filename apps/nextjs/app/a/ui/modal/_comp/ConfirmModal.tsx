'use client'

import { useState, type ReactNode } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../../../../../components/ui/dialog'
import { AlertTriangle, CheckCircle, Info, XCircle, Loader2 } from 'lucide-react'
import { Button } from '@/components/uix/html'
import { Modal } from '@/app/(main)/@modal/modal'

export type ConfirmVariant = 'info' | 'destructive' | 'warning'
interface ConfirmModalProps {
  isOpen: boolean
  onClose: () => void
  title: ReactNode
  description?: ReactNode
  onConfirm?: () => void | Promise<void>
  confirmText?: string
  cancelText?: string
  variant?: ConfirmVariant
  children?: ReactNode
}

export function ConfirmModal({
  isOpen,
  onClose,
  title,
  description,
  onConfirm,
  confirmText = '确定',
  cancelText = '取消',
  variant,
  children,
}: ConfirmModalProps) {
  const [isLoading, setIsLoading] = useState(false)

  // const getIcon = () => {
  //   switch (variant) {
  //     case "destructive":
  //       return <XCircle className="w-5 h-5 text-destructive" />;
  //     case "warning":
  //       return <AlertTriangle className="w-5 h-5 text-orange-500" />;
  //     case "info":
  //       return <Info className="w-5 h-5 text-blue-500" />;
  //     default:
  //       return null;
  //   }
  // };

  const getVariantStyle = () => {
    switch (variant) {
      case 'destructive':
        return 'destructive'
      case 'warning':
        return 'default'
      default:
        return 'default'
    }
  }

  const handleConfirm = async () => {
    if (!onConfirm) return

    try {
      setIsLoading(true)
      await onConfirm()
      console.log('Confirm action succeeded')
      onClose()
    } catch (error) {
      console.error('Confirm action failed:', error)
      // 这里可以显示错误提示
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    if (!isLoading) {
      onClose()
    }
  }

  return (
    <Modal
      open={isOpen}
      onOpenChange={handleCancel}
      title={title}
      description={description}
    >
      {children}
      <DialogFooter className="gap-2">
        <Button variant="secondary" onClick={handleCancel} disabled={isLoading}>
          {cancelText}
        </Button>
        <Button variant={getVariantStyle()} onClick={handleConfirm} pending={isLoading}>
          {confirmText}
        </Button>
      </DialogFooter>
    </Modal>
  )
}
