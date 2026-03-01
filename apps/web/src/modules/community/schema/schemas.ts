import { channelMessage } from '@/modules/community/schema/tables'
import { createInsertSchema, createSelectSchema, createUpdateSchema } from 'drizzle-zod'
import { z } from 'zod'

export const channelMessageInsertZ = createInsertSchema(channelMessage)
export type ChannelMessageInsert = typeof channelMessage.$inferInsert
export const channelMessageSelectZ = createSelectSchema(channelMessage)
export type ChannelMessageSelect = typeof channelMessage.$inferSelect
export const channelMessageUpdateSchema = createUpdateSchema(channelMessage)

export const msgInputZ = channelMessageInsertZ
  .pick({
    channelId: true,
    userId: true,
    content: true,
    contentType: true,
    replyToId: true,
    attachments: true,
  })
  .extend({
    communityId: z.string().optional(),
  })
export type MsgInput = z.infer<typeof msgInputZ>
export const msgOutputZ = channelMessageSelectZ.extend({
  communityId: z.string().optional(),
})
export type MsgOut = z.infer<typeof msgOutputZ>

export const newMsgInput = (
  channelId: string,
  userId: string,
  content: string,
): MsgInput => ({
  channelId,
  userId,
  content,
})

import { type community, communityMember } from '@/lib/db/schema'
import { UserItem, userItemZ } from '@/modules/user/schema/schemas'
import { JoinMethod, JoinMethodNames, JoinMethodPermissions } from './constants'

export type SelectCommunity = typeof community.$inferSelect
export type SelectCommunityMember = typeof communityMember.$inferSelect
export type InsertCommunityMember = typeof communityMember.$inferInsert
/**
 * 验证加入数据的完整性
 */
export function validateJoinData(data: {
  joinMethod: JoinMethod
  inviterId: InsertCommunityMember['inviterId']
  requiresApproval?: boolean
}): { valid: boolean; errors: string[] } {
  const errors: string[] = []
  const permissions = JoinMethodPermissions[data.joinMethod]

  // 检查是否需要邀请者
  if (permissions.requiresInviter && !data.inviterId) {
    errors.push(`加入方式 "${JoinMethodNames[data.joinMethod]}" 需要邀请者`)
  }

  // 检查是否不应该有邀请者
  if (!permissions.requiresInviter && data.inviterId) {
    errors.push(`加入方式 "${JoinMethodNames[data.joinMethod]}" 不应该有邀请者`)
  }

  return {
    valid: errors.length === 0,
    errors,
  }
}
export type ChannelMemberInfo = Omit<
  SelectCommunityMember,
  'createdAt' | 'updatedAt' | 'joinMethod' | 'inviterId'
> & {
  isOnline?: boolean
  lastActiveAt?: string | null
  user: UserItem
}
// export interface ChannelMemberWithPermissions {
//   id: string;
//   userId: string;
//   nickname: string | null;
//   permissions: string[]
//   roles: string[];
//   isOwner: boolean;
//   status: string;
//   createdAt: Date;
//   communityId: string;
//   user: {
//     username: string;
//     avatar: string | null;
//   };
//   isOnline?: boolean; // 新增：在线状态
// }
export const channelMemberWithPermissionsSchema = createSelectSchema(communityMember)
  .omit({
    createdAt: true,
    updatedAt: true,
    joinMethod: true,
    inviterId: true,
  })
  .extend({
    isOnline: z.boolean().optional(),
    lastActiveAt: z.string().nullable().optional(),
    channelPermissions: z.array(z.string()),
    canViewChannel: z.boolean(),
    canSendMessages: z.boolean(),
    canManageMessages: z.boolean(),
    user: userItemZ,
  })
// zod -> type
export type ChannelMemberWithPermissions = z.infer<
  typeof channelMemberWithPermissionsSchema
>

// 带邀请者信息的成员详情
export type CommunityMemberWithInviter = {
  member: SelectCommunityMember
  inviter?: UserItem
}
