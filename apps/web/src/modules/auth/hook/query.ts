'use client'
import { sessionOpt } from '@/modules/auth/hook/rq'
import { useQuery } from '@tanstack/react-query'

export const useSession = () => {
  const { data: session, ...ret } = useQuery(sessionOpt())
  return {
    session,
    ...ret,
  }
}

export const rq = {
  useSession,
}
