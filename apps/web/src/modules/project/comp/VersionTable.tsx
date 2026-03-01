'use client'
import { NoStyleLink, Text } from '@/components/uix/html'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useSession } from '@/modules/auth/hook/query'
import { getMcVersions } from '@/modules/minecraft/constants'
import { formatVersionsForDisplay } from '@/modules/minecraft/formatVersionsForDisplay'
import type { VersionWithFiles } from '@/modules/project/action/version'
import { CreateVersionButton } from '@/modules/project/comp/CreateVersion'
import { useProject, useProjectMembers, useVersions } from '@/modules/project/hook/query'

import { findProjectMember } from '@/modules/project/utils/member'
import { appUrl, s3PublicUrl } from '@/lib/config'
import { cn } from '@/lib/utils'
import { formatSize } from '@/lib/util/format'
import { formatToNow } from '@/lib/util/timeFormat'
import type { QueryObserverResult } from '@tanstack/react-query'
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
  type ColumnFiltersState,
  type Table as TTable,
} from '@tanstack/react-table'
import {
  CalendarArrowUp,
  ChevronDownIcon,
  Download,
  EllipsisVertical,
  FlagIcon,
  FunnelIcon,
  LinkIcon,
  XIcon,
} from 'lucide-react'
import { useTranslations } from 'next-intl'
import { usePathname } from 'next/navigation'
import { Fragment, useCallback, useMemo, useState } from 'react'

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  table: TTable<TData>
}
export const DataTable = <TData, TValue>({
  columns,
  data,
  table,
}: DataTableProps<TData, TValue>) => {
  return (
    <div className="overflow-hidden rounded-md bg-card p-2">
      <Table className="p-2">
        <TableHeader>
          {table.getHeaderGroups().map(headerGroup => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map(header => {
                const isLastColumn = header.column.id === table.getAllColumns().at(-1)?.id
                return (
                  <TableHead
                    key={header.id}
                    className={cn(isLastColumn ? 'text-right ' : '')}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                )
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map(row => (
              <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                {row.getVisibleCells().map(cell => {
                  const isLastColumn = cell.column.id === table.getAllColumns().at(-1)?.id
                  const isFirstColumn = cell.column.id === table.getAllColumns().at(0)?.id
                  return (
                    <TableCell
                      key={cell.id}
                      className={cn(
                        isLastColumn && 'text-right ',
                        isFirstColumn && 'w-13',
                      )}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  )
                })}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}
export const VersionTable = ({ slug }: { slug: string }) => {
  const t = useTranslations()
  const loaderT = useTranslations('loader')
  const { project } = useProject(slug)
  const { versions, refetch } = useVersions(project?.id)
  const { projectMembers, projectMembersLoading } = useProjectMembers(project?.id)
  const { session } = useSession()
  const canCreateVersion = useMemo(() => {
    if (projectMembersLoading || !session) return false
    const member = findProjectMember(projectMembers, session.user.id)
    if (!member) return false
    return member.permissions.includes('version:create') || member?.isOwner
  }, [projectMembers, projectMembersLoading, session])
  const pathname = usePathname()
  const columns: ColumnDef<VersionWithFiles>[] = [
    {
      id: 'versionType',
      cell: ({ row }) => {
        const { versionType } = row.original
        return (
          <Button
            variant="noStyle"
            size="icon"
            className={cn('rounded-full', {
              'bg-ctp-green/20 text-ctp-green': versionType === 'release',
              'bg-ctp-yellow/20 text-ctp-yellow': versionType === 'beta',
              'bg-ctp-red/20 text-ctp-red': versionType === 'alpha',
            })}
          >
            {versionType.charAt(0).toUpperCase()}
          </Button>
        )
      },
      accessorFn: row => row.versionType,
      filterFn: 'arrIncludesSome',
    },
    {
      id: 'name',
      header: '名称',
      cell: ({ row }) => {
        const { versionNumber, name } = row.original
        return (
          <NoStyleLink
            href={`${pathname}/${versionNumber}`}
            className="hover:underline flex-col items-start"
          >
            <span className="font-bold text-contrast">{versionNumber}</span>
            <span className="text-xs font-medium">{name}</span>
          </NoStyleLink>
        )
      },
    },
    {
      id: 'compatibility',
      header: '兼容性',
      accessorFn: row => {
        const items = [...row.gameVersions, ...row.loaders]
        return items // 返回值，用于排序/过滤 (e.g., 按 loader 排序)
      },
      cell: ({ row }) => {
        const { loaders, gameVersions } = row.original
        const gameVersionTags = formatVersionsForDisplay(
          gameVersions,
          getMcVersions('all'),
        )
        return (
          <section className="flex flex-wrap gap-1">
            {gameVersionTags.map(tag => (
              <Badge key={tag}>{tag}</Badge>
            ))}
            {loaders.map(i => (
              <Badge key={i}>{i}</Badge>
            ))}
          </section>
        )
      },
      filterFn: 'arrIncludesSome',
    },
    {
      id: 'stats',
      header: '统计',
      cell: ({ row }) => {
        const { createdAt, downloads } = row.original
        return (
          <section className="flex flex-col gap-1">
            <Text startContent={<CalendarArrowUp />}>{formatToNow(createdAt)}</Text>
            <Text startContent={<Download />}>{formatSize(downloads)}</Text>
          </section>
        )
      },
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        const { versionFiles, versionNumber } = row.original
        const versionUrl = `${appUrl}${pathname}/${versionNumber}`
        const f = versionFiles[0]
        return (
          <section>
            <NoStyleLink href={`${s3PublicUrl}/${f.file.storageKey}`}>
              <Button variant="primaryIcon" onClick={async () => await refetch()}>
                <Download />
              </Button>
            </NoStyleLink>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="icon">
                  <EllipsisVertical />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  className="w-full"
                  variant="ghost"
                  onClick={() => {
                    navigator.clipboard.writeText(versionUrl)
                  }}
                >
                  <LinkIcon />
                  复制链接
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="w-full"
                  variant="destructive"
                  onClick={() => { }}
                >
                  <FlagIcon />
                  举报
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </section>
        )
      },
    },
  ]
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]) // can set initial column filter state here
  console.debug('VersionTable columnFilters:', columnFilters)
  const table = useReactTable({
    data: versions,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(), // needed for client-side filtering
    state: {
      columnFilters,
    },
    onColumnFiltersChange: setColumnFilters,
  })
  // 从 data 计算出 加载器列表
  const allLoaders = Array.from(new Set(versions.flatMap(v => v.loaders)))
  const allGameVersions = Array.from(new Set(versions.flatMap(v => v.gameVersions)))
  const allVersionTypes = Array.from(new Set(versions.map(v => v.versionType)))
  type FilterId = 'compatibility' | 'versionType'
  const includesValue = (filterId: FilterId, value: string) =>
    (table.getColumn(filterId)?.getFilterValue() as string[])?.includes(value)
  const pushValue = (filterId: FilterId, value: string) =>
    table
      .getColumn(filterId)
      ?.setFilterValue((prev: string[]) =>
        prev ? Array.from(new Set([...prev, value])) : [value],
      )
  const removeValue = (filterId: FilterId, value: string) =>
    table
      .getColumn(filterId)
      ?.setFilterValue((prev: string[]) => prev.filter(v => v !== value))
  return (
    <section className="flex flex-col gap-3">
      <div className="flex items-start gap-2">
        {allLoaders.length > 1 && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary">
                <FunnelIcon className="size-4 opacity-50" />
                加载器
                <ChevronDownIcon className="size-4 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              {allLoaders.map(loader => (
                <DropdownMenuCheckboxItem
                  key={loader}
                  checked={includesValue('compatibility', loader)}
                  onCheckedChange={checked => {
                    if (checked) {
                      pushValue('compatibility', loader)
                      return
                    }
                    removeValue('compatibility', loader)
                  }}
                >
                  {t(`loader.${loader}`)}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
        {allGameVersions.length > 1 && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary">
                <FunnelIcon className="size-4 opacity-50" />
                游戏版本
                <ChevronDownIcon className="size-4 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              {allGameVersions.map(i => (
                <DropdownMenuCheckboxItem
                  key={i}
                  checked={includesValue('compatibility', i)}
                  onCheckedChange={checked => {
                    if (checked) {
                      pushValue('compatibility', i)
                      return
                    }
                    removeValue('compatibility', i)
                  }}
                >
                  {i}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
        {allVersionTypes.length > 1 && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary">
                <FunnelIcon className="size-4 opacity-50" />
                版本类型
                <ChevronDownIcon className="size-4 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              {allVersionTypes.map(i => (
                <DropdownMenuCheckboxItem
                  key={i}
                  checked={includesValue('versionType', i)}
                  onCheckedChange={checked => {
                    if (checked) {
                      pushValue('versionType', i)
                      return
                    }
                    removeValue('versionType', i)
                  }}
                >
                  {t(`versionType.${i}`)}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
        {canCreateVersion && <CreateVersionButton className="ml-auto" />}
      </div>
      {columnFilters.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {columnFilters.map(f => (
            <Fragment key={f.id}>
              {f.id === 'compatibility' &&
                (f.value as string[]).map(v => (
                  <Badge
                    key={v}
                    onClick={() => removeValue('compatibility', v)}
                    className="cursor-pointer"
                  >
                    <XIcon size={16} strokeWidth={2.5} />
                    {loaderT(v)}
                  </Badge>
                ))}
              {f.id === 'versionType' &&
                (f.value as string[]).map(v => (
                  <Badge
                    key={v}
                    onClick={() => removeValue('versionType', v)}
                    className="cursor-pointer"
                  >
                    <XIcon size={16} strokeWidth={2.5} />
                    {t(`versionType.${v}`)}
                  </Badge>
                ))}
            </Fragment>
          ))}
        </div>
      )}

      <DataTable columns={columns} data={versions} table={table} />
    </section>
  )
}
