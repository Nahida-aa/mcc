'use client'
import { userOpt } from '@/modules/user/hook/rq'
import { useQuery } from '@tanstack/react-query'

export const useUser = (id?: string) => {
  const { data: user, ...ret } = useQuery(userOpt(id))
  return {
    user,
    ...ret,
  }
}
