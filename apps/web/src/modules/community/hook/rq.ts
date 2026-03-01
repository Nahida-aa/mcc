import { queryOptions } from '@tanstack/react-query'
import { getCommunityByProject } from '../action/community'
import { listChannel } from '../action/channel'

export const communityByProjectOpt = (projectId?: string) =>
  queryOptions({
    queryKey: ['communityByProject', projectId],
    enabled: !!projectId,
    queryFn: ({ queryKey }) => {
      const [, id] = queryKey as ['communityByProject', string]
      return getCommunityByProject(id)
    },
  })

export const channelsOpt = (communityId?: string) =>
  queryOptions({
    queryKey: ['channels', communityId],
    enabled: !!communityId,
    queryFn: ({ queryKey }) => {
      const [, id] = queryKey as ['channels', string]
      return listChannel(id)
    },
  })
