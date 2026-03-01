'use server'
import { and, asc, eq } from 'drizzle-orm'
import { db, type Tx } from '@/lib/db'
import { channel, community, communityMember } from '@/lib/db/schema'
import { _addMember } from './join'
import {
  insertChannel,
  updateCommunity,
  type ChannelInsert,
  type CommunityInsert,
} from '@/lib/db/service'
// import { joinMethod } from '@/modules/community/schema/join.t'

export const createCommunity = async (tx: Tx, data: CommunityInsert) => {
  // insert community , 暂时用于提供 一个社区空间
  const [initCommunity] = await tx
    .insert(community)
    .values(data)
    .returning({ id: community.id })
  const channels: ChannelInsert[] = [
    {
      communityId: initCommunity.id,
      name: '讨论',
      type: 'forum',
    },
  ]
  if (data.type === 'project') {
    channels.push({
      communityId: initCommunity.id,
      name: '攻略',
      type: 'guide',
    })
  }
  const newChannels = await insertChannel(tx, channels)
  const defaultChannelId = newChannels[0].id
  const [newCommunity] = await updateCommunity(tx, initCommunity.id, {
    defaultChannelId: defaultChannelId,
  }).returning()

  // insert community member
  await _addMember(tx, {
    communityId: newCommunity.id,
    userId: data.ownerId,
    joinMethod: 'system',
    isOwner: true, // 设置 设置冗余
    // TODO: role
  })

  return newCommunity
}

export const listCommunityByUserId = async (userId: string) => {
  return await db
    .select({
      id: communityMember.communityId,
    })
    .from(communityMember)
    .where(eq(communityMember.userId, userId))
}

export const getCommunityByProject = async (projectId: string) => {
  return await db
    .select()
    .from(community)
    .where(and(eq(community.type, 'project'), eq(community.entityId, projectId)))
    .limit(1)
    .then(r => r[0])
}
