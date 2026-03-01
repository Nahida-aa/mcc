'use client'
import { createContext, useContext, useState, useEffect, useRef } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { projectType, type ProjectType } from '../../modules/project/types/index.t'
import { useIsMounted, useLocalStorage } from 'usehooks-ts'
// import { Select } from '@/app/a/ui/form/select'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { useTranslations } from 'next-intl'
// interface ContextType extends ContextType {}
export type ExpandType = 'top' | 'bottom' | 'null'

export const useListExpand = () => {
  const [value, setValue] = useLocalStorage<ExpandType>('expanded', 'null')
  const isMounted = useIsMounted()
  return {
    expand: isMounted() ? value : 'null',
    setExpand: setValue,
  }
}


export const ListExpandProvider = () => {
  const pathname = usePathname()
  const [value, setValue, removeValue] = useLocalStorage<ExpandType>('expanded', 'null') // 'top'
  // const isExpanded = searchParams.get("isExpanded") === "true";
  // const [state, setState] = useState(isExpanded || false);
  const previousPathname = useRef<string | null>(null)
  // const toggleState = () => {
  //   // setState(!state);
  //   // router.replace(`?${setQuery("isExpanded", state)}`);
  //   setValue(!value);
  // };

  useEffect(() => {
    if (!pathname) {
      // router is not ready
      return
    }
    console.log('ListExpandProvider pathname changed:', pathname)
    // suggestionIsExpanded(pathname)=>{}
    const suggestionIsExpanded = (pathname: string) => {
      const pathSegments = pathname.split('/').filter(Boolean)
      // 定义所有项目类型

      // 如果路径有两个段，且第一个段是项目类型，则认为是访问项目详情页
      if (
        pathSegments.length >= 2 &&
        projectType.includes(pathSegments[0] as ProjectType)
      ) {
        return true
      }
      return false
    }
    // 检测是否访问项目详情页面
    const prevSuggestion = suggestionIsExpanded(previousPathname.current || '')
    const currentSuggestion = suggestionIsExpanded(pathname)
    if (prevSuggestion !== currentSuggestion) {
      setValue('top')

      // router.replace(`?${setQuery("isExpanded", currentSuggestion)}`);
    }

    previousPathname.current = pathname
  }, [pathname, setValue])

  // useEffect(() => {
  //   console.log("isExpanded changed:", isExpanded);
  //   setState(isExpanded);
  //   router.replace(`?isExpanded=${isExpanded}`);
  // }, [isExpanded, router.replace]);

  return null
}



// export const LayoutExpandSelect = () => {
//   const [value, setValue, removeValue] = useLocalStorage<ExpandType>('expanded', 'null') // 'top'
//   const options = [
//     {
//       value: 'top',
//       label: '上面',
//     },
//     {
//       value: 'null',
//       label: '默认',
//     },
//     {
//       value: 'bottom',
//       label: '下面',
//     },
//   ]
//   return (
//     <section className="flex items-center gap-2">
//       <Label className="p-0">展开:</Label>
//       <Select options={options} value={value} onChange={v => setValue(v as ExpandType)} />
//     </section>
//   )
// }

// export const LayoutExpandTabs = () => {
//   const [value, setValue] = useLocalStorage<ExpandType>('expanded', 'null') // 'top'
//   return (
//     <section className="flex items-center justify-between">
//       <Label className="p-0">展开:</Label>
//       <Tabs
//         aria-label="Options"
//         color="primary"
//         size="sm"
//         radius="full"
//         className="p-0 rounded-full"
//         classNames={{
//           tab: cn('size-6 p-auto rounded-full'),
//         }}
//         selectedKey={value}
//         onSelectionChange={v => setValue(v as ExpandType)}
//       >
//         <Tab key="top" title={<ChevronUp size={20} />} />
//         <Tab key="null" title={<CircleOff size={20} />} />
//         <Tab key="bottom" title={<ChevronDown size={20} />} />
//       </Tabs>
//     </section>
//   )
// }

export const LayoutExpandMenu = ({ className }: { className?: string }) => {
  const [value, setValue] = useLocalStorage<ExpandType>('expanded', 'null') // 'top'
  const t = useTranslations()
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="secondary" className={className}>
          {t('expanded')}: {t(value)}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-fit min-w-0">
        <DropdownMenuRadioGroup
          value={value}
          onValueChange={value => setValue(value as ExpandType)}
        >
          <DropdownMenuRadioItem value="top">{t(`top`)}</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="null">{t(`null`)}</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="bottom">{t(`bottom`)}</DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
