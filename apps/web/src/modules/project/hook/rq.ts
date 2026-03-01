import { listVersionWithFiles } from '@/modules/project/action/version'
import { listProjectMember } from '@/modules/project/action/member'
import { queryOptions } from '@tanstack/react-query'
import { listUserProject, statUserProject } from '../action/project'
import { ProjectMemberStatus } from '../schema/member.t'
import { getProjectBySlug } from '../action'
export const projectQuery = (slug: string) =>
  queryOptions({
    queryKey: ['project', slug],
    queryFn: () => getProjectBySlug(slug),
  })

export const projectMembersQuery = (
  projectId?: string,
  noStatus?: ProjectMemberStatus[],
) =>
  queryOptions({
    queryKey: ['projectMembers', projectId, noStatus],
    enabled: !!projectId,
    queryFn: ({ queryKey }) => {
      const [, id, noStatus] = queryKey as [
        'projectMembers',
        string,
        ProjectMemberStatus[] | undefined,
      ]
      return listProjectMember(id, noStatus)
    },
  })

export const versionsQuery = (projectId?: string) =>
  queryOptions({
    queryKey: ['versions', projectId],
    enabled: !!projectId,
    queryFn: ({ queryKey }) => {
      const [, id] = queryKey as ['versions', string]
      return listVersionWithFiles(id)
    },
  })

export const userProjectsOpt = (userId?: string) =>
  queryOptions({
    queryKey: ['userProjects', userId],
    enabled: !!userId,
    queryFn: ({ queryKey }) => {
      const [, id] = queryKey as ['userProjects', string]
      return listUserProject(id)
    },
  })
export const statUserProjectOpt = (userId?: string) =>
  queryOptions({
    queryKey: ['statUserProject', userId],
    enabled: !!userId,
    queryFn: ({ queryKey }) => {
      const [, id] = queryKey as ['statUserProject', string]
      return statUserProject(id)
    },
  })
