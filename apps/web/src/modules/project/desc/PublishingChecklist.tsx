'use client'

import { useState } from 'react'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import {
  Asterisk,
  Check,
  ChevronRight,
  ChevronUp,
  Lightbulb,
  Scale,
  TriangleAlert,
} from 'lucide-react'
import Link from 'next/link'
import { notFound, usePathname } from 'next/navigation'
// import { useVersions } from "../versions/_comp/VersionsContext";
import { Button, buttonVariants } from '../../../components/ui/button'

import { isProjectMember } from '../utils/member'
import { cn } from '@/lib/utils'
import { buttonGhost, cardDefault } from '@/components/html/css'
import { useQuery } from '@tanstack/react-query'
import { projectMembersQuery, projectQuery } from '@/modules/project/hook/rq'
import { useProject, useProjectMembers, useVersions } from '@/modules/project/hook/query'
import { useSession } from '@/modules/auth/hook/query'
import { useSlugParams } from '@/hooks/useParams'
import { NagContext, projectNags } from './constants'
// import { UserSelfProject } from "@/server/project/model";

export const PublishingChecklist = () => {
  const [isOpen, setIsOpen] = useState(true)
  const pathname = usePathname()
  const slug = useSlugParams()
  const { project, projectLoading } = useProject(slug)
  const { projectMembers, projectMembersLoading } = useProjectMembers(project?.id)
  const { versions, versionsLoading } = useVersions(project?.id)

  const { session } = useSession()
  if (!session) return null
  console.log('PublishingChecklist projectLoading:', projectLoading)
  if (projectLoading || projectMembersLoading || versionsLoading) return null
  if (!isProjectMember(projectMembers, session.user.id)) return null
  if (!project) {
    console.log('PublishingChecklist project not found:', project)
    notFound()
  }
  const context: NagContext = {
    project,
    versions,
    currentPathname: pathname,
  }
  console.log('PublishingChecklist context:', context)
  const visibleNags = projectNags.filter(nag => {
    return nag.shouldShow(context)
  })
  return (
    <section className="bg-card p-4 rounded-lg mb-3">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <section
          className={`flex items-center justify-between gap-6 ${isOpen ? 'mb-3' : ''} `}
        >
          <div className="flex flex-1 items-center justify-between">
            <h2>发布清单</h2>
            <div className="flex items-center gap-2">
              <div className="  flex items-end gap-1">
                <Asterisk size={16} className="text-[#cb2245]" />
                <span className="text-sm leading-none">必需</span>
              </div>
              |
              <div className="flex  items-end gap-1">
                <TriangleAlert size={16} className="text-[#e08325]" />
                <span className="text-sm leading-none">警告</span>
              </div>
              |
              <div className="flex items-end gap-1">
                <Lightbulb size={16} className="text-[#8e32f3]" />
                <span className="text-sm leading-none">建议</span>
              </div>
            </div>
          </div>
          {/* className=" hover:text-accent-foreground rounded-full p-1 transition-colors size-8 grid place-items-center shadow-md" */}
          <CollapsibleTrigger
            className={cn(
              buttonVariants({ variant: 'ghost', size: 'icon-sm' }),
              'rounded-full p-2!',
            )}
          >
            <ChevronUp
              className={`transition-transform duration-200 ${isOpen ? 'rotate-0' : 'rotate-180'}`}
              size={16}
            />
          </CollapsibleTrigger>
        </section>
        <CollapsibleContent asChild>
          <ul className="grid grid-cols-[repeat(auto-fit,minmax(16rem,1fr))] gap-2">
            {visibleNags.map(nag => (
              <li
                key={nag.id}
                className={cn(cardDefault, 'bg-background p-2 flex flex-col gap-3')}
              >
                <h3 className="inline-flex items-center gap-2">
                  {nag.status === 'required' ? (
                    <Asterisk size={16} className="text-ctp-red" />
                  ) : nag.status === 'suggestion' ? (
                    <Lightbulb size={16} className="text-ctp-mauve" />
                  ) : nag.status === 'warning' ? (
                    <TriangleAlert size={16} className="text-ctp-yellow" />
                  ) : nag.status === 'special-submit-action' ? (
                    <Scale size={16} />
                  ) : (
                    <Lightbulb size={16} className="text-ctp-mauve" />
                  )}
                  {nag.title}
                </h3>
                <p>
                  {typeof nag.description === 'function'
                    ? nag.description(context)
                    : nag.description}
                </p>
                {nag.status === 'special-submit-action' ? (
                  <Button className="h-9 bg-ctp-yellow hover:bg-ctp-yellow/80">
                    提交审核
                  </Button>
                ) : (
                  <Link
                    className="inline-flex mt-auto"
                    href={`/${project.type}/${project.slug}/${nag.link}`}
                  >
                    {nag.linkText}
                    <ChevronRight />
                  </Link>
                )}
              </li>
            ))}
            <section className="bg-background p-4 rounded-lg flex flex-col gap-3">
              <h3 className="inline-flex">
                <Asterisk size={16} className="text-[#cb2245]" />
                上传版本
              </h3>
              项目至少需要一个版本才能提交审核。
              <Link
                className="inline-flex"
                href={`/${project.type}/${project.slug}/versions`}
              >
                访问版本页面
                <ChevronRight />
              </Link>
            </section>
          </ul>
          {/* <section className="bg-mc p-4 rounded-lg flex flex-col gap-3">
          <h3 className="inline-flex">
            <Asterisk size={16} className="text-[#cb2245]" />
            上传版本
          </h3>
          项目至少需要一个版本才能提交审核。
          <Link
            className="inline-flex"
            href={`/${project.type}/${project.slug}/versions`}
          >
            访问版本页面
            <ChevronRight />
          </Link>
        </section>
        <section className="bg-mc p-4 rounded-lg flex flex-col gap-3">
          <h3 className="inline-flex">
            <Asterisk size={16} className="text-[#cb2245]" />
            上传版本
          </h3>
          项目至少需要一个版本才能提交审核。
          <Link
            className="inline-flex"
            href={`/${project.type}/${project.slug}/versions`}
          >
            访问版本页面
            <ChevronRight />
          </Link>
        </section>
        <section className="bg-mc p-4 rounded-lg flex flex-col gap-3">
          <h3 className="inline-flex">
            <Asterisk size={16} className="text-[#cb2245]" />
            上传版本
          </h3>
          项目至少需要一个版本才能提交审核。
          <Link
            className="inline-flex"
            href={`/${project.type}/${project.slug}/versions`}
          >
            访问版本页面
            <ChevronRight />
          </Link>
        </section>
        <section className="bg-mc p-4 rounded-lg flex flex-col gap-3">
          <h3 className="inline-flex">
            <Asterisk size={16} className="text-[#cb2245]" />
            上传版本
          </h3>
          项目至少需要一个版本才能提交审核。
          <Link
            className="inline-flex"
            href={`/${project.type}/${project.slug}/versions`}
          >
            访问版本页面
            <ChevronRight />
          </Link>
        </section> */}
        </CollapsibleContent>
      </Collapsible>
    </section>
  )
}
