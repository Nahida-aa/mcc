import { getSession } from '@/modules/auth/action'
import { queryOptions } from '@tanstack/react-query'

export const sessionOpt = () =>
  queryOptions({
    queryKey: ['session'],
    queryFn: () => getSession(),
    staleTime: 5 * 60 * 1000, // 5 分钟，短 token 15 分钟，所以 5 分钟刷新一次比较安全 default: 0
    gcTime: 10 * 60 * 1000, // 10 分钟缓存, default: 5 minutes
    // retry: false,  // 认证失败不重试（避免无限循环） default: 3
    // refetchOnWindowFocus: true, // 窗口焦点时刷新（用户回来可能 token 过期） default: true
    // refetchOnMount: true, default: true
  })
