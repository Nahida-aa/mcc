import { QueryClient, defaultShouldDehydrateQuery, isServer } from '@tanstack/react-query'
import { cache } from 'react'

/**
 * rq:useQuery 工作流:
 * rq:useQuery 状态:
 * 1. fresh: 新鲜
 * 2. fetching: 请求数据中
 * 3. paused: 暂停
 * 4. stale: 陈旧
 * 5. inactive: 非活动的
 */

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
      },
      dehydrate: {
        // include pending queries in dehydration
        shouldDehydrateQuery: query =>
          defaultShouldDehydrateQuery(query) || query.state.status === 'pending',
      },
    },
  })
}

let browserQueryClient: QueryClient | undefined = undefined

// cache() 保证每次请求时, 服务端 只 创建一个 queryClient
export const getQueryClient = cache(() => {
  if (isServer) {
    // Server: always make a new query client
    return makeQueryClient()
  } else {
    // Browser: make a new query client if we don't already have one
    // This is very important, so we don't re-make a new client if React
    // suspends during the initial render. This may not be needed if we
    // have a suspense boundary BELOW the creation of the query client
    if (!browserQueryClient) browserQueryClient = makeQueryClient()
    return browserQueryClient
  }
})
// adapter
