'use client'

import { useRouter } from 'next/navigation'
import { cn } from '../../../lib/utils'
import {
  Modal as HeroModal,
  type ModalProps as HeroModalProps,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from '@heroui/modal'
import type React from 'react'
import { useModalNavigation } from '@/app/(main)/@modal/modal-nav'

interface ModalProps extends Omit<HeroModalProps, 'isOpen' | 'title'> {
  title?: React.ReactNode
  open?: boolean
}
export const Modal = ({
  className,
  classNames,
  open,
  size = 'lg',
  children,
  title,
  onOpenChange,
  ...props
}: ModalProps) => {
  const { closeModal } = useModalNavigation()
  if (!onOpenChange) {
    onOpenChange = closeModal
  }
  return (
    <HeroModal
      {...props}
      onOpenChange={onOpenChange}
      size={size}
      isOpen={open}
      classNames={{
        wrapper: cn(
          'items-center', // 避免在 小于 sm 时: items-end
          classNames?.wrapper,
        ),
        ...classNames,
      }}
    >
      <ModalContent className={cn('mx-2 w-full rounded-md ', className)}>
        <ModalHeader className="p-0">{title}</ModalHeader>
        <ModalBody className="p-0">{children}</ModalBody>
      </ModalContent>
    </HeroModal>
  )
}
