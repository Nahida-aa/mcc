'use client'
import queryString from 'query-string'
import {
  BoxesIcon,
  BoxIcon,
  BracesIcon,
  CircleXIcon,
  EarthIcon,
  FolderKanbanIcon,
  GlassesIcon,
  HardDriveIcon,
  PaletteIcon,
  SearchIcon,
  UserRoundIcon,
  UsersRoundIcon,
  Ellipsis,
  Search,
  PackageIcon,
  Funnel,
} from 'lucide-react'
import Link from 'next/link'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { useState, useCallback, useEffect } from 'react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useWindowSize } from 'usehooks-ts'
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group'
import { Button } from '@/components/uix/html'
import { useForm, useStore } from '@tanstack/react-form'
import {
  listProjectQueryZ,
  listProjectSearchParamsParseZ,
  type ListProjectQueryIn,
  type ListProjectQueryOut,
} from '@/modules/project/schema/zods'
import { useDebounceValue } from 'usehooks-ts'
import { useAppForm } from '@/hooks/useAppForm'

import {
  environment,
  projectType,
  sorts,
  type ProjectType,
  type SortType,
} from '@/modules/project/schema/constants'
import { Dialog, DialogTrigger } from '@/components/ui/dialog'
// import { ModalContent } from '@/app/(main)/@modal/modal'
import { buttonVariants } from '@/components/ui/button'
import { useTranslations } from 'next-intl'
import { Separator } from '@/components/ui/separator'
import { Field, FieldLabel } from '@/components/ui/field'
import { LayoutExpandMenu } from '@/components/providers/ListExpandProvider'
import { Icon } from '@/components/uix/nav'
import { Modal } from '@/components/uix/modal/modal'

const typeList: {
  value: ProjectType | 'all'
  icon: Icon
}[] = [
    { value: 'all', icon: BoxIcon },
    { value: 'mod', icon: BoxIcon },
    { value: 'resourcepack', icon: PaletteIcon },
    { value: 'shader', icon: GlassesIcon },
    { value: 'datapack', icon: BracesIcon },
    { value: 'modpack', icon: BoxesIcon },
    // { label: "项目", value: "project", icon: FolderKanbanIcon },
    { value: 'project', icon: PackageIcon },
    { value: 'user', icon: UserRoundIcon },
    // { label: "团队", value: "team", icon: UsersRoundIcon },
    { value: 'server', icon: HardDriveIcon },
  ]
const UiOrder = {
  all: ['tags', 'e', 'v', 'loaders', 'openSource'],
  mod: ['v', 'loaders', 'tags', 'e', 'openSource'],
  resourcepack: ['tags', 'v', 'openSource'],
  datapack: ['tags', 'v', 'openSource'],
  shader: ['tags', 'v', 'loaders', 'openSource'],
  modpack: ['tags', 'e', 'v', 'loaders', 'openSource'],
} as const

export const SearchBar = () => {
  const t = useTranslations()
  const router = useRouter()
  const searchParams = useSearchParams()
  const query = listProjectSearchParamsParseZ.parse(searchParams)
  const form = useAppForm({
    validators: {
      onChange: listProjectQueryZ,
    },
    defaultValues: query as ListProjectQueryIn,
    onSubmit: async ({ value }) => router.push(`?${queryString.stringify(value)}`),
  })
  const values = useStore(form.store, state => state.values)
  const [debouncedValue, setValue] = useDebounceValue(values, 500)
  useEffect(() => {
    console.log('debouncedValue', debouncedValue)
    const str = queryString.stringify(debouncedValue)
    router.replace(`?${str}`)
  }, [debouncedValue, router.replace])
  // const viewOrder = (type: ProjectType) => {
  //   return UiOrder[type] || UiOrder.all
  // }
  const filterComponents = {
    tags: (
      <form.AppField key="tags" name="tags">
        {field => <field.FieldTags type={values.type || 'all'} />}
      </form.AppField>
    ),
    e: (
      <form.AppField key="e" name="e">
        {field => (
          <field.FieldCheckboxGroup
            title="环境"
            options={environment.map(v => ({
              label: t(`environment.${v}`),
              value: v,
            }))}
          />
        )}
      </form.AppField>
    ),
    v: (
      <form.AppField key="v" name="v">
        {field => <field.FieldGameVersions required={false} />}
      </form.AppField>
    ),
    loaders: (
      <form.AppField key="loaders" name="tags">
        {field => <field.FieldLoaders required={false} type={values.type} />}
      </form.AppField>
    ),
    openSource: (
      <form.AppField key="openSource" name="openSource">
        {field => {
          return (
            <Field>
              <FieldLabel>{t('license')}</FieldLabel>
              <field.FieldCheck label={t('open_source')} />
            </Field>
          )
        }}
      </form.AppField>
    ),
  }
  return (
    <form.Form
      className="flex items-center gap-2 bg-card rounded-md h-12 min-h-12  px-2"
      onSubmit={form.handleSubmit}
    >
      <form.AppField name="q">
        {field => (
          <InputGroup className="flex-1">
            <InputGroupInput
              placeholder="搜索..."
              value={field.state.value}
              onChange={e => field.handleChange(e.target.value)}
              className=""
            />
            <InputGroupAddon>
              <Search />
            </InputGroupAddon>
          </InputGroup>
        )}
      </form.AppField>
      <form.AppField name="type">
        {field => {
          const value = field.state.value || 'all'
          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="secondary">{t(`projectType.${value}`)}</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-fit min-w-0">
                <DropdownMenuRadioGroup
                  value={field.state.value}
                  onValueChange={value => field.handleChange(value as ProjectType)}
                >
                  {typeList.map(i => (
                    <DropdownMenuRadioItem key={i.value} value={i.value}>
                      {t(`projectType.${i.value}`)}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          )
        }}
      </form.AppField>
      <form.AppField name="s">
        {field => {
          const value = field.state.value || 'relevance'
          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="secondary">
                  {t('sortMethod')}: {t(`order.${value}`)}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-fit min-w-0">
                <DropdownMenuRadioGroup
                  value={value}
                  onValueChange={value => field.handleChange(value as SortType)}
                >
                  {sorts.map(i => (
                    <DropdownMenuRadioItem key={i} value={i}>
                      {t(`order.${i}`)}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          )
        }}
      </form.AppField>
      <Modal title="过滤" size="2xl" Trigger={<Button variant='secondary'><Funnel /></Button>}>
        {(UiOrder[values.type as keyof typeof UiOrder] || UiOrder.all).map(
          key => filterComponents[key],
        )}
      </Modal>
      {/* <Dialog>
        <DialogTrigger className={buttonVariants({ variant: 'secondary' })}>
          <Funnel />
        </DialogTrigger>
        <ModalContent title="过滤" size="2xl">
          {(UiOrder[values.type as keyof typeof UiOrder] || UiOrder.all).map(
            key => filterComponents[key],
          )}
        </ModalContent>
      </Dialog> */}

      <Separator orientation="vertical" className="h-8!" />
      <LayoutExpandMenu />
    </form.Form>
  )
}
