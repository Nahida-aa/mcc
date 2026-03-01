'use client'

import { updateUser, type UserProfile } from '@/modules/user/action'
import { userKey } from '@/modules/user/hook/rq'
import { useMutation } from '@tanstack/react-query'

export const useUpdateUser = (id: string) =>
  useMutation({
    mutationFn: updateUser,
    // When mutate is called:
    onMutate: async (data, context) => {
      // Cancel any outgoing refetches
      // (so they don't overwrite our optimistic update)
      await context.client.cancelQueries({ queryKey: userKey(id) })

      // Snapshot the previous value
      const previousData = context.client.getQueryData<UserProfile>(userKey(id))

      // Optimistically update to the new value
      context.client.setQueryData(userKey(id), { ...previousData, ...data })

      // Return a result with the previous and new todo
      return { previousData, data }
    },
    // If the mutation fails, use the result we returned above
    onError: (err, newTodo, onMutateResult, context) => {
      context.client.setQueryData(userKey(id), onMutateResult?.previousData)
    },
    // Always refetch after error or success:
    onSettled: (newTodo, error, variables, onMutateResult, context) =>
      context.client.invalidateQueries({ queryKey: userKey(id) }),
  })
