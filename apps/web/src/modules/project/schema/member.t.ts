import { createInsertSchema, createSelectSchema, createUpdateSchema } from 'drizzle-zod'
import z from 'zod'
import { projectMember } from './tables'
import type { Db } from '@/lib/db'
import { orgItemZ, userItemZ } from '@/modules/user/schema/schemas'

export const projectMemberStatus = ['active', 'inactive', 'pending'] as const
export type ProjectMemberStatus = (typeof projectMemberStatus)[number]
// project member
export const projectMemberInsertSchema = createInsertSchema(projectMember)
export type ProjectMemberInsert = typeof projectMember.$inferInsert
export const insertProjectMember = (db: Db, data: ProjectMemberInsert) =>
  db.insert(projectMember).values(data)
export const projectMemberSelect = createSelectSchema(projectMember)
export type ProjectMemberSelect = typeof projectMember.$inferSelect
export const _projectMemberUpdate = createUpdateSchema(projectMember)
export type _ProjectMemberUpdate = z.infer<typeof _projectMemberUpdate>

export const projectMemberType = z.enum(['user', 'organization'])
export type ProjectMemberType = z.infer<typeof projectMemberType>
export const projectMemberQuery = z.object({
  entityType: projectMemberType,
  userId: z.string(),
})
export type ProjectMemberQuery = z.infer<typeof projectMemberQuery>

export const projectMemberZ = projectMemberSelect.extend({
  user: userItemZ.nullable(),
  organization: orgItemZ.nullable(),
})
export type ProjectMemberT = z.infer<typeof projectMemberZ>
export interface ProjectMember extends ProjectMemberT { }

export const projectMemberUpdate = _projectMemberUpdate.pick({
  role: true,
  permissions: true,
})
export type ProjectMemberUpdate = z.infer<typeof projectMemberUpdate>
