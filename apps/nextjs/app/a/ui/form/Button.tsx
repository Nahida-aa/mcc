'use client'
import { Button, type ButtonProps } from '@/components/uix/html'
import type { HTMLAttributes } from 'react'
import { useFormStatus } from 'react-dom'
import { SaveIcon } from 'lucide-react'

export function SubmitButton({
  children = '提交',
  pendingText = '正在提交',
}: ButtonProps & { pendingText?: string }) {
  const status = useFormStatus()
  return (
    <Button type="submit" pending={status.pending} color="primary">
      {pendingText && status.pending ? pendingText : children}
    </Button>
  )
}
export const SaveButton = ({
  type = 'submit',
  color = 'primary',
  children = '保存变更',
  Icon = <SaveIcon />,
  ...props
}: ButtonProps) => {
  return (
    <Button {...props} type={type} Icon={Icon}>
      {children}
    </Button>
  )
}
