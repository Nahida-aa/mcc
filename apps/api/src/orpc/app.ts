import { RPCHandler } from '@orpc/server/fetch'
import { CORSPlugin } from '@orpc/server/plugins'
import { onError } from '@orpc/server'
import { router } from './router'


const handler = new RPCHandler(router, {
  plugins: [
    new CORSPlugin()
  ],
  interceptors: [
    onError((error) => {
      console.error(error)
    }),
  ],
})

export const app = {
  fetch: async (request: Request) => {
    const { matched, response } = await handler.handle(request, {
      prefix: '/rpc',
      context: {} // Provide initial context if needed
    })

    if (matched) {
      return response
    }
    console.log(request)
    return new Response('Not found', { status: 404 })
  }
}