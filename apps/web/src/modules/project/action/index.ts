'use server'

import {
  getProjectMemberByUser,
} from './member'
import type {
  ProjectCreate,
  ProjectUpdate,
} from '../types/index.t'
import { projectMemberPermissions } from '../schema/permission'
import {
  eq,
  ilike,
  inArray,
  or,
  and,
  desc,
  type SQL,
  sql,
  sum,
  count,
  getTableColumns,
} from 'drizzle-orm'
import { AppErr } from '@/lib/http/types'
import { hasPermission } from '@/lib/db/permission'
import { db } from '@/lib/db'
import { project, user } from '@/lib/db/schema'
import { insertActivity, } from '@/lib/db/service'

import { insertProjectMember } from '@/modules/project/schema/member.t'
import { withAuth } from '@/lib/func/auth'
import { createCommunity } from '@/modules/community/action/community'

export const createProject = withUser(async (user, data: ProjectCreate) => {
  return await db.transaction(async tx => {
    // 插入新项目
    const [newProject] = await tx
      .insert(project)
      .values({
        ...data,
        ownerType: 'user', // 暂时只支持用户创建项目
        ownerId: user.id,
      })
      .returning({
        id: project.id,
        slug: project.slug,
        name: project.name,
        status: project.status,
        createdAt: project.createdAt,
        icon: project.icon,
      })

    // 插入项目成员表，将创建者设为项目所有者
    await insertProjectMember(tx, {
      projectId: newProject.id,
      entityType: 'user',
      userId: user.id,
      role: 'owner',
      permissions: [...projectMemberPermissions],
      isOwner: true,
      status: 'active',
      joinMethod: 'system',
    })

    // create community , 暂时用于提供 一个社区空间
    const newCommunity = await createCommunity(tx, {
      name: newProject.name,
      summary: data.summary,
      type: 'project',
      entityId: newProject.id,
      ownerId: user.id,
    })
    if (data.visibility === 'public') {
      await insertActivity(tx, {
        actorId: user.id,
        type: 'project_created',
        projectId: newProject.id,
        resourceId: newProject.id,
        description: data.summary,
        metadata: {
          name: newProject.name,
          slug: newProject.slug,
          image: newProject.icon,
        },
      })
    }
    return newProject
  })
})

// R
export const _getProjectBySlug = async (slug: string) =>
  await db.query.project.findFirst({
    where: (project, { eq }) => eq(project.slug, slug),
  })
export const getProjectBySlug = async (slug: string) => {
  const item = await _getProjectBySlug(slug)
  if (!item) throw AppErr('项目不存在', 404)
  return item
}
export const getProject = async (id: string) => {
  const item = await db.query.project.findFirst({
    where: (project, { eq }) => eq(project.id, id),
  })
  if (!item) throw AppErr('项目不存在', 404)
  return item
}


// U
export const _updateProject = async (
  authId: string,
  { id, data }: { id: string; data: ProjectUpdate },
) => {
  const member = await getProjectMemberByUser(id, 'user', authId)
  if (!member.isOwner) {
    if (data.slug || data.visibility) {
      if (!hasPermission(member.permissions, 'project', 'admin')) {
        throw AppErr('无权限修改项目标识符或可见性', 403)
      }
    } else {
      if (!hasPermission(member.permissions, 'project', 'update')) {
        throw AppErr('无权限修改项目信息', 403)
      }
    }
  }
  await db.update(project).set(data).where(eq(project.id, id))
}

export const updateProject = withAuth(_updateProject)
function withUser(arg0: (user: any, data: ProjectCreate) => Promise<{ id: string; slug: string; name: string; status: "draft" | "community" | "processing" | "rejected" | "preparing" | "published" | "archived" | "withheld"; createdAt: string; icon: string | null }>) {
  throw new Error('Function not implemented.')
}

