'use client'
// https://nextjs.org/docs/app/getting-started/layouts-and-pages#creating-a-dynamic-segment

import {
  type LucideProps,
  MessageCircle,
  SettingsIcon,
  Tags,
  UsersIcon,
} from 'lucide-react'
import {
  redirect,
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
  useSelectedLayoutSegment,
  useSelectedLayoutSegments,
} from 'next/navigation'
import type { ForwardRefExoticComponent, JSX, RefAttributes } from 'react'
import { DocumentTextIcon } from '@/components/icons'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/uix/button'
import { XTooltip } from '../tooltip'
import { buildUrl } from '@/lib/util/url'

export type Icon =
  | ForwardRefExoticComponent<Omit<LucideProps, 'ref'> & RefAttributes<SVGSVGElement>>
  | ((props: LucideProps) => JSX.Element)

// path (key) to icon map
export const iconMap: Record<string, Icon> = {
  settings: SettingsIcon,
  'settings/description': DocumentTextIcon,
  'settings/members': UsersIcon,
  'settings/tags': Tags,
  forum: MessageCircle,
}

export interface NavItem {
  key: string
  path?: string
  onClick?: (key: string) => void
  icon?: Icon
  label?: string
  description?: string
  badge?: string | number | null
}

export const Nav = ({
  basePath = '',
  baseSegment,
  items,
  isVertical = false,
  withIcon = true,
  includeSubPath = false,
  className = '',
  classNames,
  name,
  size,
}: {
  basePath?: string
  baseSegment?: string
  isVertical?: boolean
  items: NavItem[]
  withIcon?: boolean
  includeSubPath?: boolean
  className?: string
  classNames?: {
    ul?: string
    items?: string
  }
  name?: string
  size?: 'sm' | 'default' | 'lg'
}) => {
  const segment = useSelectedLayoutSegment()
  const segments = useSelectedLayoutSegments()
  const endPath = segments.join('/')
  const searchParams = useSearchParams()
  const currentKeyList = baseSegment ? [baseSegment, ...segments] : segments
  const currentKey = `/${currentKeyList.join('/')}` // [a, b] -> a/b

  console.log(
    `${name} includeSubPath: ${includeSubPath}; currentKeyList: ${currentKeyList}; currentKey: ${currentKey}; baseSegment: ${baseSegment}; segment: ${segment}; segments: ${segments}; endPath: ${endPath}`,
  )
  // const router = useRouter()
  return (
    <nav className={cn('w-fit', className)}>
      <ul
        className={cn(
          'flex    p-0.5 w-fit rounded-md',
          isVertical ? 'flex-col items-start' : 'flex-row',
          classNames?.ul,
        )}
      >
        {items.map(item => {
          const Icon = item.icon ?? iconMap[item.key]
          const itemPath = `${basePath}${item.key}`
          item.label = item.label ?? item.key
          const active =
            (includeSubPath && currentKey.startsWith(item.key)) ||
            (currentKey === item.key && !includeSubPath)
          const ret = (
            <Button
              size={size}
              className={cn('hover:text-primary w-full ', classNames?.items)}
              href={buildUrl(itemPath, searchParams)}
            >
              {withIcon && Icon && <Icon size={16} />}
              <span className="relative top-[0.5px]">{item.label}</span>
              {/* {item.label} */}
              {item.badge && <Badge variant="extra"> {item.badge} </Badge>}
            </Button>
          )

          return (
            <li
              key={item.key}
              data-active={active}
              className={
                "rounded-md w-full flex justify-start  hover:text-primary data-[active='true']:text-primary"
              }
            >
              {item.description ? (
                <XTooltip
                  side={isVertical ? 'right' : 'top'}
                  content={item.description}
                >
                  {ret}
                </XTooltip>
              ) : (
                ret
              )}
            </li>
          )
        })}
      </ul>
    </nav>
  )
}

export const Nav2 = ({
  items = [],
  isVertical = false,
  withIcon = true,
  includeSubPath = false,
  className = '',
  method = 'href',
}: {
  items: NavItem[]
  isVertical?: boolean
  withIcon?: boolean
  includeSubPath?: boolean
  className?: string
  method?: 'href' | 'replace'
  name?: string
}) => {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const router = useRouter()
  // router.push('/dashboard');
  // console.log(pathname);
  return (
    <nav
      className={cn(
        'flex gap-1',
        isVertical ? 'flex-col items-start' : 'flex-row',
        className,
      )}
    >
      {items.map(item => {
        const Icon = item.icon ?? iconMap[item.key]
        let onClick = item.onClick
        if (method === 'replace') {
          onClick = () => router.replace(buildUrl(item.key, searchParams))
        }
        return (
          <Button
            key={item.key}
            variant="ghost"
            href={method === 'href' ? buildUrl(item.key, searchParams) : undefined}
            onClick={() => onClick?.(item.key)}
            className={cn(pathname === item.key ? 'bg-accent' : '', {
              'w-full justify-start': isVertical,
            })}
          >
            {withIcon && Icon && <Icon size={16} />}
            {item.label}
          </Button>
        )
      })}
    </nav>
  )
}

// export const NavSkeleton
export const SearchParamNav = () => {
  const searchParams = useSearchParams()
}
