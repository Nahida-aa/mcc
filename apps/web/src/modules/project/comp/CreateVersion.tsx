'use client'

import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useModal } from '@/components/uix/modal/provider'
import { Button, Pre } from '@/components/uix/html'
import FileDropzone from '@/modules/upload/FileDropzone'
import { versionAcceptStr } from '@/modules/upload/utils'
import { useProject } from '@/modules/project/hook/query'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { versionTypeOptions } from '@/modules/project/types/index.t'
import { Item, ItemActions, ItemContent, ItemTitle } from '@/components/ui/item'
import { buttonVariants, radioVariants, scrollbarDefault } from '@/components/html/css'
import { createVersion } from '@/modules/project/action/version'

import { FileItem, useAppForm } from '@/hooks/useAppForm'
import { CreateVersionForm } from '@/modules/project/comp/CreateVersionForm'
// import { Button } from "@/components/ui/button"

export const CreateVersionButton = ({ className }: { className?: string }) => {
  const { openModal, setOpen, closeModal } = useModal()
  const openCreateVersionModal = () =>
    openModal('custom', {
      size: 'xl',
      component: <CreateVersionForm onSuccess={closeModal} />,
    })
  return (
    <Button onClick={openCreateVersionModal} className={className}>
      创建版本
    </Button>
  )
}
