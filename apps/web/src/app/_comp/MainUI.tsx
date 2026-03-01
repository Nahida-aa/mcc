// "use client";

import {
  copyright,
  icp,
  icpImg,
  icpUrl,
  publicRecord,
  publicRecordImg,
  publicRecordUrl,
} from '@/lib/config'
import { Announcement } from './Announcement'
import { ActivitySection } from './Activity'
import { UserRoleSwitcher } from './UserRoleSwitcher'
import { RightUI } from './RightUI'
import { ScrollArea } from '@/components/ui/scroll-area'
import { NoStyleLink, Text } from '@/components/uix/html'
import { ServerImage } from '@/components/uix/ServerImage'
import { Separator } from '@/components/ui/separator'
export default function MainUI({
  projectUI,
  chatUI,
}: {
  projectUI: React.ReactNode
  chatUI: React.ReactNode
}) {
  // const { styleState } = useStyle();
  // bg-[url(/bg/house.png)] bg-center bg-cover
  // policies legal

  return (
    <ScrollArea hideScrollBar className="h-screen ">
      <section className="h-screen   bg-background   w-full">
        {/*  左侧宽度自适应内容，右侧占满剩余 backdrop-blur-sm */}
        <div className="h-full px-2 w-full flex gap-2 min-w-0  min-h-0">
          {/* 左列 */}
          <div className="py-2 w-160 hidden lg:flex flex-col items-center ">
            {/* 区域 左1 */}
            <Announcement />
            {/* 区域 左2 */}
            <UserRoleSwitcher className="flex-none  rounded-md my-2  w-full " />

            {/* 区域  左3 团队动态与项目动态 */}
            <ActivitySection />
          </div>

          {/* 右列 - 使用 Grid 布局 */}
          <RightUI projectUI={projectUI} chatUI={chatUI} />
        </div>
      </section>
      <footer className="grid  justify-center gap-1 p-3">
        <p>{copyright}</p>
        <div className="flex justify-center gap-1 min-w-0 *:inline-flex  *:items-center *:gap-1 [&_span]:relative [&_span]:top-[1.5px]">
          <a href={icpUrl} rel="noreferrer" target="_blank">
            <ServerImage src={icpImg} alt="ICP" width={20} height={20} />
            <span>{icp}</span>
          </a>
          <Separator orientation="vertical" />
          <a href={publicRecordUrl} rel="noreferrer" target="_blank">
            <ServerImage src={publicRecordImg} alt="gwa" width={20} height={20} />
            <span>{publicRecord}</span>
          </a>
        </div>
      </footer>
    </ScrollArea>
  )
}
