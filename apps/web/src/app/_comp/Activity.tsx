import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable'
import { Badge } from '@/components/ui/badge'
import { Clock, Users, Pickaxe, Home, Sword, Diamond } from 'lucide-react'
import type { ActivitySelect } from '@/lib/db/service'
// import ssr from '@/lib/client/ssr'
import type { ReactNode } from 'react'
import { Pre, Text } from '@/components/uix/html'
import { StatusAvatar } from '@/components/uix/StatusAvatar'
import Link from 'next/link'
import { Description } from '@/components/uix/label'
import { cn } from '@/lib/utils'
import { to } from '@/lib/http/utils'
import { getQueryClient } from '@/components/providers/get-query-client'
import { projectActivityListOpt } from '@/modules/activity/hook/rq'
import { ActivityWithActor } from '@/modules/activity'
import { dehydrate, HydrationBoundary } from '@tanstack/react-query'

const MinecraftTeamContent = () => (
  <div className="space-y-4 text-sm">
    {/* bg-[#D7CCC8] hover:bg-[#A1887F]/20 */}
    <div className="mb-2 rounded-md p-2  hover:shadow-md hover:-translate-y-px bg-card hover:bg-card/50">
      <div className="flex items-center gap-2 mb-2">
        <Users className="w-4 h-4 text-blue-600" />
        <span className="font-bold text-[#5D4037]">建筑师团队</span>
        <Badge className="bg-green-600 text-white text-xs">活跃</Badge>
      </div>
      <p className="text-[#795548] mb-1">
        网络用户Steve发起了团队组建者看团建意愿书，目前已有12名建筑师响应，准备开始大型城堡建设项目。
      </p>
      <div className="flex items-center gap-2 text-xs text-[#8D6E63]">
        <Clock className="w-3 h-3" />
        <span>2小时前</span>
      </div>
    </div>

    <div className="mb-2 rounded-md p-2  hover:shadow-md bg-card hover:bg-card/50">
      <div className="flex items-center gap-2 mb-2">
        <Pickaxe className="w-4 h-4 text-gray-600" />
        <span className="font-bold text-[#5D4037]">挖矿小队</span>
        <Badge className="bg-orange-600 text-white text-xs">进行中</Badge>
      </div>
      <p className="text-[#795548] mb-1">
        网络用户Alex的团队经过全体成员的同意解散了，原因是钻石矿脉开采完毕，任务圆满完成。
      </p>
      <div className="flex items-center gap-2 text-xs text-[#8D6E63]">
        <Clock className="w-3 h-3" />
        <span>4小时前</span>
      </div>
    </div>

    <div className="mb-2 rounded-md p-2  hover:shadow-md bg-card hover:bg-card/50">
      <div className="flex items-center gap-2 mb-2">
        <Home className="w-4 h-4 text-brown-600" />
        <span className="font-bold text-[#5D4037]">红石工程师</span>
        <Badge className="bg-red-600 text-white text-xs">招募中</Badge>
      </div>
      <p className="text-[#795548] mb-1">
        网络用户Redstone的团队评级提升了，从初级工程师晋升为高级红石大师，现在可以承接更复杂的自动化项目。
      </p>
      <div className="flex items-center gap-2 text-xs text-[#8D6E63]">
        <Clock className="w-3 h-3" />
        <span>6小时前</span>
      </div>
    </div>

    <div className="mb-2 rounded-md p-2 bg-card hover:bg-card/50">
      <div className="flex items-center gap-2 mb-2">
        <Sword className="w-4 h-4 text-purple-600" />
        <span className="font-bold text-[#5D4037]">冒险公会</span>
        <Badge className="bg-purple-600 text-white text-xs">探索中</Badge>
      </div>
      <p className="text-[#795548] mb-1">
        网络用户Explorer成功完成了初次团建，团队在末地成功击败了末影龙，获得了龙蛋奖励。
      </p>
      <div className="flex items-center gap-2 text-xs text-[#8D6E63]">
        <Clock className="w-3 h-3" />
        <span>8小时前</span>
      </div>
    </div>

    <div className="mb-2 rounded-md p-2 bg-card hover:bg-card/50">
      <div className="flex items-center gap-2 mb-2">
        <Diamond className="w-4 h-4 text-cyan-600" />
        <span className="font-bold text-[#5D4037]">装备制作组</span>
        <Badge className="bg-cyan-600 text-white text-xs">制作中</Badge>
      </div>
      <p className="text-[#795548] mb-1">
        网络用户Crafter的团队开始了新的附魔装备制作计划，目标是为所有团队成员制作钻石套装。
      </p>
      <div className="flex items-center gap-2 text-xs text-[#8D6E63]">
        <Clock className="w-3 h-3" />
        <span>12小时前</span>
      </div>
    </div>
  </div>
)

