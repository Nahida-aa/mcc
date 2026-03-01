import { getUser } from '@/modules/user/action'
import { queryOptions } from '@tanstack/react-query'

export const userKey = (id?: string) => ['user', id]
export const userOpt = (id?: string) =>
  queryOptions({
    queryKey: ['user', id],
    enabled: !!id,
    queryFn: () => (id ? getUser(id) : null),
    staleTime: Infinity, // 永远不过期，客户端不重新请求
    // gcTime: 1000 * 60 * 60,   // 1小时后才 gc
    // Query data cannot be undefined. Please make sure to return a value other than undefined from your query function. Affected query key: ["user",null]
  })
