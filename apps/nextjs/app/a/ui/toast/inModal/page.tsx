'use client'

import React, { useState, useEffect } from 'react'
import { useRouter, useParams, usePathname, useSearchParams } from 'next/navigation'
import { useModal } from '@/components/uix/modal/provider'
import { Button } from '@/components/uix/html'
import { toast } from '@/components/uix/toast'
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from '@heroui/react'

export default function Page() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure()
  const router = useRouter()
  const params = useParams<{ tag: string; item: string }>() // https://nextjs.org/docs/app/api-reference/functions/use-params
  const pathname = usePathname()
  const { openModal } = useModal()

  const onClick = () => {
    toast.error(new Error('模态框内部的错误提示'))
  }

  return (
    <main>
      <Button onClick={onOpen}>Open Modal</Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} isDismissable={false}>
        <ModalContent>
          {onClose => (
            <>
              <ModalHeader className="flex flex-col gap-1">Modal Title</ModalHeader>
              <ModalBody></ModalBody>
              <ModalFooter>
                <Button color="danger" onClick={onClose}>
                  Close
                </Button>
                <Button color="primary" onClick={onClick}>
                  Action
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
      <Button
        variant="secondary"
        onClick={() =>
          openModal('custom', {
            component: (
              <div className="border-0 shadow-none">
                <p>这是一个完全自定义的模态框内容。</p>
                <div className="flex justify-end gap-2 mt-4">
                  <Button variant="outline" onClick={onClick}>
                    err
                  </Button>
                </div>
              </div>
            ),
            disableDismissal: true,
          })
        }
        className="flex items-center gap-2"
      >
        自定义模态框
      </Button>
    </main>
  )
}
