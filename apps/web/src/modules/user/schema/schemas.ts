import { friendSelectZ } from '@/lib/db/service'
import type { friend } from '@/lib/db/schema'
import { sql } from 'drizzle-orm'

import { profile } from '@/modules/user/schema/tables'
import { _userUpdateZ, orgSelectZ, userSelectZ, type UserSelect } from '@/lib/db/service'
import { createSelectSchema, createUpdateSchema } from 'drizzle-zod'
import { z } from 'zod'
import { friendStatuses } from './constants'

export const userRes = userSelectZ.extend({
  createdAt: z.string().or(z.date()),
  updatedAt: z.string().or(z.date()),
  banExpires: z.string().or(z.date()).nullable(),
})
export type UserRes = z.infer<typeof userRes>

export const userItemFields = {
  id: true,
  name: true,
  username: true,
  displayUsername: true,
  email: true,
  image: true,
} as const
export const userItemZ = userSelectZ.pick(userItemFields)
export type UserItem = z.infer<typeof userItemZ>

export const orgItemFields = {
  id: true,
  name: true,
  slug: true,
  logo: true,
} as const
export const orgItemZ = orgSelectZ.pick(orgItemFields)
export type OrganizationItem = z.infer<typeof orgItemZ>

const _profileUpdateZ = createUpdateSchema(profile)
export const userUpdateZ = _userUpdateZ.extend(_profileUpdateZ.shape).pick({
  name: true,
  // email: true,
  image: true,
  username: true,
  displayUsername: true,
  // phoneNumber: true,
  summary: true,
  color: true,
  banner: true,
  description: true,
  personalizedRecommendation: true,
})
export type UserUpdate = z.infer<typeof userUpdateZ>

export type UserOrTeamType = 'user' | 'team'

export interface AllData {
  follows: string[] //
  projects: string[] //
  user: UserRes
  // notifs: []; //
  // notifs_deliveries: [] // recipients
}



export const friendStatusZ = z.enum(friendStatuses)
export type FriendStatus = z.infer<typeof friendStatusZ>

// export const friendItemZ = friendSelectZ
//   .omit({ createdAt: true, updatedAt: true, status: true, reason: true })
//   .extend({
//     user1: userItemZ.nullable(),
//     user2: userItemZ.nullable(),
//   });
// export type FriendItem = z.infer<typeof friendItemZ>;
export const friendColumns = {
  id: true,
  user1Id: true,
  user2Id: true,
  status: true,
  reason: true,
  // nicknameFromUser1: true,
  // nicknameFromUser2: true,
  createdAt: true,
  updatedAt: true,
} as const
export const friendZ = friendSelectZ.pick(friendColumns).extend({
  nickname: z.string().nullable(),
  status: friendStatusZ,
})
export type Friend = z.infer<typeof friendZ>

export const friendRequest = z.object({
  targetId: z.string(),
  msg: z.string().default('添加你为好友'),
  nickname: z.string().optional(),
  groupName: z.string().optional().default('default'),
})
export type FriendRequest = z.infer<typeof friendRequest>

export const nicknameSql = (t: typeof friend, authId: string) => sql<string | null>`
    CASE
      WHEN ${t.user1Id} = ${authId} THEN ${t.nicknameFromUser1}
      ELSE ${t.nicknameFromUser2}
    END
  `
