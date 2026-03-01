'use client'

import { Suspense, useState, useEffect } from 'react'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
// import { filterProjects } from "@/data/mock-projects"
import Image from 'next/image'
import Link from 'next/link'
import type { ListProjectQuery, ProjectSelect } from '../types/index.t'
import {
  DownloadIcon,
  Heart,
  HeartCrack,
  HeartHandshake,
  HeartOff,
  HeartPulse,
} from 'lucide-react'
import { formatSize } from '../../../lib/util/format'
import { NoStyleLink, TooltipText } from '../../../components/uix/html'
import { useProjects } from '@/modules/project/hook/query'
import { useSearchParams } from 'next/navigation'
import {
  listProjectQueryZ,
  listProjectSearchParamsParseZ,
} from '@/modules/project/schema/zods'
import queryString from 'query-string'
import type { ListProjectOut } from '@/modules/project/action/project'
import { useTranslations } from 'next-intl'
import { ProjectIcon } from './icon'
import { Description } from '@/components/uix/label'

const ProjectCard = ({ project }: { project: ListProjectOut[0] }) => {
  // const { styleState } = useStyle();
  return (
    <Card
      className={` transition-all duration-200 p-2 grid gap-2 
  border-none`}
    >
      <CardHeader className="p-0">
        <div className="flex items-start gap-3">
          <Link href={`/${project.type}/${project.slug}`}>
            <ProjectIcon icon={project.icon} name={project.name} size={48} />
          </Link>
          <div className="flex-1 min-w-0">
            <NoStyleLink href={`/${project.type}/${project.slug}`}>
              <h2 className="hover:text-primary">{project.name}</h2>
            </NoStyleLink>
            <span>
              by{' '}
              <Link href={`/user/${project.user.username}`} className="inline-flex">
                <h3>{project.user.displayUsername}</h3>
              </Link>
            </span>
            <div className="flex flex-wrap gap-1 mt-1">
              {project.tags.slice(0, 2).map(tag => (
                <Badge
                  key={tag}
                  variant="outline"
                  className="text-xs border-[#8D6E63] text-[#5D4037] px-1"
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </CardHeader>
      <Description>{project.summary}</Description>
      <CardFooter className="p-0 flex gap-2">
        <TooltipText
          description={project.downloads}
          className="font-semibold [&_svg]:size-5"
          startContent={<DownloadIcon />}
        >
          {formatSize(project.downloads)}
        </TooltipText>
        <TooltipText
          description={project.likes}
          className="font-semibold [&_svg]:size-5"
          startContent={<Heart />}
        >
          {formatSize(project.likes)}
        </TooltipText>
      </CardFooter>
    </Card>
  )
}

export const ProjectList = () => {
  const t = useTranslations('projectType')
  const searchParams = useSearchParams()
  // console.log('ProjectList.searchParams.toString():', searchParams?.toString())
  const query = listProjectSearchParamsParseZ.parse(
    queryString.parse(searchParams?.toString() || ''),
  )
  // console.log('ProjectList.query:', query)
  const queryAutoed = listProjectQueryZ.parse(query)
  // console.log('ProjectList.queryAutoed:', queryAutoed)
  const { projects, projectsLoading } = useProjects(queryAutoed)

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className=" h-full ">
        {projectsLoading ? (
          <div className="text-center py-8">
            <div>加载中...</div>
          </div>
        ) : (
          <ScrollArea hideScrollBar className="h-full ">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-2 p-1">
              {projects.map(project => (
                <ProjectCard key={project.slug} project={project} />
              ))}
            </div>

            {projects.length === 0 && (
              <div className="text-center py-8">
                <div>
                  没有找到相关
                  {query.type ? t(query.type) : '结果'}
                </div>
              </div>
            )}
          </ScrollArea>
        )}
      </div>
    </Suspense>
  )
}
