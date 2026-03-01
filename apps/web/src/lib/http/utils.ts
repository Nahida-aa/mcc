import { dev } from '@/lib/config'
import { AppError } from '@/lib/http/types'
import { APIError } from 'better-auth'
import postgres from 'postgres'

export const messageMap: Record<string, string> = {
  'OTP not found': '验证码不存在或已过期',
  'Invalid OTP': '验证码错误',
  'OTP expired': '验证码已过期或未发送',
  'Too many attempts': '验证码尝试次数过多, 请稍后再试',
  'Too many requests. Please try again later.': '请求过于频繁, 请稍后再试',
}
export const translateMessage = (message: string) => {
  return messageMap[message] || message
}

export type ErrorJson = {
  name: string
  message: string
  status: number
  stack?: string
  cause?: string
}
// export interface APIError extends Error {
//   status: string
// }
export const analyzeError = (error: Error) => {
  let cause: string | undefined
  if (error.cause instanceof Error && error.cause.name === 'PostgresError') {
    const pgError = error.cause as postgres.PostgresError
    console.log('PostgresError')
    console.log(pgError)
    cause = pgError.detail
    // Postgres 唯一键冲突
    if (pgError.code === '23505') {
      // Postgres 唯一键冲突
      cause = cause?.replace(/already exists\./, '已存在。')
    } else if (pgError.code === '42P01') {
      // undefined_table
      pgError.message = pgError.message.replace(
        /relation "(.+)" does not exist/,
        '表 "$1" 不存在',
      )
    }
    return {
      name: 'DBError',
      message: pgError.message,
      status: 400,
      stack: dev ? pgError.stack : undefined,
      cause,
    }
  } else if (error instanceof APIError) {
    return {
      name: error.name,
      message: error.message,
      status: error.statusCode,
      stack: dev ? error.stack : undefined,
      cause,
    }
  }
  return {
    name: error.name,
    message: error.message,
    status: (error as AppError).status || 500,
    stack: dev ? error.stack : undefined,
    cause,
  }
}

export type SafeResult<T> = {
  data?: T
  error?: ErrorJson
}
export function safe<T extends (...args: any[]) => Promise<any>>(fn: T) {
  return async (...args: Parameters<T>): Promise<SafeResult<Awaited<ReturnType<T>>>> => {
    try {
      const data = await fn(...args)
      return { data }
    } catch (err: any) {
      console.log('safe:')
      console.log(err)
      return { error: analyzeError(err) }
    }
  }
}

export const to = async <T, E = Error>(
  promise: Promise<T>,
): Promise<[T, null] | [null, E]> => {
  try {
    const data = await promise
    return [data, null]
  } catch (err) {
    return [null, err as E]
  }
}

// 使用时
// const [data, err] = await to(queryClient.fetchQuery(...));

// if (err) {
//   // 处理错误
// }
// // 处理 data

// 当场处理错误，返回一个包含 data 或 error 的对象
// 当场处理的用途:
// 1. 忽略错误，继续执行后续逻辑
// 2. 及时修复
// 注意事项:
// 1. 如果每次当场处理的做法都是 if (error) { ...; return } ; 那就没意义了，直接抛错更好

// 分析错误, 但不将错误转为 json 格式, 而是正常抛出
export const tryCatch = <T extends (...args: any[]) => Promise<any>>(fn: T) => {
  return async (...args: Parameters<T>): Promise<Awaited<ReturnType<T>>> => {
    try {
      return await fn(...args)
    } catch (err: any) {
      console.log('tryCatch:')
      console.log(err)
      const analyzedError = analyzeError(err)
      console.log('analyzedError:')
      console.log(analyzedError)
      throw new Error(analyzedError.message, { cause: analyzedError.cause })
    }
  }
}
