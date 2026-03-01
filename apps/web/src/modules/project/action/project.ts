'use server'

import type { ProjectStatus } from '@/modules/project/schema/constants'
import type { ListProjectQueryOut, ListUserSelfProjectQuery } from '@/modules/project/schema/zods'
import type { InsertProject } from '@/modules/project/types/index.t'
import { db, type Db } from '@/lib/db'
import { project, user } from '@/lib/db/schema'
import {
  and,
  arrayContains,
  count,
  desc,
  eq,
  getTableColumns,
  ilike,
  inArray,
  or,
  sum,
  type SQL,
} from 'drizzle-orm'

export const insertProject = async (db: Db, data: typeof project.$inferInsert) =>
  await db.insert(project).values(data).returning()

// type=mod, status=community 的项目, 可以被 type=community, status:any 搜索, 也可以被  type=mod, status=['community']
export const listProject = async (query: ListProjectQueryOut) => {
  const {
    limit = 20,
    offset = 0,
    type,
    q: search,
    v: gameVersions,
    s: sort,
    e,
    openSource,
    tags,
  } = query
  const conditions = [eq(project.visibility, 'public')]

  const status: ProjectStatus[] = query.status
  // 添加已归档项目
  if (status.includes('published')) {
    status.push('archived')
  }
  if (type === 'community') {
    conditions.push(eq(project.status, 'community'))
  } else {
    if (type) {
      conditions.push(eq(project.type, type))
    }
    conditions.push(inArray(project.status, status))
  }
  if (gameVersions && gameVersions.length > 0) {
    conditions.push(arrayContains(project.gameVersions, gameVersions))
  }
  if (e && e.length > 0) {
    conditions.push(inArray(project.environment, e))
  }
  if (openSource !== undefined) {
    conditions.push(eq(project.isOpenSource, openSource))
  }
  if (tags && tags.length > 0) {
    conditions.push(arrayContains(project.tags, tags))
  }

  if (search) {
    // 使用 PostgreSQL 的 ILIKE 做不区分大小写的模糊搜索，匹配 name 或 summary
    conditions.push(
      // sql`${project.name} ILIKE %${search}% OR ${project.summary} ILIKE %${search}%`,
      or(
        ilike(project.name, `%${search}%`),
        ilike(project.summary, `%${search}%`),
      ) as SQL,
    )
  }
  return await db
    .select({
      ...getTableColumns(project),
      user: {
        username: user.username,
        displayUsername: user.displayUsername,
      },
    })
    .from(project)
    .innerJoin(user, eq(project.ownerId, user.id))
    .where(and(...conditions))
    .orderBy(desc(project.updatedAt))
    .limit(limit)
    .offset(offset)
}
export type ListProjectOut = Awaited<ReturnType<typeof listProject>>

const _makeListUserProjectConditions = (
  userId: string,
  query?: ListUserSelfProjectQuery,
) => {
  const { limit = 10, offset = 0, type, status, q } = query || {}
  // 构建查询条件 - 使用 Select API
  const conditions = [eq(project.ownerId, userId)]

  if (type) conditions.push(eq(project.type, type))
  if (status) conditions.push(eq(project.status, status))
  if (q) {
    // 使用 PostgreSQL 的 ILIKE 做不区分大小写的模糊搜索，匹配 name 或 summary
    conditions.push(
      // sql`${project.name} ILIKE %${search}% OR ${project.summary} ILIKE %${search}%`,
      or(
        ilike(project.name, `%${q}%`),
        ilike(project.summary, `%${q}%`),
      ) as SQL,
    )
  }
  return conditions
}
export const listUserProject = async (
  userId: string,
  query?: ListUserSelfProjectQuery,
) => {
  const { limit = 10, offset = 0, type, status, q } = query || {}
  const conditions = _makeListUserProjectConditions(userId, query)
  // 获取项目列表 - 使用 Select API
  const projects = await db
    .select()
    .from(project)
    .where(and(...conditions))
    .orderBy(desc(project.updatedAt))
    .limit(limit)
    .offset(offset)

  return projects
}

export interface UserProjectStats {
  total: number
  totalDownloads: number
  totalLikes: number
  totalStars: number
}
// stat
export const statUserProject = async (
  userId: string,
  query?: ListUserSelfProjectQuery,
) => {
  const conditions = _makeListUserProjectConditions(userId, query)

  //  total 与 sums（独立查询，使用聚合函数）
  const [item] = await db
    .select({
      total: count(),
      totalDownloads: sum(project.downloads).mapWith(Number),
      totalLikes: sum(project.likes).mapWith(Number),
      totalStars: sum(project.stars).mapWith(Number),
    })
    .from(project)
    .where(and(...conditions))
  return item as UserProjectStats
}