const MinecraftProjectContent = () => (
  <div className="space-y-4 text-sm">
    <div className=" ">
      <div className="flex items-center gap-2 mb-2">
        <Home className="w-4 h-4 text-amber-600" />
        <span className="font-bold text-[#5D4037]">巨型城堡建设</span>
        <Badge className="bg-amber-600 text-white text-xs">75%</Badge>
      </div>
      <p className="text-[#795548] mb-1">
        网络用户Builder团队发起了一个新项目：建造中世纪风格的巨型城堡，预计需要3个月完成，现已完成地基和城墙建设。
      </p>
      <div className="flex items-center gap-2 text-xs text-[#8D6E63]">
        <Clock className="w-3 h-3" />
        <span>1小时前</span>
      </div>
    </div>

    <div className="">
      <div className="flex items-center gap-2 mb-2">
        <Pickaxe className="w-4 h-4 text-gray-600" />
        <span className="font-bold text-[#5D4037]">自动化农场</span>
        <Badge className="bg-green-600 text-white text-xs">完成</Badge>
      </div>
      <p className="text-[#795548] mb-1">
        网络用户Farmer团队的项目宣布完成了，全自动小麦、胡萝卜、土豆农场正式投入使用，日产量达到1000+。
      </p>
      <div className="flex items-center gap-2 text-xs text-[#8D6E63]">
        <Clock className="w-3 h-3" />
        <span>3小时前</span>
      </div>
    </div>

    <div className="">
      <div className="flex items-center gap-2 mb-2">
        <Sword className="w-4 h-4 text-red-600" />
        <span className="font-bold text-[#5D4037]">地下城探索</span>
        <Badge className="bg-red-600 text-white text-xs">进行中</Badge>
      </div>
      <p className="text-[#795548] mb-1">
        网络用户Dungeon团队完成了工程建设阶段，成功清理了5个地下城，获得了大量稀有装备和经验。
      </p>
      <div className="flex items-center gap-2 text-xs text-[#8D6E63]">
        <Clock className="w-3 h-3" />
        <span>5小时前</span>
      </div>
    </div>

    <div className="">
      <div className="flex items-center gap-2 mb-2">
        <Diamond className="w-4 h-4 text-blue-600" />
        <span className="font-bold text-[#5D4037]">红石计算机</span>
        <Badge className="bg-blue-600 text-white text-xs">设计中</Badge>
      </div>
      <p className="text-[#795548] mb-1">
        网络用户Engineer团队对红石计算机项目发起了工作任务分配，目标是建造一台可以进行基本运算的红石计算机。
      </p>
      <div className="flex items-center gap-2 text-xs text-[#8D6E63]">
        <Clock className="w-3 h-3" />
        <span>7小时前</span>
      </div>
    </div>

    <div className="">
      <div className="flex items-center gap-2 mb-2">
        <Home className="w-4 h-4 text-purple-600" />
        <span className="font-bold text-[#5D4037]">主题公园建设</span>
        <Badge className="bg-purple-600 text-white text-xs">规划中</Badge>
      </div>
      <p className="text-[#795548] mb-1">
        网络用户Theme团队启动了Minecraft主题公园项目，计划建造过山车、摩天轮等娱乐设施，预计耗时6个月。
      </p>
      <div className="flex items-center gap-2 text-xs text-[#8D6E63]">
        <Clock className="w-3 h-3" />
        <span>10小时前</span>
      </div>
    </div>
  </div>
)

