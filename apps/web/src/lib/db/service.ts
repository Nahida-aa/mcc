// import {
//   createInsertSchema,
//   createSelectSchema,
//   createUpdateSchema,
// } from "@/api/openapi/helpers/create";
import type { Db } from '.'
import {
  community,
  communityMember,
  channelMessage,
  userReadState,
  channel,
  dmChannelMember,
  project,
  projectMember,
  version,
  versionFile,
  user,
  organization,
  friend,
  notify,
  activity,
} from './schema'
import { eq, and, desc, sql, type SQL } from 'drizzle-orm'
import type { z } from 'zod'
import { createInsertSchema, createSelectSchema, createUpdateSchema } from 'drizzle-zod'
import type { InsertProject, _projectUpdateZ } from '@/modules/project/types/index.t'

// user
export const userSelectZ = createSelectSchema(user)
export type UserSelect = typeof user.$inferSelect
export const userInsertZ = createInsertSchema(user)
export type UserInsert = typeof user.$inferInsert
export const _userUpdateZ = createUpdateSchema(user)

export type _UserUpdate = z.infer<typeof _userUpdateZ>
// org
export const orgSelectZ = createSelectSchema(organization)
export type OrgSelect = typeof organization.$inferSelect
// friend

export const friendSelectZ = createSelectSchema(friend)
export type FriendSelect = typeof friend.$inferSelect

export const projectSelectSchema = createSelectSchema(project)
export const projectInsertZ = createInsertSchema(project)

export type _ProjectUpdate = z.infer<typeof _projectUpdateZ>

// project version
export const versionSelectSchema = createSelectSchema(version)
export type SelectVersion = z.infer<typeof versionSelectSchema>
export type InsertVersion = typeof version.$inferInsert
export const insertVersion = async (db: Db, data: InsertVersion) =>
  await db.insert(version).values(data).returning()

// version file
export const versionFileSelectSchema = createSelectSchema(versionFile)
export type SelectVersionFile = z.infer<typeof versionFileSelectSchema>

// project member
export const projectMemberInsertSchema = createInsertSchema(projectMember)
export type ProjectMemberInsert = typeof projectMember.$inferInsert
export const insertProjectMember = (db: Db, data: ProjectMemberInsert) =>
  db.insert(projectMember).values(data)
export const projectMemberSelect = createSelectSchema(projectMember)
export type ProjectMemberSelect = typeof projectMember.$inferSelect
export const _projectMemberUpdate = createUpdateSchema(projectMember)
export type _ProjectMemberUpdate = z.infer<typeof _projectMemberUpdate>
// community
export const communityInsertSchema = createInsertSchema(community)
export type CommunityInsert = typeof community.$inferInsert
export const communitySelectSchema = createInsertSchema(community)
export type CommunitySelect = typeof community.$inferSelect
export const communityUpdateSchema = createUpdateSchema(community)
export type CommunityUpdate = z.infer<typeof communityUpdateSchema>
export const insertCommunity = async (db: Db, data: CommunityInsert) =>
  await db.insert(community).values(data).returning()
export const updateCommunity = (db: Db, id: string, data: CommunityUpdate) =>
  db.update(community).set(data).where(eq(community.id, id))

export const communityMemberInsertSchema = createInsertSchema(communityMember)
export type CommunityMemberInsert = typeof communityMember.$inferInsert
export const communityMemberSelectSchema = createSelectSchema(communityMember)
export type CommunityMemberSelect = typeof communityMember.$inferSelect
export const communityMemberUpdateSchema = createUpdateSchema(communityMember)
export const insertCommunityMember = async (db: Db, data: CommunityMemberInsert) =>
  await db.insert(communityMember).values(data).returning()
// channel
export const channelSelectSchema = createSelectSchema(channel)
export type ChannelSelect = typeof channel.$inferSelect
export const channelInsertSchema = createInsertSchema(channel)
export type ChannelInsert = typeof channel.$inferInsert
export const insertChannel = async (db: Db, data: ChannelInsert[]) =>
  await db.insert(channel).values(data).returning()
// dm channel member
export type DmChannelMemberInsert = typeof dmChannelMember.$inferInsert
export const insertDmChannelMember = async (db: Db, data: DmChannelMemberInsert[]) =>
  await db.insert(dmChannelMember).values(data).returning()
export const dmChannelMemberSelectSchema = createSelectSchema(dmChannelMember)
export type DmChannelMemberSelect = typeof dmChannelMember.$inferSelect
// msg
// export const channelMessageInsertZ = createInsertSchema(channelMessage)
// export type ChannelMessageInsert = typeof channelMessage.$inferInsert
// export const channelMessageSelectZ = createSelectSchema(channelMessage)
// export type ChannelMessageSelect = typeof channelMessage.$inferSelect
// export const channelMessageUpdateSchema = createUpdateSchema(channelMessage)

// notify
export const notifySelectZ = createSelectSchema(notify)
export type NotifySelect = typeof notify.$inferSelect

// follow
// export const followSelectZ = createSelectSchema(follow);
// export type FollowSelect = typeof follow.$inferSelect;
// export const followInsertZ = createInsertSchema(follow);
// export type FollowInsert = typeof follow.$inferInsert;

// activity
export const activitySelectZ = createSelectSchema(activity)
export type ActivitySelect = typeof activity.$inferSelect
export const activityInsertZ = createInsertSchema(activity)
export type ActivityInsert = typeof activity.$inferInsert
export const insertActivity = (db: Db, data: ActivityInsert) =>
  db.insert(activity).values(data)
