import { ActionButton } from '@/app/a/ui/base/html.c'
import type { Icon } from '@/app/a/ui/base/nav'
import { cn } from '@/lib/utils'

export interface ActionItem {
  key: string
  path?: string
  onClick?: () => any | Promise<any>
  icon?: Icon
  label?: string
  className?: string
  // description?: string;
  // badge?: string | number | null;
}
export const ActionList = ({
  items = [],
  withIcon = true,
  className = '',
}: {
  items?: ActionItem[]
  withIcon?: boolean
  className?: string
}) => {
  return (
    <>
      {items.map(item => {
        const Icon = item.icon
        return (
          <ActionButton
            key={item.key}
            onClick={item.onClick}
            href={item.path}
            className={cn('w-full justify-start', item.className)}
            variant="ghost"
          >
            {withIcon && Icon && <Icon size={16} />}
            <span className="relative top-[0.9px]">{item.label}</span>
          </ActionButton>
        )
      })}
    </>
  )
}
