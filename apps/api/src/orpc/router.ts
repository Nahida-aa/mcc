import { os } from '@orpc/server'

const ping = os.handler(async () => 'ping')

export const router = {
  ping,
}