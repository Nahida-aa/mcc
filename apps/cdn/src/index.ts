import { Hono } from 'hono'
import { poweredBy } from 'hono/powered-by'
import { apiBaseUrl } from './constants'
import type { ContentfulStatusCode } from 'hono/utils/http-status'
// import { cache } from 'hono/cache' // 
type Bindings = {
  MY_BUCKET: R2Bucket
}
export const to = async <T, E = Error>(
  promise: Promise<T>,
): Promise<[T, null] | [null, E]> => {
  try {
    const data = await promise;
    return [data, null];
  } catch (err) {
    return [null, err as E];
  }
};
const app = new Hono<{ Bindings: Bindings }>()
app.use(poweredBy())

app.get('/', (c) => {
  return c.text('cdn')
})

// 代理 r2 cdn and 统计 下载量
app.get('/user/*',    async (c) => {
  const url = c.req.url
  const key = c.req.path.slice(1)
  const forwardHeaders = new Headers(c.req.header())
  forwardHeaders.delete('host')  // 避免循环
  const [res, err] = await to(fetch(`${apiBaseUrl}/onDownloadFile`, {
    method: 'POST',
    headers: {
      ...Object.fromEntries(forwardHeaders),  // 转发所有 header
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      key,
      // apiKey // 后续增加 apiKey 校验
    })
  }))
  if (err) {
    console.log('未得到响应')
    return c.json({ error: 'onDownloadFile not res' }, 500, {
      'Cache-Control': 'public, max-age=10'
    })
  }
  console.debug('记录下载量响应状态码:', res.status)
  const resBody = await res.json()
  console.debug('记录下载量响应体:', resBody)
  if ( !res.ok) {
    console.log('记录下载量失败:', res.status)
    const [statusStr, error] = (resBody as { message: string }).message.split('/')
    const status = Number(statusStr) as ContentfulStatusCode || 500  
    if (status === 404) {
      return c.json({ error }, 404, {
        'Cache-Control': 'public, max-age=10'
      })
    }

    return c.json({ error: 'Failed to record download' }, status , {
      'Cache-Control': 'public, max-age=10'
    })
  }
  console.log('记录下载量成功:', res.status)
  const cache = caches.default;
  // const deleted = await cache.delete(url)  // 删除缓存
  // console.log('Purge result for key', key, ':', deleted ? 'Success' : 'Not found')
  const cached = await cache.match(url)
  if (cached) {
    console.log("cache hit:", key)
    return c.newResponse(cached.body, cached)
  }
  // 2. 未命中：从 R2 拉取
  console.log("cache miss:", key)
  const object = await c.env.MY_BUCKET.get(key)
  if (!object) {
    const ret = c.json({ error: 'File not found (BUCKET)' }, 404, {
      'Cache-Control': 'public, max-age=10'
    })
    c.executionCtx.waitUntil(cache.put(url, ret.clone()))
    return  ret
  }

  const ret: Response = c.body(object.body, 200, {
    'Cache-Control': 'public, max-age=31536000, immutable'
  })
  // c.res.headers.append('Cache-Control', 'public, max-age=31536000, immutable')
  console.log('进行缓存')
  c.executionCtx.waitUntil(cache.put(url, ret.clone()))
  return ret
})
app.get('*', (c) => {
  return c.notFound()
})
export default app