export const ActivityCard = ({
  item: { user, metadata, ...item },
}: {
  item: ActivityWithActor
}) => {
  const Content = () => {
    switch (item.type) {
      case 'project_created':
        return (
          <span className="inline-flex items-center gap-1">
            <Link
              href={`/user/${user.username}`}
              className="inline-flex gap-1 items-center "
            >
              <StatusAvatar
                name={user.displayUsername || user.username}
                src={user.image}
                size="sm"
              />
              <span className="relative top-[0.9px] text-sm">
                {user.displayUsername || user.username}
              </span>
            </Link>
            <span className="relative top-[0.9px] text-sm">创建了项目 </span>
            <Link
              href={`/project/${metadata.slug}`}
              className="inline-flex gap-1 items-center "
            >
              <StatusAvatar name={metadata.name} src={metadata.image} size="sm" />
              <span className="relative top-[0.9px] text-sm">{metadata.name}</span>
            </Link>
          </span>
        )
    }
  }
  return (
    <li className="bg-background rounded-md p-2 min-w-0 w-full  flex flex-col gap-1">
      <Content />
      <Description>{item.description}</Description>
      <div className="flex items-center gap-2 text-xs">
        <Clock className="w-3 h-3" />
        <span>{item.createdAt}</span>
      </div>
    </li>
  )
}

export const ActivityList = ({
  activityList,
  title,
}: {
  activityList: ActivityWithActor[]
  title: ReactNode
}) => {
  return (
    <Card className="rounded-md min-h-0 border-0 p-1 gap-0 w-full">
      <CardHeader className="m-0 p-1 ">
        <CardTitle className="text-center  text-base flex items-center justify-center gap-2">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 p-1 ">
        <ScrollArea
          hideScrollBar
          className="h-[calc(100vh-478px)] w-full"
          classNames={{
            viewport: cn('min-w-0 *:min-w-0'),
          }}
        >
          {/* <Pre json={{ activityList }} /> */}
          <ul className="flex flex-col gap-2">
            {activityList.map(item => (
              <ActivityCard key={item.id} item={item} />
            ))}
          </ul>
          {/* <MinecraftTeamContent /> */}
        </ScrollArea>
      </CardContent>
    </Card>
  )
}

export const ActivitySection = async () => {
  // const { data: projectActivityList = [] } = await ssr.listProjectActivity()
  const qc = getQueryClient()
  const [projectActivityList] = await to(qc.fetchQuery(projectActivityListOpt()))
  return <HydrationBoundary state={dehydrate(qc)}><ActivityList activityList={projectActivityList || []} title={'动态'} /></HydrationBoundary>
}
export const ActivitySection2 = async () => {
  const qc = getQueryClient()
  const [projectActivityList] = await to(qc.fetchQuery(projectActivityListOpt()))
  return (
    <ResizablePanelGroup className="flex-1 h-auto gap-2" orientation="horizontal" >
      <ResizablePanel defaultSize={50}>
        <ActivityList
          activityList={projectActivityList!}
          title={
            <>
              <Users className="w-5 h-5 " />
              团队动态
            </>
          }
        />
      </ResizablePanel>
      <ResizableHandle className="my-3 minecraft-handle bg-[#8D6E63] hover:bg-[#795548] border-2 border-solid border-[#5D4037] rounded-sm" />
      <ResizablePanel defaultSize={50}>
        <ActivityList
          activityList={projectActivityList!}
          title={
            <>
              <Pickaxe className="w-5 h-5" />
              项目动态
            </>
          }
        />
      </ResizablePanel>
    </ResizablePanelGroup>
  )
}
