'use server'
import { ilike, eq, sql, getTableColumns } from 'drizzle-orm'
import { AppErr } from '@/lib/http/types'
import { organization, profile, project, user } from '@/lib/db/schema'
import { db } from '@/lib/db'
import { pickColumns } from '@/lib/db/helpers'
import { UserOrTeamType, UserUpdate } from '../schema/schemas'
import { withAuth } from '@/lib/func/auth'

export const searchUser = async (_q: string) => {
  // 去除 两侧空格
  const q = _q.trim()
  const users = await db
    .select()
    .from(user)
    .where(ilike(user.username, `%${q}%`))
  return users
}

export const getUser = async (id: string) => {
  const userProfile = await db
    .select({
      ...pickColumns(user, {
        id: true,
        name: true,
        email: true,
        image: true,
        username: true,
        displayUsername: true,
        phoneNumber: true,
      }),
      ...pickColumns(profile, {
        summary: true,
        birthday: true,
        personalizedRecommendation: true,
        color: true,
        banner: true,
      }),
    })
    .from(user)
    .leftJoin(profile, eq(user.id, profile.user_id))
    .where(eq(user.id, id))
  if (userProfile.length === 0) {
    // throw AppErr('用户不存在')
    return null
  }
  return userProfile[0]
}
export type UserProfile = NonNullable<Awaited<ReturnType<typeof getUser>>>

export const getUserByName = async (username: string) => {
  const u = await db.query.user.findFirst({
    where: eq(user.username, username),
  })
  if (!u) throw AppErr('User not found', 404)
  return u
}
export const _existUserOrTeamBySlug = async (slug: string) => {
  const userList = await db
    .select({ id: user.id })
    .from(user)
    .where(eq(user.username, slug))
    .unionAll(
      db
        .select({ id: organization.id })
        .from(organization)
        .where(eq(organization.slug, slug)),
    )
  return userList
}
export const getUserOrTeamBySlug = async (slug: string) => {
  const userList = await db
    .select({
      type: sql<UserOrTeamType>`'user'`,
      id: user.id,
      slug: user.username,
      name: user.displayUsername,
      image: user.image,
      summary: profile.summary,
      description: profile.description,
      createdAt: user.createdAt,
    })
    .from(user)
    .leftJoin(profile, eq(user.id, profile.user_id))
    .where(eq(user.username, slug))
    .unionAll(
      db
        .select({
          type: sql<UserOrTeamType>`'team'`,
          id: organization.id,
          slug: organization.slug,
          name: organization.name,
          image: organization.logo,
          summary: organization.summary,
          description: organization.description,
          createdAt: organization.createdAt,
        })
        .from(organization)
        .where(eq(organization.slug, slug)),
    )
  if (userList.length === 0) throw AppErr('User or Team not found', 404)
  return userList[0]
}
export type UserOrTeam = Awaited<ReturnType<typeof getUserOrTeamBySlug>>
export const updateUser = withAuth(
  async (authId, { username, displayUsername, name, image, ...data }: UserUpdate) => {
    await db.transaction(async tx => {
      await tx
        .update(user)
        .set({
          username: username,
          displayUsername: displayUsername,
          name: name || displayUsername || undefined,
          image: image,
        })
        .where(eq(user.id, authId))
      await tx
        .insert(profile)
        .values({
          user_id: authId,
          ...data,
        })
        .onConflictDoUpdate({
          target: profile.user_id,
          set: data,
        })
    })
    return true
  },
)

export const getUserData = withAuth(async authId => {
  const [userData] = await db.select().from(user).where(eq(user.id, authId))
  const projects = await db
    .select({ id: project.id })
    .from(project)
    .where(eq(project.ownerId, authId))
  return {
    user: userData,
    projects: projects.map(p => p.id),
  }
})
