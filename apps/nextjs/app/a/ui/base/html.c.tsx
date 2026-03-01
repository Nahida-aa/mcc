'use client'
import { Button, type ButtonProps } from '@/components/uix/html'
import { toast } from '@/components/uix/toast'
import { useState, type ButtonHTMLAttributes } from 'react'

export interface ActionButtonProps extends Omit<ButtonProps, 'onClick' | 'pending'> {
  onClick?: () => any | Promise<any>
}
export const ActionButton = ({ onClick, ...props }: ActionButtonProps) => {
  const [pending, setPending] = useState(false)
  const handleClick = async () => {
    setPending(true)
    try {
      await onClick?.()
    } catch (err) {
      toast.error(err)
    } finally {
      setPending(false)
    }
  }
  //
  return <Button onClick={handleClick} pending={pending} {...props} />
}
export const ActionDiv = ({
  onClick,
  children,
  className = '',
  ...props
}: Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onClick'> & {
  onClick?: () => any | Promise<any>
}) => {
  const [pending, setPending] = useState(false)
  const handleClick = async () => {
    setPending(true)
    try {
      await onClick?.()
    } catch (err) {
      toast.error(err)
    } finally {
      setPending(false)
    }
  }
  return (
    <button onClick={handleClick} className={`${className}`} {...props}>
      {children}
    </button>
  )
}
