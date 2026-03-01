'use server'

// import { orgItemFields, userItemFields } from '../../user/schema/constants'
import { db } from '@/lib/db'
import { notify, notifyReceiver, projectMember } from '@/lib/db/schema'

import { and, asc, eq, notInArray } from 'drizzle-orm'
import {
  projectMemberPermissionsKV,
  type ProjectMemberPermission,
} from '../schema/permission'
import { AppErr } from '@/lib/http/types'

import { orgItemFields, userItemFields } from '@/modules/user/schema/schemas'
import { buildNotifyInsert } from '@/modules/notify/schema/constants'
import { withAuth } from '@/lib/func/auth'
import { ProjectMemberStatus, ProjectMemberUpdate } from '../schema/member.t'

// 修改成员的权限: 对于个人项目仅限所有者, 对于 org(团队) 项目, 管理员也能修改

// 检查权限的辅助函数
export const checkMemberPermission = async (
  projectId: string,
  authId: string,
  requiredPermission: ProjectMemberPermission,
) => {
  const member = await getProjectMemberByUser(projectId, 'user', authId)
  // console.log("member Permissions:", member);
  const has = member.isOwner || member?.permissions.includes(requiredPermission) || false
  if (!has) {
    console.log(member.id, '没有', projectMemberPermissionsKV[requiredPermission], '权限')
    throw AppErr(`缺少 ${projectMemberPermissionsKV[requiredPermission]}`, 403)
  }
  return has
}

// R
export const getProjectMember = async (id: string) => {
  const member = await db.query.projectMember.findFirst({
    where: eq(projectMember.id, id),
    with: {
      user: { columns: userItemFields },
      organization: { columns: orgItemFields },
    },
  })
  if (!member) throw AppErr('项目成员不存在', 404)
  return member
}
export const __getProjectMemberByUser = async (
  projectId: string,
  entityType: 'user' | 'organization',
  entityId: string,
) => {
  // console.log("Fetching user project permissions for:", { projectId, userId })
  const condition =
    entityType === 'user'
      ? eq(projectMember.userId, entityId)
      : eq(projectMember.organizationId, entityId)
  const member = await db.query.projectMember.findFirst({
    where: and(
      eq(projectMember.projectId, projectId),
      eq(projectMember.entityType, entityType), // 冗余字段，方便查询
      condition,
    ),
    with: {
      user: { columns: userItemFields },
      organization: { columns: orgItemFields },
    },
  })
  return member
}
export const getProjectMemberByUser = async (
  projectId: string,
  entityType: 'user' | 'organization',
  entityId: string,
) => {
  const member = await __getProjectMemberByUser(projectId, entityType, entityId)
  if (!member) throw AppErr('项目成员不存在', 404)
  return member
}
export const listProjectMember = async (
  projectId: string,
  noStatus: ProjectMemberStatus[] = [],
) => {
  const members = await db.query.projectMember.findMany({
    where: and(
      eq(projectMember.projectId, projectId),
      notInArray(projectMember.status, noStatus),
    ),
    orderBy: [asc(projectMember.createdAt)],
    with: {
      user: {
        columns: userItemFields,
      },
      organization: {
        columns: orgItemFields,
      },
    },
  })
  return members
}

// 邀请用户加入 projectMember 流程:
export const _inviteJoinProject = async (
  authId: string,
  targetUserId: string,
  projectId: string,
  projectSlug: string,
  projectIcon: string | null,
) => {
  const member = await __getProjectMemberByUser(projectId, 'user', targetUserId)
  if (member) throw AppErr('用户已是项目成员', 400)

  // 检查权限
  await checkMemberPermission(projectId, authId, 'member:create')
  return await db.transaction(async tx => {
    // 1. 插入 projectMember, default status is "pending"
    const [newMember] = await tx
      .insert(projectMember)
      .values({
        projectId: projectId,
        entityType: 'user',
        userId: targetUserId,
        inviterId: authId,
      })
      .returning()
    // 2. 插入 notify
    const [newNotify] = await tx
      .insert(notify)
      .values(
        buildNotifyInsert('invite_join_project', authId, {
          projectId,
          projectSlug,
          projectIcon,
        }),
      )
      .returning()
    // 3. 插入 notify_receiver
    await tx.insert(notifyReceiver).values({
      notifyId: newNotify.id,
      userId: targetUserId,
      isRead: false,
    })
    return {
      member: newMember,
      notify: newNotify,
    }
  })
}
export const inviteJoinProject = withAuth(_inviteJoinProject)
// 同意 加入project邀请
export const _acceptInviteJoinProject = async (
  authId: string,
  {
    projectId,
    projectSlug,
    projectIcon,
    notifyReceiverId,
  }: {
    projectId: string
    projectSlug: string
    projectIcon: string | null
    notifyReceiverId: string
  },
) => {
  const list = await db
    .update(projectMember)
    .set({ status: 'accepted' })
    .where(
      and(eq(projectMember.projectId, projectId), eq(projectMember.status, 'pending')),
    )
    .returning({ id: projectMember.id })
  if (list.length === 0) {
    throw AppErr('没有找到对应的项目成员邀请', 404)
  }
  await db
    .update(notifyReceiver)
    .set({
      actionStatus: 'accepted',
      actionAt: new Date(),
    })
    .where(eq(notifyReceiver.id, notifyReceiverId))
}
export const acceptInviteJoinProject = withAuth(_acceptInviteJoinProject)

// U
export const _updateProjectMember = async (
  authId: string,
  {
    id,
    data,
    projectId,
  }: {
    id: string
    data: ProjectMemberUpdate
    projectId: string
  },
) => {
  // 检查成员是否存在
  // const targetMember = await getProjectMember(id)

  await checkMemberPermission(projectId, authId, 'member:update')

  // 更新成员
  const [updatedMember] = await db
    .update(projectMember)
    .set(data)
    .where(
      and(
        eq(projectMember.id, id),
        // eq(projectMember.projectId, projectId),
        // eq(projectMember.entityType, entityType),
        // entityType === "user" ? eq(projectMember.userId, entityId) : eq(projectMember.organizationId, entityId),
      ),
    )
    .returning()

  return updatedMember
}
export const updateProjectMember = withAuth(_updateProjectMember)
