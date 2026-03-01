import { NoStyleLink } from '../../../../components/uix/html'
import { cn } from '../../../../lib/utils'
import { Button as HeroButton, type ButtonProps } from '@heroui/button'
import { SaveIcon } from 'lucide-react'

/** @deprecated */
export const Button = ({
  size = 'md',
  className,
  startContent,
  children,
  color,
  type,
  isIconOnly,
  ...props
}: ButtonProps) => {
  if (type === 'submit') {
    color = color ?? 'primary'
  }
  return (
    <HeroButton
      className={cn(
        " w-fit leading-[1.15]  [&>svg:not([class*='size-'])]:size-[1.1rem] [&>svg]:min-w-[1.1rem]",
        {
          'size-9 w-9 min-w-9': size === 'md',
          '': isIconOnly,
        },
        color ? `bg-${color} text-${color}-foreground` : 'bg-input text-foreground',
        className,
      )}
      isIconOnly={isIconOnly}
      size={size}
      type={type}
      {...props}
      startContent={startContent}
    >
      {startContent ? (
        <span className="leading-none relative top-[0.9px]">{children}</span>
      ) : (
        children
      )}
    </HeroButton>
  )
}

export const LinkButton = ({
  href,
  children,
  className,
  color,
  ...props
}: ButtonProps & { href: string }) => (
  <NoStyleLink href={href}>
    {/* 使用父元素 */}
    <Button
      className={cn(' text-inherit font-semibold', className)}
      color={color}
      {...props}
    >
      {children}
    </Button>
  </NoStyleLink>
)

// 弃用
/** @deprecated   **/
export const SaveButton = ({
  type = 'submit',
  color = 'primary',
  children = '保存变更',
  startContent = <SaveIcon />,
  ...props
}: ButtonProps) => {
  return (
    <Button {...props} type={type} color={color} startContent={startContent}>
      {children}
    </Button>
  )
}
