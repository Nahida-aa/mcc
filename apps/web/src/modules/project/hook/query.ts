'use client'

import { listProject, listUserProject } from '@/modules/project/action/project'
import {
  projectMembersQuery,
  projectQuery,
  versionsQuery,
} from '@/modules/project/hook/rq'
import type {
  ListProjectQueryOut,
  ListUserSelfProjectQuery,
} from '@/modules/project/schema/zods'
import type { ListProjectQuery } from '@/modules/project/types/index.t'
import { project } from '@/lib/db/schema'
import { useQuery } from '@tanstack/react-query'

export const useProjects = (query: ListProjectQueryOut) => {
  const {
    data: projects,
    isLoading: projectsLoading,
    ...ret
  } = useQuery({
    queryKey: ['projects', query],
    queryFn: () => listProject(query),
  })
  return {
    projects: projects || [],
    projectsLoading,
    ...ret,
  }
}
export const useUserProjects = (userId?: string, query?: ListUserSelfProjectQuery) => {
  const {
    data: projects,
    isLoading: projectsLoading,
    ...ret
  } = useQuery({
    queryKey: ['projects', userId, query],
    enabled: !!userId,
    queryFn: () => (userId ? listUserProject(userId, query) : null),
  })
  return {
    projects: projects || [],
    projectsLoading,
    ...ret,
  }
}

export const useProject = (slug: string) => {
  const {
    data: project,
    isLoading: projectLoading,
    ...ret
  } = useQuery(projectQuery(slug))
  return {
    project,
    projectLoading,
    ...ret,
  }
}

export const useProjectMembers = (projectId?: string) => {
  const {
    data: projectMembers,
    isLoading: projectMembersLoading,
    ...ret
  } = useQuery(projectMembersQuery(projectId))
  return {
    projectMembers,
    projectMembersLoading,
    ...ret,
  }
}

export const useVersions = (projectId?: string) => {
  const {
    data: versions = [],
    isLoading: versionsLoading,
    ...ret
  } = useQuery(versionsQuery(projectId))
  return {
    versions,
    versionsLoading,
    ...ret,
  }
}
