'use client'

import { Modal } from '@/app/a/ui/modal/_comp/Modal'
import { Button } from '@/components/uix/html'
import { toast } from '@/components/uix/toast'
import {
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export function RemoveFriendModal({
  isOpen,
  onClose,
  name,
}: {
  isOpen: boolean
  onClose: () => void
  name: string
}) {
  const router = useRouter()
  const [pending, setPending] = useState(false)
  const handleAction = async () => {
    setPending(true)
    try {
      console.log('TODO: handle remove friend action')
      // 假装 等待
      await new Promise(resolve => setTimeout(resolve, 1000))
    } catch (err) {
      console.error('Sign out error:', err)
      toast.error(err)
    } finally {
      setPending(false)
    }
  }

  const handleCancel = onClose

  return (
    <Modal open={isOpen} onOpenChange={handleCancel}>
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">移除好友 '{name}'</DialogTitle>
        <DialogDescription>
          您确定要将 <span className="font-medium text-foreground">{name}</span>{' '}
          从您的好友列表中移除吗?
        </DialogDescription>
      </DialogHeader>

      <DialogFooter className="gap-2 sm:gap-0">
        <Button onClick={handleCancel} disabled={pending}>
          取消
        </Button>
        <Button
          color="danger"
          onClick={handleAction}
          pending={pending}
          className="min-w-[100px]"
        >
          删除好友
        </Button>
      </DialogFooter>
    </Modal>
  )
}
