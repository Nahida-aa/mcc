import { toastError } from '@/components/uix/toast'

export const tryToast = <T extends (...args: any[]) => Promise<any>>(fn: T) => {
  return async (...args: Parameters<T>): Promise<Awaited<ReturnType<T>>> => {
    try {
      return await fn(...args)
    } catch (err: any) {
      toastError(err)
      console.log('tryToast:', err)
      throw err
    }
  }
}
