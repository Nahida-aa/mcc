'use client'
import { useLocalStorage } from 'usehooks-ts'
import { Card } from '@/components/ui/card'

// import { SearchBar } from '../../../modules/project/comp/SearchBar'
import { useSearchParams } from 'next/navigation'
import { cn } from '@/lib/utils'
import { ExpandType } from '@/components/providers/ListExpandProvider'
import { SearchBar } from '@/modules/project/comp/SearchBar'

export const RightUI = ({
  projectUI,
  chatUI,
}: {
  projectUI: React.ReactNode
  chatUI: React.ReactNode
}) => {
  const [expanded] = useLocalStorage<ExpandType>('expanded', 'null')

  return (
    <section
      aria-label="RightUI"
      data-expanded={expanded}
      className="flex-1 grid transition-all duration-500 py-2 data-[expanded=top]:grid-rows-[1fr_3rem_0fr] data-[expanded=null]:grid-rows-[22.5rem_auto_1fr] data-[expanded=bottom]:grid-rows-[0fr_3rem_1fr]"
    >
      <div
        className={cn('transition-all duration-500 flex flex-col overflow-hidden mb-2', {
          'opacity-0  mb-0': expanded === 'bottom',
          'opacity-100': expanded === 'null' || expanded === 'top',
        })}
      >
        {projectUI} {/* 区域 右1 */}
      </div>
      {/* 搜索栏区域 右2 - 独立的卡片 */}
      <SearchBar />
      {/* 区域 右3 */}
      <Card
        data-expanded={expanded}
        className={cn(
          `border-0  shadow-lg hover:shadow-xl mt-2
    transition-all duration-500 p-0 overflow-hidden flex flex-col `,
          'data-[expanded=top]:opacity-0 data-[expanded=top]:mt-0',
        )}
      >
        {chatUI}
      </Card>
    </section>
  )
}
