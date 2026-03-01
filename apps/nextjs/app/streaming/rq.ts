import { isServer, queryOptions } from "@tanstack/react-query";
function getBaseURL() {
  if (!isServer) {
    return ''
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`
  }
  return 'http://localhost:9999'
}
const baseUrl = getBaseURL()

export const waitOpt = (wait: number) => queryOptions({
    queryKey: ['wait', wait],
    queryFn: async () => {
      const path = `/api/wait?wait=${wait}`
      const url = baseUrl + path
      const res = await fetch(url, {
        cache: 'no-cache',
      })
      const data: string = await res.json()
      return data
    },
  })